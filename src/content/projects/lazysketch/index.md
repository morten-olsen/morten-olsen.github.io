---
slug: lazysketch
name: LazySketch
description: A live presentation tool that listens to your voice and draws hand-sketched slides while you speak, with speech models running on-device.
repo: https://code.olsen.cloud/incubator/lazysketch
url: https://lazysketch.mortenolsen.pro
stack:
  - TypeScript
  - React
  - Vite
  - Tailwind CSS
  - Transformers.js
  - WebGPU
  - IndexedDB
status: alpha
---

LazySketch turns a live transcript into a presentation as you speak. A fast LLM follows the talk and continuously draws hand-sketched diagrams, bullets, code blocks, and the occasional rubber-duck stamp onto a lamp-lit paper canvas.

## Features

- **Voice-driven slides** — the deck follows the live transcript instead of a prepared sequence
- **Local speech models** — Whisper and Kokoro run in browser workers, with WebGPU acceleration when available
- **Bring your own model** — connects to any OpenAI-compatible endpoint, without a bundled service or account
- **Browser-local storage** — presentations and recordings stay in IndexedDB and can be exported or imported
- **Cue files** — a talk outline gives the drawing agent context without scripting every slide
- **Replay and rehearsal** — rehearse from a prepared script, record live sessions, scrub through them, or resume for questions
- **Agent-friendly CLI** — author sheets and cues as files, sync them into the browser, run scripted sessions, and inspect evaluation reports
