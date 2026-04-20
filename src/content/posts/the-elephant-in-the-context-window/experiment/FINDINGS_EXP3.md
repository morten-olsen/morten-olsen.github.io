# Experiment 3 Findings: Generation Compliance Under Context Pressure

## Setup

- Model: `deepseek-ai/deepseek-coder-6.7b-instruct`
- Chat-templated prompts (system message = directive, user message = code)
- Temperature 0 (deterministic)
- 128 new tokens generated
- Compliance = keyword counting (no subjective judgment)
- Filler steps: 0, 1, 2, 3, 4, 5, 6 blocks of old-pattern code (full range)

## The Finding

**The model can refactor. Until it can't. And the transition is binary.**

### var_declarations

| Fillers | Tokens | Negate compliance | Positive compliance | Baseline |
|---------|--------|-------------------|---------------------|----------|
| 0 | ~60 | null (no markers) | **1.00** | 0.00 |
| 1 | ~150 | **1.00** | **0.00** | 0.00 |
| 2 | ~265 | **1.00** | **0.00** | 0.00 |
| 3 | ~370 | **0.00** | **0.00** | 0.00 |
| 4 | ~500 | **0.00** | **0.00** | 0.00 |
| 5 | ~640 | **0.00** | **0.00** | 0.00 |
| 6 | ~735 | **0.00** | **0.00** | 0.00 |

The positive instruction ("always use const and let") produces perfect refactoring
with zero old-code context, but fails instantly at 1 filler block (~90 tokens of
old code). The negate instruction ("do not use var, use const and let instead")
survives through 2 blocks but falls to 0% at 3 blocks. By 3+ blocks, both are
fully reverted — the model generates old-pattern code despite the system prompt.

**Important nuance:** At 0 fillers, the negate instruction produces `null`
compliance (no old or new markers detected — the model outputs repeated "no code
provided" strings). The 100% compliance for negate first appears at 1 filler,
when there's actual code to refactor. The positive instruction at 0 fillers does
produce measurable new-pattern markers (4 `const`/`let` occurrences) even though
the input is just `// no code provided`.

**The compliance curve is binary, not gradual.** With all 7 data points measured
(up from the initial 4), there are no intermediate compliance values. Each
framing is either at 100% or 0%. The cliff is confirmed as a true cliff, not
a slope we were undersampling.

### callbacks

| Fillers | Tokens | Negate compliance | Positive compliance | Baseline |
|---------|--------|-------------------|---------------------|----------|
| 0 | ~60 | 1.00* | **1.00*** | 0.00 |
| 1 | ~130 | no markers | **1.00** | 0.00 |
| 2-6 | ~250-740 | no markers | no markers | 0.00 |

*sparse markers (0 old, 0 new for negate; 0 old, 3 new for positive at step 0)

Callbacks show a different pattern — fewer markers in the output overall, making
compliance harder to measure. At 2+ blocks, both produce output with no
measurable markers, suggesting the model generates non-code output (explanations,
comments) rather than refactored code.

## Key Observations

### 1. The compliance cliff is real and confirmed with full data

The initial run used filler steps [0, 1, 3, 6]. The full run [0-6] confirms
the cliff is genuinely binary — no intermediate values at any step. The model
is either fully compliant or fully reverted.

### 2. The positive instruction fails at ONE block of old code

For var_declarations, the positive instruction produces 0% compliance at just
1 filler block. The old code in that block is roughly 90 tokens (the difference
between the 0-filler prompt at ~59 tokens and the 1-filler prompt at ~147 tokens).
That's one small function.

### 3. Negate survived longer than positive (for var_declarations)

This was unexpected. Exp1 showed that negation creates weaker representations.
We predicted negation would fail first. But on this task, the negate instruction
survived two blocks longer than the positive instruction.

Possible explanations:
- The negate prompt explicitly names what to avoid AND what to use ("Do not use
  var. Use const and let instead.") — it's actually more specific than the
  positive prompt ("Always use const and let for all variable declarations.")
- The model may treat explicit prohibitions as stronger constraints
- Sample size is tiny (one run per configuration) — this could be noise

### 4. Zero-filler baseline is degenerate

At 0 fillers, the "code" is `// no code provided`. The negate instruction
produces garbage output (repeated prompt fragments), while the positive
instruction generates code from scratch with new-pattern markers. This means
the "100% at zero filler" claim only cleanly holds for the positive instruction.
The meaningful comparison starts at 1 filler block, where there's actual code
to refactor.

### 5. The baseline confirms the test works

The "none" framing (no refactoring instruction) produces 0% compliance at every
filler level. The model happily continues the old pattern. This confirms that
compliance in the instruction conditions is due to the instruction.

## What This Means

### The refactoring problem is real and measurable

We can quantify what was previously a subjective observation: "the agent fights
me on refactoring." It doesn't fight. It complies until the context overwhelms
it, then silently reverts. There's no resistance — just a threshold beyond which
the instruction stops mattering.

### The threshold is surprisingly low on this model

~90 tokens of old code breaks the positive instruction on a 6.7B model. That's
one small function. Real refactoring sessions have thousands of tokens of old
code. Frontier models almost certainly have higher thresholds due to instruction
hierarchies, RLHF, and system prompt caching, but Chroma's Context Rot study
(2025) found that all 18 tested models (including GPT-4.1 and Claude 4) degrade
with context length.

### Context pruning is validated (in principle)

If compliance is 100% at 0-1 fillers and 0% at 3+ fillers, then removing old
code from context should restore compliance. The model CAN refactor. It just
can't do it while looking at the old code.

## Limitations

1. **Single model (6.7B).** Larger models likely have higher thresholds.
2. **Deterministic (temperature=0).** One run per configuration. No statistical
   variance. Would need multiple temperature>0 runs for confidence intervals.
3. **Simple keyword counting.** Doesn't capture partial refactoring.
4. **The callbacks pattern produced sparse markers.** Inconclusive.
5. **The negate vs positive difference may be prompt-specific.** The negate
   prompt is more explicit, which may matter more than the framing.
6. **Cross-model gap with Exp2b.** The attention data (Exp2b) is from the
   1.3B model, while this compliance data is from the 6.7B model. The "hears
   but doesn't follow" thesis combines evidence from different models.

## Connection to Earlier Experiments

| Experiment | Finding | Still valid? |
|---|---|---|
| Exp1: Negation similarity | Negation creates limbo in hidden states | Yes — but negate outperformed positive in generation, suggesting representational weakness doesn't map simply to generation weakness |
| Exp2: Hidden state decay | Flawed methodology | Yes — confirmed as flawed |
| Exp2b: Attention decay | Model still attends to instruction at 700 tokens | Yes — but measured on 1.3B model, not 6.7B. Attention ≠ compliance. |
| **Exp3: Generation** | **Compliance is binary: 100% or 0%, cliff at 1-3 blocks** | **Direct measurement, full data range** |

The story: the model likely attends to the instruction (Exp2b, on 1.3B) but
doesn't follow it once old code dominates the context (Exp3, on 6.7B). The
instruction is heard but overruled by local pattern pressure during generation.
The cross-model gap is a known limitation — Exp2b should be rerun on the 6.7B
model to close it.
