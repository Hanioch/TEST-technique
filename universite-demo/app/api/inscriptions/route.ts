import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inscriptions = await prisma.liste_inscriptions.findMany();
  return NextResponse.json(inscriptions);
}