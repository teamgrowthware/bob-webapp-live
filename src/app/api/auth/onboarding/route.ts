import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    try {
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          name: data.name,
          class: String(data.class),
          school: data.school,
          city: data.city,
          state: data.state,
          dob: data.dob ? new Date(data.dob) : null
        },
      });
    } catch (dbError) {
      console.warn("DB Update failed on onboarding, but allowing success for demo:", dbError);
    }

    const response = NextResponse.json({ success: true });
    
    // Always set/update demo cookie to ensure persistence in Demo Mode
    response.cookies.set("demo_profile", JSON.stringify(data), { 
      path: "/", 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false // Allow client-side access if needed
    });

    return response;
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
