import { CaseType } from "@/types/forms";

export const TEMPLATES: Record<CaseType, string> = {
  MULTIPLE_PATERNITY: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against objection regarding multiple linkage under SIR 2026

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide and eligible voter.

That I have received a notice from the BLO alleging that more than six persons are linked to the same parent, thereby raising doubt regarding my electoral linkage.

In this regard, I most respectfully submit that the said observation is erroneous and not based on the actual family structure. The applicant belongs to a genuine family consisting of {{total}} siblings, namely {{brothers}} brothers and {{sisters}} sisters, all born to the same parent {{parentName}}.

It is further submitted that large family structures were common in earlier times, especially in rural and traditional societies, and such circumstances cannot be treated as a ground for suspecting incorrect linkage.

That the applicant has been exercising voting rights lawfully and possesses valid documentary proof establishing identity and family relationship.

Therefore, the objection raised is not sustainable in law or on facts.

Under the above facts and circumstances, it is therefore most humbly prayed that your honour may be pleased to allow this appeal, set aside the objection, and ensure that the name of the applicant is not deleted from the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  PARENT_NAME_MISMATCH: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against discrepancy in parental name under SIR 2026

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentCurrentName}}, am a bona fide voter.

That I have received a notice regarding mismatch in my {{parentType}}'s name between earlier electoral records and the present voter list.

In this regard, I respectfully submit that my {{parentType}}'s name was recorded as "{{parentOldName}}" in earlier records, whereas in the current records it appears as "{{parentCurrentName}}".

It is submitted that both names refer to one and the same person and are identical in identity. The variation has occurred due to spelling differences, phonetic variations, or clerical errors in earlier records.

That the relationship between the applicant and the said {{parentType}} is genuine, valid, and supported by all official documents.

Therefore, the discrepancy is purely technical in nature and does not affect the identity or linkage of the applicant.

Under the above facts and circumstances, it is therefore most humbly prayed that the discrepancy may kindly be corrected and the name of the applicant be retained in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  SELF_NAME_MISMATCH: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against discrepancy in applicant's name under SIR 2026

I, {{currentName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that my name differs between earlier electoral records and the present voter list.

In this regard, I respectfully submit that my name was recorded as "{{oldName}}" in earlier records, whereas my correct and current name is "{{currentName}}".

I humbly submit that both names refer to myself only and represent one and the same person, without any difference in identity.

The variation has occurred due to spelling differences, phonetic changes, or clerical errors in legacy records.

It is further submitted that all my current official documents consistently reflect my correct name "{{currentName}}", which is in regular use.

Therefore, the discrepancy is purely technical and does not affect my identity or eligibility as a voter.

Under the above facts and circumstances, it is therefore most humbly prayed that necessary correction may kindly be made and my name be continued in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  AGE_GAP_GT_50: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap clarification (Above 50 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a significant age gap (more than 50 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said age difference is genuine and factually correct.

The applicant belongs to a family consisting of {{total}} siblings, including {{brothers}} brothers and {{sisters}} sisters, and is the {{position}} child. Due to extended family structure and long birth span, such age differences naturally occur.

It is further submitted that in earlier times, particularly in rural and traditional societies, late parenthood and extended family structures were common.

Therefore, this is not a case of incorrect linkage, and the relationship is genuine and valid.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  AGE_GAP_LT_15: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap clarification (Below 15 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a small age gap (less than 15 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said observation is based on record interpretation and does not reflect the actual facts.

Such situations may arise due to early marriages prevalent in earlier times, particularly in rural and traditional societies. Additionally, inconsistencies in record maintenance and delayed registrations may contribute to such perceived discrepancies.

Despite this, the relationship between the applicant and the parent is genuine, valid, and supported by official documents.

Therefore, this does not indicate any incorrect linkage.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  GRANDPARENT_AGE_GAP_LT_40: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding grandparent age gap clarification (Below 40 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a small age gap (less than 40 years) between my {{grandparentType}} and myself.

In this regard, I respectfully submit that the said observation is based on record interpretation and does not reflect the actual facts.

Such situations may arise due to early marriages and extended family structures prevalent in earlier times, particularly in rural and traditional societies. Additionally, inconsistencies in record maintenance may contribute to such perceived discrepancies.

Despite this, the relationship between the applicant and the grandparent is genuine, valid, and supported by official documents.

Therefore, this does not indicate any incorrect linkage.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. BLO Notice  
6. Hearing Notice  
7. Relevant Voter List Records  
`,

  NOTICE_NOT_SERVED: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against deletion due to improper notice service

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received information that my name has been deleted from the electoral roll, however, I was not properly served with any notice regarding the same.

In this regard, I respectfully submit that the principles of natural justice require that any adverse action against a person must be preceded by proper notice and an opportunity to be heard.

It is submitted that no such notice was served to me, either personally or through proper channels, regarding any objection or proposed deletion.

Therefore, the deletion without proper notice is illegal and violates my right to fair hearing.

Under the above facts and circumstances, it is therefore most humbly prayed that the deletion may kindly be set aside and my name be restored in the electoral roll.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. Any Communication Received  
6. Relevant Voter List Records  
`,

  NOTICE_INCOMPLETE: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against deletion due to incomplete notice

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I received a notice regarding deletion from the electoral roll, however, the said notice was incomplete and did not contain sufficient information.

In this regard, I respectfully submit that the notice did not specify the grounds for objection, the specific issues with my linkage, or the evidence relied upon.

It is submitted that an incomplete notice does not provide adequate opportunity to respond and prepare a proper defense.

Therefore, any action based on such incomplete notice is unsustainable in law.

Under the above facts and circumstances, it is therefore most humbly prayed that the deletion may kindly be set aside and my name be restored in the electoral roll with proper notice being served.

Under the above facts and Circumstances you may pleased to allow my petition from deletion to restore my name in the electoral roll as I can give the vote in The year 2026 as per election Commission rules as you deemed fit just and proper for the ends of Social justice.

Annexure:
1. Aadhaar Card  
2. Voter ID Card  
3. PAN Card  
4. Ration Card  
5. Notice Received  
6. Relevant Voter List Records  
`,
};