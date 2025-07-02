import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    console.log("record route HIT");
const {userId} =  getAuth(req);


if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
      console.log("no user found in records")
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  console.log("User ID:", userId);

  const records = await prisma.record.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return NextResponse.json(records);
}
