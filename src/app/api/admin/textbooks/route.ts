import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import pdf from "pdf-parse";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const textbooks = await prisma.textbook.findMany({
      include: {
        chapters: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(textbooks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch textbooks" }, { status: 500 });
  }
}
