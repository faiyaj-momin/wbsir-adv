import { CaseType } from "@/types/forms";

type TemplateKeys = CaseType | "MULTIPLE_PATERNITY_INVALID" | "SELF_NAME_MISMATCH_INVALID" | "PARENT_NAME_MISMATCH_INVALID" | "AGE_GAP_GT_50_INVALID" | "AGE_GAP_LT_15_INVALID" | "GRANDPARENT_AGE_GAP_LT_40_INVALID" | "GRANDPARENT_AGE_GAP_VALID";

export const TEMPLATES: Record<TemplateKeys, string> = {
  MULTIPLE_PATERNITY: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub: Petition of Appeal against deletion of name from Electoral Roll due to suspected incorrect family linkage

Respected Sir/Madam,

I, {{fullName}}, aged about {{age}} years, {{relationType}} of {{guardianName}}, resident of {{fullAddress}}, respectfully submit that:

1. My name has been wrongly deleted from the electoral roll.

2. The objection raised is that I have been linked as a son/daughter of a person who is also claimed as father by more than six persons, creating doubt.

3. This has occurred due to incorrect or mistaken linkage in the records.

4. I state that my father’s name is {{guardianName}}, and my family relationship is genuine and verifiable.

5. I have valid documents to prove my identity and correct family linkage beyond any doubt.

Under the above facts and circumstances, it is therefore most humbly prayed that the discrepancy may kindly be corrected and the name of the applicant be retained in the electoral roll.`,

  MULTIPLE_PATERNITY_INVALID: `
  BEFORE THE LEARNED TRIBUNAL / APPELLATE AUTHORITY
AT {{district}}

Sub: Petition of Appeal against deletion of name from Electoral Roll due to incorrect objection

Respected Sir/Madam,

I, {{fullName}}, aged about {{age}} years, {{relationType}} of {{guardianName}}, resident of {{fullAddress}}, respectfully submit that:

1. My name has been wrongly deleted from the electoral roll.

2. The objection raised is that more than six persons are linked to the same father, creating doubt regarding family linkage. However, this is incorrect.

3. In reality, we are only {{totalSiblings}} siblings, which is less than six, and therefore the objection is not applicable in my case.

4. My father’s name is {{guardianName}}, and my family relationship is genuine and verifiable.

5. I have valid documents to prove my identity and correct family linkage beyond any doubt.

Under the above facts and circumstances, it is therefore most humbly prayed that the discrepancy may kindly be corrected and the name of the applicant be retained in the electoral roll.`,
  PARENT_NAME_MISMATCH: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against discrepancy in parental name under SIR 2026

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentCurrentName}}, am a bona fide voter.

That I have received a notice regarding mismatch in my {{parentType}}'s name between earlier electoral records and the present voter list.

In this regard, I respectfully submit that my {{parentType}}'s name was recorded as "{{parentOldName}}" in earlier records, whereas in the current records it appears as "{{parentCurrentName}}".

It is submitted that both names refer to one and the same person and are identical in identity. The variation has occurred due to spelling differences, phonetic variations, or clerical errors in earlier records.

That the relationship between the applicant and the said {{parentType}} is genuine, valid, and supported by all official documents.

Therefore, the discrepancy is purely technical in nature and does not affect the identity or linkage of the applicant.

Under the above facts and circumstances, it is therefore most humbly prayed that the discrepancy may kindly be corrected and the name of the applicant be retained in the electoral roll.`,

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
Under the above facts and circumstances, it is therefore most humbly prayed that the discrepancy may kindly be corrected and my name be retained in the electoral roll.`,

  AGE_GAP_GT_50: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap clarification (Above 50 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a significant age gap (more than 50 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said age difference is genuine and factually correct.

The applicant belongs to a family consisting of {{total}} siblings, including {{brothers}} brothers and {{sisters}} sisters, and is the {{position}} child. Due to extended family structure and long birth span, such age differences naturally occur.

It is further submitted that in earlier times, particularly in rural and traditional societies, late parenthood and extended family structures were common.

Therefore, this is not a case of incorrect linkage, and the relationship is genuine and valid.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.`,

  AGE_GAP_LT_15: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap clarification (Below 15 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a small age gap (less than 15 years) between me and my {{parentType}}.

In this regard, I respectfully submit that the said observation is based on record interpretation and does not reflect the actual facts.

Such situations may arise due to early marriages prevalent in earlier times, particularly in rural and traditional societies. Additionally, inconsistencies in record maintenance and delayed registrations may contribute to such perceived discrepancies.

Despite this, the relationship between the applicant and the parent is genuine, valid, and supported by official documents.

Therefore, this does not indicate any incorrect linkage.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.`,

  GRANDPARENT_AGE_GAP_LT_40: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding grandparent age gap clarification (Below 40 years)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice stating that there is a small age gap (less than 40 years) between my {{grandparentType}} and myself.

In this regard, I respectfully submit that the said observation is based on record interpretation and does not reflect the actual facts.

Such situations may arise due to early marriages and extended family structures prevalent in earlier times, particularly in rural and traditional societies. Additionally, inconsistencies in record maintenance may contribute to such perceived discrepancies.

Despite this, the relationship between the applicant and the grandparent is genuine, valid, and supported by official documents.

Therefore, this does not indicate any incorrect linkage.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and the applicant's name be retained in the electoral roll.`,

  NOTICE_NOT_SERVED: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against deletion due to improper notice service

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received information that my name has been deleted from the electoral roll, however, I was not properly served with any notice regarding the same.

In this regard, I respectfully submit that the principles of natural justice require that any adverse action against a person must be preceded by proper notice and an opportunity to be heard.

It is submitted that no such notice was served to me, either personally or through proper channels, regarding any objection or proposed deletion.

Therefore, the deletion without proper notice is illegal and violates my right to fair hearing.

Under the above facts and circumstances, it is therefore most humbly prayed that the deletion may kindly be set aside and my name be restored in the electoral roll.`,

  NOTICE_INCOMPLETE: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against deletion due to incomplete notice

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I received a notice regarding deletion from the electoral roll, however, the said notice was incomplete and did not contain sufficient information.

In this regard, I respectfully submit that the notice did not specify the grounds for objection, the specific issues with my linkage, or the evidence relied upon.

It is submitted that an incomplete notice does not provide adequate opportunity to respond and prepare a proper defense.

Therefore, any action based on such incomplete notice is unsustainable in law.

Under the above facts and circumstances, it is therefore most humbly prayed that the deletion may kindly be set aside and my name be restored in the electoral roll with proper notice being served.`,

  SELF_NAME_MISMATCH_INVALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against discrepancy in applicant's name under SIR 2026

I, {{currentName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received an objection regarding alleged discrepancy in my name in the electoral records, however, this objection is invalid and baseless.

In this regard, I respectfully submit that {{isSamePerson}}. Both my old name "{{oldName}}" and current name "{{currentName}}" refer to myself only, without any actual difference in identity.

The variation has occurred due to spelling differences, phonetic variations, or clerical errors in legacy records, and does not indicate any change in the actual person.

It is further submitted that all my official documents, namely Aadhaar, PAN, Passport, and educational certificates consistently reflect my identity, and {{isSamePerson}}.

Therefore, there is no discrepancy that requires correction, and the objection should be rejected outright.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be rejected and my name be retained in the electoral roll.`,

  PARENT_NAME_MISMATCH_INVALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal against discrepancy in parental name under SIR 2026

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentCurrentName}}, am a bona fide voter.

That I have received an objection regarding alleged mismatch in my {{parentType}}'s name between earlier electoral records and the present voter list, however, this objection is invalid and baseless.

In this regard, I respectfully submit that {{isSamePerson}}. My {{parentType}}'s name recorded as "{{parentOldName}}" in earlier records and appearing as "{{parentCurrentName}}" in current records refer to one and the same person.

The variation has occurred due to spelling differences, phonetic variations, or clerical errors in legacy records, and does not indicate any actual change in the person's identity.

It is further submitted that {{isSamePerson}}, and all official documents related to my {{parentType}} consistently reflect the same person's identity.

Therefore, there is no actual mismatch, and the objection should be rejected outright. The discrepancy is purely technical in nature and does not affect the identity or linkage of the applicant.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be rejected and my name be retained in the electoral roll.`,

  AGE_GAP_GT_50_INVALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap objection (Above 50 years) - Invalid

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received an objection stating that there is a significant age gap (more than 50 years) between me and my {{parentType}}, however, this objection is invalid and not applicable.

In this regard, I respectfully submit that {{totalSiblings}}.

{{totalSiblings | case="less_than_6"}}, so the objection based on multiple paternity is not applicable in my case.

{{totalSiblings | case="gte_6"}}, and we are genuine siblings from the same parents, so the objection is baseless.

The applicant belongs to a family structure where {{position}} child relationship with {{parentName}} is genuine and verifiable. In earlier times, particularly in rural and traditional societies, late parenthood and extended family structures were common, leading to such age differences naturally.

Therefore, this is not a case of incorrect linkage or spurious relationship, and the objection should be rejected outright.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be rejected and my name be retained in the electoral roll.`,

  AGE_GAP_LT_15_INVALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding age gap objection (Below 15 years) - Invalid

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received an objection stating that there is a small age gap (less than 15 years) between me and my {{parentType}}, however, this objection is invalid and not applicable in my case.

In this regard, I respectfully submit that {{totalSiblings}}.

{{totalSiblings | case="less_than_6"}}, so the objection is not applicable in my case.

{{totalSiblings | case="gte_6"}}, and we are genuine siblings from the same parents, confirming the legitimacy of the family relationship.

Such situations naturally arise due to early marriages prevalent in earlier times, particularly in rural and traditional societies. Additionally, inconsistencies in record maintenance may contribute to such perceived discrepancies, but do not indicate incorrect linkage.

The relationship between the applicant and the parent is genuine, valid, and supported by all official documents.

Therefore, this is not a case of incorrect linkage or spurious relationship, and the objection should be rejected.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be rejected and my name be retained in the electoral roll.`,

  GRANDPARENT_AGE_GAP_LT_40_INVALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding grandparent age gap objection (Below 40 years) - Invalid

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received an objection stating that there is a small age gap (less than 40 years) between my {{grandparentType}} and myself, however, this objection is invalid and not applicable in my case.

In this regard, I respectfully submit that {{totalSiblings}}.

{{totalSiblings | case="less_than_6"}}, so the objection based on family structure is not applicable in my case.

{{totalSiblings | case="gte_6"}}, and we are genuine siblings from the same parents, confirming the legitimacy of the family relationship.

The relationship between the applicant and the grandparent is genuine, valid, and supported by all official documents. Such age gaps naturally occur due to early marriages and extended family structures prevalent in earlier times, particularly in rural and traditional societies.

Therefore, this is not a case of incorrect linkage or spurious relationship, and the objection should be rejected.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be rejected and my name be retained in the electoral roll.`,

  GRANDPARENT_AGE_GAP_VALID: `
BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT {{district}}

Sub:- Appeal regarding grandparent age gap clarification (Valid relationship)

I, {{fullName}}, Age {{age}}, {{sonOrDaughter}} of {{parentName}}, am a bona fide voter.

That I have received a notice regarding age gap between my {{grandparentType}} and myself. I respectfully submit that this relationship is genuine and valid.

In this regard, I respectfully submit that {{totalSiblings}}.

We are {{totalSiblings}} genuine siblings from the same parents, confirming the legitimacy and authenticity of our family structure and lineage.

The applicant belongs to a family where the relationship with {{grandparentName}} is genuine, verifiable, and supported by all official documents including birth certificates, ration cards, Aadhaar records, and other government documents.

Such age relationships naturally occur due to the family structure, and multiple generations of earlier marriages in rural and traditional societies. The relationship is legitimate and reflects the actual family composition.

Therefore, the relationship is genuine, valid, and should be accepted, and my name should be retained in the electoral roll.

Under the above facts and circumstances, it is therefore most humbly prayed that the objection may kindly be set aside and my name be retained in the electoral roll.`,
};