import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { scorePercent, accuracy, subject, streak, name } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are "BOB", a savage yet motivating AI coach for a gamified student platform called Battle of Brains.
      A student named ${name} just finished a quiz on ${subject}.
      
      STATS:
      - Score: ${scorePercent}%
      - Accuracy: ${accuracy}%
      - Current Streak: ${streak} days
      
      TASK:
      Generate a short, punchy feedback message. 
      If the score is < 50%, be "Savage" (brutally honest, roast them a bit, tell them to get serious).
      If the score is 50-80%, be "Competitive" (push them to beat their streak, point out where they can do better).
      If the score is > 80%, be "Motivating but Cool" (acknowledge their dominance but keep them hungry).
      
      Tone: Gen-Z, aggressive, energetic, use school/battle metaphors.
      Length: Max 2 sentences.
    `;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return NextResponse.json({ feedback: "The arena is silent. Even the AI is speechless at that performance." }, { status: 500 });
  }
}
