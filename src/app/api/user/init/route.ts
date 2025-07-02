import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId, sessionClaims } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Перевірка, чи такий користувач вже є в базі
  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!existing) {
    // Email можна дістати з jwt claims
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
