---
slug: nova
name: Nova
description: A programming strategy game where you write TypeScript for autonomous androids preparing a hostile planet before humanity's colony fleet arrives.
repo: https://github.com/morten-olsen/nova
url: https://morten-olsen.github.io/nova/ide/
stack:
  - TypeScript
  - React
  - Vite
  - WebRTC
  - Monaco Editor
  - Three.js
status: alpha
---

Nova is a programming strategy game built for playing with coding agents. You do not move units directly: you write the TypeScript module an android runs, launch it into a hostile world, inspect the recorded result, and improve the program that controls it.

## How it works

- **One action per round** — each android runs its script once and chooses a single move, collection, construction, salvage, or broadcast action
- **Autonomous execution** — once a run begins there is no intervention; battery, cargo, hazards, and routing are the program's responsibility
- **Event-based recordings** — replay and scrub every round to inspect the exact decision a script made and the world it observed
- **Colony progression** — scavenge materials, build infrastructure, establish production, clean acid, and prepare a colony module
- **Fog of war** — each script receives only the world projection visible to its player's androids, scanners, and radars
- **Browser lab** — edit and run scripts locally in a browser IDE without installing the CLI
- **Peer-to-peer matches** — host or join two-player games over WebRTC with configurable post-match disclosure
- **Agent-ready factories** — the CLI creates a typed android project with rules, examples, and instructions for a coding agent
