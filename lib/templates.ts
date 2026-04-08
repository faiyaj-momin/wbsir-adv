import { CaseType } from "@/types/forms";

export const TEMPLATES: Record<CaseType, string> = {
  multiple_paternity_claims: `
BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT [DISTRICT]

Sub:- Petition of Appeal against objection raised during SIR 2026 regarding family linkage

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} {{parentName}}, am an eligible voter.

I received a notice from the BLO stating that more than 6 persons are linked to the same parent, creating doubt regarding the correctness of my electoral record.

In this regard, I respectfully submit that the said observation is incorrect. We are a real and genuine family consisting of {{total}} siblings—{{brothers}} brothers and {{sisters}} sisters—all born to the same parent, namely {{parentName}}.

Large family structures are common in earlier times, particularly in rural areas, and this does not indicate any incorrect linkage.

I have been voting as per law and I possess valid documents establishing my identity and relationship.

Therefore, I humbly request that my name may not be deleted and the records may kindly be verified and corrected accordingly.

Annexure:

1. Aadhaar
2. Voter ID
3. PAN
4. Ration Card
5. BLO Notice
6. Hearing Notice
7. 2002 Voter List

Submitted by
{{fullName}}
  `,
  father_name_mismatch: `
BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT {{district}}

Sub:- Petition of Appeal against name mismatch in parental records

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} {{parentCurrentName}}, am an eligible voter.

I received a notice from the BLO regarding discrepancy in my {{parentType}}'s name between the SIR 2002 voter list and the current electoral record.

In this regard, I respectfully submit that my {{parentType}}'s name was recorded as "{{parentOldName}}" in the SIR 2002 voter list, whereas in the present electoral record the name is "{{parentCurrentName}}".

Both names refer to one and the same person and are identical in identity.

The variation has occurred due to spelling differences or clerical errors.

Therefore, I humbly request correction.

Submitted by  
{{fullName}}
`,
  name_mismatch: `
  BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT {{district}}

Sub:- Petition of Appeal against name mismatch in voter records

I, {{currentName}}, Age {{age}}, {{sonOrDaughter}} {{parentName}}, am an eligible voter.

I received a notice from the BLO stating that my name differs between the SIR 2002 voter list and the present electoral record.

In this regard, I respectfully submit that my name was recorded as "{{oldName}}" in the SIR 2002 voter list, whereas my correct and current name is "{{currentName}}".

I humbly submit that both the above-mentioned names refer to myself only and represent one and the same person, and there is no difference in identity.

The variation has occurred due to spelling differences, phonetic changes, or clerical errors in earlier electoral records.

It is further submitted that all my current official documents, including Aadhaar, PAN, and Voter ID, consistently reflect my correct and updated name "{{currentName}}", which is now in regular use.

Therefore, my present name may kindly be considered correct and the records may be updated accordingly.

I am a genuine voter and there is no doubt regarding my identity.

Hence, I humbly request necessary correction and continuation of my name in the electoral roll.

Annexure:

1. Aadhaar
2. Voter ID
3. PAN
4. Ration Card
5. BLO Notice
6. Hearing Notice
7. 2002 Voter List

Submitted by
{{currentName}}
`,

  age_over_50: `
  BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT {{district}}

[Sub:- Petition regarding age gap clarification]

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} {{parentName}}, am an eligible voter.

I received a notice from the BLO stating that there is a significant age gap (more than 50 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said age difference is genuine and factually correct.

We are a family of {{total}} siblings—{{brothers}} brothers and {{sisters}} sisters—and I am the {{position}} child. Due to extended family structure and large birth span, such age differences naturally occur.

It is also submitted that in earlier times, especially in rural and traditional Indian society, marriages often took place at a younger age, which contributes to such generational age gaps.

Therefore, this is not a case of wrong linkage, and my relationship is true and valid.

Hence, I humbly request that the records may kindly be verified and corrected accordingly.

Annexure:
[Same as above]

Submitted by
{{fullName}}
  `,
  age_under_15: `
  BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT {{district}}

[Sub:- Petition regarding age gap clarification]

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} {{parentName}}, am an eligible voter.

I received a notice from the BLO stating that there is a small age gap (less than 15 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said observation is genuine and factually correct.

Such situations may arise due to early marriages in earlier times, particularly in rural and traditional Indian society. Additionally, variations in record maintenance and delayed registrations may also contribute to perceived discrepancies.

Despite this, my relationship with my parent is genuine and supported by all my official documents.

Therefore, this does not indicate any wrong linkage.

Hence, I humbly request that the records may kindly be verified and corrected accordingly.

Annexure:
[Same as above]

Submitted by
{{fullName}}
  `,
};