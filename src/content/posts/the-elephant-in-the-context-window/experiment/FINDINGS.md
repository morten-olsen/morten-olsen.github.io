# The Elephant in the Context Window — Consolidated Findings

## The Question

When you tell an LLM "don't use pattern X, use Y instead," what happens inside
the model — and does it actually work as context fills with the old pattern?

This matters because refactoring with AI coding agents is a common frustration:
the agent complies at first but silently reverts to old patterns as the session
grows. We wanted to understand *why* and whether the failure is in the instruction
representation, the attention mechanism, or the generation process.

## The Journey (What We Expected vs What We Found)

### Experiment 1: Negation Similarity
**Expected:** "Don't use X" leaks — the model's representation stays close to
"use X" (the elephant stays in the room).

**Found:** Negation creates **limbo**, not leakage. "Don't use callbacks" is far
from BOTH "use callbacks" AND "use async/await." The model understands what you
don't want but doesn't automatically map that to what you do want. Positive
instructions ("use async/await") produce clearer representations.

- Tested on: DeepSeek Coder 1.3B instruct + base
- Method: Centered cosine similarity (raw cosine was misleading due to
  dimensional collapse from layer normalization)
- Key metric: Negation sits in a representational dead zone, close to neither
  the concept nor the alternative

### Experiment 2: Hidden State Decay (FLAWED)
**Expected:** As old-pattern code fills context, the hidden state drifts toward
the old pattern.

**Found:** Methodological flaw. We compared short reference prompts (~15 tokens)
to long context prompts (~700 tokens). The length mismatch dominated the signal.
Both "old" and "new" reference similarities collapsed equally — we were measuring
"long prompts look different from short prompts," not instruction decay.

**Lesson:** Hidden state cosine similarity doesn't work across dramatically
different prompt lengths. Documented for transparency.

### Experiment 2b: Attention Decay
**Expected:** The model stops attending to the instruction as code fills context.

**Found:** The model **still attends** to instruction tokens even at 700 tokens
of old code. Each instruction token receives 60-80x more attention than each code
token. The aggregate instruction share drops from ~78% to ~52%, but this is a
denominator effect (more code tokens splitting the pie), not the model ignoring
the instruction.

- Negated instructions get slightly less attention than positive ones
  (confirming Exp1 in a different measurement)
- The instruction isn't being forgotten. It's being heard.

### Experiment 3: Generation Compliance
**Expected:** Compliance with refactoring instructions degrades as old code fills
context. Negated instructions degrade faster.

**Found:** **Compliance drops from 100% to 0% at just ~130 tokens of old code.**
Both negate and positive instructions start at perfect compliance with clean
context and completely fail once old-pattern code is present.

- Model: DeepSeek Coder 6.7B instruct (1.3B couldn't refactor at all)
- Chat-templated: system prompt = directive, user message = code
- Temperature 0 (deterministic, reproducible)
- Measurement: keyword counting (var/const/let), no subjective judgment
- The baseline (no instruction) stays at 0% throughout — confirming the
  instruction IS the reason for compliance when it works

**The threshold is shockingly low.** One block of old code (~70 tokens of `var`
declarations) is enough to break the positive instruction. The negate instruction
survives one block longer (to ~130 tokens). By 3 blocks (~350 tokens), both
framings produce 0% compliance despite the system prompt still being present.

## The Synthesis

Combining Exp2b and Exp3 produces the key insight:

> **The model hears the instruction. It just doesn't follow it.**

Attention analysis shows the instruction tokens are still being attended to at
700 tokens of context. But compliance is already at 0% by 130-350 tokens. The
model "sees" the instruction but the token-by-token generation process is
dominated by local code patterns — exactly as predicted by Jens Roland's insight
from the tone article (most generated tokens are locally determined, not
instruction-determined).

## What We Got Wrong

1. **Original thesis was wrong.** We predicted "the elephant wins" — that the
   model's representation of the old pattern would overpower the negation. The
   actual mechanism is different: the instruction drowns, not because the old
   pattern is louder in attention, but because generation is a local process
   that follows surrounding code patterns regardless of what the instruction says.

2. **Hidden state comparison across lengths doesn't work.** Exp2 was a dead end.
   We caught it, documented it, and built a better approach (Exp2b attention +
   Exp3 generation).

3. **We expected negation to be the weak link.** Exp1 showed negation creates
   weaker representations. But Exp3 showed the positive instruction fails FIRST
   on var_declarations. The instruction framing matters less than we thought —
   both framings fail at similar context thresholds. The dominant factor is
   context volume, not instruction quality.

## What We Got Right

1. **The refactoring problem is real and measurable.** What was previously a
   subjective "the agent fights me" is now a quantified compliance curve that
   drops from 100% to 0%.

2. **Positive instructions are better in representation space.** Exp1's finding
   that negation creates limbo while positive instructions are clearer still
   holds — it's just that this difference is smaller than the context pressure
   effect.

3. **The context pruning harness should work.** Compliance is 100% at 0 fillers.
   The model CAN refactor. It just can't refactor while looking at old code.
   Remove the old code, and the instruction should regain control.

## Practical Takeaways

1. **Don't show the model what you want to change.** The single most impactful
   thing for refactoring: keep the old code out of context. Process one file at
   a time, remove old content after each refactor, keep only the result.

2. **Phrase refactoring instructions positively.** "Use const/let" creates a
   clearer representation than "don't use var" (Exp1). Though the practical
   difference is smaller than the representation-level difference suggests.

3. **The threshold is lower than you think.** ~130 tokens of old code can break
   the instruction on a 6.7B model. Real refactoring sessions have orders of
   magnitude more. If you're accumulating old code in context, you passed the
   failure point long ago.

4. **Instruction repetition may help.** Exp2b showed attention is still high.
   Exp3 showed compliance is zero. The gap suggests the instruction might need
   to be closer to the generation point, not just at the top of the system
   prompt. Repeating the instruction mid-context (untested) could help.

## Models Used

| Experiment | Model | Why |
|---|---|---|
| Exp1 | DeepSeek Coder 1.3B (instruct + base) | Hidden state analysis doesn't need generation capability |
| Exp2 | DeepSeek Coder 1.3B instruct | (flawed experiment) |
| Exp2b | DeepSeek Coder 1.3B instruct | Attention analysis doesn't need generation |
| Exp3 | DeepSeek Coder 6.7B instruct | Generation requires instruction-following capability; 1.3B was too small |

## File Index

| File | What it does |
|---|---|
| `exp1_negation_similarity.py` | Probes hidden states for negation vs affirmation representations |
| `exp2_negation_decay.py` | (Flawed) Hidden state cosine to reference vectors over context growth |
| `exp2b_attention_decay.py` | Attention share from last token to instruction vs code regions |
| `exp3_generation_compliance.py` | Generates code and counts compliance keywords |
| `prompts.py` | 8 pattern pairs (affirm/negate/alternative) for Exp1 |
| `exp2_context_fillers.py` | Old-pattern code blocks for context filling (Exp2/2b/3) |
| `shared.py` | Model loading, hidden state extraction, attention extraction |
| `FINDINGS_EXP1.md` | Exp1 detailed results |
| `FINDINGS_EXP2.md` | Exp2 detailed results + why it's flawed |
| `FINDINGS_EXP2B.md` | Exp2b detailed results |
| `FINDINGS_EXP3.md` | Exp3 detailed results |

## Open Questions for Future Work

- Does the compliance threshold scale with model size? Larger models (70B+) may
  resist context pressure longer.
- Does repeating the instruction mid-context restore compliance?
- Does the context pruning harness actually work in practice (not just in theory)?
- How do frontier models (Claude, GPT-4) compare? We can't probe their hidden
  states but we CAN run Exp3-style compliance tests via their APIs.
