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

## BilZonen: start of professional developer career

Morten wants to treat BilZonen as the practical beginning of his developer career.

Before BilZonen, he worked for a period as a programmer in a small agency, but he was very young and does not really count it as professional experience.

BilZonen is the point where he started to move from hobby development into professional development, though with the caveat that it was still junior, part-time work.

What made it different from hobby development was the feeling of actually working on a real-world product.

The strongest difference was continuity. Before BilZonen, Morten had mostly done short stints on projects and then moved on to the next thing. At BilZonen, he experienced gradually improving a product over time when things went well, and living with the consequences when they did not. That continuity made the work feel more real than anything he had done up until that point.

Illustrative story: BilZonen was a used-car marketplace, and the team also had a catalogue of car details — not individual used-car listings, but underlying car data. At one point they needed to switch from one data provider to another. The old implementation was heavily tangled into the system, so the team was looking at something close to a complete rewrite.

The site was built in Umbraco 4, which was XSLT-based and required a lot of boilerplate to build features. As a young developer, Morten thought he could improve on this by building his own templating system. It was composed of a very large amount of string concatenation. The result worked, and was very fast and stable, but maintainability suffered significantly. Morten and others had to maintain it afterward, so the pain was both personal and shared: he had not only created his own maintenance burden, but also forced it onto colleagues. This became an early concrete lesson in the difference between making something work and making something maintainable inside a long-lived product.

Important nuance: this did not make Morten anti-abstraction or anti-custom systems. The lesson was not "never build custom abstractions." If anything, he is now more focused on abstractions and interfaces. A good abstraction creates flexibility; it lets a bad implementation be replaced later. The real rigidity is a large, unabstracted implementation that is tangled into the product. In the BilZonen example, the data model was simple enough that the right interface/abstraction around it could have made the messy templating implementation much easier to replace or clean up.

The car-catalogue/provider work was the most consuming part of the role, partly because the team was handling a large relational database. Morten remembers printing the relationship diagram in a small font and still ending up with roughly 30 pages, which he taped together and put on the wall to understand how to map the database into the almost table-like frontend.

Other BilZonen projects included a jQuery Mobile website.

Another important contribution was improving deployment. When Morten started, deployment meant overwriting files on the production server using FTP. The team had already had a few outages caused by people, Morten included, accidentally overwriting the wrong files. Morten saw a chance both to improve the company's process and to learn something along the way. He got a budget to buy a computer, repurposed it as a TeamCity build server, and the team ended up with an actual CI/CD pipeline.

Work was organized through a shared FogBugz board, where people mostly picked tasks from the board rather than receiving tightly assigned work. This gave Morten room, even as a junior part-time developer, to notice problems and take on useful pieces of work.

BilZonen was the smaller alternative to the large Danish used-car marketplace BilBasen. At its peak during Morten's time, the company had roughly three full-time and three or four part-time engineers, plus the CEO, a product manager, a supporter, a journalist, and three salespeople.

The office was small enough that Morten had a general sense of what everyone was doing, including non-engineering functions. However, at that point in his career he did not have a very active interest in areas outside engineering; his attention was mostly on the technical work.

One of the main instincts Morten left with was a tiredness of cumbersome tooling. In this case, Umbraco 4 felt like it created too much boilerplate and made too little of the result easy to validate through testing. The experience gave him an early awareness of the importance of good tooling and the cost of not having it.

## Session checkpoint

We ended the earlier ZeroNorth thread after discussing the human purpose of the agentic platform work and a cautious illustrative maritime workflow example. Morten chose to skip the AI-experiment thread for now and start shaping earlier experience descriptions, beginning with BilZonen.

Good next place to resume:

Continue the BilZonen interview: what made the work feel different from hobby programming, what responsibilities he was trusted with, and what he learned there about real production systems.
