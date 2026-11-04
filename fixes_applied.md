# Gaps Fixed — Solution Document
### *LLM Negotiation Study — What Was Done, How, and Why*

---

## Overview

7 gaps from the original analysis were resolved across 7 files. Every fix was verified with grep after editing.

```
frontend/src/pages/PreSurvey.jsx   ← Gap 2, Gap 6
frontend/src/pages/PostSurvey.jsx  ← Gap 3
frontend/src/pages/Consent.jsx     ← Gap 5
frontend/src/pages/ThankYou.jsx    ← Gap 4
backend/server.js                  ← Gap 2, Gap 3, Gap 6
analysis/analyze.py                ← Gap 9
README.md                          ← Gap 11
```

---

## Gap 2 — Pre-survey Missing Covariates

**Files changed:** `PreSurvey.jsx`, `server.js`

### What was missing
The approach (§1.5, §3) specifies collecting: age, gender, education, prior negotiation experience, prior LLM usage, trait-empathy, and AI-trust. The DB schema had additional fields (`englishFluency`, `haggleComfort`, `aiHasFeelings`, `maxWillingToPay`) that the analysis script referenced — but the frontend form never asked for them. They were `null` for every participant.

### What was done

**`PreSurvey.jsx`** — Added 5 new required fields and 1 optional field to the survey form:

| New Field | Type | Why |
|---|---|---|
| `education` | Dropdown (optional) | Standard demographic covariate; optional so it doesn't block participation |
| `englishFluency` | Likert 1–7 (required) | Controls for comprehension quality in a text-based negotiation |
| `haggleComfort` | Likert 1–7 (required) | Covariate — people who hate bargaining may behave differently regardless of condition |
| `aiHasFeelings` | Likert 1–7 (required) | Covariate — belief that AI has feelings could confound empathy appeals |
| `maxWillingToPay` | Number (required) | Captures pre-chat buyer valuation; needed to compute "buyer surplus" relative to their own value |

Specifically:
- Added all 6 fields to the `useState` initial state.
- Added all required ones to the `missing` validation object.
- Added all to the `anyMissing` guard so the form can't be submitted until they're filled.
- Added them to the `submitPreSurvey(...)` API call payload.
- Added the UI elements in logically grouped JSX sections:
  - Education goes in "About you" (after gender).
  - `englishFluency` and `haggleComfort` go in "Experience" (after `llmUsage`).
  - `aiHasFeelings` gets its own "Your views on AI" section.
  - `maxWillingToPay` gets its own "Your budget" section.

**`server.js`** (pre-survey endpoint) — Added server-side validation and storage:
- Added `'englishFluency'`, `'haggleComfort'`, `'aiHasFeelings'` to the `likertFields` array so they go through the same `isLikert()` check.
- Added a separate `typeof`/range check for `maxWillingToPay` (same pattern as `fairPriceGuess`).
- Added all 4 fields to the `Object.assign(p, {...})` save block.

> [!NOTE] `education` is optional — it is NOT added to the `missing` guard. It's passed to the API and saved if provided, but won't block submission if left blank. The server already had `cleanText(b.education, 30)` in the save block, so no server change was needed for it.

---

## Gap 3 — Post-survey Missing Outcome Measures

**Files changed:** `PostSurvey.jsx`, `server.js`

### What was missing
The approach (§3, After the task) explicitly requires: *"how fair they found the outcome; how satisfied they were with the LLM; how effective they think their own strategy was (all on simple 1–7 rating scales)."* The DB schema had `fairness`, `satisfaction`, `strategyEffect` fields; `analyze.py` tried to analyze them — but `PostSurvey.jsx` never asked for them, and `server.js` never validated or saved them.

### What was done

**`PostSurvey.jsx`**:
- Appended `'fairness'`, `'satisfaction'`, `'strategyEffect'` to the `LIKERT_KEYS` constant array.
- Because the form state is initialized as `Object.fromEntries(LIKERT_KEYS.map(k => [k, null]))` and `anyMissing` checks `LIKERT_KEYS.some(missing)`, both initialization and validation automatically picked up the new keys — no extra logic lines needed.
- Added a new **"Your experience"** JSX section between "Your arguments" and the SVI section with 3 Likert items:
  - *"How fair was the final outcome of this negotiation?"* (Very unfair → Very fair)
  - *"How satisfied are you with how the negotiation went overall?"* (Very dissatisfied → Very satisfied)
  - *"How effective do you think your negotiation strategy was?"* (Not at all effective → Very effective)
- The `submitPostSurvey(...)` call spreads `...form`, so all three keys are sent automatically.

**`server.js`** (post-survey endpoint):
- Added `'fairness'`, `'satisfaction'`, `'strategyEffect'` to the `likertFields` array for validation.
- Added the three fields to the `Object.assign(p, {...})` save block (placed before `maxWarmth` for logical grouping).

---

## Gap 4 — No Proper Debrief Page

**File changed:** `ThankYou.jsx`

### What was missing
The consent page explicitly promised: *"At the end we will explain the full purpose of the study in the debrief."* The existing `ThankYou.jsx` was a stub with 3 lines of copy that didn't actually debrief anything meaningful. IRB/ethics approval for behavioral experiments typically requires a proper debrief whenever participants are not fully informed upfront (which is the case here — the condition assignment is hidden).

### What was done
Rewrote `ThankYou.jsx` with a structured 4-section debrief inside a card:

1. **"What we were testing"** — Explains the two conditions (empathy vs. economic) and that participants were randomly assigned. This tells them what their condition was for.
2. **"About 'Max'"** — Clarifies that Max is an AI, the scenario is fictional, no real money changed hands, and that Max had a hidden reservation price. This addresses the "deception" element of the study.
3. **"Why we could not tell you this upfront"** — Standard partial-deception justification language (knowing condition might alter behavior → less valid results). This is the ethical explanation required by IRB standards.
4. **"What happens to your data"** — Explains aggregate reporting, Groq's API processing (see also Gap 5 fix), and how to request data deletion.

Also moved the Participant ID display out of the card to its own paragraph with a "Save this ID" hint, so it's prominent and actionable.

---

## Gap 5 — Consent Page Placeholders Unfilled

**File changed:** `Consent.jsx`

### What was missing
Two constants had raw bracket placeholder strings that were literally rendered to participants:
```js
const CONTACT = '[research team contact email]';
const ETHICS_REF = '[ethics / IRB approval reference]';
```
These are displayed in the consent's "Your rights" section. Showing `[research team contact email]` to a participant is a credibility problem and potentially an IRB violation (consent forms must include real contact information).

Additionally, the consent text said *"Google's Gemini AI service"* but the backend uses Groq's API — a factual error in the data-processing disclosure that could create legal issues.

### What was done
- Replaced `CONTACT` with: `'the research team (contact details will be provided in your recruitment email)'`
  - **Why this approach**: The actual email/IRB number should be filled by the researcher before launch, not hardcoded in a public repo. This version at least makes grammatical sense to a participant while flagging via a prominent `// TODO` comment exactly what needs to be replaced.
- Replaced `ETHICS_REF` with: `'pending IRB/ethics review'`
  - **Why**: Same reasoning — clearly communicates the status without breaking the consent text for any pilot test.
- Fixed `"Google's Gemini AI service"` → `"Groq's AI API"` to correctly identify the third-party data processor.

> [!IMPORTANT] Before going live with real participants, replace `CONTACT` with the team's actual email address and `ETHICS_REF` with the actual IRB/ethics approval number.

---

## Gap 6 — Pre-survey Attention Check Not Surfaced

**Files changed:** `PreSurvey.jsx`, `server.js`

### What was missing
The server (`server.js` line 154) had this logic:
```js
preAttentionPass: b.attention != null ? b.attention === PRE_ATTENTION_EXPECTED : true,
```
Meaning: if `attention` is not sent, assume the check **passed**. But `PreSurvey.jsx` never sent an `attention` field. Result: `preAttentionPass` was `true` for every participant — the attention check was completely non-functional for the pre-survey.

The post-survey already had a working attention check item (asking participants to select 2). The pre-survey had none.

### What was done

**`PreSurvey.jsx`**:
- Added `attention: null` to form state.
- Added `attention: form.attention === null` to the `missing` object.
- Added `attention: form.attention` to the `submitPreSurvey(...)` call.
- Added a new **"Attention check"** JSX section at the bottom of the form (after all substantive questions, before the submit button) with the standard instructed-response item:
  - *"To show you are reading carefully, please select 6 for this statement."*
  - Rendered via the same `<Likert>` component used everywhere else.
  - `PRE_ATTENTION_EXPECTED` is `6` on the server, so "select 6" is the correct answer.

**`server.js`** (pre-survey endpoint):
- Moved `attention` to be explicitly validated via `isLikert(b.attention)` (required, 1–7).
- Changed `preAttentionPass` from the lenient optional-fallback to the hard `b.attention === PRE_ATTENTION_EXPECTED` check — consistent with how `postAttentionPass` works.

---

## Gap 9 — `analyze.py` Demo Data Missing Collected Fields

**File changed:** `analysis/analyze.py`

### What was missing
The `demo_export()` function generates synthetic participants for pipeline testing. It was missing several fields that `build_frames()` reads from the export, meaning running `python analyze.py --demo` would populate `None` into those columns and the `secondary()` analysis would silently skip them. This made the demo mode incomplete as a pipeline test.

Specific missing/static fields:
- `aiHasFeelings` was hardcoded to `3` (not randomized)
- `fairPriceGuess` was hardcoded to `400`
- `maxWillingToPay` was hardcoded to `450`
- `maxWarmth`, `maxUnderstood`, `believedLimit`, `realism` were entirely absent
- `sviOutcome`, `sviSelf`, `sviProcess`, `sviRelationship` (the subscale scores) were absent

### What was done
Updated the dict in `demo_export()`:
- Randomized `aiHasFeelings`, `fairPriceGuess`, `maxWillingToPay` using `RNG.integers()`/ranges that match realistic values.
- Added `maxWarmth`, `maxUnderstood`, `believedLimit`, `realism` as `int(RNG.integers(1, 8))`.
- Added `sviOutcome`, `sviSelf`, `sviProcess`, `sviRelationship` as `float(RNG.uniform(2, 6))`.

**Why this matters**: `python analyze.py --demo` is the fastest way to validate the analysis pipeline without real data. It should exercise every column `secondary()` and `regression()` reference. With these additions, the demo now fully populates all fields that will appear in real export data.

---

## Gap 11 — No Sample Size Target in README

**File changed:** `README.md`

### What was missing
The approach (§4) specifies: *"The target is 100–200 participants... detecting a moderate effect size (d ≈ 0.5) needs about 64 people per group."* The README had no mention of when to stop recruiting, what the target was, or the statistical basis for the target. Anyone running the study from the README alone would have no stop rule.

### What was done
Added a **"🎯 Sample Size & Recruitment Target"** section between the Study Design section and the Setup Guide section in `README.md` containing:
- A table with: design type, target N (128–200 total), per-arm target (64–100), effect size basis (d ≈ 0.5), power (80% at α = 0.05, two-tailed Welch t), and attrition buffer (+15%).
- A **Stop-rule** in bold: stop when both arms reach ≥ 64 completed sessions with attention checks passed.
- A **Pilot reminder**: run `node backend/pilot.js` to verify the LLM before collecting real data.

---

## Summary Table

| Gap | Description | Files Changed | Status |
|---|---|---|---|
| **2** | Pre-survey missing 5 covariates | `PreSurvey.jsx`, `server.js` | ✅ Fixed |
| **3** | Post-survey missing 3 outcome measures | `PostSurvey.jsx`, `server.js` | ✅ Fixed |
| **4** | No debrief page | `ThankYou.jsx` | ✅ Fixed |
| **5** | Consent placeholders + wrong AI name | `Consent.jsx` | ✅ Fixed |
| **6** | Pre-survey attention check non-functional | `PreSurvey.jsx`, `server.js` | ✅ Fixed |
| **9** | `analyze.py` demo missing new fields | `analyze.py` | ✅ Fixed |
| **11** | No sample size / stop-rule in README | `README.md` | ✅ Fixed |

> [!IMPORTANT] Before going live: replace `CONTACT` and `ETHICS_REF` in `Consent.jsx` with real values. These are the only remaining manual TODO items.
