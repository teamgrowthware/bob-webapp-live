import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export type GeneratedQuestion = {
  text: string;
  options: string[];
  correctIdx: number;
  timeLimit: number;
};

export async function generateQuizQuestions(
  topic: string,
  classLevel: string,
  count: number = 10,
  context?: string
): Promise<GeneratedQuestion[]> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
  }

  // We use gemini-2.5-flash for fastest generation of simple JSON
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const contextPrompt = context 
    ? `\nFocus the questions SPECIFICALLY on the following provided text/syllabus:\n"""\n${context}\n"""`
    : "";

  const prompt = `
You are an expert curriculum designer and gamification expert for "Battle of Brains" - a Gen-Z quiz platform.
I need you to generate exactly ${count} multiple-choice questions for students in Class ${classLevel} on the topic: "${topic}".
${contextPrompt}

Guidelines:
- The tone should be slightly humorous, modern, and engaging (Gen-Z vibe), while still being educational and factually accurate.
- Each question must have exactly 4 options.
- The 'correctIdx' must be the index (0, 1, 2, or 3) of the correct answer in your options array.
- 'timeLimit' for each question should be a number (usually 15, 30, 45, or 60) based on how difficult the calculation/thought process is.

Return the response PURELY as a JSON array of objects. Do not wrap it in markdown blockquotes or add any other text.
The JSON array should have this exact structure:
[
  {
    "text": "Question text here...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIdx": 1,
    "timeLimit": 30
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Attempt to parse JSON securely
    let cleanJsonStr = text.trim();
    if (cleanJsonStr.startsWith("\`\`\`json")) {
      cleanJsonStr = cleanJsonStr.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    } else if (cleanJsonStr.startsWith("\`\`\`")) {
      cleanJsonStr = cleanJsonStr.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    }

    const parsed = JSON.parse(cleanJsonStr);
    return parsed as GeneratedQuestion[];
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to parse or generate quiz with AI.");
  }
}

export async function analyzeSyllabus(
  fileBuffer: Buffer,
  mimeType: string
): Promise<{ text: string; topics: string[]; suggestedClass?: string; suggestedSubject?: string }> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let prompt = "";
  let parts: any[] = [];

  if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
    prompt = `
      You are a brilliant Gen-Z teaching assistant for "Battle of Brains". 
      Analyze this file (${mimeType === "application/pdf" ? "PDF document" : "image/notes"}) and:
      1. Extract all readable educational text.
      2. Identify the core topics discussed.
      3. Suggest a Class Level (6-12) and Subject.
      
      Return as JSON:
      {
        "text": "Full extracted text here...",
        "topics": ["Topic 1", "Topic 2"],
        "suggestedClass": "10",
        "suggestedSubject": "Biology"
      }
    `;
    parts = [
      prompt,
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType,
        },
      },
    ];
  } else {
    // For raw text input
    const textContent = fileBuffer.toString("utf-8");
    prompt = `
      Analyze the following educational text and extract key information:
      Text: """${textContent.substring(0, 10000)}"""
      
      Return as JSON:
      {
        "text": "Summary of the text...",
        "topics": ["Topic 1", "Topic 2"],
        "suggestedClass": "9",
        "suggestedSubject": "History"
      }
    `;
    parts = [prompt];
  }

  try {
    const result = await model.generateContent(parts);
    const text = result.response.text();
    let cleanJsonStr = text.trim().replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    return JSON.parse(cleanJsonStr);
  } catch (error) {
    console.error("Syllabus Analysis Error:", error);
    throw new Error("Failed to analyze syllabus with AI.");
  }
}

export async function generateDoubtExplanation(question: string, context?: string): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const contextPrompt = context 
    ? `\nHere is some contextual information from the verified syllabus to base your answer accurately:\n"""\n${context}\n"""`
    : "";

  const prompt = `
You are a helpful, brilliant, and slightly Gen-Z flavored teacher for "Battle of Brains" - a learning platform.
A student in Class 6-12 has asked the following doubt:
"${question}"
${contextPrompt}

Explain the answer to them step-by-step. 
Guidelines:
- Keep the language simple, engaging, and age-appropriate.
- Use bullet points and markdown bolding for readability.
- DO NOT just give the final answer. Walk them through the pedagogical reasoning so they learn *how* to solve or understand it.
- Keep it concise but comprehensive. Maximum 3-4 short paragraphs/bullet sections.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Doubt Generation Error:", error);
    throw new Error("Failed to generate explanation from AI.");
  }
}
export async function generateEmbeddings(text: string): Promise<number[]> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding Generation Error:", error);
    throw new Error("Failed to generate embedding with AI.");
  }
}
