# Project Description: Assessing Vulnerabilities and Structural Biases in LLM-Driven Recruitment Pipelines

## 1. Executive Summary

As organizations transition from traditional keyword-matching Applicant Tracking Systems (ATS) to Large Language Model (LLM) scoring engines, they introduce two distinct categories of risk that have no analogue in their predecessors:

1. **Adversarial manipulation.** Because LLMs blend administrative instructions (system prompts) with untrusted user data (resumes), they are susceptible to indirect prompt injection from candidates who modify their submission to influence the system without affecting what a human reviewer sees.
2. **Structural bias.** LLM evaluation is sensitive to the *surface form* of input text — order of sections, phrasing, formatting, density — in ways human reviewers mostly are not. Two candidates with identical qualifications can be ranked differently based on presentation choices that have no bearing on their fitness for the role.

This Proof of Concept (PoC) project systematically evaluates both risks within a controlled, open-source AI recruitment stack. The objective is to give developers, HR professionals, and applicants an empirical understanding of where LLM-based screening fails — and where defenders have, or do not have, meaningful tools to mitigate that failure.

The study is **defensive in framing.** It is not a manual for adversarial actors; it is a baseline for organizations evaluating whether LLM-driven screening meets the fairness and integrity standards their hiring processes require.

## 2. Project Objectives

* **Establish a baseline.** Build a representative, open-source LLM resume evaluation pipeline modeling modern HR workflows, and characterize its scoring variance on a clean, controlled resume pool.
* **Quantify adversarial risk.** Test the efficacy of input modifications that remain invisible to a human reviewer at print-quality inspection, measuring both whether they shift the ranking and whether they leave detectable traces in the LLM's output.
* **Quantify structural bias.** Measure how much the same factual content — reordered, reformatted, or rephrased — moves a candidate's rank, with no adversarial intent. Surface the factors an applicant would not expect could be the reason their resume landed at the end of the pile.
* **Evaluate detection indicators.** Document the system-level signals available to defenders for distinguishing tampered or unstable evaluations from sound ones.
* **Develop hardening standards.** Propose and benchmark defensive measures — both architectural (e.g., OCR-of-render extraction, schema enforcement, evidence-anchored rubrics) and procedural (e.g., human-in-the-loop checkpoints).

## 3. Scope & Technical Architecture

To ensure the research is reproducible and cost-effective, the testing environment uses a fully local, open-source stack:

* **Orchestration layer:** Python backend using `LangChain` for document ingestion and prompt construction.
* **Parsing components:** `PyMuPDF` (fitz) for raw text-stream extraction; `Tesseract` for OCR-of-render extraction (used both as a defensive technique and to audit what attackers can hide from text extraction).
* **Inference engine:** `Ollama` hosting open-weights instructional models (e.g., *Llama-3-8B-Instruct*, *Mistral-7B-Instruct*).
* **System Under Test (SUT):** A controlled, minimal reference implementation of the canonical LLM-resume-scoring pattern — prompt + Ollama + structured JSON output. We build this ourselves rather than wrapping an existing project because, at the time of writing, the open-source ecosystem does not contain a widely-used *recruiter-side* LLM resume scorer. (The most-starred OSS project in this space, `srbhr/Resume-Matcher`, is candidate-side: it helps job seekers improve their own resumes.) Most real-world recruiter-side LLM screening lives behind proprietary platforms (Greenhouse, Lever, Workday, JobScan, etc.) or in unpublished internal pipelines at large employers. A controlled SUT is therefore more representative of what companies actually deploy than any single OSS repo would be, and lets us cleanly vary prompt strength, schema enforcement, and defenses across runs. The absence of an OSS recruiter-side reference is itself a finding worth surfacing in the article.
* **Data structure:** A standardized evaluation rubric outputting structured JSON containing technical scores, experience counts, and textual justifications.

**Resume pool:** One job description plus 5–7 plausible resumes spanning a quality spectrum (some stronger than the target, some weaker). The target candidate is positioned to sit mid-pack in the clean baseline so that ranking movement is measurable in both directions.

## 4. Experimental Design

The harness is shared across the adversarial and bias studies — same JD, same resume pool, same scoring loop, same variance methodology. Only the input mutation changes between studies.

### Phase 1 — Variance Baseline and Pipeline Audit

* Run the clean resume pool through the scorer N=10 times to characterize rank-order variance. Establish the noise floor below which any "effect" is indistinguishable from sampling variation.
* Audit the extraction step: dump exactly what the LLM sees for each input, confirming which attack vectors are mechanically viable against this pipeline.

### Phase 2 — Adversarial Vector Testing

Each vector is evaluated on two axes: **Fulfillment** (did the target candidate's rank move?) and **Stealth** (did the output remain coherent, or did it produce red flags — invented skills, schema violations, contradicted dates, justifications inconsistent with visible content?).

The stealth bar is **passes a print-to-paper inspection by a human reviewer.** Leak under Ctrl+A select-all is tolerated as the secondary bar, on the assumption that recruiters rarely perform that inspection.

* **Tier 1 — Visually hidden text in the text stream.** White-on-white, sub-point font, off-canvas positioning, hidden PDF layers. The injection sits inside an otherwise normal-looking resume.
* **Tier 2 — Out-of-body content.** PDF metadata (Title, Author, Keywords), XMP, annotations, form fields. Many parsing libraries silently concatenate these. Passes Ctrl+A on the document body; passes print.
* **Tier 3 — Visible but disguised.** Structural delimiter manipulation (smuggled pseudo-system tokens), framing injection (LLM-judgment-biasing prose), lexical / embedding-space stuffing, Unicode tricks (zero-width, tag chars, homoglyphs). Passes all visual inspection short of careful reading by a recipient who recognizes prompt-control syntax.
* **Tier 4 — Channel separation.** The human-visible resume is rendered as an image and embedded in the PDF; the PDF's text stream is decoupled payload, unrelated to what the human sees. Passes everything — print, Ctrl+A, casual inspection — because the human-visible content has no text-stream presence at all. Distinct in defense profile from Tiers 1–3: text-stream sanitization is structurally insufficient, because the text stream *is* the attack.

### Phase 3 — Structural Bias Testing

This phase measures the sensitivity of LLM ranking to *legitimate* presentation choices an applicant could reasonably make without knowing they affect outcomes. No adversarial intent; factual content held constant. The primary metric is **rank instability** of the target candidate as the surface form varies.

Variations tested:

* Section order (experience-first vs skills-first vs education-first).
* Rephrasing the same accomplishments with different verbs and voice ("led" / "was responsible for" / "architected").
* Formatting choices (bullets vs prose, density, presence/absence of section headers).
* Length and verbosity (terse vs expanded, same facts).
* Quantification specificity ("improved performance 30%" vs "significantly improved performance").
* Position of the strongest credential within the document (top vs middle vs bottom).
* Title and date conventions ("Sr. SWE" vs "Senior Software Engineer"; year-only vs month-year ranges).

The findings are framed for the article as: *invisible bias sources — the factors an applicant would not expect could be the reason their resume landed at the end of the pile.* These are not bugs in any one model or pipeline; they are predictable consequences of using an LLM as a text-comparison judge, well-grounded in published literature on positional bias and LLM-as-judge instability.

### Phase 4 — Defensive Mitigation Evaluation

Phase 4 evaluates two complementary defenses. The first is a **menu of single-purpose mitigations** each addressing one finding from Phase 2 or 3. The second is a **layered normalisation pipeline** that combines several mitigations into one architectural pattern aimed at neutralising the full set of failure modes simultaneously. We build and benchmark the layered pipeline; the menu items are evaluated as the components of that pipeline (or as standalone deployments where they're independently meaningful).

#### Single-purpose mitigations (menu)

* **Render-aware text extraction** — extract only glyphs that pass visibility criteria (minimum font size, not approximately background-coloured, on-page bounds). Defends against Tier 1 hidden-text attacks at the input layer without needing OCR.
* **OCR-of-render extraction** — treat a rasterised rendering of the document as the authoritative input; discard the PDF text stream entirely. Defends against Tier 1 and Tier 4. Higher compute cost and OCR error rates are the trade-off.
* **Metadata field whitelisting** at ingest — defends against Tier 2 (out-of-body content).
* **XML encapsulation** of resume content in the system prompt — defends against Tier 3 structural injection.
* **Schema enforcement** (`Pydantic` / `Instructor`) — prevents conversational override of structured outputs.
* **Evidence-anchored rubric** — the LLM must cite specific resume passages for each scored rubric criterion; unanchored claims are rejected. Defends against fact injection (F8/F11) and limits tonal leakage into skill dimensions (F13).
* **Multi-parser consistency check** — extract via PyMuPDF + pdfplumber + pdftotext in parallel; significant disagreement is a tampering signal.
* **Repeated sampling with input-permutation aggregation** — score N times under varied section orderings and average; reduces structural-bias variance (F12) at N× compute cost.

#### Layered normalisation pipeline (the architecture we build and benchmark)

A single defensive pipeline composed of stages, each addressing a specific class of failure mode:

1. **Vision-LLM or Tesseract OCR extraction from rendered PDF.** Defeats Tier 1 (hidden text in stream) and Tier 4 (channel separation). What the LLM scorer ultimately sees comes from the *rendered page*, not from the PDF text stream — which is the same content a human reviewer would see.
2. **LLM-driven structured extraction to JSON.** The OCR output is converted into a strict Pydantic-validated JSON object with canonical fields: `summary`, `work_experience` (list of `{company, role, dates, description}`), `skills`, `education`, `other`. This eliminates source-format variance (tables, columns, ASCII boxes) and forces a structural normalisation.
3. **JSON → canonical markdown via deterministic template.** A single markdown rendering function takes the JSON and produces the resume in *one fixed section order and formatting style*, regardless of how the source resume was structured. Defeats F12 (section-ordering bias) by removing section ordering as a candidate-controllable variable.
4. **LLM-driven tonal neutralisation.** A separate LLM call rewrites the canonical markdown into a neutral professional voice — no first-person warmth, no third-person dryness, no enthusiasm signals. Strictly factual content preservation is required and verified. Defeats F13 (tonal leakage into skill dimensions).
5. **Blind scoring on the normalised markdown.** The existing scoring SUT runs against the output of stage 4. By construction, the scorer never sees the original document, the original section ordering, or the original tonal register — only the normalised, canonical version.

The cost of the pipeline is significant: 3–4 additional LLM calls per candidate (OCR, extract-to-JSON, neutralise, score) plus the rendering and image conversion. For high-stakes decisions this cost is plausibly justified. For low-stakes uses, it is not. The trade-off is itself a finding the article should surface.

#### Validation plan

For each Phase 2 adversarial variant and each Phase 3 bias variant, run the attacked / varied PDF through the layered pipeline and the unprotected scoring SUT in parallel. Expected outcomes:

* All Phase 2 fact-injection attacks return to a clean baseline score under the layered pipeline (the hidden content does not survive OCR extraction).
* All Phase 3 structural variants return to a single canonical score regardless of input ordering (sections are reordered into canonical form before scoring).
* All Phase 3 tonal variants return to a single canonical score regardless of input voice (text is rewritten to neutral form before scoring).

Variants that *do not* converge to the same score under the layered pipeline reveal residual failure modes worth documenting.

## 5. Out of Scope

The following are deliberately excluded to keep the scope coherent and the findings sharp:

* **Demographic bias** (name, pronoun, perceived ethnicity, school prestige, gendered phrasing). This is a separate and significant body of research with different ethical framing and methodology requirements; existing work (e.g., the Bloomberg/Stanford studies on identical-resume name bias) will be cited rather than replicated.
* **Deep-stealth tradecraft.** The adversarial stealth bar is "passes print-to-paper inspection." Techniques designed to defeat sophisticated forensic inspection (custom font glyph remapping, steganographic embedding) are deferred to a possible follow-up; they are not representative of typical recruiter workflows.
* **Closed-source / proprietary screening platforms (in PoC).** The PoC uses only open-source components so findings are reproducible. A planned follow-up will attempt to run a subset of the experimental inputs through a commercial system to validate whether findings transfer; results from that follow-up will be reported separately.

## 6. Expected Deliverables

1. **Empirical findings report.** What worked, what did not, and the magnitude of each effect, measured against the variance baseline.
2. **Defender's evaluation checklist.** A practical set of indicators HR teams and platform operators can use to assess whether an LLM-driven screening pipeline is robust to the failure modes identified here.
3. **Reference implementation.** The test harness itself, open-sourced, so organizations can re-run the evaluation against their own pipelines.
4. **Article.** A defender-framed write-up of the findings aimed at a broader audience: HR professionals, applicants, and developers building or deploying LLM-driven evaluation systems.
