export const detectPrompt = (data: any) => `
You are an intelligent case classifier for SIR 2026 electoral appeal applications.

Your task is to analyze the applicant's details and comment, and detect all applicable case types.

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
"parentType": "father | mother",
"parentOldName": "",
"parentCurrentName": "",
"selfOldName": "",
"selfCurrentName": "",
"total": number,
"brothers": number,
"sisters": number,
"position": number,
"ageGapType": "UNDER_15 | OVER_50 | NONE",
"isAgeGapValid": true/false
}
}

---

⚠️ Rules:

- Do NOT guess. Use only provided info.
- If unsure → leave empty or null
- Do NOT explain anything

---

📥 Input:

Applicant Details:
${JSON.stringify(data.basicDetails)}

Applicant Comment:
${data.applicantComment}

---

🎯 Output:

Return ONLY JSON.
  `;

export const normalizePrompt = (detected: any, data: any) => `
You are a legal data formatter.

Your job is to convert detected case data and applicant input into a clean structured format for legal drafting.

---

Input:

Detected:
${JSON.stringify(detected)}

Applicant:
${JSON.stringify(data.basicDetails)}

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
"ageGapText": ""
}
}

---

Rules:

- Convert into clean readable values
- Prepare ready-to-use legal phrases (short)
- No explanation

Return only JSON.
`;

export const generatePrompt = (normalized: any, data: any) => `
You are a senior legal drafting assistant.

Generate a complete SIR 2026 appeal application.

---

Instructions:

- Merge all detected cases into ONE application
- Use proper legal tone
- Keep it clear and human-like
- No repetition
- No hallucination

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
${JSON.stringify(data.normalizedJson)}

Applicant Comment:
${JSON.stringify(data.applicantComment)}

District:
${JSON.stringify(data.district)}

Language:
${JSON.stringify(data.lang)}

---

Output:

Generate ONLY final application text.
`;