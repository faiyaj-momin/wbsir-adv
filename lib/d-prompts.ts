import { TEMPLATES } from "./templates";
import type { FormData as AppFormData } from "@/types/forms";
import type { AIPipelineDetected, AIPipelineNormalized } from "@/lib/aiPipeline";

export const detectPrompt = (data: AppFormData) => `
  <role>
  Expert Legal Classification Agent for SIR 2026 Electoral Appeals
  </role>

  <task>
  Analyze structured applicant data and free - text statements to detect ALL applicable legal case types for Election Commission of India(ECI) tribunal appeals.Generate a deterministic JSON output containing detected cases and extracted dynamic fields.
</task>

  < reasoning_effort > medium </reasoning_effort>

  < classification_rules >
  <rule>
  <trigger>Grandparent age gap < 40 years </trigger>
    <case> GRANDPARENT_AGE_GAP_LT_40 </case>
      < evidence_required > Applicant mentions age gap with grandfather / grandmother OR notice code indicates grandparent age discrepancy </evidence_required>
        </rule>

        < rule >
        <trigger>Multiple paternity / maternity linkage </trigger>
          <case> MULTIPLE_PATERNITY </case>
            < evidence_required > More than 6 persons linked to same parent OR applicant mentions large family structure with 7 + siblings </evidence_required>
            </rule>

            < rule >
            <trigger>Parental age gap > 50 years </trigger>
              <case> AGE_GAP_GT_50 </case>
                < evidence_required > Significant age difference with parent(> 50 years) OR applicant mentions being youngest / eldest in large family span </evidence_required>
                  </rule>

                  < rule >
                  <trigger>Parental age gap < 15 years </trigger>
                    <case> AGE_GAP_LT_15 </case>
                      < evidence_required > Age gap with parent under 15 years OR mentions early marriage context </evidence_required>
                        </rule>

                        < rule >
                        <trigger>Parent name discrepancy </trigger>
                          <case> PARENT_NAME_MISMATCH </case>
                            < evidence_required > Difference between parent name in old records vs current records(spelling / phonetic variations) </evidence_required>
                              </rule>

                              < rule >
                              <trigger>Self name discrepancy </trigger>
                                <case> SELF_NAME_MISMATCH </case>
                                  < evidence_required > Applicant name varies between electoral records(oldName vs currentName) </evidence_required>
                                    </rule>

                                    < rule >
                                    <trigger>Procedural defect - No notice </trigger>
                                      <case> NOTICE_NOT_SERVED </case>
                                        < evidence_required > Applicant explicitly states NO notice received OR mentions discovering deletion without prior intimation </evidence_required>
                                          < priority > Highest(overrides other cases if procedural violation claimed)</priority>
                                            </rule>

                                            < rule >
                                            <trigger>Procedural defect - Incomplete notice </trigger>
                                              <case> NOTICE_INCOMPLETE </case>
                                                < evidence_required > Notice received but lacks grounds, specific issues, or evidence relied upon </evidence_required>
                                                  </rule>
                                                  </classification_rules>

                                                  <reasoning_steps>
1. < analyze_inputs >
  - Parse basicDetails for objective facts(names, ages, relationships)
    - Parse additionalFacts(applicant comments) for subjective claims and context
      - Review selectedCases as hints only, not ground truth
        - Identify explicit mentions of notice receipt, grounds, or defects
          </analyze_inputs>

2. < detect_cases >
  - Apply ALL classification rules independently
    - Do NOT stop after first match; accumulate all applicable cases
      - If applicant comments contradict selectedCases, prioritize comments
        - Flag NOTICE_NOT_SERVED if applicant denies receiving notice regardless of other patterns
          </detect_cases>

3. < extract_dynamic_fields >
  - parentType: Identify father / mother / grandfather / grandmother from context
    - parentOldName / parentCurrentName: Extract if name discrepancy mentioned
      - selfOldName / selfCurrentName: Extract for SELF_NAME_MISMATCH
        - total / brothers / sisters: Extract family composition for MULTIPLE_PATERNITY or AGE_GAP_GT_50
          - position: Determine birth order(youngest / eldest / middle) if extended family mentioned
            - ageGapType: Categorize as UNDER_15, OVER_50, GRANDPARENT_LT_40, or NONE
              - isAgeGapValid: Boolean if applicant justifies the gap as genuine
                - noticeStatus: Classify as RECEIVED, NOT_SERVED, or INCOMPLETE based on applicant statement
                  </extract_dynamic_fields>

4. < validate_dependencies >
  - If MULTIPLE_PATERNITY detected: ensure total, brothers, sisters populated
    - If AGE_GAP_GT_50 detected: ensure position and ageGapType populated
      - If PARENT_NAME_MISMATCH detected: ensure parentType and name variants populated
        - If NOTICE_NOT_SERVED: ignore other notice - based contradictions
          </validate_dependencies>
          </reasoning_steps>

          < output_contract >
          <format>Valid JSON object only </format>
            <schema>
{
  "cases": ["CaseType enum values"], // Array of 1-8 strings from: MULTIPLE_PATERNITY, PARENT_NAME_MISMATCH, SELF_NAME_MISMATCH, AGE_GAP_GT_50, AGE_GAP_LT_15, GRANDPARENT_AGE_GAP_LT_40, NOTICE_NOT_SERVED, NOTICE_INCOMPLETE
    "dynamic": {
    "parentType": "father | mother | grandfather | grandmother | null",
      "parentOldName": "string (if mismatch claimed)",
        "parentCurrentName": "string (if mismatch claimed)",
          "selfOldName": "string (if self mismatch)",
            "selfCurrentName": "string (if self mismatch)",
              "total": "number | null (total siblings)",
                "brothers": "number | null",
                  "sisters": "number | null",
                    "position": "string | null (birth order)",
                      "ageGapType": "UNDER_15 | OVER_50 | GRANDPARENT_LT_40 | NONE",
                        "isAgeGapValid": "boolean | null",
                          "noticeStatus": "RECEIVED | NOT_SERVED | INCOMPLETE"
  }
}
</schema>
  < constraints >
  - Output ONLY the JSON object
    - No markdown fences, no commentary, no preamble
      - Ensure valid JSON syntax(no trailing commas)
        - Null values allowed for optional fields; omit only if schema permits
          - Cases array must contain unique values(no duplicates)
            </constraints>
            </output_contract>

            < grounding_rules >
            - Base classification ONLY on provided input data(basicDetails, additionalFacts, dynamicFields)
              - Do NOT infer facts not stated in applicant comments
                - Do NOT hallucinate names, ages, or family structures
                  - If information insufficient to confirm a case, exclude it from cases array
                    - selectedCases are advisory hints; verify against actual applicant statements
                      - If ambiguity exists between two case types, prefer the one with explicit textual support
                        </grounding_rules>

                        <verification_loop>
  Before outputting JSON:
1. Verify all detected cases have supporting evidence in input
2. Check that dynamic fields align with detected cases(e.g., name fields present if mismatch case detected)
3. Ensure cases array is not empty if selectedCases provided hints(re - analyze if empty)
  4. Validate JSON structure: proper quotes, commas, brackets
5. Confirm no explanatory text outside JSON object
  </verification_loop>

  < completeness_contract >
  - Treat task incomplete if cases array empty AND selectedCases non - empty(re - analyze)
    - All applicable cases must be detected; partial classification is failure
      - If applicant mentions multiple distinct issues(e.g., name mismatch AND age gap), include ALL relevant case types
        - Dynamic fields must be extracted if explicitly stated in additionalFacts
          </completeness_contract>

          < input_context >
          <basicDetails>
          ${JSON.stringify(data.basicDetails)}
</basicDetails>

  <applicant_comments>
    ${JSON.stringify(data.additionalFacts)}
</applicant_comments>

  <selected_hints>
    ${JSON.stringify(data.selectedCases)}
</selected_hints>

  <existing_dynamic>
    ${JSON.stringify(data.dynamicFields)}
</existing_dynamic>
  </input_context>

  <execution>
  Execute reasoning steps and output ONLY the JSON result.
</execution>
    `;


export const normalizePrompt = (
  detected: AIPipelineDetected,
  data: AppFormData
) => `
<role>
  Legal Data Normalization Agent for Electoral Appeal Preparation
</role>

<task>
  Transform AI-detected case classifications and raw applicant data into structured, legally-formatted facts ready for direct insertion into SIR 2026 tribunal appeal templates. Normalize field values, generate concise legal statements, and ensure drafting-ready output.
</task>

<reasoning_effort>low</reasoning_effort>

<input_contract>
  <detected>
    AI classification output containing:
    - cases: Array of detected CaseType enums
    - dynamic: Extracted contextual fields (parent names, age gaps, family structure, notice status)
    ${JSON.stringify(detected)}
  </detected>
  
  <applicant_core>
    Basic biographical data:
    ${JSON.stringify(data.basicDetails)}
  </applicant_core>
  
  <applicant_narrative>
    Free-text statements from applicant:
    ${JSON.stringify(data.additionalFacts)}
  </applicant_narrative>
</input_contract>

<normalization_rules>
  <applicant_block>
    <field>name</field>
    <source>data.basicDetails.fullName OR detected.dynamic.selfCurrentName</source>
    <transform>Title case, remove extra spaces, standardize spelling if obvious variation</transform>
    
    <field>age</field>
    <source>data.basicDetails.age</source>
    <transform>Numeric only, validate 18-120 range</transform>
    
    <field>relation</field>
    <source>data.basicDetails.relation OR detected.dynamic.parentType + gender inference</source>
    <transform>Map to legal abbreviations: S/O (Son of), D/O (Daughter of), W/O (Wife of), H/O (Husband of)</transform>
    <constraint>Must match parentType; if parentType is mother and applicant male → S/O</constraint>
    
    <field>parentName</field>
    <source>detected.dynamic.parentCurrentName OR data.basicDetails.parentName</source>
    <transform>Title case, use current/corrected name for legal documents</transform>
  </applicant_block>

  <facts_block>
    <field>parentOldName</field>
    <condition>CaseType.PARENT_NAME_MISMATCH in detected.cases</condition>
    <transform>Title case, preserve exact spelling from records</transform>
    <fallback>null if not applicable</fallback>
    
    <field>parentCurrentName</field>
    <condition>CaseType.PARENT_NAME_MISMATCH in detected.cases</condition>
    <transform>Title case, ensure distinct from parentOldName</transform>
    <fallback>null if not applicable</fallback>
    
    <field>selfOldName</field>
    <condition>CaseType.SELF_NAME_MISMATCH in detected.cases</condition>
    <transform>Title case, preserve legacy record spelling</transform>
    <fallback>null if not applicable</fallback>
    
    <field>selfCurrentName</field>
    <condition>CaseType.SELF_NAME_MISMATCH in detected.cases</condition>
    <transform>Title case, ensure distinct from selfOldName</transform>
    <fallback>null if not applicable</fallback>
    
    <field>familyText</field>
    <condition>CaseType.MULTIPLE_PATERNITY OR CaseType.AGE_GAP_GT_50 in detected.cases</condition>
    <template>The applicant belongs to a family consisting of {{total}} siblings, namely {{brothers}} brothers and {{sisters}} sisters</template>
    <transform>Inject detected.dynamic.total, brothers, sisters; if any null, omit specific counts and use "a large family"</transform>
    <constraint>Maximum 25 words</constraint>
    
    <field>ageGapText</field>
    <condition>Any age gap case detected</condition>
    <mapping>
      <case>AGE_GAP_GT_50</case>
      <text>due to extended family structure and long birth span, such age differences naturally occur in genuine family structures</text>
      
      <case>AGE_GAP_LT_15</case>
      <text>due to early marriages prevalent in earlier times, particularly in rural and traditional societies</text>
      
      <case>GRANDPARENT_AGE_GAP_LT_40</case>
      <text>due to early marriages and extended family structures prevalent in earlier times, particularly in rural and traditional societies</text>
    </mapping>
    <constraint>Exact phrase match required for legal consistency</constraint>
    
    <field>noticeText</field>
    <condition>Procedural case detected</condition>
    <mapping>
      <case>NOTICE_NOT_SERVED</case>
      <text>no such notice was served to me, either personally or through proper channels</text>
      
      <case>NOTICE_INCOMPLETE</case>
      <text>the notice did not specify the grounds for objection, the specific issues with my linkage, or the evidence relied upon</text>
      
      <case>RECEIVED</case>
      <text>null</text>
    </mapping>
    
    <field>brothersCount</field>
    <source>detected.dynamic.brothers</source>
    <transform>Integer or null</transform>
    
    <field>sistersCount</field>
    <source>detected.dynamic.sisters</source>
    <transform>Integer or null</transform>
    
    <field>birthPosition</field>
    <source>detected.dynamic.position</source>
    <transform>Standardize to: youngest, eldest, oldest, middle, or ordinal (first, second, etc.)</transform>
    
    <field>parentType</field>
    <source>detected.dynamic.parentType</source>
    <transform>father, mother, grandfather, or grandmother</transform>
  </facts_block>

  <cases_array>
    <transform>Pass through detected.cases unchanged</transform>
    <constraint>Preserve exact CaseType enum values for downstream template selection</constraint>
  </cases_array>
</normalization_rules>

<legal_style_controls>
  <register>Formal legal English, tribunal-appropriate</register>
  <verbosity>Concise, information-dense</verbosity>
  <formatting>No markdown, no bullets within text fields</formatting>
  <phrasing>
    - Use "applicant" not "I" in generated statements
    - Use "bona fide" where appropriate
    - Preserve required legal formulas exactly as specified in normalization rules
    - Name mismatches: include phrase "one and the same person" or "identical in identity"
  </phrasing>
</legal_style_controls>

<output_contract>
  <format>Valid JSON object only</format>
  <schema>
    {
      "applicant": {
        "name": "string (normalized full name)",
        "age": "string (numeric)",
        "relation": "S/O | D/O | W/O | H/O | null",
        "parentName": "string (current/corrected parent name)"
      },
      "cases": ["CaseType enum values"], // Preserved from input
      "facts": {
        "parentOldName": "string | null",
        "parentCurrentName": "string | null",
        "selfOldName": "string | null",
        "selfCurrentName": "string | null",
        "familyText": "string (legal statement) | null",
        "ageGapText": "string (legal justification) | null",
        "noticeText": "string (procedural defect) | null",
        "brothersCount": "number | null",
        "sistersCount": "number | null",
        "birthPosition": "string | null",
        "parentType": "father | mother | grandfather | grandmother | null"
      }
    }
  </schema>
  <constraints>
    - Output ONLY the JSON object
    - No markdown code fences, no commentary, no preamble
    - All string values trimmed (no leading/trailing whitespace)
    - Null values explicitly included for unused fields (do not omit keys)
    - Arrays and objects properly formatted with no trailing commas
    - Text fields maximum 150 characters unless familyText exception (250 chars)
  </constraints>
</output_contract>

<grounding_rules>
  - Derive ALL output values strictly from provided detected and data inputs
  - Do NOT invent facts not present in source data
  - Do NOT correct spelling unless obvious typographic error (e.g., "fahter" → "father")
  - If detected.cases contains case type but dynamic fields incomplete, use fallback language or null
  - Preserve applicant's stated narrative; do not embellish beyond legal phrasing templates
  - If conflict between detected.dynamic and data.basicDetails, prefer detected (AI-extracted) values
</grounding_rules>

<verification_loop>
  Before finalizing JSON:
  1. Verify applicant.name matches selfCurrentName if SELF_NAME_MISMATCH case present
  2. Verify applicant.parentName matches parentCurrentName if PARENT_NAME_MISMATCH case present
  3. Check familyText contains numeric counts if brothers/sisters values available
  4. Confirm ageGapText matches exactly one of the three canonical phrases per case type
  5. Ensure noticeText null if no procedural cases detected, exact phrase if detected
  6. Validate relation field aligns with parentType and applicant gender (if inferable)
  7. Check JSON syntax: balanced braces, proper quotes, no trailing commas
</verification_loop>

<completeness_contract>
  - All schema fields must be present in output (no omitted keys)
  - cases array must not be empty if detected.cases provided
  - applicant block must be fully populated with non-null values where source data exists
  - facts block must populate fields relevant to detected cases, null others
  - If normalization results in empty or invalid values, use explicit null rather than empty string
</completeness_contract>

<execution>
  Apply normalization rules to input data and output ONLY the structured JSON result.
</execution>
`;

export const generatePrompt = (
  normalized: AIPipelineNormalized,
  data: AppFormData
) => `
  <role>
  Senior Legal Drafting Agent for SIR 2026 Electoral Appeals
  </role>

  <task>
  Generate a single, cohesive legal appeal document addressing ALL detected case issues for submission to the Tribunal / Appellate Authority.Synthesize multiple grounds into one comprehensive petition suitable for applicants with basic English proficiency.
</task>

  < reasoning_effort > medium </reasoning_effort>

  < input_contract >
  <normalized_data>
  Structured legal facts and detected cases:
    ${JSON.stringify(normalized)}

Contains:
- applicant: { name, age, relation, parentName }
- cases: Array of detected issues(MULTIPLE_PATERNITY, AGE_GAP_GT_50, etc.)
  - facts: { familyText, ageGapText, noticeText, name variants, counts }
</normalized_data>

  <applicant_context>
    Original statements and district:
    ${JSON.stringify(data.additionalFacts)}
District: ${JSON.stringify(data.basicDetails.district)}
</applicant_context>

  <tone_reference>
    Legal templates for style consistency:
    ${JSON.stringify(Object.values(TEMPLATES).join("\n\n"))}
</tone_reference>

  <notice_definitions>
    Context for appeal grounds(what the applicant is responding to):
  1. Age gap with grandparent < 40 years(likely mis - linking)
2. Multiple paternity: 6 + people claiming same parent(possible false connection)
3. Age gap with parent > 50 years(likely mis - linking)
4. Age gap with parent < 15 years(likely mis - linking)
5. Name mismatch in father / self between previous SR and voter list(incorrect linkage)
6. Notice not served by BLO(procedural violation)
7. Incomplete notice received(no reason specified)
  </notice_definitions>
  </input_contract>

  < output_contract >
  <format>Plain text legal document </format>
    < length_constraint > Maximum 350 tokens(STRICT ENFORCEMENT) </length_constraint>
      < language_level > Simple English, accessible to ordinary people with limited legal literacy </language_level>
        <structure>
1. Header: "BEFORE THE LD. TRIBUNAL / APPELLATE AUTHORITY AT [District]"
2. Subject: Brief subject line referencing SIR 2026
3. Introduction: Identity declaration(Name, Age, S / O or D / O, Parent)
4. Notice Issue(if applicable): Address procedural defects first
5. Case Explanations: Address each detected case concisely
6. Final Declaration: Summary of genuine relationship / eligibility
7. Annexure reference: "Annexure: [list documents]"
  </structure>
  < style_rules >
  - Use respectful legal formulas: "I respectfully submit", "It is stated that"
    - For name mismatches: Use phrase "same and identical person"
      - Reference "clerical error" or "legacy record error" for discrepancies
        - Emphasize "genuine and valid relationship"
  - Use "bona fide voter" in introduction
  - Avoid: Latin terms, complex subordinate clauses, passive voice excess
    </style_rules>
    </output_contract>

    <reasoning_steps>
1. < analyze_cases >
  - Review normalized.cases array
    - Identify if NOTICE_NOT_SERVED or NOTICE_INCOMPLETE present(prioritize these)
      - Group remaining cases: Name issues, Age gap issues, Family structure issues
        </analyze_cases>

2. < draft_header >
  - Insert district from basicDetails
    - Create subject line mentioning "Appeal against objection under SIR 2026"
      </draft_header>

3. < draft_introduction >
  - "I, [name], Age [age], [relation] of [parentName], am a bona fide voter."
  - Keep to one sentence
    </draft_introduction>

4. < address_notice_issues >
  <condition>If NOTICE_NOT_SERVED in cases </condition>
    < content > State that no notice was received, violating natural justice principles.Mention discovery of deletion without prior intimation.</content>

      < condition > If NOTICE_INCOMPLETE in cases </condition>
        < content > State notice lacked grounds / specifics, preventing adequate defense preparation.</content>

          < priority > Place this paragraph immediately after introduction if either notice case exists </priority>
            </address_notice_issues>

5. < explain_substantive_cases >
  <rule>For MULTIPLE_PATERNITY >
    - Mention family size using normalized.facts.familyText
- State large families common in rural / traditional societies
  - Assert all siblings born to same parent

    < rule > For AGE_GAP_GT_50 >
      - Acknowledge age gap
        - Use normalized.facts.ageGapText(extended family / late parenthood)
          - Mention birth position if available(youngest / eldest)

            < rule > For AGE_GAP_LT_15 >
              - Explain via early marriage in earlier times
                - Reference record maintenance inconsistencies

                  < rule > For GRANDPARENT_AGE_GAP_LT_40 >
                    - State observation appears incorrect
                      - Reference early marriages and extended families

                        < rule > For PARENT_NAME_MISMATCH >
                          - State both names refer to same person
                            - Call it "same and identical person"
                              - Attribute to spelling / phonetic / clerical errors

                                < rule > For SELF_NAME_MISMATCH >
                                  - State both names refer to applicant only
                                    - Current documents reflect correct name
                                      - Legacy record errors caused variation

                                        < constraint > Combine related issues in single flowing paragraph if multiple cases exist </constraint>
                                          </explain_substantive_cases>

6. < draft_declaration >
  - Summarize that relationship is genuine
    - State applicant possesses supporting documents
      - Mention lawful voting history if applicable
        </draft_declaration>
  
  7. < draft_prayer >
    - "Under the above facts and circumstances, it is most humbly prayed that your honour may be pleased to allow this appeal and restore my name to the electoral roll."
    - Include SIR 2026 reference
      </draft_prayer>

8. < add_annexure >
  - List standard documents: 1. Aadhaar, 2. Voter ID, 3. PAN, 4. Ration Card, 5. BLO Notices, 6. SIR Enumeration Form, 7. Relevant Voter List Records
    </add_annexure>
    </reasoning_steps>

    < content_constraints >
    <prohibited>
    - No hallucinated facts not in normalized data
      - No legal citations or case law references
        - No repetition of same argument
          - No complex vocabulary(use "wrong" not "erroneous", "same" not "identical" unless in phrase "same and identical person")
            - No separate sections for each case if multiple exist(integrate into cohesive narrative)
              - No mention of other applicants or comparative statements
                </prohibited>

                < required_phrases >
                - "I respectfully submit"
                - "bona fide"
                - "same and identical person"(if name mismatch)
- "genuine and valid relationship"
  </required_phrases>

  < token_optimization >
  - Use short sentences(max 15 words)
    - Omit flowery adjectives
      - Combine related grounds with "and" instead of separate sentences
        - Use "That" to start substantive paragraphs(legal convention) but keep following clause short
          </token_optimization>
          </content_constraints>

          <verification_loop>
  Before final output:
1. Count approximate tokens(target < 400).If exceeded, shorten age gap explanations first.
  2. Verify all detected cases from normalized.cases are addressed in text
3. Check that notice issues appear before substantive issues if both present
4. Ensure no document - specific details(Aadhaar numbers, etc.) invented
5. Confirm district name correctly inserted in header
6. Validate that tone matches referenced templates(respectful, humble, direct)
7. Ensure "Annexure" section present with document list
8. Check readability: Can a person with 8th - grade education understand it ?
  </verification_loop>

  < grounding_rules >
  - Base ALL statements strictly on normalized input data
    - Use normalized.facts.familyText verbatim if available
      - Use normalized.facts.ageGapText verbatim for respective cases
        - Use normalized.facts.noticeText verbatim for procedural issues
          - Do NOT add "examples" or "for instance" clauses
            - Do NOT explain what SIR 2026 stands for
  - Preserve applicant's stated relationships exactly as provided
  </grounding_rules>

  < completeness_contract >
  - Output must be complete legal document ready for submission(no placeholders)
    - All detected cases must find reflection in the narrative
      - Document must have clear beginning(header) and end(prayer + annexure)
        - If multiple cases detected, ensure cohesive narrative linking them(e.g., "Furthermore" or "Additionally")
          - Empty lines between paragraphs only, no extra formatting
            </completeness_contract>

            <execution>
  Generate the complete appeal text following reasoning steps and constraints.Output ONLY the legal document text with no markdown fences, no commentary, and no preamble.
</execution>
    `;