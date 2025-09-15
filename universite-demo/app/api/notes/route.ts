/**
 * @openapi
 * /api/notes:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Récupère la liste des notes
 *     responses:
 *       200:
 *         description: Liste des notes
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const notes = await prisma.liste_notes.findMany();
  return NextResponse.json(notes);
}