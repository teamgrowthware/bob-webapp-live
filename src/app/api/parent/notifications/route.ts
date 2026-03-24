import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Return safe dummy array without DB auth module crashes
  return NextResponse.json([]);
}
