import { FormData, CaseType } from "@/types/forms";
import { buildTemplateData, injectTemplate } from "@/lib/template-utils";
import { TEMPLATES } from "@/lib/templates";

/**
 * Generates a single merged appeal document for multiple case types.
 * Each case generates its own body section; they are joined into one letter.
 */
export function generateMergedDocument(form: FormData): string {
  const { selectedCases, basicDetails } = form;

  if (selectedCases.length === 0) return "";

  if (selectedCases.length === 1) {
    // Single case — use the standard template directly
    const templateData = buildTemplateData(form);
    const template = TEMPLATES[selectedCases[0]];
    if (!template) throw new Error(`No template for ${selectedCases[0]}`);
    return injectTemplate(template, templateData);
  }

  // Multi-case: build a composite document
  const templateData = buildTemplateData(form);
  const { fullName, district, parentName, sonOrDaughter, age } = templateData;

  const caseLabels: Record<CaseType, string> = {
    MULTIPLE_PATERNITY: "Multiple Siblings / Large Family Linkage",
    SELF_NAME_MISMATCH: "Self Name Mismatch in Electoral Record",
    PARENT_NAME_MISMATCH: "Parent Name Mismatch in Record",
    AGE_GAP_GT_50: "Age Gap Clarification (>50 Years)",
    AGE_GAP_LT_15: "Age Gap Clarification (<15 Years)",
    GRANDPARENT_AGE_GAP_LT_40: "Grandparent Age Gap Clarification (<40 Years)",
    NOTICE_NOT_SERVED: "Notice Not Served Properly",
    NOTICE_INCOMPLETE: "Notice Incomplete",
  };

  // Extract the body paragraphs from each template (skip header/footer)
  function extractBody(caseType: CaseType): string {
    const raw = TEMPLATES[caseType];
    if (!raw) return "";

    const injected = injectTemplate(raw, templateData);
    const lines = injected.split("\n").map((l) => l.trim()).filter(Boolean);

    // Strip header (BEFORE THE…), subject line, and footer (Annexure / Submitted by)
    const bodyLines: string[] = [];
    let inBody = false;
    let inAnnexure = false;

    for (const line of lines) {
      if (line.startsWith("BEFORE THE") || line.startsWith("Sub:-") || line.startsWith("Sub:") || line.startsWith("[Sub:")) {
        inBody = true;
        continue;
      }
      if (!inBody) continue;

      if (line.toLowerCase().startsWith("annexure")) {
        inAnnexure = true;
        continue;
      }
      if (inAnnexure) continue;

      if (line.toLowerCase().startsWith("submitted by") || line.toLowerCase().startsWith("yours")) {
        break;
      }

      bodyLines.push(line);
    }

    return bodyLines.join("\n");
  }

  const caseSections = selectedCases
    .map((caseType, index) => {
      const label = caseLabels[caseType];
      const body = extractBody(caseType);
      return `GROUND ${index + 1}: ${label}\n\n${body}`;
    })
    .join("\n\n---\n\n");

  const annexureItems = [
    "Aadhaar Card",
    "Voter ID Card",
    "PAN Card",
    "Ration Card",
    "BLO Notice",
    "Hearing Notice",
    "2002 Voter List Extract",
  ];

  const annexureList = annexureItems.map((item, i) => `${i + 1}. ${item}`).join("\n");

  return `BEFORE THE LD. TRIBUNAL / APPELLATE COURT AT ${district || "[DISTRICT]"}

Sub:- Petition of Appeal against objections raised during SIR 2026 regarding multiple discrepancies

I, ${fullName}, Age ${age}, ${sonOrDaughter} ${parentName}, am a genuine and eligible voter currently registered in the Electoral Roll of ${district || "[District]"}, West Bengal.

I have received a notice from the Block Level Officer (BLO) raising objections against my electoral record under SIR 2026. I humbly submit this combined appeal addressing all objections raised, as detailed below.

${caseSections}

PRAYER

In view of the facts and circumstances mentioned above, I respectfully pray that this Hon'ble Tribunal may be pleased to:

1. Carefully examine all the documents annexed herewith;
2. Verify the facts through appropriate authority;
3. Reject the objections raised by the BLO and retain my name in the electoral roll;
4. Pass such other orders as this Hon'ble Court may deem fit and proper in the interest of justice.

Annexure:

${annexureList}

Submitted by
${fullName}`;
}