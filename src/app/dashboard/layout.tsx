
"use client";
import { useEffect } from "react";
import { ReactNode } from "react";
import RecordHistorySidebar from "@/components/RecordHistorySidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
     useEffect(() => {
              fetch("/api/user/init", { method: "POST" });
            }, []);
  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

