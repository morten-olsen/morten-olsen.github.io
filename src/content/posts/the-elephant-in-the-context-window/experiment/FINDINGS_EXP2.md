# Experiment 2 Findings: Negation Decay Under Context Growth

## Model Tested

| Model | Type |
|---|---|
| `deepseek-ai/deepseek-coder-1.3b-instruct` | Code, instruct |

## What We Expected

As old-pattern code fills the context between instruction and generation point,
the model's hidden state should drift toward the old pattern — resolving the
Exp1 "limbo state" in the wrong direction. Negated instructions ("don't use var")
should be more vulnerable to this drift than positive instructions ("use const/let").

## What Actually Happened

**Both signals lose.** Neither old nor new pattern "wins" as context grows.

The raw drift data tells the story:

```
var_declarations/negate:
  sim_to_old drift: -0.537  (similarity to old reference collapses)
  sim_to_new drift: -0.525  (similarity to new reference collapses equally)
```

As hundreds of tokens of JavaScript code fill the context, the last-token hidden
state moves away from *both* reference vectors at roughly the same rate. The model
doesn't get pulled toward the old pattern or the new one. It enters "code
processing mode" — a representation dominated by the statistical properties of
the code block itself, where the instruction signal from the top of the context
is effectively drowned out.

## The Gap Analysis

The gap (sim_to_new - sim_to_old) at the late layer:

### var_declarations
| Framing | Gap at 0 fillers | Gap at 6 fillers | Δ |
|---------|-----------------|-----------------|---|
| negate | -0.013 | -0.001 | +0.013 |
| positive | -0.008 | -0.002 | +0.006 |

### callbacks
| Framing | Gap at 0 fillers | Gap at 6 fillers | Δ |
|---------|-----------------|-----------------|---|
| negate | -0.073 | +0.032 | +0.105 |
| positive | -0.051 | +0.043 | +0.094 |

The gap moves from slightly negative toward zero or slightly positive. This does
*not* mean the model favors the new pattern with more context. It means both
reference signals become equally irrelevant as code dominates the context.

## Reinterpretation

Our original hypothesis was: **"the old code pulls the model toward the old pattern."**

The actual finding is: **"the code buries the instruction entirely."**

This is a different failure mode. The model isn't "stubbornly doing the old thing
because it's pulled toward the old pattern." It's doing the old thing because:

1. The instruction signal (whether negated or positive) decays as it gets buried
   under hundreds of code tokens
2. When the instruction is effectively gone, the model generates based on what it
   sees in the immediate context — which is old-style code
3. This is autoregressive continuation, not instruction following — the model
   defaults to "continue the pattern in front of me"

The distinction matters for the fix. It's not about *removing* the old code
(Experiment 3's original premise). It's about **keeping the instruction signal
alive** — either by:

- Placing the instruction close to the generation point (not just at the top)
- Repeating the instruction periodically through the context
- Pruning old code AND reinserting the instruction after each file

## Negate vs Positive: No Meaningful Difference

We expected negated instructions to decay faster than positive ones. The data
doesn't support this — both framings show similar drift patterns and similar gap
trajectories. At the scale of context growth we tested (~700 tokens), the
instruction framing matters less than simple *distance from the generation point*.

This doesn't contradict Exp1's finding (that negation creates a weaker starting
representation). It means that context dilution is a much stronger effect that
overwhelms the framing difference. At 0 fillers, you can see the Exp1 effect:
positive instructions start with a slightly better gap. But by 2-3 filler blocks,
the difference is gone — both are drowning equally.

## Limitations

1. **Single model, small scale.** Only tested on DeepSeek 1.3B instruct.
2. **Reference vector mismatch.** Our "old" and "new" reference prompts are short
   instruction-style text (~15 tokens). The actual context is hundreds of tokens
   of code. The representations may live in fundamentally different regions of
   hidden state space, making cosine similarity between them unreliable at large
   context sizes. We're effectively measuring "how much does this long prompt still
   look like this short prompt" — and the answer is "less and less, regardless."
3. **No actual generation test.** We measure representations, not output. The
   model *might* still follow the instruction at generation time even if the
   hidden state has drifted, because the attention mechanism can still "look back"
   at the instruction tokens directly.
4. **Context size is modest.** 6 filler blocks ≈ 700 tokens. Real refactoring
   sessions can have 10,000+ tokens of old code. The signal loss we see at 700
   tokens would be far more severe at production scale.

## Implications for Experiment 3

The context pruning experiment should be redesigned. Original plan: remove old
code, keep only refactored version. Updated plan should also test:

- **Instruction repetition:** Re-insert the refactoring instruction after each
  code block, keeping it close to the generation point
- **Instruction + pruning combined:** Remove old code AND repeat the instruction
- **Baseline comparison:** How does a fresh prompt (no accumulated context) compare
  to a long context with pruning?

## Key Takeaway

The refactoring problem isn't "old code wins." It's "instructions drown."
The model doesn't prefer the old pattern — it forgets you asked for anything.
