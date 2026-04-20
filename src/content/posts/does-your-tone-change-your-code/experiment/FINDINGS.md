# Experiment Findings

## Models Tested

| Model | Architecture | Params | Type |
|---|---|---|---|
| `deepseek-ai/deepseek-coder-1.3b-instruct` | DeepSeek | 1.3B | Code-specialized |
| `deepseek-ai/deepseek-coder-6.7b-instruct` | DeepSeek | 6.7B | Code-specialized |
| `Qwen/Qwen2.5-Coder-3B-Instruct` | Qwen | 3B | Code-specialized |

Three models, two different architectures (DeepSeek and Qwen), three different sizes.

## Key Metric: Tone Silhouette (coding prompts only, late layer)

This is the number that matters — it measures how strongly tone clusters in the
hidden states closest to the output distribution.

| Model | Tone Silhouette (late) | Task Silhouette (late) |
|---|---|---|
| DeepSeek 1.3B | **+0.178** | -0.124 |
| DeepSeek 6.7B | **+0.159** | -0.092 |
| Qwen 3B | **+0.226** | -0.083 |

All three models show:
- **Positive tone clustering** — same-tone prompts are represented more similarly
  than same-task prompts
- **Negative task clustering** — the model does not primarily organize by what
  you're asking it to code

## Tone Increases in Importance Toward Output

Across all models, tone silhouette increases from early to late layers:

### DeepSeek 1.3B
| Layer | Tone | Task |
|---|---|---|
| Early (2) | +0.141 | -0.130 |
| Mid (12) | +0.145 | -0.063 |
| Late (22) | **+0.178** | -0.124 |

### DeepSeek 6.7B
| Layer | Tone | Task |
|---|---|---|
| Early (2) | +0.146 | -0.147 |
| Mid (16) | +0.098 | -0.032 |
| Late (30) | **+0.159** | -0.092 |

### Qwen 3B
| Layer | Tone | Task |
|---|---|---|
| Early (2) | +0.160 | -0.149 |
| Mid (18) | +0.049 | +0.035 |
| Late (34) | **+0.226** | -0.083 |

Tone is present from the earliest layers and persists — or strengthens — through to
the output layer. This is not a surface-level feature that gets abstracted away.

## Cosine Similarity: Tone Creates Tighter Groups Than Task

Looking at within-group cosine similarity at the late layer (higher = tighter cluster):

### DeepSeek 1.3B
| Tone | Self-similarity |
|---|---|
| Professional | 0.845 |
| Academic | 0.725 |
| Terse | 0.626 |
| Casual | 0.594 |

By comparison, individual tasks top out at ~0.67 self-similarity. **Professional
tone creates the tightest cluster of any grouping we measured.**

### DeepSeek 6.7B
| Tone | Self-similarity |
|---|---|
| Professional | 0.767 |
| Academic | 0.663 |
| Terse | 0.653 |
| Casual | 0.559 |

Same ranking, slightly lower absolute values.

### Qwen 3B
| Tone | Self-similarity |
|---|---|
| Professional | 0.937 |
| Academic | 0.939 |
| Casual | 0.848 |
| Terse | 0.840 |

Qwen shows even stronger tone clustering, with academic and professional both
above 0.93 self-similarity. This is remarkably tight for hidden state vectors.

## The Tone Proximity Pattern

A consistent pattern emerges across all models:

- **Academic ↔ Professional** are closer to each other (high cross-similarity)
- **Casual ↔ Terse** are closer to each other
- **Formal ↔ Informal** pairs are the most distant

This makes intuitive sense: academic and professional language share formal register,
complete sentences, and polished vocabulary. Casual and terse prompts share brevity
and informality. The model appears to encode a **formality axis**.

## Control Group: The Sanity Check

The group silhouette (coding vs control) is positive but modest across all models
(0.01–0.16). This tells us the model does separate intent somewhat, but **tone is
a stronger organizing signal than the coding-vs-not-coding distinction**.

This is itself a finding: the model cares more about *how* you ask than *what
domain* you're asking about.

## Confirmed by Both UMAP and PCA

The clustering is visible in both UMAP (non-linear) and PCA (linear) projections
across all three models. This rules out UMAP artifact concerns — the structure
exists in the raw high-dimensional space, not just in the reduced projection.

## Interpretation

**The thesis is supported.** Tone/register creates distinct, persistent
representations in LLM hidden states that survive to the final layers before
output generation. This means:

1. The model enters a different "region" of its learned distribution depending on
   how you phrase your request
2. This is not a DeepSeek-specific trait — it reproduces across architectures
3. It's not a small-model artifact — the 6.7B model shows the same pattern
4. The effect is strongest at late layers, exactly where it would influence
   token generation

**What this doesn't prove:** We measured internal representations, not generated
output. A different hidden state *necessarily* produces a different probability
distribution over next tokens, but we haven't measured whether the resulting code
differs in quality, style, or correctness. That would be a natural follow-up
experiment.

## Confounds Acknowledged

1. **Token count:** Terse prompts average ~7 tokens, academic prompts ~35. Some
   clustering may reflect sequence length rather than tone per se. However, casual
   (~18 tokens) and professional (~19 tokens) have nearly identical lengths yet
   cluster separately — so length alone doesn't explain the pattern.

2. **Sample size:** 40 coding prompts (10 tasks × 4 tones) is sufficient to observe
   strong effects but not for fine-grained statistical claims.

3. **Instruction-tuned models only:** We tested instruct-tuned models. Base models
   might behave differently.
