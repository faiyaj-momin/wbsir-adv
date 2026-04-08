import OpenAI from "openai";
import {
  detectPrompt,
  normalizePrompt,
  generatePrompt,
} from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function callAI(prompt: string) {
  const res = await openai.chat.completions.create({
    model: "gpt-5.3",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return res.choices[0].message.content;
}

export async function runPipeline(data: any) {
  // STEP 1: Detect
  const detectedRaw = await callAI(detectPrompt(data));
  const detected = JSON.parse(detectedRaw || "{}");

  // STEP 2: Normalize
  const normalizedRaw = await callAI(
    normalizePrompt(detected, data)
  );
  const normalized = JSON.parse(normalizedRaw || "{}");

  // STEP 3: Generate
  const finalDoc = await callAI(
    generatePrompt(normalized, data)
  );

  return {
    detected,
    normalized,
    finalDoc,
  };
}