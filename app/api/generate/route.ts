import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/aiPipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await runPipeline(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate application",
      },
      { status: 500 }
    );
  }
}