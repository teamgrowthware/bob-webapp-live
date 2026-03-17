import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classes = await prisma.classroom.findMany({
      where: { teacherId: session.userId },
      include: {
        _count: { select: { students: true } }
      }
    });

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const code = nanoid(6).toUpperCase();

    const newClass = await prisma.classroom.create({
      data: {
        name,
        code,
        teacherId: session.userId
      }
    });

    return NextResponse.json(newClass);
  } catch (error) {
    console.error("Class create error:", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
