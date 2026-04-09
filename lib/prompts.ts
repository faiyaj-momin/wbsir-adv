import { TEMPLATES } from "./templates";
import type { FormData as AppFormData } from "@/types/forms";
import type { AIPipelineDetected, AIPipelineNormalized } from "@/lib/aiPipeline";

export const detectPrompt = (data: AppFormData) => `
You are an expert legal classifier for SIR 2026 electoral appeal cases based on ECI notices.

Your task is to detect ALL applicable cases from structured data and applicant statements.

---

🎯 UNDERSTAND ECI NOTICE PATTERNS

Map the following notice meanings to cases:

1. Age gap with GRANDPARENT < 40 → GRANDPARENT_AGE_GAP_LT_40
2. More than 6 people claiming same parent → MULTIPLE_PATERNITY
3. Age gap with parent > 50 → AGE_GAP_GT_50
4. Age gap with parent < 15 → AGE_GAP_LT_15
5. Name mismatch (parent/self) → PARENT_NAME_MISMATCH / SELF_NAME_MISMATCH

Additional conditions:
- If applicant says NO notice received → NOTICE_NOT_SERVED
- If notice received WITHOUT reason → NOTICE_INCOMPLETE

---

📌 MULTI-CASE RULE

- One applicant can have MULTIPLE cases
- Detect ALL applicable cases independently
- Do NOT stop after first match

---

📌 OUTPUT STRUCTURE

{
  "cases": [],
  "dynamic": {
    "parentType": "father | mother | grandfather | grandmother | null",
    "parentOldName": "",
    "parentCurrentName": "",
    "selfOldName": "",
    "selfCurrentName": "",
    "total": null,
    "brothers": null,
    "sisters": null,
    "position": null,
    "ageGapType": "UNDER_15 | OVER_50 | GRANDPARENT_LT_40 | NONE",
    "isAgeGapValid": null,
    "noticeStatus": "RECEIVED | NOT_SERVED | INCOMPLETE"
  }
}

---

⚠️ STRICT RULES

- Detect ONLY from given input
- Do NOT assume missing facts
- Comments have highest priority
- Selected cases are hints, not truth
- If unclear → return null

---

📥 INPUT

Applicant Details:
${JSON.stringify(data.basicDetails)}

Applicant Comment:
${JSON.stringify(data.additionalFacts)}

Selected Cases:
${JSON.stringify(data.selectedCases)}

Dynamic Fields:
${JSON.stringify(data.dynamicFields)}

---

🎯 OUTPUT

Return ONLY valid JSON
`;

export const normalizePrompt = (
  detected: AIPipelineDetected,
  data: AppFormData
) => `
You are a legal data formatter for electoral appeal drafting.

Convert detected data into structured legal facts.

---

🎯 OBJECTIVE

- Normalize all fields
- Generate short legal-ready statements
- Prepare drafting-ready content

---

📥 INPUT

Detected:
${JSON.stringify(detected)}

Applicant:
${JSON.stringify(data.basicDetails)}

Comment:
${JSON.stringify(data.additionalFacts)}

---

📤 OUTPUT

{
  "applicant": {
    "name": "",
    "age": "",
    "relation": "S/O | D/O | W/O | null",
    "parentName": ""
  },
  "cases": [],
  "facts": {
    "parentOldName": "",
    "parentCurrentName": "",
    "selfOldName": "",
    "selfCurrentName": "",
    "familyText": "",
    "ageGapText": "",
    "noticeText": "",
    "brothersCount": null,
    "sistersCount": null,
    "birthPosition": null,
    "parentType": ""
  }
}

---

🧠 NORMALIZATION RULES

- familyText:
  → "The applicant belongs to a family consisting of X siblings"

- ageGapText:
  → GT_50 → "due to extended family span and late parenthood"
  → LT_15 → "due to early marriage and legacy record variations"
  → GRANDPARENT_LT_40 → "incorrect generational linkage in records"

- noticeText:
  → NOT_SERVED → "no notice was properly served"
  → INCOMPLETE → "notice did not specify any reason"
  → RECEIVED → ""

- Name mismatch:
  → "same and identical person"

---

⚠️ RULES

- No new facts
- No explanations
- Keep it legally usable
- Keep it short

---

🎯 OUTPUT

Return ONLY JSON
`;

export const generatePrompt = (
  normalized: AIPipelineNormalized,
  data: AppFormData
) => `
You are a senior legal drafting expert for SIR 2026 appeals.

Generate ONE complete appeal covering ALL detected issues.

---

🎯 CORE RULES

- Max 350 tokens (STRICT)
- No hallucination
- Use only given data
- Clear, simple, legal tone, simple languege and words
- No repetition
- Ordinary people can understand it easily.
- Follow the structure and style guide strictly
- Do NOT add any new information or assumptions
- If notice issues exist, address them first before case explanations
- For multiple cases, create a cohesive narrative linking them together
- So that someone with limited English proficiency can easily understand it.
---

⚖️ CASE HANDLING

Handle each case separately:

- MULTIPLE_PATERNITY → explain large family
- AGE_GAP_GT_50 → justify late parenthood
- AGE_GAP_LT_15 → justify early marriage / record issues
- GRANDPARENT_AGE_GAP_LT_40 → state incorrect linkage
- NAME_MISMATCH → "same and identical person"
- NOTICE_NOT_SERVED → highlight procedural lapse
- NOTICE_INCOMPLETE → highlight lack of reason

---

📌 SPECIAL RULE (IMPORTANT)

If notice issue exists:
→ Add separate paragraph before case explanations

---

📌 STRUCTURE

1. Introduction
2. Notice issue (if any)
3. Case-wise explanation (one by one)
4. Final declaration

---

📥 INPUT

Structured:
${JSON.stringify(normalized)}

Comment:
${JSON.stringify(data.additionalFacts)}

District:
${JSON.stringify(data.basicDetails.district)}

---

A Logical Discrepancy Notice looks like this; several sample notices are provided below.
1. The age difference between you and your grandfather or grandmother, whose details were used to link you to the voters' list of the previous SIR, is less than 40 years, which is likely due to mis-linking.
2. You have been added as the son/daughter of someone who is also claimed as the father by six other people, which is a possible false connection.
3. The age difference between you and your parent, whose details were used to link you to the voter list in the previous SIR, is more than 50 years, which is likely due to mis-linking.
4. The age difference between you and your parent, whose details were used to link you to the voter list of the previous SIR, is less than 15 years, which is likely due to mis-linking.
5. There's a mismatch in the father's or own name provided in the previous SR with what's linked to the voter list. This mismatch is likely due to an incorrect linkage.
- However, some individuals were not served with a notice by the BLO, while others received incomplete notices in which no reason was specified.
- Generally, an individual receives only one case. However, in certain instances, an individual may receive more than one case.
Generally, an individual receives only one case. However, in certain instances, an individual may receive more than one case.

---

📤 OUTPUT

Generate ONLY final appeal text.

---

📌 STYLE GUIDE

- "I respectfully submit"
- "It is stated that"
- "same and identical person"
- "clerical / legacy record error"
- "genuine and valid relationship"

---

Use this template tone as reference:
${JSON.stringify(Object.values(TEMPLATES).join("\n\n\n\n"))}
`;