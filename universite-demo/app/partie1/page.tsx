"use client";

import { useGetApiInscriptions } from "@/lib/api/partie1/inscriptions/inscriptions";

export default function Page() {
    const { data, isLoading, error } = useGetApiInscriptions();

    if (isLoading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {(error as Error).message}</p>;

    const inscriptions = data?.data ?? [];

    return (
        <ul>
            {inscriptions.map((i: any) => (
                <li key={`${i.matricule}-${i.annee_etude}`}>
                    {i.nom} {i.prenom} – {i.annee_etude}
                </li>
            ))}
        </ul>
    );
}