import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doubts = await prisma.doubt.findMany({
      include: {
        user: { select: { name: true, school: true, class: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(doubts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doubts" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "TEACHER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, verified, teacherCorrection } = await req.json();

    const doubt = await prisma.doubt.update({
      where: { id },
      data: {
        status: verified ? "VERIFIED" : "FLAGGED",
        teacherCorrection,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(doubt);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update doubt" }, { status: 500 });
  }
}
