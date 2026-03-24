import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // In a full implementation, we'd have a 'Redemption' model
    // For MVP, we use a mock list of available rewards
    const rewards = [
      { id: "1", name: "₹500 Amazon Voucher", price: 5000, stock: 12, category: "Voucher" },
      { id: "2", name: "Gaming Headset", price: 25000, stock: 3, category: "Tech" },
      { id: "3", name: "BOB Elite Badge (NFT)", price: 1000, stock: 999, category: "Digital" },
      { id: "4", name: "School Bag", price: 15000, stock: 5, category: "Physical" },
    ];
    return NextResponse.json(rewards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 });
  }
}
