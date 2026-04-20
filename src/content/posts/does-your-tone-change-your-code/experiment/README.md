# Experiment: Does Tone Affect LLM Internal Representations?

## Thesis

LLMs are statistical next-token predictors trained on vast corpora. Different tones
of voice (casual, professional, terse, academic) are not uniformly distributed across
training data — casual phrasing correlates with forum posts and chat logs, while
professional phrasing correlates with documentation and code reviews.

**If tone is encoded as a significant feature in the model's hidden states, it
necessarily conditions the output probability distribution.** This means *how* you
ask a coding question may influence the style, quality, and patterns of the code
you receive — not because the model "understands" professionalism, but because
different registers activate different regions of the learned distribution.

## Experiment Design

We feed semantically identical coding prompts, written in 4 distinct tones, through
an open LLM and extract the hidden state activations at the last prompt token (the
representation the model uses to begin generating output).

### Prompt Matrix

- **Semantic axis:** 10 distinct coding tasks (palindrome check, sort a list,
  HTTP request, parse JSON, fibonacci, etc.)
- **Tone axis:** 4 register variants per task:
  - `casual` — informal, conversational ("hey can u write me...")
  - `professional` — clear, polished ("Please implement a function that...")
  - `terse` — minimal, keyword-style ("python palindrome check function")
  - `academic` — verbose, formal ("I would appreciate your assistance in developing...")

This gives us 40 coding data points in a 10×4 matrix.

### Controls

5 non-coding tasks (recipe, history, travel, fitness, email drafting) × the same
4 tones = 20 additional data points. These establish a baseline: if the model's
hidden states don't separate coding from non-coding prompts, the experimental
setup is broken and no tone conclusions can be drawn.

Controls also let us compare: is the distance between tones comparable to the
distance between intents? If tone separation is tiny relative to intent separation,
tone's practical impact is likely negligible even if statistically present.

**Total: 60 prompts** (40 coding + 20 control).

### What We Extract

For each prompt, we extract the hidden state vector at the **last token position**
from multiple transformer layers:

- **Early layer** (~layer 2) — surface/syntactic features
- **Middle layer** (~layer 50%) — semantic composition
- **Late layer** (~layer N-2) — output preparation

### Analysis

1. Reduce hidden states to 2D using both **UMAP** and **PCA** — UMAP preserves local
   structure but can hallucinate clusters; PCA is linear and deterministic, serving as
   a sanity check. If clusters appear in UMAP but not PCA, they're likely artifacts.
2. Generate scatter plots colored by **group** (coding vs control), **tone**, and **task**
3. Compute silhouette scores for all groupings at each layer depth
4. Repeat tone/task analysis on coding prompts only (isolating the question from
   the control separation noise)
5. Compute **cosine similarity heatmaps** between groups — this gives a granular view
   of how similar same-tone prompts are vs same-task prompts, independent of any
   dimensionality reduction

### Interpreting Results

**First, check the controls.** The group silhouette (coding vs control) should be
high. If it's near zero, the model isn't separating different intents and the
experiment setup needs revisiting.

| Observation | Interpretation |
|---|---|
| Group silhouette is low | Experiment is broken — model doesn't separate intent. Stop here. |
| Early layers cluster by tone, late layers by task | Model "sees" tone but abstracts it away. Tone impact on output is minimal. |
| Late layers still separate by tone | Tone persists to the output distribution. Strong evidence for the thesis. |
| Tone and task form a grid-like structure | Both dimensions are independently encoded. Tone matters but doesn't override semantics. |
| No tone clustering at any layer | Tone is noise to the model. Thesis is weakened. |
| Tone silhouette is tiny vs group silhouette | Tone is encoded but its effect is dwarfed by intent. Practical impact likely negligible. |

## Limitations

1. **Single model:** We test one open model (likely 1-7B parameters). Results may
   not transfer to larger proprietary models (GPT-4, Claude) which have additional
   RLHF/RLAIF tuning that could amplify or dampen tone sensitivity.

2. **Representation ≠ output:** Even if tone creates distinct clusters in hidden
   states, we are not directly measuring whether the *generated code* differs. The
   experiment shows potential for impact, not proven impact on output quality.

3. **Prompt crafting bias:** The tone variants are hand-written. Despite best efforts,
   subtle semantic differences may leak in (e.g., the terse variant might omit context
   that the academic variant includes). We mitigate this by keeping the core request
   identical across variants.

4. **Small sample size:** 60 data points (40 coding + 20 control) is enough to see
   strong clustering effects but not enough for robust statistical claims. This is
   an exploratory experiment, not a definitive study.

5. **Layer selection:** The "right" layer to probe is debatable. We sample early,
   middle, and late, but the most informative layer may vary by model architecture.

6. **UMAP is non-deterministic:** Repeated runs produce slightly different layouts.
   We set a fixed random seed for reproducibility, but the silhouette scores are
   more reliable than visual inspection of the plots.

7. **Confound: token count:** Different tones produce different token counts. A longer
   prompt means more context for the last-token hidden state. We note token counts
   but do not control for this — it is arguably part of the tone signal.

## Requirements

Managed with [uv](https://docs.astral.sh/uv/). See `pyproject.toml` for dependencies.

## Running

Requires [uv](https://docs.astral.sh/uv/) and Python 3.11+. First run will
download the model (~2.5 GB for the default) and install dependencies.

```bash
cd experiment
uv run run_experiment.py
```

To use a different model:

```bash
uv run run_experiment.py --model codellama/CodeLlama-7b-Instruct-hf
```

### Hardware

- **GPU (CUDA/MPS):** Recommended. Runs in a few minutes.
- **CPU:** Works but slow (~30+ minutes depending on model size).

The script auto-detects CUDA → MPS → CPU.

### Outputs

Each model run saves to its own directory: `output/{model-name}/`.
This allows running multiple models as independent experiments without overwriting.

| File | Description |
|---|---|
| `{layer}_{method}_by_group.png` | Coding vs control scatter — the sanity check |
| `{layer}_umap_by_tone.png` | All prompts colored by tone (UMAP) |
| `{layer}_umap_by_task.png` | All prompts colored by task (UMAP) |
| `{layer}_{method}_coding_by_tone.png` | Coding prompts only, colored by tone |
| `{layer}_{method}_coding_by_task.png` | Coding prompts only, colored by task |
| `{layer}_cosine_by_tone.png` | Cosine similarity heatmap between tones |
| `{layer}_cosine_by_task.png` | Cosine similarity heatmap between tasks |
| `results.json` | Silhouette scores, token counts, model metadata |

Where `{layer}` is `early`, `mid`, or `late` and `{method}` is `umap` or `pca`.

### Comparing models

Run the experiment multiple times with different `--model` values. Each produces
its own output directory. Compare `results.json` silhouette scores across models
to see if tone sensitivity varies by model architecture or training.
