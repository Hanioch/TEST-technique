import { NextResponse } from "next/server";
import { getInscriptions } from "@/lib/api/partie2/inscriptions";
import { getCours } from "@/lib/api/partie2/cours";
import { getNotes } from "@/lib/api/partie2/notes";

type Anomalie = {
  type: string;
  matricule: string;
  annee: number;
  detail: string;
};

export async function GET() {
  try {  
    const inscriptions = await getInscriptions();
    const cours = await getCours();
    const notes = await getNotes();

    const anomalies: Anomalie[] = [];

    inscriptions.forEach((inscription: any) => {
      const { matricule, annee_etude, cours_json } = inscription;

      let coursInscrits: string[] = [];
      try {
        coursInscrits = JSON.parse(cours_json);
      } catch {
        coursInscrits = [];
      }

      if (coursInscrits.length === 0) {
        anomalies.push({
          type: "INSCRIPTION_SANS_COURS",
          matricule,
          annee: annee_etude,
          detail: "",
        });
      }

      coursInscrits.forEach((mnemo) => {
        if (!cours.find((c: any) => c.mnemonique === mnemo)) {
          anomalies.push({
            type: "COURS_INCONNU",
            matricule,
            annee: annee_etude,
            detail: mnemo,
          });
        }
      });

      const notesEtudiant = notes.filter((n: any) => n.matricule === matricule);

      notesEtudiant.forEach((note: any) => {
        if (!coursInscrits.includes(note.mnemonique)) {
          anomalies.push({
            type: "NOTE_SANS_INSCRIPTION",
            matricule,
            annee: annee_etude,
            detail: note.mnemonique,
          });
        }
      });

      const seen: Record<string, number> = {};
      notesEtudiant.forEach((note: any) => {
        seen[note.mnemonique] = (seen[note.mnemonique] || 0) + 1;
      });
      
      Object.keys(seen).forEach((mnemo) => {
        if (seen[mnemo] > 1) {
          anomalies.push({
            type: "DUPLICATA_NOTE",
            matricule,
            annee: annee_etude,
            detail: mnemo,
          });
        }
      });

      notesEtudiant.forEach((note: any) => {
        const coursNote = cours.find((c: any) => c.mnemonique === note.mnemonique);
        if (!coursNote || !coursNote.credit || coursNote.credit <= 0) {
          anomalies.push({
            type: "NOTE_SANS_CREDIT",
            matricule,
            annee: annee_etude,
            detail: note.mnemonique,
          });
        }
      });
    });

    return NextResponse.json(anomalies, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors du calcul des anomalies", details: err.message },
      { status: 500 }
    );
  }
}