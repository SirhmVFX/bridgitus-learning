import type { AIQuestion } from "./firestore";
import * as gemini from "./gemini";
import * as openai from "./openai";

export type { GenerateQuestionsParams, CreateSimilarParams } from "./openai";

export function getAiProvider(): "openai" | "gemini" {
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  return "gemini";
}

export function isAiConfigured(): boolean {
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  return Boolean(openaiKey || (geminiKey && geminiKey !== "your_gemini_api_key_here"));
}

export function aiConfigError(): string {
  return "No AI key configured. Add OPENAI_API_KEY (preferred) or GEMINI_API_KEY to .env.local.";
}

export async function generateQuestions(
  params: openai.GenerateQuestionsParams
): Promise<AIQuestion[]> {
  if (getAiProvider() === "openai") return openai.generateQuestions(params);
  return gemini.generateQuestions(params);
}

export async function createSimilarQuestions(
  params: openai.CreateSimilarParams
): Promise<AIQuestion[]> {
  if (getAiProvider() === "openai") return openai.createSimilarQuestions(params);
  return gemini.createSimilarQuestions(params);
}

/** Attach diagrams for questions that need them (OpenAI Images when key present). */
export async function attachDiagramsToQuestions(
  questions: AIQuestion[]
): Promise<{ questions: AIQuestion[]; generated: number; failed: number }> {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return { questions, generated: 0, failed: 0 };
  }
  return openai.attachDiagramsToQuestions(questions);
}
