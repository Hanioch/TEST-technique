/**
 * @openapi
 * /api/inscriptions:
 *   get:
 *     tags:
 *       - Inscriptions
 *     summary: Récupère toutes les inscriptions
 *     responses:
 *       200:
 *         description: Liste des inscriptions
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inscriptions = await prisma.liste_inscriptions.findMany();
  return NextResponse.json(inscriptions);
}