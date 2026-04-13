# Draft — The Agentic Hangover

## Opening

Last Tuesday, I mass-refactored an authentication flow across four services in about twenty minutes. Not by myself — I had an agent handling the mechanical parts while I focused on the edge cases that actually required a brain. At one point, it flagged a race condition I hadn't considered, and I caught a permissions gap it had missed. We went back and forth for a bit, fixed both, and shipped it before lunch.

It felt like pair programming with a very fast, slightly overconfident colleague. It felt *good*.

I'm telling you this because I need you to know: I am not here to write the "AI is ruining software" article. You've read that one. I've read that one. I've probably *been* that article at dinner parties.

By day, I work on a team that's reimagining our entire platform as an AI-based agentic system. By night, I maintain a personal AI setup I've affectionately named [GLaDOS](/posts/grown-ups-guide-personal-ai/), because naming your side projects after fictional AIs with questionable ethics is apparently my love language. I am, by most reasonable definitions, *all in* on this.

But getting to that Tuesday — to the version of agentic development that actually works — required stumbling through a version that very much didn't. And I don't think I'm the only one with bruises.

The industry moved fast. We went from "AI can autocomplete my function" to "AI is writing my entire pull request" in what felt like six months. And in that rush, we skipped a few steps. We adopted agentic development before we built the practices, habits, and guardrails to make it sustainable.

I should be honest upfront: I don't have the answers. I have suggestions. In some areas — like building agentic platforms professionally — I might be a little ahead in the story. In others, I'm probably behind. Like everyone else, I'm watching this unfold in real time, trying to make sense of it while it's still moving.

What I want to do here is project forward. Not predict — project. As in: here's a place I think this *could* end up, if we're intentional about steering it there. Some of these ideas are things I've tested. Some are things I'm still testing. Some are just bets I'm making because standing still doesn't seem like an option.

This is the story of what broke along the way, what we need to honestly grieve, and where I think the green grass might be — if we're willing to do some uncomfortable gardening to get there.

## We've Outrun Our Own Instincts

There's a mildly terrifying fact about being human: we're running 21st-century software on 50,000-year-old hardware.

Our brains evolved for small tribes, immediate physical threats, and figuring out which berries wouldn't kill us. They did not evolve for Slack notifications, global information overload, or sitting in an ergonomic chair for eight hours arguing about type systems. We are, biologically speaking, fish who taught themselves to ride bicycles.

But we adapted. Not by evolving faster — that takes millennia — but by using our other strengths. We built cooperation, culture, institutions, and tools that bridge the gap between what our ape brains can handle and what our environments demand. In return, we got drastically better living standards. The tradeoffs are real — loneliness, anxiety, the fact that our spines clearly weren't designed for desks — but most of us wouldn't trade it for the savannah.

I think the exact same thing is happening to developers right now.

Our "developer instincts" evolved in a world where you wrote code, understood code, and maintained code — all yourself. The agentic shift has outpaced our ability to update our practices, our habits, and our mental models. We're the hunter-gatherer brain trying to navigate the industrial city.

And the answer isn't to go back to the savannah. It's to build the institutions, the habits, and the guardrails that let us thrive in the new environment — while being honest about what we trade away.

So let's talk about what's actually breaking.

## We're Shipping Code Nobody Understands

Here's a number that should make you uncomfortable: according to recent studies, experienced developers are measurably **19% slower** when using AI coding tools. That alone isn't shocking. What's shocking is that the same developers *predicted* they'd be **24% faster**.

That's not a small miscalibration. That's a 43-percentage-point gap between perception and reality. We *feel* more productive while actually being less effective. If that doesn't remind you of something, let me help: it's the software engineering equivalent of drunk driving. Total confidence, degraded performance.

Code churn — the rate at which recently written code gets rewritten — is up 39% in AI-heavy projects. And 76% of developers admit they don't fully understand code that their AI assistant wrote. We're building skyscrapers on foundations we haven't inspected, and we're doing it *faster than ever*, which mostly means we're going to find out about the foundation problem faster than ever too.

### What We're Losing

I want to name something here that I don't see named often enough: the deep, bone-level understanding you develop when you write something yourself, line by line.

It's the intuition for where the bugs hide, not because someone told you, but because you *built* the walls they hide behind. It's the ability to get paged at 2 AM and have a mental map of the system before you even open your laptop. That kind of understanding doesn't come from reading code. It comes from writing it, struggling with it, and swearing at it.

That's atrophying. And I think we need to say that out loud rather than pretending it's fine.

### What I'm Trying

I don't think the answer is "write everything by hand again." That ship has sailed, and honestly, it wasn't coming back anyway — the economic pressure is too strong.

Instead, I've been experimenting with what I call **comprehension checkpoints** — deliberate points in the workflow where you stop and make sure you actually understand what just happened.

In practice, this looks like:

- **"Explain it back to me" sessions.** After the agent generates a significant chunk of code, I ask it to walk me through the logic. But — and this is the important part — I'm not just nodding along. I'm actively checking its explanation against my own understanding. If I can't poke holes in its reasoning, I probably don't understand it well enough.
- **Human-first code review for critical paths.** Not every piece of AI-generated code needs a line-by-line human review. But the code that handles money, auth, or data integrity? That gets the same rigor it always did. The AI writes the first draft; a human makes sure the draft isn't quietly insane.
- **The "what would break" test.** Before I accept a chunk of AI output, I force myself to answer one question: if this breaks at 3 AM, will I know where to look? If the answer is no, I'm not done yet.

None of this is revolutionary. It's just the discipline of *staying in the loop* when the tooling is actively trying to make that optional.

## We Use Tools We Don't Trust

Here's a genuinely weird statistic: 80% of developers are now using AI coding agents. Trust in AI accuracy has *dropped* from 40% to 29% over the past year.

Read that again. Adoption up. Trust down. We are using more of something we believe in less.

I've been trying to think of a historical parallel for this, and I genuinely can't. We didn't adopt cars while becoming less confident they had brakes. We didn't adopt the internet while increasingly doubting that websites worked. This is a new thing: mass adoption driven not by trust, but by competitive pressure and the fear of being left behind.

"Everyone else is using it, so I have to use it, even though I'm not sure it works" is not the foundation of a healthy technology adoption curve. It's the foundation of a bubble.

### What We're Losing

This one's subtler, but it nags at me: the determinism of our toolchain.

`gcc` doesn't hallucinate. `npm install` doesn't improvise. When you type `git commit`, it does what you told it — every time, without creativity. There was an implicit contract with our tools: they are reliable, predictable, and boring. You could build trust on boring.

AI agents broke that contract. The same prompt can produce different results. The tool might be brilliant or quietly wrong, and the failure mode isn't a crash — it's plausible-looking code that happens to not work. We traded boring reliability for exciting unpredictability, and I'm not sure we fully processed what that means for how we work.

### What I'm Trying

The goal isn't to go back to blind trust in deterministic tools. It's to build what I think of as **calibrated trust** — knowing when to lean on the AI and when to double-check, based on the actual risk of being wrong.

Concretely:

- **Test-first workflows.** I write the spec — the tests, the types, the contract — and let the AI write the implementation. That way, the AI is working against *my* definition of correct, not its own. If the tests pass, I have a baseline of confidence that's grounded in something real.
- **Graduated autonomy.** Not all code is equal. Utility functions? Let the agent rip. Payment processing? I'm reading every line. Matching the level of human oversight to the actual risk is the practice that makes "I use AI" sustainable.
- **Treat the agent like a junior dev.** This framing has been more useful than I expected. You wouldn't merge a junior developer's PR without review. You also wouldn't refuse to let them write code. The AI gets the same deal: trust, but verify. Not because you don't believe in it, but because that's how you build confidence in any collaborator.

## We're Cutting the Ladder Behind Us

54% of engineering leaders now say they plan to hire fewer junior developers because of AI. In Q1 2026 alone, 80,000 tech workers were laid off, with nearly half of those attributed directly to AI automation.

The logic seems sound on a spreadsheet: if AI can do the work a junior used to do, why hire the junior?

Here's why: because the senior engineers who supervise the AI were *made* by being juniors first.

Nobody wakes up one day with the judgment to evaluate whether an AI-generated architecture makes sense. That judgment is forged over years of writing bad code, deploying bad code, getting paged because of bad code, and slowly — painfully — learning what good code actually looks like.

If we automate away the entry point, we don't save money on juniors. We create a future shortage of seniors. It's like cutting down all the saplings to save space and then being surprised when there are no trees in ten years.

### What We're Losing

The mentorship relationship. I know that sounds soft in a technical article, but hear me out.

The slow, messy process of a junior growing into a senior through thousands of small mistakes isn't just a training program. It's how teams build culture, how institutional knowledge transfers, and how organizations develop the kind of shared judgment that makes them resilient. An AI can teach syntax. It cannot teach the moment where a senior engineer says, "yeah, technically this works, but here's why we don't do it this way, and here's the production incident that taught me that."

If we automate away the entry point, we lose something that's very hard to rebuild.

### What I'm Trying

I don't think the answer is to artificially preserve junior roles as they were. The grunt work *is* going away, and pretending otherwise helps no one. But we can redesign what "junior" means.

Some things I'm thinking about:

- **AI as the third seat in pair programming.** The junior doesn't write the boilerplate — the AI does. The junior's job is to *review and understand* the AI's output, with a senior guiding them. The learning shifts from "how do I write this?" to "how do I evaluate whether this is right?" — which, honestly, is the more valuable skill anyway.
- **Verification as a learning tool.** Checking AI output turns out to be an incredible way to learn. You're forced to understand code you didn't write, trace logic, and find subtle bugs. That's closer to real-world senior engineering work than writing CRUD endpoints ever was.
- **Structured "why" conversations.** Instead of juniors learning by doing the mechanical work, they learn by asking — and answering — "why did the AI make this choice? What's the alternative? What are the tradeoffs?" That's the judgment muscle, and it can be trained deliberately.

## The Commons Is Drowning

Daniel Stenberg, the maintainer of cURL — a tool installed on roughly every device with a network connection — recently shut down the project's bug bounty program. The reason? AI-generated submissions had tanked the valid report rate to 5%. Ninety-five percent noise.

He's not alone. The Flux CD maintainer called it "AI slop DDoSing OSS maintainers." And the security implications are worse than the noise: researchers found that 20% of package names suggested by AI coding tools don't actually exist. Attackers have started *registering* those hallucinated package names and publishing malicious code under them. The AI hallucinates a library, the developer installs it, and the attacker is in.

The cost of generating plausible-looking code, bug reports, and pull requests has dropped to approximately zero. The cost of filtering all of it still falls on the same handful of unpaid humans it always did.

### What We're Losing

There's a democratic ideal at the heart of open source: anyone can contribute. That ethos built Linux, cURL, Node.js, and most of the infrastructure the modern internet runs on.

The implicit filter was *effort*. You had to care enough to read the codebase, understand the conventions, and submit something thoughtful. It wasn't a perfect filter, but it was a filter. AI removed it. The barrier to generating a plausible-looking contribution is now a prompt, and the people who have to sort the plausible from the useful are already exhausted.

I don't have a clean mitigation for this one. It's genuinely hard.

### What I Think Might Help

- **Contribution gates that test understanding, not just code.** Some projects are experimenting with requiring contributors to explain *why* their change is correct, not just submit the diff. An AI can generate a patch easily. Generating a coherent explanation of why the patch is necessary and what it affects is still harder.
- **Maintainer-side AI tooling.** If the problem is a flood of AI-generated noise, part of the answer is AI-powered filtering. Tools that triage incoming issues and PRs, flag likely AI-generated submissions, and surface the ones that actually need human attention. Fight the flood with a better dam, not more buckets.
- **Honest conversations about "open to all."** This one is uncomfortable, but I think it's coming. The current model assumes good-faith effort from contributors. That assumption may need explicit defense — verified identities, contribution histories, or proof-of-work mechanisms that raise the cost of low-effort submissions without locking out genuine newcomers.

Like I said — no clean answers here. Just the beginning of a conversation that I think the open source community needs to have before the dam breaks.

## "Will I Lose My Job?"

Alright. Let's talk about the elephant.

If you've been anywhere near tech Twitter, Hacker News, or frankly just a family dinner in the last year, you've been asked some version of this question. Maybe you've been asking it yourself, at 2 AM, staring at a ceiling.

The honest answer is: maybe. And I think anyone who tells you "definitely not" is selling something.

But I also think we've seen this movie before, and the ending was different than the trailer suggested.

### The Outsourcing Parallel

When outsourcing became a massive trend, the pitch was irresistible: same engineering hours, a fraction of the price. So companies did the obvious thing. They laid off in-house engineers, shipped the work overseas, and watched their bottom lines improve. 

For a while.

Then quality became hard to control. Communication overhead ate into the savings. And the smart competitors noticed something: instead of putting the outsourcing savings on the bottom line, what if they *reinvested* that money in their in-house teams? The engineers who remained — now freed from the grunt work handled by the outsourcing partner — could focus entirely on the high-value problems. Product vision. Architecture. The stuff that actually generates revenue.

The result: a painful downturn in jobs, followed by an uptick. Not the *same* jobs — but more of them, and often better ones.

### The AI Version

I think the same cycle is playing out, but faster.

Yes, companies can dramatically cut engineering headcount and replace the output with AI tooling. But here's the thing that keeps me up at night — not as a developer worried about my job, but as someone building these systems: if your entire engineering output can be replicated by a competitor with a Claude Code license and a weekend, then your engineering team was never your moat.

You haven't saved money. You've made yourself trivially disruptable.

The companies that will win this era aren't the ones cutting engineers to save costs. They're the ones reinvesting the productivity gains — letting AI handle the commodity work and redirecting human engineers toward the problems that are genuinely hard to replicate. Domain expertise. Product taste. Customer understanding. The accumulated judgment that comes from years of building things and watching them succeed or fail in the real world.

That's the moat. And it's made of humans.

### The Uncomfortable Middle

I want to be honest: there will be a downturn period. Some roles will go away. That's real, and handwaving it with "everyone will be fine" would be disrespectful to people who are genuinely worried — or already affected.

But I believe the equilibrium point is more engineering jobs, not fewer. Different jobs, focused higher up the value chain, but more of them. The same way the outsourcing wave ultimately expanded the industry rather than shrinking it.

## Put Down the Doom Articles

Okay. If you've made it this far, you've been patient with me through some genuinely grim statistics and uncomfortable admissions. Thank you.

Now I want to talk to you directly.

If you've been reading the "AI will replace all developers" articles and feeling a knot in your stomach — I get it. I've felt it too. There's an entire cottage industry of content designed to make you feel like you're already behind, already obsolete, already a relic of a disappearing era.

I want you to forget that narrative. Not because the risks aren't real — we just spent several thousand words being honest about them. But because that narrative is *wrong about the prescription*. It tells you to be afraid. Fear doesn't help. Fear makes you freeze, cling to the old way, and resist the very changes that could actually make your work better.

Here's what I want to offer instead: **swap the anxiety for curiosity.**

The best way I've found to understand where I add value isn't to anxiously study "what AI can and can't do" from the outside. It's to actually *partner with it*. Every day. On real work.

When you make AI your genuine collaborator — not a threat to monitor, not a toy to dismiss, but a working partner — something interesting happens:

- You outsource the grunt work you never liked doing anyway.
- You ship faster, because the mechanical parts take minutes instead of hours.
- And almost as a side effect, you develop a natural, intuitive sense for where *you* are needed and where the AI is sufficient.

That last part is the important one. You don't need a list of "AI-proof skills." Any such list would have a shelf life measured in months. Instead, by working with AI daily, you *feel* the frontier. You know it in your bones: "this part, I needed to handle. That part, it did fine." Over time, that builds into a clear, confident picture of your own value.

And that value? It's the thing that keeps you employed. Not because you're clinging to relevance, but because you genuinely understand what you bring that the machine doesn't.

The developers who thrive in this era won't be the ones who memorized the right skills from a blog post. They'll be the ones who stayed curious, kept experimenting, and learned — through practice — where human judgment still matters.

That's not exhausting. That's the job it always was. We've just got better tools now.

## Finding the Fun Again

I want to circle back to where we started: that Tuesday with the auth refactor.

That moment wasn't an accident. It was the accumulated result of months of doing the things I described in this article — building comprehension checkpoints, calibrating trust, staying in the loop even when the tooling made it tempting to check out. The guardrails aren't restrictions. They're what make the collaboration actually *work*.

And here's what surprised me: the fun didn't disappear. It moved.

The craft used to be in the typing — in the elegant function, the clever algorithm, the perfectly structured module. And there's still room for that, sometimes. But increasingly, the craft is in something else: orchestration. Taste. Knowing *what* to build and *why*, not just *how*. Asking the questions the AI doesn't know to ask. Making the judgment calls that require context no model has.

It turns out that the human parts of engineering — the messy, intuitive, judgment-heavy parts that we used to treat as soft skills — are the hard skills now. And if you've been a developer long enough to have opinions, instincts, and scar tissue from production incidents? You're better equipped for this era than you think.

I don't know exactly where this lands. Nobody does. But I know that standing still isn't an option, and I know that anxiety isn't a strategy. Curiosity is.

So here's my suggestion: open your terminal, fire up an agent, and start building something with it. Not to prove you're not obsolete — to discover what you're good at when the boring parts are handled for you. You might be surprised by what you find.

I was.
