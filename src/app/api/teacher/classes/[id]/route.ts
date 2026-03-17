import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classroom = await prisma.classroom.findFirst({
      where: { id: params.id, teacherId: session.userId },
      include: {
        students: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                xp: true,
                class: true,
                attempts: {
                  take: 5,
                  orderBy: { createdAt: "desc" },
                  select: { accuracy: true, score: true, createdAt: true }
                }
              }
            }
          }
        },
        assignments: {
          include: { quiz: { select: { title: true, subject: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!classroom) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(classroom);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
