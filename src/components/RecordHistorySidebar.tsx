"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RecordItem = {
  id: string;
  content: string;
  createdAt: string;
};


export default function RecordHistorySidebar() {
  const [records, setRecords] = useState<RecordItem[]>([]);

  useEffect(() => {
    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Історія записів</h2>
      <ul className="space-y-2">
       {records.map((record) => (
         <li key={record.id}>
           <Link
             href={`/dashboard/records/${record.id}`}
             className="block p-2 rounded hover:bg-accent transition"
           >
             {record.content.substring(0, 30) || "Без назви"}
           </Link>
         </li>
       ))}

      </ul>
    </div>
  );
}