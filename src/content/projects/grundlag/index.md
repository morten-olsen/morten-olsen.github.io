---
slug: grundlag
name: Grundlag
description: A shared, self-hosted foundation for modeling capabilities once as typed actions, events, and data, then composing agents, automations, and apps on top.
repo: https://code.olsen.cloud/incubator/grundlag
url: https://grundlag.mortenolsen.pro/
stack:
  - TypeScript
  - Zod
  - Fastify
  - QuickJS
  - SQLite
  - Docker
license: MIT
status: active
---

Grundlag — Danish for "foundation" — is a set of composable libraries for building software around shared capabilities instead of isolated apps. A provider models an external system once as typed actions, searchable entities, and reactive events; agents, automations, scripts, and conventional applications can all use the same primitives.

## Building blocks

- **Providers** — adapt calendars, messaging services, device networks, and other systems into a common typed model
- **Agents** — expose provider actions as tools, stream model output, preserve conversations, and pause for human approval
- **Deterministic sandbox** — run TypeScript in a sealed QuickJS environment with replayable calls and resumable interruptions
- **Automation engine** — embed automations into an agent-authored or hand-built experience without creating another integration layer
- **Composable server** — assemble a self-hosted HTTP host from the providers and services a deployment needs
- **Generated client** — build a typed API and matching tool set from a running server's manifest
- **Transport-independent tools** — run the same agent or sandbox against local services or an HTTP-backed client
