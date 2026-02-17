import 'dotenv/config';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createInterface } from "node:readline";

// --- Config ---

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const ELEVENLABS_TITLE_VOICE_ID = process.env.ELEVENLABS_TITLE_VOICE_ID;
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_v3";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1-mini";

const MAX_CHARS_PER_CHUNK = 4500;
const CONTENT_DIR = join(import.meta.dirname, "../src/content/posts");

// --- Types ---

type Segment = {
  index: number;
  type: "title" | "body";
  text: string;
  file: string;
};

// --- Helpers ---

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function parseFrontmatter(mdx: string): { title: string; content: string } {
  const match = mdx.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { title: "", content: mdx };

  const frontmatter = match[1];
  const content = match[2];
  const titleMatch = frontmatter.match(/^title:\s*['"]?(.*?)['"]?\s*$/m);
  return {
    title: titleMatch ? titleMatch[1] : "",
    content,
  };
}

async function cleanForAudio(rawText: string): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is required");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content: `You are converting a blog post written in MDX/Markdown into a clean script for text-to-speech narration.

Rules:
- Remove all MDX/JSX components (imports, <ContentImage />, <BotMessage>, etc.)
- Remove all code blocks (both inline \`code\` and fenced \`\`\`code blocks\`\`\`). Replace them with a brief natural-language description of what the code does if it's important to understanding the text. If it's just illustrative, skip it.
- Remove markdown links but keep the link text (e.g. "[my site](https://...)" becomes "my site")
- Remove markdown formatting (**, *, _, etc.) but keep the text
- Remove HTML tags
- Convert bullet lists into flowing prose or short sentences
- Keep section headers as-is on their own lines, prefixed with "## " (exactly two hashes + space). Remove any existing hash prefixes first, then add "## ". These will be read by a different voice.
- The output should read naturally when spoken aloud
- Do not add any commentary or preamble — output ONLY the cleaned script
- Preserve the author's voice and tone`,
        },
        {
          role: "user",
          content: rawText,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${body}`);
  }

  const json = await res.json();
  return json.choices[0].message.content.trim();
}

function splitIntoSegments(script: string): Segment[] {
  const lines = script.split("\n");
  const segments: Segment[] = [];
  let currentBody = "";
  let index = 0;

  function flushBody() {
    const trimmed = currentBody.trim();
    if (trimmed) {
      segments.push({
        index,
        type: "body",
        text: trimmed,
        file: `${String(index).padStart(3, "0")}-body.mp3`,
      });
      index++;
    }
    currentBody = "";
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushBody();
      const text = line.replace(/^## /, "").trim();
      segments.push({
        index,
        type: "title",
        text,
        file: `${String(index).padStart(3, "0")}-title.mp3`,
      });
      index++;
    } else {
      currentBody += line + "\n";
    }
  }
  flushBody();

  return segments;
}

function chunkText(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = "";

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxChars && current) {
      chunks.push(current.trim());
      current = "";
    }

    if (para.length > maxChars) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      const sentences = para.match(/[^.!?]+[.!?]+\s*/g) || [para];
      for (const sentence of sentences) {
        if (current.length + sentence.length > maxChars && current) {
          chunks.push(current.trim());
          current = "";
        }
        current += sentence;
      }
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function generateSpeech(
  text: string,
  voiceId: string,
): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is required");

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${body}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

function generateSilence(durationMs: number, outputPath: string) {
  execSync(
    `ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo -t ${durationMs / 1000} -c:a libmp3lame -b:a 128k "${outputPath}"`,
    { stdio: "pipe" },
  );
}

function concatAudioFiles(files: string[], outputPath: string) {
  const listPath = join(tmpdir(), `audio-concat-${Date.now()}.txt`);
  const listContent = files.map((f) => `file '${f}'`).join("\n");
  writeFileSync(listPath, listContent);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listPath}" -c:a libmp3lame -b:a 128k "${outputPath}"`,
    { stdio: "pipe" },
  );
}

function getWorkDir(slug: string) {
  return join(CONTENT_DIR, slug, "assets", "audio-work");
}

function getSegmentsPath(slug: string) {
  return join(getWorkDir(slug), "segments.json");
}

function getScriptPath(slug: string) {
  return join(getWorkDir(slug), "script.txt");
}

function getClipsDir(slug: string) {
  return join(getWorkDir(slug), "clips");
}

function loadSegments(slug: string): Segment[] {
  const p = getSegmentsPath(slug);
  if (!existsSync(p)) {
    console.error(`No segments.json found. Run "prepare ${slug}" first.`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(p, "utf-8"));
}

// --- Commands ---

async function cmdPrepare(slug: string) {
  if (!OPENROUTER_API_KEY) {
    console.error("Error: OPENROUTER_API_KEY env var is required");
    process.exit(1);
  }

  const mdxPath = join(CONTENT_DIR, slug, "index.mdx");
  if (!existsSync(mdxPath)) {
    console.error(`Post not found: ${mdxPath}`);
    process.exit(1);
  }

  const workDir = getWorkDir(slug);
  const clipsDir = getClipsDir(slug);
  mkdirSync(clipsDir, { recursive: true });

  // Read and parse
  console.log("Reading post...");
  const raw = readFileSync(mdxPath, "utf-8");
  const { title, content } = parseFrontmatter(raw);

  // Clean via LLM
  console.log("Cleaning content for audio narration...");
  const cleaned = await cleanForAudio(content);

  // Prepend article title as the first heading
  const script = title ? `## ${title}\n\n${cleaned}` : cleaned;

  // Save script for review
  const scriptPath = getScriptPath(slug);
  writeFileSync(scriptPath, script);
  console.log(`\nScript saved to:\n  ${scriptPath}\n`);

  // Parse and save segments
  const segments = splitIntoSegments(script);
  writeFileSync(getSegmentsPath(slug), JSON.stringify(segments, null, 2));

  // Print summary
  console.log(`${segments.length} segments:\n`);
  for (const seg of segments) {
    const preview =
      seg.text.length > 80 ? seg.text.slice(0, 80) + "..." : seg.text;
    const charInfo =
      seg.type === "body" ? ` (${seg.text.length} chars)` : "";
    const chunks =
      seg.type === "body" && seg.text.length > MAX_CHARS_PER_CHUNK
        ? chunkText(seg.text, MAX_CHARS_PER_CHUNK).length
        : 0;
    const chunkWarning = chunks ? ` -> will be split into ${chunks} chunks` : "";
    console.log(
      `  ${String(seg.index).padStart(3)}  [${seg.type.padEnd(5)}]  ${seg.file}${charInfo}${chunkWarning}`,
    );
    console.log(`       ${preview}`);
  }

  console.log(
    `\nReview and edit the script at:\n  ${scriptPath}\n`,
  );
  console.log(
    `When ready, run:\n  npx tsx scripts/generate-audio.ts generate ${slug}`,
  );
}

async function cmdGenerate(slug: string, only?: number[], missingOnly?: boolean) {
  if (!ELEVENLABS_API_KEY) {
    console.error("Error: ELEVENLABS_API_KEY env var is required");
    process.exit(1);
  }
  if (!ELEVENLABS_VOICE_ID) {
    console.error("Error: ELEVENLABS_VOICE_ID env var is required");
    process.exit(1);
  }
  if (!ELEVENLABS_TITLE_VOICE_ID) {
    console.error("Error: ELEVENLABS_TITLE_VOICE_ID env var is required");
    process.exit(1);
  }

  const clipsDir = getClipsDir(slug);
  mkdirSync(clipsDir, { recursive: true });

  // If script was edited, re-parse segments
  const scriptPath = getScriptPath(slug);
  if (existsSync(scriptPath)) {
    const script = readFileSync(scriptPath, "utf-8");
    const segments = splitIntoSegments(script);
    writeFileSync(getSegmentsPath(slug), JSON.stringify(segments, null, 2));
  }

  const segments = loadSegments(slug);
  let toGenerate = only
    ? segments.filter((s) => only.includes(s.index))
    : segments;

  if (missingOnly) {
    toGenerate = toGenerate.filter(
      (s) => !existsSync(join(clipsDir, s.file)),
    );
  }

  if (toGenerate.length === 0) {
    console.error("No matching segments to generate.");
    process.exit(1);
  }

  console.log(`Generating ${toGenerate.length} clip(s)...\n`);

  for (const segment of toGenerate) {
    const voiceId =
      segment.type === "title"
        ? ELEVENLABS_TITLE_VOICE_ID!
        : ELEVENLABS_VOICE_ID!;

    if (segment.type === "body" && segment.text.length > MAX_CHARS_PER_CHUNK) {
      // Body too long — chunk it, generate each, then concat
      const chunks = chunkText(segment.text, MAX_CHARS_PER_CHUNK);
      const chunkPaths: string[] = [];

      for (let j = 0; j < chunks.length; j++) {
        console.log(
          `  ${segment.file} chunk ${j + 1}/${chunks.length} (${chunks[j].length} chars)`,
        );
        const audioData = await generateSpeech(chunks[j], voiceId);
        const chunkPath = join(clipsDir, `${segment.file}.chunk-${j}.mp3`);
        writeFileSync(chunkPath, audioData);
        chunkPaths.push(chunkPath);
      }

      // Concat chunks into the segment clip
      const clipPath = join(clipsDir, segment.file);
      concatAudioFiles(chunkPaths, clipPath);
      console.log(`  -> ${segment.file}\n`);
    } else {
      const preview =
        segment.text.length > 60
          ? segment.text.slice(0, 60) + "..."
          : segment.text;
      console.log(
        `  ${segment.file} (${segment.text.length} chars) "${preview}"`,
      );
      const audioData = await generateSpeech(segment.text, voiceId);
      writeFileSync(join(clipsDir, segment.file), audioData);
    }
  }

  console.log(`\nClips saved to:\n  ${clipsDir}\n`);
  console.log(
    `To regenerate specific segments, run:\n  npx tsx scripts/generate-audio.ts generate ${slug} --only=0,3,5\n`,
  );
  console.log(
    `When satisfied, run:\n  npx tsx scripts/generate-audio.ts merge ${slug}`,
  );
}

async function cmdMerge(slug: string, only?: number[]) {
  const allSegments = loadSegments(slug);
  const segments = only
    ? allSegments.filter((s) => only.includes(s.index))
    : allSegments;
  const clipsDir = getClipsDir(slug);
  const assetsDir = join(CONTENT_DIR, slug, "assets");

  // Verify required clips exist
  const missing = segments.filter(
    (s) => !existsSync(join(clipsDir, s.file)),
  );
  if (missing.length > 0) {
    console.error("Missing clips:");
    for (const s of missing) console.error(`  ${s.file}`);
    console.error('\nRun "generate" first or regenerate missing segments.');
    process.exit(1);
  }

  // Build file list with silence between segments
  const silencePath = join(clipsDir, "_silence.mp3");
  generateSilence(1000, silencePath);

  const parts: string[] = [];
  for (const segment of segments) {
    parts.push(join(clipsDir, segment.file));
    parts.push(silencePath);
  }
  // Remove trailing silence
  parts.pop();

  const outputPath = only
    ? join(clipsDir, `_preview.mp3`)
    : join(assetsDir, "audio.mp3");

  console.log(`Merging ${segments.length} clips...`);
  concatAudioFiles(parts, outputPath);

  console.log(`Done! Audio saved to:\n  ${outputPath}`);
}

// --- Main ---

async function main() {
  const [command, slug, ...rest] = process.argv.slice(2);

  if (!command || !slug) {
    console.log(`Usage: npx tsx scripts/generate-audio.ts <command> <post-slug> [options]

Commands:
  prepare  <slug>              Clean MDX into a narration script for review
  generate <slug> [--only=N,N] [--missing] Generate audio clips
  merge    <slug> [--only=N,N] Combine clips into final audio.mp3 (or preview subset)

Workflow:
  1. prepare  — generates script.txt for you to review/edit
  2. generate — creates individual mp3 clips per segment
  3. merge    — combines clips with 1s silence between sections

Environment variables:
  OPENROUTER_API_KEY       Required for "prepare"
  ELEVENLABS_API_KEY       Required for "generate"
  ELEVENLABS_VOICE_ID      Body narration voice
  ELEVENLABS_TITLE_VOICE_ID Section title voice
  ELEVENLABS_MODEL         Model ID (default: eleven_v3)
  OPENROUTER_MODEL         LLM model (default: openai/gpt-4.1-mini)
`);
    console.log("Available posts:");
    const posts = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const p of posts) console.log(`  ${p}`);
    process.exit(0);
  }

  const postDir = join(CONTENT_DIR, slug);
  if (!existsSync(join(postDir, "index.mdx"))) {
    console.error(`Post not found: ${slug}`);
    process.exit(1);
  }

  switch (command) {
    case "prepare":
      await cmdPrepare(slug);
      break;

    case "generate": {
      let only: number[] | undefined;
      const onlyArg = rest.find((a) => a.startsWith("--only="));
      if (onlyArg) {
        only = onlyArg
          .replace("--only=", "")
          .split(",")
          .map(Number);
      }
      const missingOnly = rest.includes("--missing");
      await cmdGenerate(slug, only, missingOnly);
      break;
    }

    case "merge": {
      let only: number[] | undefined;
      const onlyArg = rest.find((a) => a.startsWith("--only="));
      if (onlyArg) {
        only = onlyArg
          .replace("--only=", "")
          .split(",")
          .map(Number);
      }
      await cmdMerge(slug, only);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
