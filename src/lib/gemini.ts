import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIQuestion } from "./firestore";

const geminiModel = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";
const geminiApiVersion = process.env.GEMINI_API_VERSION ?? "v1";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

/**
 * Fix common JSON escape errors that LLMs produce:
 *  - bad escapes like \' \% \: \& that are invalid in JSON
 *  - smart/curly quotes inside string values
 */
function sanitizeJson(raw: string): string {
  // Extract just the array portion first
  const match = raw.match(/\[[\s\S]*\]/);
  const text = match ? match[0] : raw;

  // Replace invalid escape sequences: keep only valid JSON escapes
  // Valid: \" \\ \/ \b \f \n \r \t \uXXXX
  return text.replace(/\\([^"\\/bfnrtu])/g, (_, char) => char);
}

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

// Build the prompt — structured so Gemini returns clean JSON
function buildPrompt(p: GenerateQuestionsParams, count: number): string {
  const formatNote =
    p.format === "Multiple Choice" ? "All questions must be multiple_choice with exactly 4 options." :
      p.format === "Short Answer" ? "All questions must be short_answer." :
        p.format === "True/False" ? "All questions must be true_false." :
          p.format === "Extended Response" ? "All questions must be extended_response (no options needed)." :
            "Mix question types: use a variety of multiple_choice, true_false, and short_answer.";

  const diffNote =
    p.difficulty === "Support" ? "Use simple language, single-step problems, foundational concepts. Suitable for students who need extra scaffolding." :
      p.difficulty === "Extension" ? "Use complex multi-step problems, higher-order thinking, application to novel situations." :
        "Use grade-appropriate standard difficulty — the typical expected level for this year group.";

  const ctxNote =
    p.context === "Real-life" ? "Frame all questions in real-world, relatable scenarios." :
      p.context === "Exam-style" ? "Use formal exam-style wording and presentation." :
        p.context === "Problem-solving" ? "Focus on problem-solving and mathematical reasoning." :
          p.context === "Worded problems" ? "All questions should be worded problems requiring interpretation." :
            "Use abstract, concept-focused questions.";

  return `You are an expert ${p.subject} teacher creating a question set for Australian students.

CURRICULUM: ${p.curriculum}
SUBJECT: ${p.subject}
YEAR LEVEL: ${p.year}
TOPIC: ${p.topic}${p.subtopic ? `\nSUBTOPIC: ${p.subtopic}` : ""}
DIFFICULTY: ${p.difficulty}
COUNT: ${count} questions

QUESTION FORMAT RULE: ${formatNote}
DIFFICULTY RULE: ${diffNote}
CONTEXT RULE: ${ctxNote}

MATHEMATICS & SCIENCE NOTATION RULES (apply whenever the subject requires it):
- Use Unicode symbols directly in text: × ÷ ± √ π ∞ ≤ ≥ ≠ ∈ ∑ ∫ ²  ³  ⁴  ½  ¼  ¾
- Write fractions as: ¾, 2/3, or (3x+1)/2 — never use slash for ambiguous expressions
- Write exponents using superscript Unicode or the ^ symbol: x² or x^2, not x**2
- For square roots write: √16 or √(3x+1) with the radicand in brackets if compound
- For equations use: 3x² − 7x + 2 = 0 (use proper minus sign −, not hyphen -)
- Geometry: describe shapes using words + measurements, e.g. "a right-angled triangle with legs 3 cm and 4 cm"
- When a question would typically include a diagram (e.g. a number line, coordinate grid, geometric figure), describe it clearly in brackets: [Diagram: coordinate grid with x-axis from -5 to 5 and y-axis from -5 to 5]
- For data/statistics questions, embed small tables using pipe notation: | x | 1 | 2 | 3 | and | f | 4 | 7 | 2 |

CRITICAL: Return ONLY a valid JSON array. No markdown, no explanation, no code blocks.
Every element must have ALL these fields:

[
  {
    "id": "q1",
    "type": "multiple_choice",
    "text": "Question text here — use Unicode math symbols",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "correctAnswer": "A) option1",
    "points": 1,
    "topic": "${p.topic}",
    "subtopic": "${p.subtopic ?? p.topic}",
    "difficulty": "${p.difficulty}",
    "explanation": "Brief explanation of why this is correct (1-2 sentences).",
    "workedSolution": "Step-by-step worked solution showing full working out with proper symbols."
  }
]

Rules:
- For multiple_choice: options array must have exactly 4 items starting with "A) ", "B) ", "C) ", "D) ". correctAnswer must exactly match one option.
- For true_false: options must be ["True", "False"]. correctAnswer must be "True" or "False".
- For short_answer: omit options. correctAnswer is the key term or number expected.
- For extended_response: omit options. correctAnswer is a model answer outline.
- workedSolution must show every step clearly — use numbered steps for maths problems.
- All ${count} questions must be unique and test different aspects of the topic.
- Question ids must be "q1", "q2", ..., "q${count}".

Return the JSON array now:`;
}

export async function generateQuestions(params: GenerateQuestionsParams): Promise<AIQuestion[]> {
  const model = genAI.getGenerativeModel({
    model: geminiModel,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 16384,
    },
  }, {
    apiVersion: geminiApiVersion,
  });

  // Batch into chunks of 10 to avoid token truncation for large sets
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

  const prompt = buildPrompt(params, params.count);

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip any markdown code fences if Gemini adds them
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let questions: AIQuestion[];
  try {
    questions = JSON.parse(sanitizeJson(cleaned));
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini did not return valid JSON. Please try again.");
    questions = JSON.parse(sanitizeJson(match[0]));
  }

  if (!Array.isArray(questions)) throw new Error("Expected an array of questions.");

  // Ensure every question has required fields
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

export interface CreateSimilarParams {
  question: AIQuestion;
  count?: number;
}

export async function createSimilarQuestions(params: CreateSimilarParams): Promise<AIQuestion[]> {
  const { question, count = 3 } = params;
  const model = genAI.getGenerativeModel({
    model: geminiModel,
    generationConfig: { temperature: 0.8, topP: 0.9, maxOutputTokens: 4096 },
  }, {
    apiVersion: geminiApiVersion,
  });

  const prompt = `You are an expert teacher. A student got the following question WRONG and needs practice on similar questions.

ORIGINAL QUESTION:
Type: ${question.type}
Topic: ${question.topic} — ${question.subtopic}
Difficulty: ${question.difficulty}
Question: ${question.text}
${question.options ? `Options: ${question.options.join(", ")}` : ""}
Correct Answer: ${question.correctAnswer}

Generate EXACTLY ${count} NEW questions that are similar in style, topic, and difficulty.
They must test the same concept but use different numbers, scenarios, or contexts.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation):
[
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

Return the JSON array now:`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  let questions: AIQuestion[];
  try {
    questions = JSON.parse(sanitizeJson(text));
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini did not return valid JSON.");
    questions = JSON.parse(sanitizeJson(match[0]));
  }

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
