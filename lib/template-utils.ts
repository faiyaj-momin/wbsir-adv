import { FormData, DynamicFields, CaseType } from "@/types/forms";
import { generateMergedDocument } from "./merge-documents";

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
  MULTIPLE_PATERNITY: 'multiplePaternity',
  SELF_NAME_MISMATCH: 'selfNameMismatch',
  PARENT_NAME_MISMATCH: 'parentNameMismatch',
  AGE_GAP_GT_50: 'ageGapGt50',
  AGE_GAP_LT_15: 'ageGapLt15',
  GRANDPARENT_AGE_GAP_LT_40: 'grandparentAgeGapLt40',
  NOTICE_NOT_SERVED: null,
  NOTICE_INCOMPLETE: null,
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

    // For SELF_NAME_MISMATCH case
    currentName: basicDetails.fullName,
    oldName: dynamicFields.selfNameMismatch?.nameOnSIR || '',
    nameOnDocument: dynamicFields.selfNameMismatch?.nameOnDocument || '',

    // For PARENT_NAME_MISMATCH case
    parentCurrentName: parentName,
    parentOldName: dynamicFields.parentNameMismatch?.parentNameOnSIR || '',
    parentNewName: dynamicFields.parentNameMismatch?.parentNameOnDocument || '',

    // For family cases (MULTIPLE_PATERNITY, AGE_GAP_GT_50, AGE_GAP_LT_15, GRANDPARENT_AGE_GAP_LT_40)
    total:
      (currentCaseDynamicFields?.brothersCount || 0) +
      (currentCaseDynamicFields?.sistersCount || 0),
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
 * Check if Gemini API key is available
 */
export function hasGeminiApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Generate appeal using Gemini AI
 */
export async function generateAppealWithGemini(formData: FormData): Promise<string> {
  // Placeholder for Gemini integration
  // In the future, this will use Google's Gemini API
  // For now, return the merged document
  return generateMergedDocument(formData);
}

/**
 * Download PDF from HTML element
 */
export async function downloadPDF(elementId: string, options: any = {}): Promise<void> {
  // Placeholder for PDF generation
  // In the future, this will use a PDF library like jsPDF or html2pdf
  console.log('PDF download not implemented yet', elementId, options);
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
