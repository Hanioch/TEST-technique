import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const notes = await prisma.liste_notes.findMany();
  return NextResponse.json(notes);
}