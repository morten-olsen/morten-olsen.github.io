---
title: 'The Dev Is Dead, Long Live the Dev'
description: 'I build agentic AI platforms for a living and tinker with them for fun. The green grass is real — but getting there required breaking a lot of things first. Here is what went wrong, what we are losing, and why I think you can put the doom articles down.'
pubDate: 2026-04-13
color: '#8B5CF6'
heroImage: ./assets/cover.png
slug: the-dev-is-dead-long-live-the-dev
---

Last Tuesday, I mass-refactored an authentication flow across four services in about twenty minutes. Not by myself — I had an agent handling the mechanical parts while I focused on the edge cases that actually required a brain. At one point, it flagged a race condition I hadn't considered, and I caught a permissions gap it had missed. We went back and forth for a bit, fixed both, and shipped it before lunch.

It felt like pair programming with a very fast, slightly overconfident colleague. It felt *good*.

I'm telling you this because I need you to know: I am not here to write the "AI is ruining software" article. You've read that one. I've read that one. I've probably *been* that article at dinner parties.

By day, I work on a team that's reimagining our entire platform as an AI-based agentic system. By night, I maintain a personal AI setup I've affectionately named [GLaDOS](/posts/grown-ups-guide-personal-ai/), because naming your side projects after fictional AIs with questionable ethics is apparently my love language. I am, by most reasonable definitions, *all in* on this.

But getting to that Tuesday — to the version of agentic development that actually works — required stumbling through a version that very much didn't. And I don't think I'm the only one with bruises. The industry moved fast. We went from "AI can autocomplete my function" to "AI is writing my entire pull request" in what felt like six months. And in that rush, we skipped a few steps. I don't have the answers — I have suggestions, bets, and a few things that seem to be working. This is me trying to make sense of it while it's still moving.

## We've Outrun Our Own Instincts

There's a mildly terrifying fact about being human: we're running 21st-century software on 50,000-year-old hardware.

Our brains evolved for small tribes, immediate physical threats, and figuring out which berries wouldn't kill us. They did not evolve for Slack notifications, global information overload, or sitting in an ergonomic chair for eight hours arguing about type systems. We are fish who taught themselves to ride bicycles.

But we adapted. Not by evolving faster — that takes millennia — but by using our other strengths. We built cooperation, culture, institutions, and tools that bridge the gap between what our ape brains can handle and what our environments demand. In return, we got antibiotics, central heating, and the ability to argue with strangers on the internet. The tradeoffs are real — loneliness, anxiety, the fact that our spines clearly weren't designed for desks — but most of us wouldn't trade it for the savannah.

I think the exact same thing is happening to developers right now. Our "developer instincts" evolved in a world where you wrote code, understood code, and maintained code — all yourself. The agentic shift has outpaced our ability to update our practices, our habits, and our mental models. We're the hunter-gatherer brain trying to navigate the industrial city.

And the answer isn't to go back to the savannah. It's to build the habits and guardrails that let us thrive in the new environment — while being honest about what we trade away.

How fast is this moving? A study by METR — published mid-2025, evaluating tools from earlier that year — found that experienced developers were **19% slower** when using AI coding tools, while *predicting* they'd be **24% faster**. That's a staggering gap between perception and reality. But here's the thing: that study used autocomplete-era tools. Chat-in-editor, suggest-a-line-of-code stuff. The agentic systems I use daily — tools that autonomously navigate codebases, run tests, and iterate on failures — are a fundamentally different species. That study isn't even a year old, and it already describes a different era. Are agentic tools actually better? My experience says yes, emphatically — but I don't have peer-reviewed data to back that up, and neither does anyone else yet. For now, this is practitioner intuition, not science. Take it accordingly.

By the time you read this, the landscape will have shifted again. Keep that in mind — everything that follows is a snapshot, including my own experience.

## We're Shipping Code Nobody Understands

Code churn — the rate at which recently written code gets rewritten — has nearly doubled since 2020, with the steepest rise tracking neatly alongside AI adoption. And according to Qodo's 2025 survey, 76% of developers report low confidence in AI-generated code, experiencing frequent hallucinations and declining to ship it without heavy manual review. We're building skyscrapers on foundations we haven't inspected, and we're doing it *faster than ever*, which mostly means we'll discover the cracks sooner.

I want to name something here that I don't see named often enough: the deep, bone-level understanding you develop when you write something yourself, line by line. It's the intuition for where the bugs hide, not because someone told you, but because you *built* the walls they hide behind. It's the ability to get paged at 2 AM and have a mental map of the system before you even open your laptop. That kind of understanding doesn't come from reading code. It comes from writing it, struggling with it, and swearing at it.

That's atrophying. And I think we need to say that out loud rather than pretending it's fine.

I miss it. I miss the feeling of knowing a codebase so intimately that I could navigate it in my sleep. I miss the slow satisfaction of building something from nothing, understanding every byte, every decision. There's a particular kind of confidence that comes from that depth of knowledge — a quietness, a "I know exactly where this will break and why" — that I find myself reaching for and coming up empty-handed more often than I'd like to admit.

That feeling isn't coming back. Not in the way it was. And I don't think it helps to pretend otherwise.

What I *can* do is stay in the loop deliberately, rather than letting the tooling make that optional. After the agent generates a significant chunk of code, I stop and interrogate it. Walk me through this. Why this approach? What are the alternatives? I'm not being polite about it — I'm actively looking for the places where it's confidently wrong, poking at the reasoning, checking it against my own understanding of the problem. If I can't find a hole in its logic, I probably don't understand it well enough. For critical paths — the code that handles money, auth, or data integrity — I still apply the same rigor I always did. The AI writes the first draft; a human makes sure the draft isn't quietly insane. And before I accept any substantial output, I force myself to answer one question: if this breaks at 3 AM, will I know where to look? If the answer is no, I'm not done yet.

One more habit that's quietly become one of my most valuable: building reference material by hand. I spend time crafting small, well-defined, thoroughly documented units — patterns, scaffolds, architectural building blocks — that represent how I *want* things to work. Not full implementations, but clear expressions of intent. Then, instead of hoping the agent invents the right approach, I hand it the reference and let it adapt the pattern to the specific project. Before AI, I had similar templates, but I always had to manually adapt them to each codebase myself. Now I invest the time once to make the reference material really strong, and the agent handles the adaptation. The irony is that AI has made me *more* deliberate about craftsmanship, not less. I just apply that craftsmanship at a different altitude.

## We Use Tools We Don't Trust

I had a moment a few months ago where I caught myself approving an AI-generated PR with a comment that essentially amounted to "looks right to me" — and then realized, walking to get coffee, that I hadn't actually *read* it. Not properly. I'd skimmed it the way you skim a terms-of-service agreement: enough to feel like I'd done my due diligence, not enough to actually catch anything.

I don't think I'm alone in this, and the data backs it up. According to Stack Overflow's 2025 survey, 84% of developers now use or plan to use AI coding tools. In the same survey, trust in AI accuracy *dropped* from 43% to 33% year-over-year. We are using more of something we believe in less. I've been trying to think of a historical parallel, and I genuinely can't. We didn't adopt cars while becoming less confident they had brakes. We didn't adopt the internet while doubting that websites worked. "Everyone else is using it, so I have to, even though I'm not sure it works" is not a healthy technology adoption curve. It's a bubble.

Part of the problem might be that our opinions are lagging behind the tools. Remember that METR study — developers 19% slower with autocomplete-era AI? A lot of the wariness people carry today was formed during that generation. The tools changed; the gut feeling didn't. We're making judgments about today's car based on last year's horse. That doesn't mean the wariness is wrong — but it does mean we should be recalibrating constantly, and very few of us are.

What nags at me most is the loss of something subtler: the determinism of our toolchain. `gcc` doesn't hallucinate. `npm install` doesn't improvise. When you type `git commit`, it does what you told it — every time, without creativity. There was an implicit contract with our tools: they are reliable, predictable, and boring. You could build trust on boring. AI agents broke that contract. The same prompt can produce different results. The tool might be brilliant or quietly wrong, and the failure mode isn't a crash — it's plausible-looking code that happens to not work. We traded boring reliability for exciting unpredictability, and I'm not sure we fully processed what that means.

The way I've been navigating this is by matching the level of trust to the actual stakes. I write the spec first — the tests, the types, the contract — and let the AI write the implementation against *my* definition of correct, not its own. Utility functions? Let the agent rip. Payment processing? I'm reading every line. The framing that's helped me most is treating the agent like a junior developer. You wouldn't merge a junior's PR without review. You also wouldn't refuse to let them write code. The AI gets the same deal. Not because you don't believe in it, but because that's how you build confidence in any collaborator — by watching the work, providing feedback, and gradually expanding the scope of what you trust them with.

## We're Cutting the Ladder Behind Us

According to LeadDev's 2025 Engineering Leadership Report, 54% of engineering leaders believe junior developer hiring will decline in the long term as a result of AI. In Q1 2026 alone, nearly 80,000 tech workers were laid off, with almost half of those positions attributed to AI and workflow automation — though it's worth noting that "we replaced them with AI" has become a conveniently trendy narrative for companies that may be cutting costs for other reasons entirely.

The logic seems sound on a spreadsheet: if AI can do the work a junior used to do, why hire the junior?

Here's why: because the senior engineers who supervise the AI were *made* by being juniors first.

Nobody wakes up one day with the judgment to evaluate whether an AI-generated architecture makes sense. That judgment is forged over years of writing bad code, deploying bad code, getting paged because of bad code, and slowly — painfully — learning what good code actually looks like. If we automate away the entry point, we don't save money on juniors. We create a future shortage of seniors. It's like cutting down all the saplings to save space and then being surprised when there are no trees in ten years.

And the loss here isn't just economic — it's cultural. The slow, messy process of a junior growing into a senior through thousands of small mistakes isn't just a training program. It's how teams build culture, how institutional knowledge transfers, how organizations develop the kind of shared judgment that makes them resilient. An AI can teach syntax. It cannot replicate the moment where a senior engineer says, "yeah, technically this works, but here's why we don't do it this way — and here's the production incident that taught me that."

I don't think the answer is to artificially preserve junior roles as they were. The grunt work *is* going away. But we can redesign what "junior" means. Picture pair programming with AI as the third seat: the junior doesn't write the boilerplate — the agent does. The junior's job becomes *reviewing and understanding* the AI's output, with a senior guiding the process. The learning shifts from "how do I write this?" to "how do I evaluate whether this is right?" — which, honestly, is the more valuable skill anyway. Checking AI output turns out to be an incredible way to learn. You're forced to understand code you didn't write, trace logic, find subtle bugs. That's closer to real-world senior engineering than writing CRUD endpoints ever was.

## The Commons Is Drowning

Daniel Stenberg, the maintainer of cURL — a tool installed on roughly every device with a network connection — recently shut down the project's *paid* bug bounty program. Vulnerability reports are still accepted, but the financial incentive is gone. The reason? AI-generated submissions had tanked the valid report rate to roughly 5%. The bounty wasn't attracting security researchers anymore; it was attracting people who could paste a codebase into ChatGPT and collect a payout for whatever came out.

He's not alone. The Flux CD maintainer called it "AI slop DDoSing OSS maintainers." The security implications are worse than the noise: a USENIX Security 2025 study found that roughly 20% of package names suggested by AI coding tools don't actually exist. Because these hallucinations are repeatable and predictable, security researchers warn it's only a matter of time before attackers start registering those phantom package names and publishing malicious code under them. The AI hallucinates a library, the developer installs it, and the attacker is in. It hasn't happened at scale yet — but the door is wide open.

The cost of generating plausible-looking code, bug reports, and pull requests has dropped to approximately zero. The cost of filtering all of it still falls on the same handful of unpaid humans it always did.

There's a democratic ideal at the heart of open source that makes this particularly painful: anyone can contribute. That ethos built Linux, cURL, Node.js, and most of the infrastructure the modern internet runs on. The implicit filter was *effort*. You had to care enough to read the codebase, understand the conventions, and submit something thoughtful. It wasn't a perfect filter, but it was a filter. AI removed it. The barrier to generating a plausible-looking contribution is now a prompt, and the people who have to sort the plausible from the useful are already exhausted.

I don't have a clean answer for this one. It's genuinely hard. Some projects are experimenting with contribution gates that test understanding, not just code — requiring contributors to explain *why* their change is correct, not just submit the diff. Others are fighting the flood with AI-powered filtering on the maintainer side. And there's an uncomfortable but necessary conversation brewing about whether "open to all contributions" still works as a default, or whether the community needs new norms entirely. No clean answers. Just the beginning of a conversation the open source world needs to have before the dam breaks.

## "Will I Lose My Job?"

Alright. Let's talk about the elephant.

The honest answer is: maybe. And I think anyone who tells you "definitely not" is selling something.

But I also think we've seen this pattern before. When outsourcing boomed, companies laid off in-house engineers, pocketed the savings, and watched their bottom lines improve — for a while. Then the smart competitors realized they could reinvest those savings in their remaining teams, focusing human engineers on the high-value work. Painful downturn, followed by an uptick. Not the same jobs, but more of them.

And technically, we've lived through it too: assembly to high-level languages to libraries to frameworks. Every time we made building easier, the bar for what software should do rose to match it. We didn't need fewer developers when we got React. We needed developers with bigger ambitions.

Now, AI isn't a perfect analogy for either of these — outsourcing moved work to cheaper humans, not machines, and past tooling advances didn't generate plausible-looking output that might be subtly wrong. The dynamics *are* different this time, and I don't want to gloss over that. But the underlying pattern — productivity gains creating new categories of work that didn't exist before — has held through every previous wave.

Here's the thing that keeps me up at night, not as a developer worried about my job, but as someone building these systems: if your entire engineering output can be replicated by a competitor with a Claude Code license and a weekend, then your engineering team was never your moat. You haven't saved money. You've made yourself trivially disruptable. The companies that win this era will be the ones redirecting human engineers toward the problems that are genuinely hard to replicate — domain expertise, product taste, the accumulated judgment that comes from years of building things and watching them succeed or fail in the real world. That's the moat. And it's made of humans.

There will be a downturn period. Some roles will go away. Pretending otherwise would be disrespectful to people who are already affected. But I believe the equilibrium is more engineering jobs, not fewer — different, and higher up the value chain.

## Put Down the Doom Articles

If you've made it this far, I want to talk to you directly for a moment.

If you've been reading the "AI will replace all developers" articles and feeling a knot in your stomach — I get it. I've felt it too. There are people building entire careers on making you feel like you're already behind, already obsolete, already a relic.

Forget that narrative. Not because the risks aren't real — we just spent several thousand words being honest about them. But because it's wrong about what to *do*. It tells you to be afraid. Fear doesn't help you navigate change. Fear makes you freeze, cling to what you know, and resist the very things that could make your work better.

I'd like to propose a trade: swap the anxiety for curiosity.

The best way I've found to understand where I add value isn't to anxiously study "what AI can and can't do" from the outside. It's to *partner with it*. Every day. On real work. When you make AI your genuine collaborator — not a threat to monitor, not a toy to dismiss — something quietly clarifying happens. You outsource the grunt work you never liked. You ship faster. And almost without trying, you develop an intuitive sense for where *you* are needed and where the AI is sufficient.

The other day, I needed a Kubernetes controller to automate a tedious manual task on my personal cluster. I've written controllers before — in JavaScript, my day-to-day language. But if you've ever tried to build Kubernetes tooling in JavaScript, you know the ecosystem is... let's call it "character-building." The real Kubernetes ecosystem lives in Go.

Old me had two bad options: wrestle with inadequate JavaScript tooling and end up with something brittle, or spend weeks learning Go and its entire ecosystem just to solve one problem. In practice, this meant the controller would never get built. It would join the graveyard of "I'll get to it eventually" projects.

So I let the AI write it in Go.

Could I review every line for idiomatic Go? Absolutely not — the AI knows Go semantics better than I do, and pretending otherwise would be theatre. But I designed the architecture. I defined exactly what the controller needed to do and why. I iterated on the approach until it matched my mental model. And I wrote the test cases that proved it actually worked.

It's running in my cluster right now, so far without a single bug. An afternoon project that would previously have been either painful or impossible. And at no point during the process was the division of labor unclear: the AI handled a language I don't speak; I handled the decisions it couldn't make.

*That's* what partnership feels like. Not threatening. Not mysterious. Just useful. And the question of "where do I add value?" answered itself without me needing to read a single think piece about the future of work.

You don't need a list of "AI-proof skills." Any such list is outdated before the ink dries. By working with AI daily, you feel the frontier instead — in your bones, not in a blog post. "This part, I needed to handle. That part, it did fine." Over time, that builds into a confident picture of your own value.

## Finding the Fun Again

I want to circle back to that Tuesday.

It wasn't luck. It was the result of months of building exactly the kind of habits I've described here — staying in the loop, matching trust to stakes, interrogating the output, doing the craft work at a different altitude. The guardrails aren't restrictions. They're what makes the collaboration actually *work*.

And here's what surprised me: the fun didn't disappear. It moved.

The craft used to be in the typing — the elegant function, the clever algorithm, the perfectly structured module. There's still room for that, sometimes. But increasingly, the craft lives somewhere else: in orchestration, in taste, in knowing *what* to build and *why*. In asking the questions the AI doesn't know to ask. In making the judgment calls that require the kind of context no model has — the context you can only build by caring about the work for years.

I don't know exactly where all of this lands. Nobody does. I'll probably re-read this piece in six months and wince at half of it, because that's the pace we're dealing with.

But last week I started sketching out a new project — something ambitious, something I wouldn't have attempted a year ago because the mechanical overhead would have buried me. I found myself *excited*. Not anxious. Not performing optimism. Just excited about the thing I was going to build.

Not because everything is fine — we've covered enough ground to know it isn't. But because on the other side of the honest reckoning, there's something worth building toward.

The dev is dead. Long live the dev.
