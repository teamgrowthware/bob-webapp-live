import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doubts = await prisma.doubt.findMany({
      include: {
        user: { select: { name: true, phone: true, school: true, class: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ doubts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch doubts." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doubtId, status, teacherCorrection } = await req.json();
    if (!doubtId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updateData: any = { status };
    if (teacherCorrection !== undefined) {
      updateData.teacherCorrection = teacherCorrection;
    }

    const updated = await prisma.doubt.update({
      where: { id: doubtId },
      data: updateData,
      include: {
        user: { select: { name: true, phone: true, school: true, class: true } }
      }
    });

    return NextResponse.json({ success: true, doubt: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update doubt" }, { status: 500 });
  }
}
