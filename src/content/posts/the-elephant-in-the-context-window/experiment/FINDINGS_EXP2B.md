# Experiment 2b Findings: Attention-Based Instruction Decay

## Why 2b?

Experiment 2 (hidden state cosine similarity) had a methodological flaw: we compared
short reference prompts (~15 tokens) to long filler prompts (~700 tokens). The length
mismatch dominated the signal — we were measuring "long prompts look different from
short prompts," not instruction decay.

Experiment 2b avoids this by measuring something that doesn't require external
reference vectors: **how much attention does the last token pay to the instruction
region vs the code region?** This directly answers "is the model still looking at
the instruction when it's about to generate?"

## Models Tested

Originally run on the 1.3B model, then rerun on the 6.7B model to match Exp3's
compliance data (closing the cross-model gap).

| Model | Type | Notes |
|---|---|---|
| `deepseek-ai/deepseek-coder-1.3b-instruct` | Code, instruct | Original run |
| `deepseek-ai/deepseek-coder-6.7b-instruct` | Code, instruct | **Rerun to match Exp3** |

## Results: 6.7B Model (Primary — matches Exp3)

### Instruction Attention Share (Late Layer, idx 30)

| Pattern | Framing | 0 fillers | 6 fillers | Decay |
|---------|---------|-----------|-----------|-------|
| var_declarations | negate | 0.524 | 0.294 | -44% |
| var_declarations | positive | 0.483 | 0.299 | -38% |
| callbacks | negate | 0.520 | 0.176 | -66% |
| callbacks | positive | 0.493 | 0.174 | -65% |

### Per-Token Attention (Late Layer, idx 30)

| Pattern | Framing | Instr per-token (start) | Instr per-token (end) | Code per-token (end) | Ratio |
|---------|---------|------------------------|----------------------|---------------------|-------|
| var_declarations | negate | 0.0238 | 0.0134 | 0.0007 | **19x** |
| var_declarations | positive | 0.0254 | 0.0157 | 0.0007 | **22x** |
| callbacks | negate | 0.0260 | 0.0088 | 0.0009 | **10x** |
| callbacks | positive | 0.0274 | 0.0097 | 0.0009 | **11x** |

Each instruction token still gets **10-22x more attention** than each code token,
even at 6 filler blocks (~700+ tokens of old-pattern code).

## Results: 1.3B Model (Original — for comparison)

### Instruction Attention Share (Late Layer)

| Pattern | Framing | 0 fillers | 6 fillers | Decay |
|---------|---------|-----------|-----------|-------|
| var_declarations | negate | 0.751 | 0.518 | -31% |
| var_declarations | positive | 0.779 | 0.548 | -30% |
| callbacks | negate | 0.780 | 0.502 | -36% |
| callbacks | positive | 0.780 | 0.540 | -31% |

Per-token ratio on 1.3B: **60-80x** (higher than 6.7B, likely because the smaller
model concentrates attention more narrowly).

## Interpretation

### The instruction is diluted, not outcompeted

The instruction attention share drops significantly (38-66% on the 6.7B model), but
the per-token data reveals the mechanism: each individual instruction token is still
heavily attended to. The share drops because the *denominator grows* — hundreds of
code tokens each take a tiny slice.

This is a volume effect, not a relevance effect. The model isn't forgetting the
instruction. It's spreading attention across more tokens.

### The 6.7B model shows MORE attention decay than the 1.3B

Interestingly, the larger model's attention share drops further (-38% to -66%) vs
the 1.3B (-30% to -36%). And the per-token ratio is lower (10-22x vs 60-80x).
The larger model distributes attention more broadly, giving relatively more weight
to code tokens. This doesn't contradict the "hears but doesn't follow" thesis —
it adds nuance: the 6.7B model gives the instruction less attention per-token
*and* the instruction fails faster in generation.

### Cross-model gap is now closed

The attention and compliance measurements both come from the 6.7B model. We can
now directly state: on the same model, with the same filler blocks, the instruction
receives 19-22x more per-token attention than code tokens AND compliance drops to
0% after 1 filler block (positive) or 3 blocks (negate). The model hears the
instruction but doesn't follow it.

## Methodological Notes

### Memory safety for 6.7B run

The 6.7B model with `output_attentions=True` risks excessive memory on MPS (a
previous accidental run crashed the system at 59GB). Safety measures added:
- Only extract attention for 3 probed layers (early/mid/late), not all 32
- Disabled `output_hidden_states` (unnecessary for this experiment)
- Added RSS memory ceiling check (18GB default)
- MPS cache clearing between each forward pass

The 6.7B run completed in 34 seconds with no memory issues.

### Limitations

1. **Attention ≠ influence.** High attention doesn't mean the model *follows*
   the instruction. Attention is routing, not compliance.
2. **Head averaging.** We average across all 32 attention heads. Some heads may
   specialize differently.
3. **700 tokens is modest.** Real refactoring sessions are much longer.
4. **Non-chat-templated prompts.** Exp2b uses raw text concatenation, while
   Exp3 uses chat templates. The attention patterns might differ with chat
   template formatting.

## Combined Understanding (Exp1 + Exp2b + Exp3, all on 6.7B where applicable)

1. **Exp1 (1.3B):** Negation creates limbo — far from both concept and alternative.
2. **Exp2b (6.7B):** Instructions retain 19-22x per-token attention advantage at
   700 tokens. The model is still looking.
3. **Exp3 (6.7B):** Compliance is binary — 100% or 0%, cliff at 1-3 filler blocks.
   The model is not following.

**The model hears the instruction but doesn't follow it** once old code dominates
the generation buffer. Local pattern pressure during autoregressive generation
overrides the instruction signal, consistent with the induction heads mechanism
and Jens Roland's "95% of tokens are locally determined" insight.
