import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP required" }, { status: 400 });
    }

    // Static OTP validation for demo purposes
    if (otp !== "123456") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check if user exists (with fail-safe)
    let user: any = null;
    let isNewUser = false;
    let dbFailed = false;

    try {
      user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            phone,
          }
        });
        isNewUser = true;
      }
    } catch (dbError) {
      console.error("Database connection failed, using fail-safe mock:", dbError);
      dbFailed = true;
      // Fail-safe mock user
      user = {
        id: `mock-${phone}`,
        phone,
        role: "STUDENT",
        name: "Trial User",
      };
    }

    // Create session cookie
    const token = await createSession(user.id, user.role);

    return NextResponse.json({
      success: true,
      token,
      isNewUser,
      isDemoMode: dbFailed,
      needsOnboarding: dbFailed ? false : (!user.name || !user.class || !user.school)
    });
  } catch (error: any) {
    console.error("Auth Error:", error);
    return NextResponse.json({ 
      error: "Authentication failed", 
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
}
