import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const classroom = await prisma.classroom.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!classroom) {
      return NextResponse.json({ error: "Classroom not found" }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: session.userId,
        classId: classroom.id
      }
    });

    return NextResponse.json({ message: "Joined successfully", className: classroom.name });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return NextResponse.json({ error: "Already enrolled in this class" }, { status: 400 });
    }
    return NextResponse.json({ error: "Join failed" }, { status: 500 });
  }
}
