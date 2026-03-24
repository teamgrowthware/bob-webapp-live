import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSession } from "@/lib/session";

const prisma = new PrismaClient();

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

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { phone }
    });

    let isNewUser = false;
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
        }
      });
      isNewUser = true;
    }

    // Create session cookie
    const token = await createSession(user.id, user.role);

    return NextResponse.json({
      success: true,
      token,
      isNewUser,
      needsOnboarding: !user.name || !user.class || !user.school
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
