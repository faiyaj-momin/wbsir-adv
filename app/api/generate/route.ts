import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/aiPipeline";
import type { FormData as AppFormData } from "@/types/forms";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AppFormData;

    const result = await runPipeline(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate application",
      },
      { status: 500 }
    );
  }
}