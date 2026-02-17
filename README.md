# morten-olsen.github.io

Personal portfolio and blog built with Astro 5.

## Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:4321)
pnpm build            # Production build
pnpm preview          # Preview production build
```

## Audio Generation

Generate text-to-speech audio versions of blog posts using ElevenLabs and OpenRouter.

### Prerequisites

- [ffmpeg](https://ffmpeg.org/) installed
- An [ElevenLabs](https://elevenlabs.io/) API key and two voice IDs (one for body narration, one for section titles)
- An [OpenRouter](https://openrouter.ai/) API key

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | For `prepare` | OpenRouter API key |
| `ELEVENLABS_API_KEY` | For `generate` | ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | For `generate` | Voice ID for body narration |
| `ELEVENLABS_TITLE_VOICE_ID` | For `generate` | Voice ID for section titles |
| `ELEVENLABS_MODEL` | No | ElevenLabs model (default: `eleven_v3`) |
| `OPENROUTER_MODEL` | No | LLM for script cleaning (default: `openai/gpt-4.1-mini`) |

### Workflow

The script runs in three steps so you can review and adjust at each stage.

**1. Prepare** — clean the MDX into a narration script

```bash
npx tsx scripts/generate-audio.ts prepare <post-slug>
```

This sends the post content through an LLM to strip MDX components, code blocks, and markdown formatting, converting it into natural spoken prose. The article title is prepended as the first section heading.

The output is saved to `src/content/posts/<slug>/assets/audio-work/script.txt`. Open it, review the text, and edit anything that doesn't read well before moving on.

**2. Generate** — create audio clips

```bash
npx tsx scripts/generate-audio.ts generate <post-slug>
```

Generates one MP3 clip per segment (section titles use `ELEVENLABS_TITLE_VOICE_ID`, body text uses `ELEVENLABS_VOICE_ID`). Long body segments are automatically chunked to stay within the ElevenLabs character limit.

Clips are saved to `audio-work/clips/` with filenames like `000-title.mp3`, `001-body.mp3`, etc. Listen to them and regenerate specific segments if needed:

```bash
npx tsx scripts/generate-audio.ts generate <post-slug> --only=3,5
```

If you edited `script.txt` after the initial generate, the script will re-parse segments automatically.

**3. Merge** — combine clips into the final audio file

```bash
npx tsx scripts/generate-audio.ts merge <post-slug>
```

Concatenates all clips with 1 second of silence between segments and writes the result to `src/content/posts/<slug>/assets/audio.mp3`.

### Example

```bash
export OPENROUTER_API_KEY=sk-or-...
export ELEVENLABS_API_KEY=sk_...
export ELEVENLABS_VOICE_ID=abc123
export ELEVENLABS_TITLE_VOICE_ID=def456

npx tsx scripts/generate-audio.ts prepare node-security
# Review/edit src/content/posts/node-security/assets/audio-work/script.txt

npx tsx scripts/generate-audio.ts generate node-security
# Listen to clips in audio-work/clips/, redo any that sound off
npx tsx scripts/generate-audio.ts generate node-security --only=2

npx tsx scripts/generate-audio.ts merge node-security
# -> src/content/posts/node-security/assets/audio.mp3
```

To enable the audio player on the post, add `audio: ./assets/audio.mp3` to the post's frontmatter.
