# Experiment 1 Findings: Negation vs Affirmation in Hidden States

## Models Tested

| Model | Type |
|---|---|
| `deepseek-ai/deepseek-coder-1.3b-instruct` | Code, instruct |
| `deepseek-ai/deepseek-coder-1.3b-base` | Code, base (no instruction tuning) |

## Key Methodological Note: Dimensional Collapse

Initial results using raw cosine similarity showed all pairs at 0.80–0.97 similarity
with tiny differences (~0.01). This was misleading — late-layer normalization
(RMSNorm/LayerNorm) pushes all vectors into a narrow cone, making everything look
similar.

**Fix: Centered cosine similarity.** We subtract the mean vector of all prompts
before computing similarity. This removes the shared direction and reveals the
actual structure. All results below use centered cosine.

## The Core Finding: Negation Creates Limbo, Not Redirection

Our initial hypothesis was wrong in an interesting way. We expected one of:
- **Negation leaks:** "don't use X" is close to "use X" (elephant in the room)
- **Negation works:** "don't use X" is close to "use Y" (clean redirection)

What we found is **neither.** Negation creates a representation that is distant
from *both* the concept and the alternative. "Don't use callbacks" ≠ "use callbacks"
AND ≠ "use async/await." It's a third thing — a limbo state.

## Results (Centered Cosine Similarity)

### DeepSeek 1.3B Instruct

| Layer | affirm ↔ negate | affirm ↔ alt | negate ↔ alt | leakiness |
|-------|----------------|-------------|-------------|-----------|
| Early | -0.054 | 0.244 | 0.065 | -0.119 |
| Mid | **-0.209** | 0.413 | -0.126 | -0.083 |
| Late | 0.018 | 0.433 | 0.068 | -0.049 |

### DeepSeek 1.3B Base

| Layer | affirm ↔ negate | affirm ↔ alt | negate ↔ alt | leakiness |
|-------|----------------|-------------|-------------|-----------|
| Early | -0.057 | 0.230 | 0.056 | -0.113 |
| Mid | **-0.117** | 0.423 | -0.062 | -0.055 |
| Late | **0.104** | 0.427 | 0.170 | -0.066 |

## Interpretation

### 1. Negation does create separation from the concept

affirm ↔ negate is near zero or negative at early/mid layers in both models. The
model does distinguish "use X" from "don't use X" — they are not the same
representation. The elephant is not fully in the room.

### 2. But negation does NOT redirect toward the alternative

negate ↔ alternative is weak (0.06–0.17 at early/late). The model doesn't treat
"don't use callbacks" as equivalent to "use async/await." It understands what you
*don't* want but doesn't automatically infer what you *do* want. The negation
creates an ambiguous representation far from both options.

### 3. affirm ↔ alternative is consistently the strongest similarity

"Use callbacks" and "use async/await" (0.24–0.43) are recognized as the same
*category* of instruction — both are positive directives about code patterns. This
makes sense and serves as a sanity check.

### 4. Mid-layer shows strongest negation; late-layer partially collapses

Both models show the maximum separation between affirm and negate at the mid-layer
(the processing layer). At the late layer (output preparation), the separation
partially collapses — the negation signal weakens as the model prepares to generate.

### 5. Instruction tuning helps preserve negation at the output layer

At the late layer:
- **Instruct model:** affirm ↔ negate = 0.018 (nearly orthogonal — negation held)
- **Base model:** affirm ↔ negate = 0.104 (drifting back toward concept)

Without instruction tuning, the negation signal decays more at the output layer.
RLHF/instruction tuning appears to help the model *maintain* the negation through
to generation — but even with it, the negation doesn't redirect toward the
alternative.

## Implications for the Refactoring Problem

This reframes the refactoring trap. The issue isn't just that "the old code drowns
out the negation instruction" (though that's also true and is Experiment 2's
hypothesis). It's more fundamental:

**Even in a clean, short prompt, "don't use X" doesn't point the model toward "use Y."**
It points toward a limbo state. The model knows what to avoid but doesn't know where
to go instead. This means:

- Saying "don't use var" is *less effective* than saying "use const/let" — even
  though they mean the same thing to a human
- Negative instructions are inherently weaker than positive ones, regardless of
  context length
- The refactoring problem has two compounding factors: (1) negation is weak to
  begin with, and (2) context full of old code further weakens it

## Practical Takeaway

**Always phrase refactoring instructions positively.** "Use const/let" > "don't use
var." "Use async/await" > "don't use callbacks." The model's hidden states represent
positive instructions more clearly than negated ones. This is true even before
context dilution enters the picture.

## Next Steps

- **Experiment 2:** Measure how the negation signal decays as we insert increasing
  amounts of old-pattern code. The limbo finding predicts this will be especially
  damaging — a weak signal (negation) competing with a strong one (reinforcement).
- **Experiment 3:** Test whether context pruning rescues the signal.
- **Run on more models** to verify the pattern (Qwen Coder 3B, Qwen general 3B,
  DeepSeek 6.7B).
