import { TEMPLATES } from "./templates";
import type { FormData as AppFormData } from "@/types/forms";
import type { AIPipelineDetected, AIPipelineNormalized } from "@/lib/aiPipeline";

export const detectPrompt = (data: AppFormData) => `
You are an intelligent case classifier for SIR 2026 electoral appeal applications.

Your task is to analyze the applicant's details and comments, and detect all applicable case types.

---

🎯 Detect These Cases:

- MORE_THAN_6 → if family has more than 6 siblings
- PARENT_NAME_MISMATCH → if father's/mother's name differs (old vs current)
- SELF_NAME_MISMATCH → if applicant name differs (old vs current)
- AGE_GAP_VALID → if age gap (<15 or >50) is genuine
- AGE_GAP_INVALID → if age gap mentioned is incorrect

---

📌 Extract These Fields:

Return structured JSON:

{
  "cases": [],
  "dynamic": {
    "parentType": "father | mother | other",
    "parentOldName": "",
    "parentCurrentName": "",
    "selfOldName": "",
    "selfCurrentName": "",
    "total": 0,
    "brothers": 0,
    "sisters": 0,
    "position": 0,
    "ageGapType": "UNDER_15 | OVER_50 | NONE",
    "isAgeGapValid": true
  }
}

---

⚠️ Rules:

- Use only the information provided.
- If the value is not available, return null or an empty string.
- Do NOT provide explanations.

---

📥 Input:

Applicant Details:
${JSON.stringify(data.basicDetails)}

Applicant Comment:
${JSON.stringify(data.additionalFacts)}

Selected Cases:
${JSON.stringify(data.selectedCases)}

Dynamic Fields:
${JSON.stringify(data.dynamicFields)}

---

🎯 Output:

Return ONLY JSON.
`;

export const normalizePrompt = (
  detected: AIPipelineDetected,
  data: AppFormData
) => `
You are a legal data formatter.

Your job is to convert detected case data and applicant input into a clean structured format for legal drafting.

---

Input:

Detected:
${JSON.stringify(detected)}

Applicant:
${JSON.stringify(data.basicDetails)}

Applicant Comment:
${JSON.stringify(data.additionalFacts)}

---

Output JSON:

{
  "applicant": {
    "name": "",
    "age": "",
    "relation": "S/O or D/O",
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
    "brothersCount": number,
  "sistersCount": number,
  "birthPosition": number,
  "parentType": "",
  "parentDoB": "",
  "ageDifference": "",
  }
}

---

Rules:

- Convert into clean, readable values.
- Prepare short, ready-to-use legal phrases.
- Avoid explanations.
- Use detected values only.

Return only JSON.
`;

export const generatePrompt = (
  normalized: AIPipelineNormalized,
  data: AppFormData
) => `
You are a senior legal drafting assistant.

Generate a complete SIR 2026 appeal application.

---

Instructions:

- Merge all detected cases into ONE application.
- Use proper legal tone.
- Keep it clear and human-like.
- Avoid repetition.
- Do not hallucinate.
- Appeal application must be in 400 tokens
- Do NOT exceed 400 tokens
- one case one salution
- For a case or problem, there is only one salution -- no more than that
- If there is more than one problem, provide a salution for that problem -- nothing more.
- The appeal application should be strictly based on the detected cases and provided facts. Do not add any information that is not present in the input.

---

Must Include:

- Old vs Current name → "same and identical person"
- Family structure (if large)
- Age gap justification (if applicable)
- Clerical / legacy record explanation
- Strong but respectful tone

---

Input:

Structured Data:
${JSON.stringify(normalized)}

Applicant Comment:
${JSON.stringify(data.additionalFacts)}

District:
${JSON.stringify(data.basicDetails.district)}

Language:
"English"

---

Output:

Generate ONLY final application text.
Here is the format to follow:

${JSON.stringify(TEMPLATES.multiple_paternity_claims)}
`;
