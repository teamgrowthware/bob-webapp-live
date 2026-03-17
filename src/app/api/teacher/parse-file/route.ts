import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { analyzeSyllabus } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;

    // Use Gemini for all file types (PDF, Images)
    // Multimodal models handle these natively and better than pdf-parse
    const extractedData = await analyzeSyllabus(buffer, mimeType);

    return NextResponse.json({ 
      success: true, 
      ...extractedData
    });
  } catch (error: any) {
    console.error("File Parse Error:", error);
    return NextResponse.json(
      { error: "Failed to process file with AI." },
      { status: 500 }
    );
  }
}
