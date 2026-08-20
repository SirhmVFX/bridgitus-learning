import OpenAI from "openai";
import type { AIQuestion } from "./firestore";

export interface GenerateQuestionsParams {
  curriculum: string;
  subject: string;
  year: string;
  topic: string;
  subtopic?: string;
  count: number;
  difficulty: string;
  format: string;
  context: string;
}

export interface CreateSimilarParams {
  question: AIQuestion;
  count?: number;
}

const openaiTextModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey: key });
}

function sanitizeJson(raw: string): string {
  const match = raw.match(/\[[\s\S]*\]/);
  const text = match ? match[0] : raw;
  return text.replace(/\\([^"\\/bfnrtu])/g, (_, char) => char);
}

function parseQuestionsArray(raw: string): AIQuestion[] {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(sanitizeJson(cleaned));
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
  } catch {
    /* fall through */
  }

  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("OpenAI did not return valid JSON. Please try again.");
  return JSON.parse(sanitizeJson(match[0]));
}

function buildPrompt(p: GenerateQuestionsParams, count: number): string {
  const formatNote =
    p.format === "Multiple Choice"
      ? "All questions must be multiple_choice with exactly 4 options."
      : p.format === "Short Answer"
        ? "All questions must be short_answer."
        : p.format === "True/False"
          ? "All questions must be true_false."
          : p.format === "Extended Response"
            ? "All questions must be extended_response (no options needed)."
            : "Mix question types: use a variety of multiple_choice, true_false, and short_answer.";

  const diffNote =
    p.difficulty === "Support"
      ? "Use simple language, single-step problems, foundational concepts."
      : p.difficulty === "Extension"
        ? "Use complex multi-step problems and higher-order thinking."
        : "Use grade-appropriate standard difficulty.";

  const ctxNote =
    p.context === "Real-life"
      ? "Frame all questions in real-world scenarios."
      : p.context === "Exam-style"
        ? "Use formal exam-style wording."
        : p.context === "Problem-solving"
          ? "Focus on problem-solving and reasoning."
          : p.context === "Worded problems"
            ? "All questions should be worded problems."
            : "Use abstract, concept-focused questions.";

  return `You are an expert ${p.subject} teacher creating a question set for students.

CURRICULUM: ${p.curriculum}
SUBJECT: ${p.subject}
YEAR LEVEL: ${p.year}
TOPIC: ${p.topic}${p.subtopic ? `\nSUBTOPIC: ${p.subtopic}` : ""}
DIFFICULTY: ${p.difficulty}
COUNT: ${count} questions

QUESTION FORMAT RULE: ${formatNote}
DIFFICULTY RULE: ${diffNote}
CONTEXT RULE: ${ctxNote}

Use proper Unicode math notation where needed (× ÷ √ π ² −).

Return ONLY a valid JSON object:
{
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "text": "Question text",
      "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
      "correctAnswer": "A) option1",
      "points": 1,
      "topic": "${p.topic}",
      "subtopic": "${p.subtopic ?? p.topic}",
      "difficulty": "${p.difficulty}",
      "explanation": "Brief explanation.",
      "workedSolution": "Step-by-step solution."
    }
  ]
}

Rules:
- multiple_choice: exactly 4 options "A) "…"D) "; correctAnswer matches one option.
- true_false: options ["True","False"].
- short_answer / extended_response: omit options.
- ids q1…q${count}. All questions unique.`;
}

async function chatJson(user: string, maxTokens = 8192): Promise<string> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: openaiTextModel,
    temperature: 0.7,
    max_tokens: maxTokens,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You generate educational quiz questions. Always respond with valid JSON only.",
      },
      { role: "user", content: user },
    ],
  });
  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned an empty response.");
  return text;
}

export async function generateQuestions(params: GenerateQuestionsParams): Promise<AIQuestion[]> {
  const BATCH_SIZE = 10;
  if (params.count > BATCH_SIZE) {
    const batches: AIQuestion[][] = [];
    let remaining = params.count;
    let batchNum = 0;
    while (remaining > 0) {
      const batchCount = Math.min(BATCH_SIZE, remaining);
      const batchResult = await generateQuestions({ ...params, count: batchCount });
      const offset = batchNum * BATCH_SIZE;
      batches.push(batchResult.map((q, i) => ({ ...q, id: `q${offset + i + 1}` })));
      remaining -= batchCount;
      batchNum++;
    }
    return batches.flat();
  }

  const text = await chatJson(buildPrompt(params, params.count));
  const questions = parseQuestionsArray(text);
  if (!Array.isArray(questions)) throw new Error("Expected an array of questions.");

  return questions.map((q, i) => ({
    id: q.id ?? `q${i + 1}`,
    type: q.type ?? "multiple_choice",
    text: q.text ?? "",
    options: q.options,
    correctAnswer: q.correctAnswer ?? "",
    points: q.points ?? 1,
    explanation: q.explanation ?? "",
    workedSolution: q.workedSolution ?? "",
    topic: q.topic ?? params.topic,
    subtopic: q.subtopic ?? params.subtopic ?? params.topic,
    difficulty: q.difficulty ?? params.difficulty,
  }));
}

export async function createSimilarQuestions(params: CreateSimilarParams): Promise<AIQuestion[]> {
  const { question, count = 3 } = params;
  const prompt = `You are an expert teacher. A student got the following question WRONG and needs practice on similar questions.

ORIGINAL QUESTION:
Type: ${question.type}
Topic: ${question.topic} — ${question.subtopic}
Difficulty: ${question.difficulty}
Question: ${question.text}
${question.options ? `Options: ${question.options.join(", ")}` : ""}
Correct Answer: ${question.correctAnswer}

Generate EXACTLY ${count} NEW similar questions (same concept, different numbers/scenarios).

Return ONLY JSON:
{
  "questions": [
    {
      "id": "s1",
      "type": "${question.type}",
      "text": "Question text",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "A) ...",
      "points": ${question.points ?? 1},
      "topic": "${question.topic}",
      "subtopic": "${question.subtopic ?? question.topic}",
      "difficulty": "${question.difficulty}",
      "explanation": "Brief explanation.",
      "workedSolution": "Step-by-step solution."
    }
  ]
}`;

  const text = await chatJson(prompt, 4096);
  const questions = parseQuestionsArray(text);
  return questions.map((q, i) => ({
    id: q.id ?? `s${i + 1}`,
    type: q.type ?? question.type,
    text: q.text ?? "",
    options: q.options,
    correctAnswer: q.correctAnswer ?? "",
    points: q.points ?? question.points ?? 1,
    explanation: q.explanation ?? "",
    workedSolution: q.workedSolution ?? "",
    topic: q.topic ?? question.topic,
    subtopic: q.subtopic ?? question.subtopic,
    difficulty: q.difficulty ?? question.difficulty,
  }));
}
