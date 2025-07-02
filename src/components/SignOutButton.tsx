"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CustomSignOutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-red-600 hover:underline"
    >
      Вийти
    </button>
  );
}
