import { NextResponse } from "next/server";
import {
  generateQuestions,
  attachDiagramsToQuestions,
  isAiConfigured,
  aiConfigError,
} from "@/lib/ai";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    if (!isAiConfigured()) {
      return NextResponse.json({ error: aiConfigError() }, { status: 503 });
    }

    const body = await request.json();
    const {
      curriculum,
      subject,
      year,
      topic,
      subtopic,
      count,
      difficulty,
      format,
      context,
    } = body;

    if (
      !curriculum ||
      !subject ||
      !year ||
      !topic ||
      !count ||
      !difficulty ||
      !format ||
      !context
    ) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    let questions = await generateQuestions({
      curriculum,
      subject,
      year,
      topic,
      subtopic,
      count,
      difficulty,
      format,
      context,
    });

    // Generate Cloudinary diagrams for questions that need visuals
    try {
      const diagramResult = await attachDiagramsToQuestions(questions);
      questions = diagramResult.questions;
    } catch (err) {
      console.error("Practice diagram attachment failed (non-fatal):", err);
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: unknown) {
    console.error("generate-questions error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 }
    );
  }
}
