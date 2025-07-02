    import { prisma } from "@/lib/prisma";
    import { clerkClient } from "@clerk/nextjs/server";

    export async function createUserIfNotExists(clerkUserId: string) {
      const existing = await prisma.user.findUnique({
        where: { clerkId: clerkUserId }
      });
      if (existing) return;

      const client = await clerkClient();
      const clerkUser = await client.users.getUser(clerkUserId);
      const email = clerkUser.emailAddresses[0]?.emailAddress || null;

      await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: email
        }
      });
    }
