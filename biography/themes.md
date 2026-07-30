# Emerging Themes

## 1. Building is how Morten learns

Morten does not only read or evaluate technologies from the outside. He often recreates small or ambitious versions of them to understand the design decisions and tradeoffs underneath.

Possible framing:

- building as reading
- tinkering as research
- trial and error as a knowledge engine
- recreating solved problems to understand why the solved version looks the way it does

## 2. Rebuilding solved problems, then choosing the mature tool

Morten often builds his own version of an existing solution. This is not usually because he believes he can outbuild the ecosystem, but because the act of building exposes the hard problems.

The mature tool often wins afterward because it is maintained, known, documented, and supported.

This shows both curiosity and senior pragmatism.

## 3. Abandoned projects as field notes

There are hundreds of abandoned repositories. They are not only unfinished products; many are learning artifacts.

A project may exist to make a concept concrete:

- Bloom filters
- orchestration
- infrastructure state management
- AI memory
- voice latency
- tool interchangeability

The repo may die, but the understanding remains.

## 4. The first 80% versus the last 20%

Morten is strongest in the exploratory phase:

- finding the shape of a problem
- proving that something is possible
- designing the architecture
- understanding the core tradeoff
- making the interesting part work

The final 20% is harder:

- polish
- finishing details
- usability
- edge cases
- documentation
- repeated cleanup

Professionally, this has been handled by collaborating with people who enjoy and excel at finishing polish. Personally, AI has started filling part of that role.

## 5. AI as workshop assistant, not magic replacement

LLMs help Morten finish personal projects enough to become daily drivers. They are useful in the lower-energy final 20%: glue, polish, repetition, cleanup, UI finishing, documentation, and small gaps.

This is not framed as AI replacing skill, but as AI complementing Morten's specific builder profile.

## 6. Engineering is the art of restriction

This may be the central philosophical theme.

A programming language is almost unrestricted, but that makes it a poor product interface for most users. Good engineering and product design remove possibilities until what remains is useful.

Interfaces — UI, API, platform contracts, agent tools, prompts, infrastructure abstractions — all involve choosing what to expose, what to hide, what to forbid, and where to allow freedom.

Good restriction is not limitation for its own sake. It is the shape that makes power usable.

BilZonen adds an early version of this lesson: the danger is not simply custom abstraction. A well-designed abstraction/interface can create flexibility because it allows an implementation to be replaced. The more dangerous rigidity is a large implementation tangled directly into the product without the right seam around it.

## 7. Current chapter: agentic AI at ZeroNorth

Morten is currently applying years of personal AI tinkering to a professional platform-level effort: building the core of ZeroNorth's next iteration as an agentic reimagining of the platform.

His prior experiments give him scar tissue and intuition about:

- latency in voice AI
- long-term memory activation
- tool interfaces and interchangeability
- limitations and failure modes of AI systems

This positions him as someone who brings practical, hands-on AI system intuition rather than only surface-level enthusiasm.

## 8. AI as orchestration over deterministic tools

In the ZeroNorth platform work, LLMs are not framed as magic brains replacing the platform. The platform already contains deterministic tools, domain data, and human expertise.

The agentic layer is about orchestration:

- connecting signals across a large platform
- handling simple or routine decisions
- reducing operator time spent gathering context
- surfacing meaningful information when human oversight is needed

A key nuance: outsource orchestration and simple decision-making to LLMs, but rely on deterministic tools and humans for the real intelligence parts.
