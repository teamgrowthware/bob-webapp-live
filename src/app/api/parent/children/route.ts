import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const secretKey = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'super_secret_fallback_key_for_dev_only'
);

// Unified token decryptor
async function auth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  const user = await auth(req);
  if (!user || user.role !== 'PARENT') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const children = await prisma.user.findMany({
      where: { parentId: user.userId as string },
      select: {
        id: true,
        name: true,
        class: true,
        school: true,
        xp: true,
        streak: true,
        coins: true,
      }
    });

    const parsed = children.map(c => ({
      ...c,
      name: c.name || "Student",
      class: c.class || "10",
      school: c.school || "BOB Academy"
    }));

    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: "DB Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await auth(req);
  if (!user || user.role !== 'PARENT') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { childPhone } = body;

    const child = await prisma.user.findUnique({
      where: { phone: childPhone }
    });

    if (!child) {
      return NextResponse.json({ error: "No student registered with this number." }, { status: 404 });
    }

    // Bind parentID foreign key
    await prisma.user.update({
      where: { id: child.id },
      data: { parentId: user.userId as string }
    });

    return NextResponse.json({ success: true, message: "Child linked securely!" });
  } catch (e) {
    return NextResponse.json({ error: "Failed to link child due to processing overlap." }, { status: 500 });
  }
}
