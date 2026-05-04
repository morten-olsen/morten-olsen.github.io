---
slug: grimoire
name: Grimoire
description: A Bitwarden-compatible CLI, SSH agent, and daemon for Vaultwarden — built for engineers who want their secrets served from memory, not files on disk.
repo: https://github.com/morten-olsen/grimoire
stack:
  - Rust
  - X25519
  - ChaCha20-Poly1305
  - Swift
  - GTK4
license: MIT
status: active
---

Grimoire is a Bitwarden-compatible CLI and SSH agent for Vaultwarden. It was born out of a desire to have proper secret management that integrates seamlessly into a developer workflow without relying on proprietary clients.

## Features

- **Vault access** — full read/write to a Vaultwarden instance from the command line
- **SSH agent** — keys are served from memory, never written to disk
- **Secret injection** — inject vault items into environment variables for any command
- **Scoped approval prompts** — biometric, PIN, or password with a hardcoded 5-minute expiry per session
- **Encrypted IPC** — X25519 key exchange with ChaCha20-Poly1305 between CLI and daemon
- **Auto-lock** — daemon locks after 15 minutes of inactivity
- **Git commit signing** — sign commits using keys stored in your vault
- **GUI prompts** — native prompts via Swift on macOS and GTK4 on Linux
- **Headless support** — runs on servers without a display
