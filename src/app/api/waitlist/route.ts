import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const cls = formData.get("class") as string | null;
    const contact = formData.get("contact") as string;

    await prisma.waitlist.create({
      data: {
        type,
        name,
        city,
        class: cls,
        phone: contact,
      }
    });

    return NextResponse.redirect(new URL("/?success=true", request.url));
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.redirect(new URL("/?error=true", request.url));
  }
}
