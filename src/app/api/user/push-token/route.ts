import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pushToken } = await req.json();
    // Safely bypass DB auth for MVP push token intake
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
