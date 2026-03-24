import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'super_secret_fallback_key_for_dev_only'
);

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    // Upsert the Parent user so Prisma Foreign Key constraints resolve properly
    let parent = await prisma.user.findUnique({ where: { phone } });
    
    if (!parent) {
      parent = await prisma.user.create({
        data: {
          phone,
          role: "PARENT",
          name: "Guardian"
        }
      });
    }

    // Generate a secure JWT locked to the real Database ID
    const token = await new SignJWT({ 
        role: "PARENT", 
        userId: parent.id,
        phone 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secretKey);

    return NextResponse.json({
      message: "Login successful",
      user: { role: 'PARENT', phone, id: parent.id },
      token
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
