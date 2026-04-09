import OpenAI from "openai";
import type { FormData as AppFormData } from "@/types/forms";
import {
  detectPrompt,
  normalizePrompt,
  generatePrompt,
} from "./prompts";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is required for AI generation.");
}

const openai = new OpenAI({ apiKey });

type AgeGapType = "UNDER_15" | "OVER_50" | "NONE";
type ParentType = "father" | "mother" | "other";

export interface AIPipelineDetected {
  cases: string[];
  dynamic: {
    parentType?: ParentType;
    parentOldName?: string;
    parentCurrentName?: string;
    selfOldName?: string;
    selfCurrentName?: string;
    total?: number;
    brothers?: number;
    sisters?: number;
    position?: number;
    ageGapType?: AgeGapType;
    isAgeGapValid?: boolean;
  };
}

export interface AIPipelineNormalized {
  applicant: {
    name: string;
    age: string;
    relation: string;
    parentName: string;
  };
  cases: string[];
  facts: {
    parentOldName?: string;
    parentCurrentName?: string;
    selfOldName?: string;
    selfCurrentName?: string;
    familyText?: string;
    ageGapText?: string;
  };
}

export interface AIPipelineResult {
  detected: AIPipelineDetected;
  normalized: AIPipelineNormalized;
  finalDoc: string;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function callAI(prompt: string): Promise<string> {

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
      temperature: 0.3,
    });

    return res.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    return ""
  }
}

export async function runPipeline(data: AppFormData): Promise<AIPipelineResult> {
  console.log("Running AI pipeline with data:", data);
  const detectedRaw = await callAI(detectPrompt(data));
  const detected = parseJson<AIPipelineDetected>(detectedRaw, {
    cases: [],
    dynamic: {},
  });

  const normalizedRaw = await callAI(normalizePrompt(detected, data));
  const normalized = parseJson<AIPipelineNormalized>(normalizedRaw, {
    applicant: {
      name: "",
      age: "",
      relation: "",
      parentName: "",
    },
    cases: [],
    facts: {},
  });

  const finalDoc = await callAI(generatePrompt(normalized, data));

  return {
    detected,
    normalized,
    finalDoc: finalDoc.trim(),
  };
}