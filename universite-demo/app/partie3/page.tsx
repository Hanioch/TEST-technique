"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";


function useApi<T>(url: string) {
    return useQuery<T>({
        queryKey: [url],
        queryFn: async () => {
            const { data } = await axios.get(url);
            return data;
        },
    });
}

export default function Partie3() {
    /**
     * Explication: 
     * le mieux ici aurait été de séparer chaque liste dans un composant à part entière et de les appeler dans chaque onglet.
     * Cependant, pour des raisons de temps, j'ai préféré tout mettre dans un seul fichier.
     */
    const {
        data: bulletins,
        isLoading: loadingBulletins,
        error: errorBulletins,
    } = useApi<any[]>("/partie2/bulletins");

    const {
        data: anomalies,
        isLoading: loadingAnomalies,
        error: errorAnomalies,
    } = useApi<any[]>("/partie2/anomalies");

    const {
        data: inscriptions,
        isLoading: loadingInscriptions,
        error: errorInscriptions,
    } = useApi<any[]>("/api/inscriptions");

    const {
        data: notesRaw,
        isLoading: loadingNotes,
        error: errorNotes,
    } = useApi<any[]>("/api/notes");

    const {
        data: coursRaw,
        isLoading: loadingCours,
        error: errorCours,
    } = useApi<any[]>("/api/cours");

    if (loadingBulletins || loadingAnomalies || loadingInscriptions || loadingNotes || loadingCours) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );
    }

    if (errorBulletins || errorAnomalies || errorInscriptions || errorNotes || errorCours) {
        return <p className="text-red-500">Erreur lors du chargement des données.</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">📊 Tableau de bord</h1>

            <Tabs defaultValue="bulletins" >
                <div className="md:hidden">
                    <ScrollArea className="overflow-x-auto w-full whitespace-nowrap">
                        <TabsList className="flex w-max space-x-2">
                            <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
                            <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                            <TabsTrigger value="cours">Cours</TabsTrigger>
                            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                <div className="hidden md:block">
                    <TabsList className="grid grid-cols-5 gap-2 w-full">
                        <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
                        <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                        <TabsTrigger value="cours">Cours</TabsTrigger>
                        <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="bulletins" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bulletins?.map((b: any) => (
                        <Card key={`${b.matricule}-${b.annee}`} className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>{b.nom} {b.prenom} – Année {b.annee}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Crédits inscrits :</strong> {b.ects_total_inscrits}</p>
                                <p><strong>Crédits obtenus :</strong> {b.ects_obtenus}</p>
                                <p><strong>Moyenne pondérée :</strong> {b.moyenne_ponderee?.toFixed(2) ?? "-"}</p>
                                <p>
                                    <strong>Réussite :</strong>{" "}
                                    <span className={b.reussite ? "text-green-600" : "text-red-600"}>
                                        {b.reussite ? "✅ Oui" : "❌ Non"}
                                    </span>
                                </p>

                                {b.details && b.details.length > 0 && (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="details">
                                            <AccordionTrigger>Voir détails des cours</AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="space-y-1 text-sm">
                                                    {b.details.map((c: any) => (
                                                        <li key={c.mnemonique}>
                                                            <span className="font-medium">{c.mnemonique}</span> – {c.intitule} ({c.credit} ECTS) | Note : {c.note ?? "Non évalué"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="inscriptions" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inscriptions?.map((i: any) => {
                        let nbCours = 0;
                        try {
                            const arr = JSON.parse(i.cours_json);
                            nbCours = Array.isArray(arr) ? arr.length : 0;
                        } catch { }
                        return (
                            <Card key={`${i.matricule}-${i.annee_etude}`} className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>{i.nom} {i.prenom} – {i.matricule}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong>Année :</strong> {i.annee_etude}</p>
                                    <p><strong>Nombre de cours inscrits :</strong> {nbCours}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="notes" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesRaw?.map((n: any) => (
                        <Card key={n.id} className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Note #{n.id}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Matricule :</strong> {n.matricule}</p>
                                <p><strong>Cours :</strong> {n.mnemonique}</p>
                                <p><strong>Note :</strong> {n.note ?? "-"}</p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="cours" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coursRaw?.map((c: any) => (
                        <Card key={c.mnemonique} className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>{c.mnemonique}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Intitulé :</strong> {c.intitule}</p>
                                <p><strong>Crédit :</strong> {c.credit}</p>
                                <p><strong>Titulaire :</strong> {c.titulaire}</p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="anomalies" className="space-y-4">
                    {anomalies?.map((a: any, idx: number) => (
                        <Card key={idx}>
                            <CardHeader>
                                <CardTitle>{a.type}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Étudiant : {a.matricule} (année {a.annee})
                                </p>
                                <p>Détail : {a.detail}</p>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}