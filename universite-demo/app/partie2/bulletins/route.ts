import { NextResponse } from "next/server";
import { getInscriptions } from "@/lib/api/partie2/inscriptions";
import { getCours } from "@/lib/api/partie2/cours";
import { getNotes } from "@/lib/api/partie2/notes";

type Bulletin = {
  matricule: string;
  nom: string;
  prenom: string;
  annee: number;
  ects_total_inscrits: number;
  ects_obtenus: number;
  moyenne_ponderee: number | null;
  reussite: boolean;
  details: {
    mnemonique: string;
    intitule: string;
    credit: number;
    titulaire: string;
    note: number | null;
  }[];
};

export async function GET() {
  try {
    const inscriptions = await getInscriptions();
    const cours = await getCours();
    const notes = await getNotes();

    const bulletins: Bulletin[] = inscriptions.map((inscription: any) => {
      const { matricule, nom, prenom, annee_etude, cours_json } = inscription;

      let coursInscrits: string[] = [];
      try {
        coursInscrits = JSON.parse(cours_json);
      } catch (e) {
        coursInscrits = [];
      }

      const details = coursInscrits.map((mnemo) => {
        const c = cours.find((cc: any) => cc.mnemonique === mnemo);
        const note = notes.find(
          (n: any) => n.matricule === matricule && n.mnemonique === mnemo
        )?.note ?? null;

        return {
          mnemonique: mnemo,
          intitule: c?.intitule ?? "Inconnu",
          credit: c?.credit ?? 0,
          titulaire: c?.titulaire ?? "Inconnu",
          note,
        };
      });

      const ects_total_inscrits = details.reduce((acc, d) => acc + (d.credit || 0), 0);
      const ects_obtenus = details.reduce(
        (acc, d) => acc + (d.note !== null && d.note >= 10 ? d.credit : 0),
        0
      );

      const notesAvecCredits = details.filter((d) => d.note !== null);
      const moyenne_ponderee =
        notesAvecCredits.length > 0
          ? parseFloat((
              notesAvecCredits.reduce((acc, d) => acc + d.note! * d.credit, 0) /
              notesAvecCredits.reduce((acc, d) => acc + d.credit, 0)
            ).toFixed(2))
          : null;


      const reussite =
        ects_obtenus >= 60 ||
        (notesAvecCredits.length === details.length &&
          (moyenne_ponderee ?? 0) >= 10);

      details.sort((a, b) => a.mnemonique.localeCompare(b.mnemonique));

      return {
        matricule,
        nom,
        prenom,
        annee: annee_etude,
        ects_total_inscrits,
        ects_obtenus,
        moyenne_ponderee,
        reussite,
        details,
      };
    });

    return NextResponse.json(bulletins, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erreur lors du calcul des bulletins", details: err.message },
      { status: 500 }
    );
  }
}