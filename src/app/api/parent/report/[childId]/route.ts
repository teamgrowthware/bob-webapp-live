import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  // Safe generic MVP report 
  return NextResponse.json({
    metrics: { accuracy: 95, timePerQuestion: 15 },
    recentBattles: [],
    weakAreas: ["Trigonometry"]
  });
}
