---
slug: listenin
name: listenin
description: An offline macOS meeting recorder that keeps mic and system audio and produces re-runnable, speaker-labeled transcripts entirely on your own machine.
repo: https://code.olsen.cloud/incubator/listenin
stack:
  - TypeScript
  - Node.js
  - React
  - OpenTUI
  - whisper.cpp
  - Sherpa ONNX
  - FFmpeg
  - ScreenCaptureKit
status: active
---

listenin records microphone and system audio on macOS, then turns the recording into a high-quality, speaker-labeled transcript after the meeting. Audio and voiceprints stay on your machine, and retained recordings can be transcribed again as models and settings improve.

## Features

- **Local capture** — records mic and system audio through macOS ScreenCaptureKit
- **Batch transcription** — uses long-form decoding and full-recording context instead of trading accuracy for live output
- **Speaker diarization** — clusters speakers across the whole recording and supports reusable, explicitly enrolled voice profiles
- **Append-only passes** — new transcriptions never overwrite old ones, making models and settings easy to compare
- **Canonical YAML** — stores structured speakers, timestamps, and segments, with Markdown as a regenerable view
- **Glossary support** — primes recognition with names, product terms, and company-specific language
- **Optional refinement** — cleans transcripts and produces summaries through your own OpenAI-compatible endpoint
- **On-demand peek** — transcribes the meeting so far when a quick mid-call check is useful
