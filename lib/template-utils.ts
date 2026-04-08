import { FormData, DynamicFields, CaseType } from "@/types/forms";

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Map case types to their dynamic field keys
 */
const caseFieldMap: Record<CaseType, keyof DynamicFields | null> = {
  multiple_paternity_claims: 'multiplePaternityC',
  name_mismatch: 'nameMismatch',
  father_name_mismatch: 'nameMismatch',
  age_over_50: 'ageOver50',
  age_under_15: 'ageUnder15',
};

/**
 * Build complete template data from form data
 * Handles dynamic sonOrDaughter (S/O or D/O) based on gender
 * Handles dynamic parentType (father, mother, other)
 */
export function buildTemplateData(form: FormData): Record<string, any> {
  const { basicDetails, dynamicFields, selectedCases } = form;

  // Determine parent type from the first case's dynamic fields
  let parentType: 'father' | 'mother' = 'father';
  let currentCaseDynamicFields: any = null;

  if (selectedCases.length > 0) {
    const firstCase = selectedCases[0];
    const fieldKey = caseFieldMap[firstCase];

    if (fieldKey) {
      currentCaseDynamicFields = dynamicFields[fieldKey];
      if (currentCaseDynamicFields?.parentType) {
        parentType = currentCaseDynamicFields.parentType;
      }
    }
  }

  // Determine parent name based on parent type
  const parentName =
    parentType === 'mother' ? basicDetails.motherName : basicDetails.fatherName;

  // Calculate son or daughter based on gender
  const sonOrDaughter =
    basicDetails.gender?.toLowerCase() === 'female' ? 'D/O' : 'S/O';

  // Build the complete data object compatible with all templates
  return {
    // Basic information
    fullName: basicDetails.fullName,
    age: calculateAge(basicDetails.dateOfBirth),
    district: basicDetails.district,
    parentName,
    parentType,
    sonOrDaughter,

    // For name_mismatch case
    currentName: basicDetails.fullName,
    oldName: dynamicFields.nameMismatch?.nameOnSIR || '',
    nameOnDocument: dynamicFields.nameMismatch?.nameOnDocument || '',

    // For father_name_mismatch case
    parentCurrentName: parentName,
    parentOldName: dynamicFields.nameMismatch?.nameOnSIR || '',
    parentNewName: dynamicFields.nameMismatch?.nameOnDocument || '',

    // For family cases (multiple_paternity_claims, age_over_50, age_under_15)
    total:
      (currentCaseDynamicFields?.brothersCount || 0) +
      (currentCaseDynamicFields?.sistersCount || 0) +
      1 || 1,
    brothers: currentCaseDynamicFields?.brothersCount || 0,
    sisters: currentCaseDynamicFields?.sistersCount || 0,
    position: currentCaseDynamicFields?.birthPosition || 1,
  };
}

/**
 * Inject template with form data
 * Replaces all {{key}} placeholders with corresponding data values
 */
export function injectTemplate(template: string, data: any): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return data[trimmedKey] ?? '';
  });
}

/**
 * Generate complete document from case type and form data
 */
export function generateDocument(
  caseType: CaseType,
  form: FormData,
  TEMPLATES: Record<CaseType, string>
): string {
  const templateData = buildTemplateData(form);
  const template = TEMPLATES[caseType];

  if (!template) {
    throw new Error(`No template found for case type: ${caseType}`);
  }

  return injectTemplate(template, templateData);
}
