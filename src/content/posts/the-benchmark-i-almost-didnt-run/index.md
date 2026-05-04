---
title: "The Benchmark I Almost Didn't Run"
subtitle: "How an evening of validation collapsed two months of careful engineering."
description: "I picked the textbook-correct model and accepted the compute cost as the price of doing things properly. Then I almost gave up on the project. Then I ran a benchmark, and the benchmark told me the textbook was wrong."
pubDate: 2026-05-01
color: '#00D4FF'
heroImage: ./assets/cover.png
slug: the-benchmark-i-almost-didnt-run
tags: ["ai", "ml", "engineering"]
---

There's a flavor of engineering pain that doesn't register as pain at the time. It feels like *being responsible*. You read the docs, pick the recommended tool, and accept its costs as the price of doing things properly — the way an adult accepts that the gym membership is going to keep auto-renewing. You build careful, principled mitigations around its rough edges. And then, months later, you run a benchmark, and the benchmark sits you down like a disappointed parent and explains that the tool was wrong, the costs were unnecessary, and the mitigations were elaborate apology letters for a problem you'd manufactured yourself.

That happened to me this year on a side project that almost shipped before I noticed it shouldn't. The thing that saved it was a benchmark I'd been treating as paperwork.

The project is [Editions](https://mortenolsen.pro/editions/), a self-hosted news reader. The part that matters here: you define topics — *focuses* — in plain English, and the system sorts articles from your RSS feeds into them regardless of which feed they came from. Most feeds are broad ("technology"). Your focuses are narrow ("AI safety and alignment risk"). Bridging that gap is a classification problem. And because Editions is built around *nothing leaves your machine* — no central service, no analytics, no nothing — that classifier has to run on whatever the user has lying around. No model API to call, no GPU to assume, often a NUC humming in a closet between a label printer and a box of mystery cables that might be HDMI, might be the charger for a 2014 Kindle.

So the engineering question, stripped of romance, is this: how do you do zero-shot text classification on someone else's homelab, well enough to be useful and cheaply enough that it doesn't slow-cook the Raspberry Pi already running Pi-hole, Home Assistant, and a Minecraft server for the kids?

That's where the first mistake started. Confidently. Wearing a tie.

## Built for the job

Every tutorial on zero-shot classification points at the same thing, with the same calm, reassuring tone. NLI. Natural Language Inference. The textbook answer. The Wirecutter pick of model architectures. You give it a piece of text and a candidate label phrased as a hypothesis ("this article is about AI safety"), and it returns a probability that the hypothesis follows. It is, literally, the job description. Every tutorial routes you to a flavor of `bart-large-mnli`. Ask any reasonable engineer to pick a tool for this problem and they will pick NLI, and they will be right, and at no point in this article will I tell you they were wrong.

So I picked NLI. Smug as a man who reads the manual.

The cost was real but felt earned. NLI runs the full model for every (article, focus) pair. Five focuses, a hundred new articles, five hundred forward passes through a hefty model on a NUC originally bought to host a Plex server and now, against its will, employed as a machine learning workstation by a man who never asked its permission. It is not fast.

So I built the obvious mitigations. Classification went into a long-running background queue. Articles trickled in, processing trickled behind them, and I phased the work carefully enough that the box didn't slow-cook itself into thermal shutdown like a forgotten lasagna. The user-facing pitch became *"your next edition will be ready in about twenty minutes,"* hidden behind soft UI language engineered to make twenty minutes feel like a feature rather than a confession. The whole point of Editions is the small satisfying ritual of opening a finished magazine with your morning coffee. *Check back tomorrow* is not a ritual. *Check back tomorrow* is homework I assigned myself.

I shipped that, more or less. It was correct. It was principled. It felt like wearing a wool suit to the beach.

That's where the benchmark came in, dragging its feet like a teenager asked to empty the dishwasher.

## The benchmark I almost didn't run

Let me be honest about why I ran it: I was about to quit. The NLI bottleneck had me circling the drain on the entire project. The mitigations made the system *run*, technically, in the sense that a sloth wearing running shoes is technically participating in a marathon. Twenty-minute latency is where the dopamine of opening a finished magazine quietly degrades into the small sad realization that you opened a tab three hours ago and forgot what was supposed to be in it. I was workshopping the polite way to tell my own GitHub repo we should see other people.

The benchmark was a last sanity check before I did. I knew what the cheap alternative looked like: vector similarity with general-purpose embeddings. Embed the article once, embed each focus once, cosine-similarity them like an undergraduate's first NLP assignment. Trivially fast. Trivially batched. The only question was whether the quality drop versus a purpose-built NLI model would be catastrophic — whether I'd just be picking a faster way to ship a bad product.

So I wrote it. Took an evening. I sat down with seventy articles from three RSS feeds — The Verge, Ars Technica, and the New York Times' world section — and labeled each one against fifteen topic descriptions by hand, in a CLI I'd built for the purpose. This is the kind of work that makes you understand why labeling startups exist, and why the phrase *"I built a CLI for it"* is the engineer's universal euphemism for *"I have made my own life worse on purpose, and I would like a witness."*

Then I wired up six models — the NLI baseline plus five general-purpose embedding models — and pointed them at the same labeled set against three metrics. The mantra going in was *please do not be terrible, please do not be terrible, please do not be terrible*, muttered under my breath like a man at a craps table who has already told his wife he's done gambling.

I expected the embeddings to lose. The question was just by how much, and whether I could stomach it.

Then I ran it.

## Where my priors went to die

The embeddings didn't lose.

They won.

I sat there for a minute trying to figure out which model I'd misconfigured, because there was no other reasonable explanation for what I was looking at. The general-purpose embeddings — the cheap fallback I'd lined up so I could feel I'd done my due diligence before quitting — were beating the purpose-built NLI baseline. Not by a tiebreaker. By a gap wide enough to drive a NUC through.

The headline winner was `bge-small-en-v1.5`, an embedding model whose entire reason for existing is to turn English text into 384-dimensional vectors and let you cosine-similarity them at home. It scored 86.9% F1 against my hand-labeled set. NLI scored 84.6%. That's a 2.3-point lead for a model never meant to do this — and one that costs roughly an order of magnitude less compute per article. Embeddings cost you one pass per article. NLI costs you one pass per article *per focus*. With five focuses, that's the difference between embedding once and running the full model six times. Per article. Forever.

<figure>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" font-family="'Space Grotesk', system-ui, sans-serif" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
    <rect x="14" y="14" width="772" height="492" fill="#000000"/>
    <rect x="6" y="6" width="772" height="492" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
    <text x="32" y="50" font-family="'Archivo Black', sans-serif" font-size="22" fill="#000000">F1 score by model</text>
    <text x="32" y="74" font-size="14" fill="#333333">Higher is better. 70 articles, 15 topic descriptions.</text>
    <g transform="translate(200, 110)">
      <text x="-12" y="26" text-anchor="end" font-size="14" font-weight="700" fill="#000000">bge-small</text>
      <rect x="0" y="0" width="430" height="40" fill="#00D4FF" stroke="#000000" stroke-width="3"/>
      <text x="442" y="26" font-size="14" font-weight="700" fill="#000000">86.9%</text>
    </g>
    <g transform="translate(200, 165)">
      <text x="-12" y="26" text-anchor="end" font-size="14" fill="#000000">MiniLM-L12</text>
      <rect x="0" y="0" width="395" height="40" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
      <text x="407" y="26" font-size="14" fill="#000000">84.7%</text>
    </g>
    <g transform="translate(200, 220)">
      <text x="-12" y="26" text-anchor="end" font-size="14" font-weight="700" fill="#000000">NLI (BART)</text>
      <rect x="0" y="0" width="394" height="40" fill="#FF5757" stroke="#000000" stroke-width="3"/>
      <text x="406" y="26" font-size="14" font-weight="700" fill="#000000">84.6%</text>
    </g>
    <g transform="translate(200, 275)">
      <text x="-12" y="26" text-anchor="end" font-size="14" fill="#000000">MiniLM-L6</text>
      <rect x="0" y="0" width="386" height="40" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
      <text x="398" y="26" font-size="14" fill="#000000">84.1%</text>
    </g>
    <g transform="translate(200, 330)">
      <text x="-12" y="26" text-anchor="end" font-size="14" fill="#000000">gte-small</text>
      <rect x="0" y="0" width="384" height="40" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
      <text x="396" y="26" font-size="14" fill="#000000">84.0%</text>
    </g>
    <g transform="translate(200, 385)">
      <text x="-12" y="26" text-anchor="end" font-size="14" fill="#000000">gte-base</text>
      <rect x="0" y="0" width="314" height="40" fill="#FFFFFF" stroke="#000000" stroke-width="3"/>
      <text x="326" y="26" font-size="14" fill="#000000">79.6%</text>
    </g>
    <line x1="200" y1="440" x2="680" y2="440" stroke="#000000" stroke-width="2"/>
    <text x="194" y="462" font-size="12" fill="#333333">60%</text>
    <text x="354" y="462" font-size="12" fill="#333333">70%</text>
    <text x="514" y="462" font-size="12" fill="#333333">80%</text>
    <text x="672" y="462" font-size="12" fill="#333333">90%</text>
  </svg>
  <figcaption style="font-size: 0.875rem; color: #333333; text-align: center; margin-top: 0.5rem; font-style: italic;">The textbook answer in red. The cheap fallback in cyan. The smug little gap between them, where two months of my life went.</figcaption>
</figure>

The model I'd built mitigations around wasn't just unnecessary. It was *worse*. The fast path was also the good path. Every sad-eyed UX accommodation was a tax I'd been quietly paying for the privilege of being slightly less accurate. I had built a cathedral of scaffolding around a problem that didn't exist.

Then the second twist. I scanned the chart for the runner-up, expecting NLI to at least limp home with silver. It didn't. Three other embedding models had walked past it, and one tells its own story: `gte-small` scored 84.0%, while its bigger sibling `gte-base` — same family, more parameters, the one you'd reach for if a colleague asked — scored 79.6%. Smaller model, same family, beat the bigger one by 4.4 points.

This is the part that did the most damage to my priors. *"Bigger model from the same family is at least as good"* is the kind of claim I'd have stated as fact in a system design doc with the casual confidence of a man explaining to his friends how to invest in crypto. Wrong inside a single family, on a single test set. Not "coin flip" wrong. *Five F1 points* wrong. The kind of wrong you put on a t-shirt.

The queue went. The phased processing went. The *check back tomorrow* went, replaced by *check back in a minute*. And every line of mitigation code I deleted was code I'd written competently — none of it sloppy, none of it unnecessary *for the architecture I had*. It was just unnecessary for the architecture the benchmark was telling me to switch to. Engineering is the only field where the punishment for solving a hard problem well is finding out, in the cold light of a CSV file, that you didn't need to solve it.

## The map, not the territory

The lesson is not "test your assumptions." That's a fortune cookie, and I do not need a fortune cookie to feel bad about my last two months. The actual lesson is sharper and slightly more uncomfortable, and I had to wear it home.

NLI is the right answer for zero-shot text classification *on the benchmarks NLI was designed against*. Those benchmarks have hundreds of carefully crafted candidate labels, paragraph-length premises, and use cases where "this hypothesis follows from this premise" is a probability that actually matters. My task — fifteen short topic descriptions written by some guy in his kitchen, four-paragraph news articles, run on a NUC living under a router — is emphatically not that benchmark. The recommendation is correct. It's correct *somewhere else*. It's correct in a building I do not work in.

Best practices are advice from someone else's evaluation harness.

They encode the problem shape the people writing the recommendation cared about. Your problem has a shape too, and unless you're willing to bet it's identical to theirs, the recommendation is a strong hint, not a load-bearing wall. The dangerous version of "best practice" is the one you adopt because it sounds responsible and never benchmark — because you've handed off your thinking to someone who has never seen your data, your hardware, or your users. That's the entire job. That's the only job.

The really uncomfortable thing is that the mitigations I built were *evidence*. Every piece of scheduling logic I wrote to dodge the cost of NLI was the system tapping me on the shoulder, increasingly politely, to let me know the model didn't fit. I was treating the evidence as friction and engineering my way around it like a man stacking books in front of a leaking pipe. I should have been treating it as a question.

## And now what

The usual caveats apply, and I'd rather list them myself than have someone on Hacker News do it with less charity. One project. One dataset. One family of models. One very specific classification problem run by one guy in one country. The gap is also lopsided — every model handles cleanly separable topics fine; the spread only opens up where my categories overlap, which is, of course, where the choice actually matters. The full evaluation, including the ugly per-feed breakdowns, is [up on the project site](https://mortenolsen.pro/editions/evaluation/) if you want to argue with it. Please do. I'd much rather find out it's wrong now than after a thousand users have politely emailed me about it.

The thing I'm sitting with is what *else* I'm currently paying a complexity tax for. How many of the other "principled" choices in my codebase are mitigation towers welded around a recommendation that doesn't fit? How many of my queues exist because the right model would be fast enough not to need one? I don't know yet. I am, in the spirit of the recently archived NLI pipeline, about to find out, probably loudly.

If you're building something and you're already on your second mitigation, stop building the third. Write the benchmark. The benchmark is cheaper than the breakup letter to your own GitHub repo, and it has a non-zero chance of saving the project. Mine had a 100% chance, and I almost didn't write it.
