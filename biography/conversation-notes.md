# Conversation Notes

Chronological notes from the biography interview. These are source notes, not final copy.

## Initial direction

Morten wants to update his personal webpage/CV. The desired process is biographical and conversational, not filling out a form. The aim is to uncover the real story first, then write:

- a full, story-driven version in a fun, maker/storytelling tone
- a strong short CV version derived from that story

Tone reference for the long version: Adam Savage talking about a topic — curious, practical, energetic, and craft-oriented.

## Core drive: compulsive problem-solving and tinkering

Morten described the central pattern as passion, but not a single origin story. The repeated behavior is:

> If I see an issue, I want to solve it.

This applies both professionally and personally. If the problem fits into work, it becomes part of work. If it does not fit, it often becomes a spare-time experiment.

This pattern has created a lot of knowledge through trial and error.

## Building to understand, not necessarily to replace

A large driving force is the tinkerer instinct: taking things apart and trying to reassemble them in order to understand how they work.

Morten often builds his own solution even for already-solved problems. The point is usually not that his version is necessarily better, but that building it reveals the design decisions behind the established solution.

He may then scrap his version because the established solution has advantages:

- maintained by others
- understood by the wider community
- more mature
- better ecosystem support

His own solution may be more optimized for a specific issue, but that does not automatically make it the right thing to keep.

## Infrastructure experiments

Morten has built many infrastructure "frameworks" over the years, often solving problems similar to those addressed by tools such as:

- Terraform
- Ansible
- CloudFormation
- Argo
- Flux

He has also gone lower-level and tried to build orchestration-like systems instead of Kubernetes.

This is an example of an overly ambitious problem, but the goal was not to compete with teams of extremely competent domain experts. The value was learning the challenges those tools must overcome and better understanding their design and limitations.

## Cool technologies become workshops

When Morten hears about a cool technology or concept, he often workshops it into a personal project or builds a new project around it.

Example given: Bloom filters.

The ideal outcome is something he might use, but more often the result goes into a graveyard of abandoned repositories. There are hundreds of these.

Important framing: the abandoned projects are still learning artifacts.

## The 80/20 project pattern

Morten has personal projects he would genuinely like to build, but curiosity often carries him to around 80% before he abandons them. Later, a new interesting technology may give him an excuse to restart the project.

He wishes he were better at finishing personal projects.

He is very strong at the first 80% of a project: exploration, proving the idea, shaping the architecture, making the interesting part work.

The last 20% takes significant focus and willpower: polish, completion, integration, daily usability, edge cases, finishing details.

Professionally, he has generally overcome this limitation by working with people who enjoy adding finishing polish. This has been important to making the exploratory strength useful in teams.

For personal projects, the lack of a finisher/polisher has often been the killing blow.

AI/LLMs have changed this. They can now substitute for some of that finishing role well enough to make personal projects usable as daily drivers.

## Current professional chapter: ZeroNorth AI / agentic platform

Morten currently works in a small team tasked with building the core of ZeroNorth's next iteration: an agentic reimagining of the platform.

AI systems are an area where Morten has built many personal experiments, including:

- voice AI systems trying to solve the latency path
- advanced long-term memory activation systems
- tool platforms for tool interchangeability

When the ZeroNorth project started, he entered it with a lot of personal experience about how these systems work and the limitations that must be overcome.

## Engineering as restriction

Morten's formulation:

> Engineering is the art of restriction.

A programming language is the extreme of unrestricted possibility: a user could theoretically solve any issue in a programming language, but that is not very useful as a product interface.

Product design is about removing everything not needed so the user can easily interact with what remains.

Interfaces — whether programmatic or visual/user-facing — are about finding the balance:

- restricted enough to be usable
- not so restricted that the user cannot solve the task

This idea appears to be a central narrative bridge across frontend, infrastructure, platform, product design, and AI agent work.

## ZeroNorth agentic platform: human purpose

ZeroNorth is a large platform covering many aspects of maritime operations. Operators today use many different features across the platform and look at data from many places to make decisions.

This is time-consuming. Many decisions are relatively trivial, but still take human attention. Other decisions become harder because the operator has to build a full picture from a large number of signals.

The goal of the agentic reimagining is to expose the entire platform in an agentic way, so agents can interact with the platform, analyze signals, and act on simple tasks. When a task truly requires human oversight, the system should surface meaningful information to the operator.

Morten describes the plan as an orchestration system for the platform, powered by deterministic tools and platform data. The team is trying to outsource orchestration and simple decision-making to LLMs, while using deterministic tools and humans for the actual intelligence parts.

Important nuance: LLMs are not treated as the source of truth or the real intelligence. They are used for orchestration and routing around deterministic capabilities, data, and human judgment.

## Example operator workflows to be careful with

Morten emphasized that he is not an expert on the actual maritime processes, so these examples are paraphrased and should be handled carefully in public writing.

Example: before a vessel departs, the port and time window may already be known in the system. An operator may go into the platform to generate an optimized route. That involves entering information and waiting for calculation to complete. The plan is sent to the master, who may reply with a question that needs answering.

Once the vessel is underway, the weather forecast may change. It may become worth changing the route due to fuel usage or safety concerns. That again needs analysis and communication with the master.

This is one small example of the larger maritime space ZeroNorth operates in.

Other possible examples mentioned:

- mechanical/routine parts of buying bunker fuel through WhatsApp
- bringing together data when a vessel is underperforming and may need hull cleaning

Use these examples as illustrative, not authoritative domain claims.

## Session checkpoint

We ended the session after discussing the human purpose of the ZeroNorth agentic platform work and a cautious illustrative maritime workflow example.

Good next place to resume:

Ask what Morten's personal AI experiments — voice AI latency, long-term memory activation, and interchangeable tool platforms — taught him that became useful in the ZeroNorth work. Focus especially on traps, limitations, and design instincts he had already developed before the professional project began.
