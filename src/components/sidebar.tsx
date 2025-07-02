'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface Record {
  id: string;
  content: string;
}

export default function Sidebar({ userId }: { userId: string }) {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    fetch(`/api/records?userId=${userId}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, [userId]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Записи</h2>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
            <Link href={`/record/${rec.id}`} className="block py-2 hover:text-blue-500">
              {rec.content.slice(0, 30)}...
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
