# LLM Usage Guide (Project-Wide)

Short guide on how we use AI across this repo: prompts to keep, what to verify, how to correct, and when to avoid automation.

---

## 1) Where We Use LLMs
- **Documentation & support text**: Draft README/notes, onboarding steps, error copy.
- **Coding assistance**: Scaffolding components/routes, refactors, test suggestions.
- **UX helpers**: Heuristic “AI Summary” of reviews in ProductDetail (currently rule-based; can be swapped for real LLM).
- **Review workflows**: Brainstorm moderation rules, not to auto-approve/deny.

What we **don’t** automate: production decisions (moderation, payments), schema migrations, secrets handling.

---

## 2) Prompt Patterns to Keep Handy
- **Summarize reviews (UI label “AI-generated”)**
  ```
  Summarize these reviews into 3 bullet groups:
  - Pros:
  - Cons:
  - Common opinion:
  Keep it concise, neutral, English. Input: [{rating,title,body,source,verified_purchase}, ...]
  ```
- **Validation rules (Express)**
  ```
  Given this JSON schema, propose express-validator checks with messages; no business logic changes.
  ```
- **Refactor/explain code**
  ```
  Given this React/Express snippet, improve readability without changing behavior. List risks and test ideas.
  ```
- **Test ideas**
  ```
  Suggest key tests for this route/component. Return short list with inputs/expected outcomes.
  ```

Keep temperature low (~0.2) when determinism matters.

---

## 3) Verification & Corrections
- **Schema fit**: Validate model output before use (types, required fields). Reject/repair if missing.
- **Safety**: Strip PII/toxic text; label “AI-generated” in UI; never send secrets.
- **Idempotence**: Prefer deterministic prompts; cache by product/review checksum if calling real APIs.
- **Fallbacks**: On error or schema mismatch, fall back to heuristic summary or no-op.
- **Testing**: Add/adjust unit/integration tests for any AI-assisted change. Treat AI output as untrusted input.
- **Manual review**: Humans approve moderation, data deletion, payments, or schema changes.

---

## 4) Challenges & Mitigations
- **Hallucination/incorrect fields** → Validate against schema; display defaults; log rejects.
- **Tone/length drift** → Constrain format (bullets, max chars); low temperature.
- **Latency/cost** → Batch/collapse requests; cache; allow offline heuristic mode.
- **Privacy** → Redact PII; use env vars for keys; never commit secrets.
- **Version drift** → Store prompt templates in repo; note model/version in comments or docs.

---

## 5) Implementation Notes for This Project
- Current “AI Summary” is heuristic only. To switch to a real LLM:
  1) Add backend route `/api/ai/summary` that accepts `reviews[]`.
  2) Call provider with fixed prompt + low temperature.
  3) Validate response `{pros, cons, common}`; on failure, use heuristic.
  4) Cache per product + review checksum to limit calls.
  5) Surface “AI-generated (beta)” badge and timestamp in UI.
- Store keys in `.env` (`LLM_API_KEY` etc.). Rotate regularly.
- Avoid LLMs for MySQL migrations or irreversible admin actions.

---

## 6) Critical Reflection for Contributors
- **Did the AI change logic?** Re-read diffs; add tests for branches touched.
- **Is the prompt reproducible?** Save it alongside code/tests; document model/params.
- **Are outputs safe to show users?** Neutral tone, no PII, clear labeling.
- **Can we revert gracefully?** Keep fallbacks; avoid tight coupling to provider uptime.
- **Are we overusing AI?** Prefer simple rules/SQL/JS when clearer or faster.

---

## 7) Quick Checklist (before merge)
- Prompts committed or documented.
- Output validated (schema, safety); fallbacks in place.
- Tests updated/added; manual QA done for sensitive flows.
- No secrets in code; env vars documented.
- UI clearly labels AI-generated content where applicable.
