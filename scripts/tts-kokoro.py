#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "kokoro",
#     "soundfile",
#     "numpy",
# ]
# ///

"""Local TTS using Kokoro-82M. Called by generate-audio.ts."""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="Generate speech with Kokoro TTS")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--text", help="Text to synthesize")
    group.add_argument("--text-file", help="Path to file containing text to synthesize")
    parser.add_argument("--output", required=True, help="Output WAV file path")
    parser.add_argument("--voice", default="af_heart", help="Kokoro voice ID (default: af_heart)")
    parser.add_argument("--lang", default="a", help="Language code: a=American, b=British (default: a)")
    args = parser.parse_args()

    try:
        from kokoro import KPipeline
        import soundfile as sf
        import numpy as np
    except ImportError:
        print("Missing dependencies. Install with:", file=sys.stderr)
        print("  pip install kokoro soundfile numpy", file=sys.stderr)
        print("  brew install espeak-ng", file=sys.stderr)
        sys.exit(1)

    text = args.text
    if args.text_file:
        with open(args.text_file, "r") as f:
            text = f.read()

    pipeline = KPipeline(lang_code=args.lang)

    # Kokoro yields audio in chunks — collect and concatenate
    segments = []
    for _, _, audio in pipeline(text, voice=args.voice):
        segments.append(audio)

    if not segments:
        print("Error: Kokoro produced no audio output", file=sys.stderr)
        sys.exit(1)

    full_audio = np.concatenate(segments)
    sf.write(args.output, full_audio, 24000)

if __name__ == "__main__":
    main()
