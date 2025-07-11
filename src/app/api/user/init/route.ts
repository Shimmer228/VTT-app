import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existing) {
    const email = sessionClaims?.email as string | undefined;

    await prisma.user.create({
      data: {
        clerkId: userId,
        email: email || null,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
