import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banners = await prisma.adBanner.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, imageUrl, linkUrl, location } = await req.json();

    if (!title || !imageUrl || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const banner = await prisma.adBanner.create({
      data: {
        title,
        imageUrl,
        linkUrl,
        location,
        isActive: true
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
