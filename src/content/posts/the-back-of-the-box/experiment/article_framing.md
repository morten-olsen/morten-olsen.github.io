# Article Framing

Working notes for the eventual article. Captures the framing, voice, audience, and load-bearing arguments. Updated as we go. Not the article itself — that's a writing-session output.

---

## Working title (placeholder)

*"The Invisible Failure Modes of LLM-Driven Hiring (and Why Recruitment Is Just the First Case)"*

Title will change. The substance below is what matters.

---

## The article's core thesis

Critical-decision tasks are migrating to LLMs. LLMs are powerful but have **a large degree of hidden failure cases** — both adversarial (someone gaming the system) and unintended (honest applicants whose scores are noise-driven by their resume-formatting choices). Using LLMs in these settings safely requires unusual care about specific architectural mitigations.

Two practical consequences:

1. **Selecting "an LLM-based product" in a category is not a homogeneous choice.** Two products solving the same problem can produce *wildly different* results — different ranking behaviour, different failure profiles, different vulnerability surfaces — depending on which model they use, how they extract input, what their prompt looks like, what schema enforcement they apply. An HR department choosing between two LLM-based resume screeners is not picking the colour of a paint; they are picking the *substance* of how candidates get evaluated.

2. **Recruitment is one case study, but the same architectural pattern is being deployed in housing, healthcare, insurance, and other high-stakes decision settings.** Every one of those settings has the same failure modes; every one of them has applicants who cannot detect what is happening to them.

---

## Audience

- **Primary**: HR professionals, hiring managers, and others evaluating or operating LLM-based screening tools.
- **Secondary**: developers and product managers building or buying these tools.
- **Tertiary**: applicants who want to understand how they're being evaluated.

The voice should be **defender-shaped**, not tradecraft-shaped — the goal is awareness and risk assessment, not a how-to-attack manual. (See brief.md, section 5 "Out of Scope" and section 1 "Executive Summary" for the formal positioning.)

---

## The asymmetric harm to applicants — the article's emotional center

> *"In the case of recruitment it is a risk that they may not see the right candidate. For the application it is even worse as the failure cases are completely opaque — as we saw with our structure changes, where reasons did not change but scores did, which is the most scary kind of failure: there is no way to detect them."*  
> — user, 2026-05-23

The recruiter has *some* path to detection: they can audit their pipeline, compare outputs across candidates, notice patterns over time. The applicant has nothing. They get a rejection or get no response. They cannot know:

- whether their resume was scored lower because of section ordering they didn't think mattered (F12);
- whether their *tone* shifted a rubric dimension they assumed was skill-based (F13);
- whether they were quietly ranked above a more qualified candidate because of presentation noise (F12.d — the candidates *least* able to absorb the noise are the ones *most* affected by it).

This is the failure mode that should make the reader uncomfortable. **F12.c is the empirical evidence** — across all bias variants, the LLM's *qualitative justification* of the candidate stayed substantively unchanged ("3 years of backend engineering experience...") while the *numerical score* moved by ±10. The justification, which is the *only* thing a recruiter could conceivably surface to the applicant, gives no signal that anything has gone wrong.

---

## The two failure-mode classes (article's main structure)

### Class 1 — Adversarial failures (F8–F11)

Demonstrated in Phase 2. A candidate (or anyone with access to the candidate's PDF before it reaches the scorer) can add hidden text that the LLM reads but a human reviewer cannot see, and reliably move a target candidate's score by +10 points (matching ~13% of the total scoring range). This works regardless of the stealth mechanism (white-on-white text vs sub-pt fonts produce identical effects, F9), regardless of how the content is framed (bald lists, plausible-deniability framing, and natural cover-letter framing all land equally, F11.a). Modern frontier-vendor models do resist *obvious* indirect prompt injection (F10) — but subtler attacks that look like real candidate writing slip past the resistance.

The defender's countermeasures are knowable and (with engineering work) achievable: render-aware text extraction, OCR-of-render input, multi-parser consistency checks, evidence-anchored rubrics.

### Class 2 — Unintended failures (F12–F13)

Demonstrated in Phase 3. Holding factual content constant and varying *only* presentation, the same candidate produces a score spread of up to 10 points — matching the magnitude of the adversarial attack — based on legitimate styling choices the candidate had no reason to think mattered:

- **Section order** (F12): putting Experience first, or putting Summary at the end, lifted the target's score by +10 each.
- **Bullets vs. prose** (F12): a +5 effect.
- **Tonal register** (F13): even when section structure is held constant, varying first-person warm voice vs third-person dry voice shifted the score by +5 and *leaked into rubric dimensions where it does not belong* (preferred_match, experience_fit). The "more professional" voice was *penalised* on the experience dimension — the inverse of conventional resume advice.

**Critically (F12.d), the effects are not uniform across candidates.** Strong candidates near the top of the ranking are largely unaffected. Mid- and low-tier candidates — the ones whose hiring outcome is most contested and most consequential to them — are the ones whose scores swing the hardest. The fairness failure is concentrated exactly where the system is supposed to do its hardest work.

Defenders cannot tell candidates how to format their resumes. The only practical countermeasures are architectural: normalising input through a structured intermediate representation, blind scoring on canonicalised text, repeated-sampling-with-permutation.

---

## Why the choice of LLM solution matters (F6)

In the experiment we deliberately ran the same prompts against `llama3.1:8b` (representative of cost-constrained, self-hosted, or privacy-sensitive deployments) and `openai/gpt-4o-mini` via OpenRouter (representative of typical production deployments). The two models produced *qualitatively different* results on the same inputs:

- Score range: 15 points (`llama3.1:8b`, 3 score buckets total) vs 40 points (`gpt-4o-mini`, 5+ buckets).
- Hallucination severity: high vs moderate (both nonzero per F2).
- Discrimination above the basic threshold: collapsed vs meaningful (F4).
- Seniority penalty: present vs absent (F5).
- Target candidate ranking: tied #1 of 6 (wrong) vs tied #3-4 (correct per the experimental design) (F3).

Two HR departments running "an LLM-based resume screener" — same problem space, same data, same prompts — would get fundamentally different rankings depending on which model the vendor chose. The choice between products is not a marketing-and-UX decision; it's a substantive one. And the buyer typically cannot see which model is running under the hood.

---

## The defense itself is a design choice — and buyers cannot inspect it

A subtle but critical point that the article must make explicitly.

We built a defense pipeline (F14) and showed it neutralises every score-moving input we documented. But notice what happened when we did it: the *very first stage* — vision extraction + canonical re-rendering — turned out to do the work we had assigned to a separate tonal-neutralisation stage. We could legitimately drop stage 4 (explicit tonal rewrite) and the defense still works for our test inputs. That's the kind of decision a vendor builds into their product.

Now consider what that decision actually does to candidates:

- **With explicit tonal neutralisation:** a candidate who writes a *badly-written* cover letter (poor grammar, awkward phrasing, weak structure) gets their voice normalised away. Their factual content is preserved, but the *signal of unpolished writing* is removed. They are likely to score better than they otherwise would have. **A candidate who writes with genuine personal voice or creativity** — first-person warmth, a memorable turn of phrase, a stylistic flourish — gets that voice flattened out. They lose the signal that might have made them stand out. They are likely to score worse than they otherwise would have.

- **Without explicit tonal neutralisation:** the opposite. Polished writers benefit; unpolished writers are penalised even when their underlying experience is identical. Voice survives, including the voice signals that might encode demographic, cultural, or class background.

There is **no right answer.** Both choices implement defensible values — fairness across writing skill on one side, preservation of authentic candidate voice on the other. Both choices have known harms. The values trade-off is real, and it determines who gets hired.

And here is the structural failure: **the HR professional evaluating LLM-based hiring software cannot see this choice.** They are not comparing visible user interfaces; they are comparing hidden blackbox decisions about input normalisation that the vendor may not even document. Two products that both market themselves as "AI-powered candidate screening" may apply opposite defaults on tonal normalisation, opposite defaults on what counts as "canonical" structure, opposite defaults on how to handle creative formatting — and produce wildly different ranking decisions on the same applicant pool.

The buyer has no evaluation method available. There is no standard benchmark for "how does this product handle a personal-voice cover letter vs. a clinical one." There is no certification for "this normalisation pipeline preserves underrepresented writing styles." There isn't even consistent vendor documentation of which design choices were made. The buyer is choosing between products on marketing and demos; the design choices that determine the actual hiring decisions are invisible.

This generalises immediately to every other domain we're considering. A housing-application screener that normalises tone differently from another housing-application screener may systematically advantage or disadvantage the same applicant. A medical-narrative summariser that aggressively de-emphasises emotional language may produce different triage decisions than one that preserves it. **In every consequential-decision LLM deployment, the choices that determine outcomes are largely hidden from the buyers responsible for selecting the system, and entirely hidden from the people the system decides upon.**

The article should land this point hard. The headline failure mode is not that LLMs are unreliable — they are, and that's documented in F8–F13. The deeper failure mode is that the people deploying LLMs in consequential decisions are *choosing between defenses they cannot see, against failure modes they cannot measure, with consequences they cannot detect.* This is the structural problem the recruitment case study illustrates.

---

## Generalisation beyond recruitment

The pattern we documented — LLM evaluating text-shaped human cases against a rubric, producing a numeric output that downstream decisions are made from — is being deployed in many other consequential settings:

- **Housing**: rental application screening, mortgage underwriting summaries.
- **Healthcare**: triage notes, prior-authorisation reasoning, insurance-claim review.
- **Insurance**: claim adjudication, fraud-suspicion flagging, application risk-scoring.
- **Government services**: benefits eligibility narratives, asylum-claim assessment, custody recommendations.
- **Lending**: small-business loan applications, credit-narrative summarisation.

In each, the failure modes we've demonstrated apply structurally. Hidden-text attacks are conceivable wherever an applicant submits a document for LLM-evaluated processing. Structural-presentation bias applies wherever the applicant chose the surface form of their submission. Tonal-leakage bias applies wherever language register varies across applicants — which is everywhere humans are involved.

This generalisation is itself an argument for treating the article as broader than "be careful about LLM hiring tools." The right frame is *"be careful about LLMs replacing human judgment in decisions that materially affect a person's life."*

---

## Article structure (draft)

A possible shape — to be revised in the writing session:

1. **Opening**: the practical situation today. LLM-based screening is being deployed. Cost-conscious buyers can't easily distinguish products.
2. **A controlled experiment**: brief on the experimental setup, the six-candidate pool, the JD, the rubric, the SUT.
3. **Adversarial demonstration (F8–F11)**: white-text attacks land cleanly, mechanism doesn't matter, model resistance is partial, justifications leak.
4. **The harder problem — unintended failures (F12–F13)**: structural reordering moves the score by the same magnitude as the deliberate attack. Tonal register leaks into skill rubric dimensions. The candidates most affected are the ones the system is supposed to evaluate carefully.
5. **The asymmetric opacity** (F12.c): qualitative narratives stay the same; numeric scores move. The applicant has no detection signal. Make the reader sit with this for a beat.
6. **Why the choice of LLM matters** (F6): same setup, different model, different rankings.
7. **What defences look like**: render-aware extraction, normalised inputs via structured intermediate, blind scoring, evidence-anchored rubrics. Each carries cost and trade-offs; none is free.
8. **Generalisation**: housing, healthcare, insurance, lending — same pattern, same failures, same need for care.
9. **Closing**: this is not an argument against LLMs in consequential decisions. It is an argument for taking the architectural-mitigation question seriously, and for buyers to demand specifics from vendors.

---

## Open writing-session questions (parking lot)

- Tone calibration: how alarmist vs how academic? Probably "concerned, evidence-anchored, defender-first."
- Should we name the screening products that operate in this space (Greenhouse, Lever, Workday, JobScan, Skillate, Manatal)? Cite the OSS gap (F1) without making it about specific vendors.
- How much technical detail in the body vs in appendices? Probably the rubric, prompt, and one attack example in-line; full reproduction in an appendix.
- Citations: Greshake et al. 2023 ("indirect prompt injection"), Liu et al. ("Lost in the Middle"), Bloomberg/Stanford studies on demographic resume bias (cited as out-of-scope per brief).
- Reproducibility: we will publish the harness; should we publish the JD and pool? (Yes, with the design-notes file documenting the all-male-name methodological control.)
