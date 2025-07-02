import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { userId } = await auth();
  console.log("auth result:", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const transcriptionCount = await prisma.audioTranscription.count({
    where: { userId: user.id },
  });

  const isLimitReached = !user.isPaid && transcriptionCount >= 2;
  if (isLimitReached) {
    return NextResponse.json(
      { error: "Ліміт безкоштовних транскрипцій вичерпано. Оформіть оплату, щоб продовжити." },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name || `audio_${Date.now()}.wav`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  try {
    // Запис файлу в public/uploads
    await fs.writeFile(filePath, buffer);

    // Надсилання в OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: file as any,
      model: "whisper-1",
    });

    const text = transcription.text ?? "[немає тексту]";

    const newRecord = await prisma.record.create({
      data: {
        userId: user.id,
        content: text,
      },
    });

    await prisma.audioTranscription.create({
      data: {
        userId: user.id,
        audioUrl: `/uploads/${fileName}`,
        text,
      },
    });

    return NextResponse.json({
      id: newRecord.id,
      text,
      audioUrl: `/uploads/${fileName}`,
    });
  } catch (err) {
    console.error("Transcription error", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
