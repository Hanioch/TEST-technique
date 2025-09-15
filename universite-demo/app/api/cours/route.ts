/**
 * @openapi
 * /api/cours:
 *   get:
 *     tags:
 *       - Cours
 *     summary: Récupère la liste des cours
 *     responses:
 *       200:
 *         description: Liste des cours
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cours = await prisma.liste_cours.findMany();
  return NextResponse.json(cours);
}