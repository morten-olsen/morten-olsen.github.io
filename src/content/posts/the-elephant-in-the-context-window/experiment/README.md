# Experiment: The Elephant in the Context Window

## Background

This is a follow-up to the [tone experiment](/posts/does-your-tone-change-your-code)
where we found that tone/register creates distinct clusters in LLM hidden states
that are stronger than the task signal.

A friend ([Jens Roland](https://jensroland.com/)) pointed out that most generated
tokens are locally determined (style/syntax), not task-determined — which explains
why tone dominates. This raised a follow-up question: if the model's representations
are dominated by local patterns, what happens to *negation* instructions as context
fills with the very patterns being negated?

## Status: Evolving Understanding

Our initial thesis has been revised multiple times as experiments surprised us.
See the individual findings files for the journey:

- `FINDINGS_EXP1.md` — Negation creates "limbo," not leakage
- `FINDINGS_EXP2.md` — Hidden state approach was flawed (length mismatch)
- `FINDINGS_EXP2B.md` — Attention analysis shows instruction dilution, not loss

**Final understanding:** The refactoring problem is real and measurable. The model
attends to instructions (Exp2b) but stops following them once old-pattern code
dominates the context (Exp3). Compliance drops from 100% to 0% at just ~130 tokens
of old code on a 6.7B model. The instruction is heard but overruled by local
pattern pressure during token-by-token generation — confirming Jens Roland's
prediction from the tone article.

Context pruning (removing old code after refactoring each file) should work, because
compliance is perfect when no old code is present. The model CAN refactor. You just
can't show it the thing you want to change.

## Original Thesis (partially revised)

When you instruct an LLM "don't use X," the model must activate a representation
of X to understand the instruction. This creates a paradox:

1. **To negate X, you must represent X** — "don't use callbacks" requires the model
   to activate "callbacks" in its hidden states
2. **Negation is a modifier, not an eraser** — in embedding space, "not happy" is
   closer to "happy" than to "sad." The concept persists; the negation is layered on top
3. **Context dilution is asymmetric** — as the context fills with code containing
   pattern X (which the model must read during refactoring), every instance reinforces
   X's representation. The negation instruction is stated once, at the top.

**Prediction:** The negation signal decays faster than the concept signal as context
grows. At some context length, the "don't" effectively vanishes and the model
reverts to the pattern it was told to avoid. This explains why LLM refactoring
degrades over long sessions — the model starts "agreeing" with the old code.

## The "Ironic Process" Analogy

This mirrors Daniel Wegner's *ironic process theory* in psychology: suppressing a
thought requires monitoring for that thought, which paradoxically keeps it active.
For LLMs, the mechanism is different (statistical rather than cognitive) but the
outcome is similar — mentioning something to negate it still activates it.

## Experiment Design

### Experiment 1: Negation vs Affirmation in Hidden States

**Question:** How does "do X" vs "don't do X" look in the model's hidden states?
Are they close together (because X is activated in both) or far apart (because
negation creates a distinct representation)?

**Method:**
- Create prompt pairs: "Write a function using callbacks" vs "Write a function
  without using callbacks" (and similar pairs for other patterns)
- Extract hidden states at the last token from early/mid/late layers
- Measure cosine similarity between affirmed and negated versions
- Compare to a baseline: how similar is "use callbacks" to "use promises" (a
  genuine alternative, not a negation)?

**Expected result:** Negated prompts are closer to their affirmed counterparts than
to genuine alternatives. "Don't use callbacks" is more similar to "use callbacks"
than to "use promises."

### Experiment 2: Negation Decay Under Context Growth

**Question:** Does the negation signal weaken as we insert more code containing the
negated pattern between the instruction and the generation point?

**Method:**
- Start with: "Refactor this code to not use var declarations. Use const/let instead."
- Insert increasing amounts of code that uses `var` (50, 100, 200, 500, 1000 tokens)
  between the instruction and the generation point
- At each context length, extract the hidden state at the last token
- Measure: (a) cosine similarity to the "use var" representation, and (b) cosine
  similarity to the "use const/let" representation
- Track how the ratio shifts as context grows

**Expected result:** At short context, the hidden state is closer to "use const/let."
As var-heavy code fills the context, the hidden state drifts toward "use var" —
the negation decays while the concept reinforcement grows.

### Experiment 3: Context Pruning Intervention

**Question:** Does removing old-pattern code from context after refactoring each
file preserve the negation signal?

**Method:**
- Same setup as Experiment 2, but after each "file" of var-heavy code is
  processed, remove it from context and keep only the refactored (const/let) version
- Compare the hidden state trajectory to the unpruned version
- Measure whether the negation signal survives longer

**Expected result:** Pruned context preserves the negation signal. The hidden state
stays closer to "use const/let" because the context reinforcement shifts from
old pattern to new pattern.

## Pattern Pairs for Testing

Pick patterns where the "old" and "new" are clearly distinguishable in code:

| Negation instruction | Old pattern | New pattern |
|---|---|---|
| "Don't use var" | `var x = 1;` | `const x = 1;` |
| "Don't use callbacks" | `fs.readFile(f, cb)` | `await fs.promises.readFile(f)` |
| "Don't use class components" | `class Foo extends Component` | `function Foo()` |
| "Don't use for loops" | `for (let i=0; ...)` | `items.map(...)` |
| "Don't use string concatenation" | `"hello " + name` | `` `hello ${name}` `` |

## Tools

Reuse the hidden state extraction infrastructure from the tone experiment. Same
models (DeepSeek Coder 1.3B instruct + base, 6.7B, Qwen Coder 3B, Qwen 3B).
New analysis: tracking cosine similarity trajectories over increasing context
lengths rather than clustering.

## Open Questions

- **Does negation have a "direction" in hidden state space?** If so, can we
  compute a "negation vector" and track its magnitude as context grows?
- **Is there a critical context length where negation flips?** A phase transition
  where the model goes from "avoiding X" to "generating X"?
- **Does the position of the negation instruction matter?** Near the top of
  context vs repeated throughout vs near the generation point?
- **Do larger models preserve negation longer?** Related to the finding from the
  tone experiment that RLHF slightly dampens tone sensitivity.

## Relation to the Refactoring Harness

Experiment 3 directly tests the refactoring harness idea proposed in the tone
article. If context pruning preserves negation, it validates the approach of
removing old file content after refactoring to keep the context window aligned
with the intended pattern rather than the pattern being escaped.
