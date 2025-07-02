"use client";

import { useEffect, useState } from "react";
import SignOut from "@/components/SignOutButton";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/user/status")
      .then((res) => res.json())
      .then((data) => setIsPaid(data.isPaid === true))
      .catch((err) => {
        console.error("Помилка отримання статусу користувача", err);
        setIsPaid(false);
      });

    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => setRecords(data));
  }, []);

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      setResult(errorData.error || "Сталася помилка");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResult(data.text);
    setLoading(false);

    const newRecord = {
      id: data.id,
      content: data.text,
      audioUrl: data.audioUrl,
      createdAt: new Date().toISOString(),
    };
    setRecords((prev) => [newRecord, ...prev]);
    setSelectedRecord(newRecord);
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r p-6 shadow-md overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Історія записів</h2>
        <ul className="space-y-2">
          {records.map((record) => (
            <li key={record.id}>
              <button
                onClick={() => setSelectedRecord(record)}
                className="w-full text-left p-3 rounded bg-gray-100 hover:bg-gray-200 transition text-sm"
              >
                {record.content?.slice(0, 50) || "Без назви"}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          {isPaid === null ? (
            <p className="text-gray-500">Завантаження статусу...</p>
          ) : isPaid ? (
            <p className="text-green-600 font-semibold">
              У вас безлімітний доступ!
            </p>
          ) : (
            <StripeCheckoutButton />
          )}
          <SignOut />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Завантажити аудіо</h3>
          <input
            type="file"
            accept="audio/*"
            className="mb-4 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition disabled:opacity-50"
          >
            {loading ? "Обробка..." : "Розпізнати"}
          </button>
        </div>

        {result && (
          <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded">
            <h4 className="font-bold mb-2">Отриманий текст:</h4>
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}

        {selectedRecord && (
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-3">🗂 Обраний запис</h3>
            <p className="whitespace-pre-wrap mb-4">{selectedRecord.content}</p>
            <a
              href={selectedRecord.audioUrl}
              download
              className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-800 font-medium transition"
            >
              ⬇️ Завантажити аудіофайл
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
