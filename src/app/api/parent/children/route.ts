import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth"; // Assuming auth helper exists

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const children = await prisma.user.findMany({
      where: { parentId: session.userId },
      select: {
        id: true,
        name: true,
        xp: true,
        coins: true,
        level: true,
        streak: true,
        class: true,
        school: true,
        attempts: {
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            score: true,
            accuracy: true,
            createdAt: true,
            quiz: { select: { title: true, subject: true } }
          }
        }
      }
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Parent children fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { childPhone } = await req.json();

    const child = await prisma.user.findUnique({
      where: { phone: childPhone }
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    if (child.parentId) {
      return NextResponse.json({ error: "Child already linked to a parent" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: child.id },
      data: { parentId: session.userId }
    });

    return NextResponse.json({ message: "Child linked successfully" });
  } catch (error) {
    console.error("Parent link child error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
