"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useEffect } from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";


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


    const [bulletinsSortField, setBulletinsSortField] = useState<"moyenne" | "annee">("moyenne");
    const [bulletinsSortOrder, setBulletinsSortOrder] = useState<"asc" | "desc">("desc");
    const [bulletinsFilterAnnee, setBulletinsFilterAnnee] = useState<string>("all");
    const [bulletinsFilterReussite, setBulletinsFilterReussite] = useState<string>("all");

    const [inscriptionsSortOrder, setInscriptionsSortOrder] = useState<"asc" | "desc">("asc");
    const [inscriptionsFilterAnnee, setInscriptionsFilterAnnee] = useState<string>("all");

    const [notesSortField, setNotesSortField] = useState<"note" | "matricule">("note");
    const [notesSortOrder, setNotesSortOrder] = useState<"asc" | "desc">("asc");

    const [coursSortOrder, setCoursSortOrder] = useState<"asc" | "desc">("asc");

    const [selectedAnomalyType, setSelectedAnomalyType] = useState<string | null>(null);


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

    let filteredBulletins = bulletins ?? [];
    if (bulletinsFilterAnnee !== "all") {
        filteredBulletins = filteredBulletins.filter(b => String(b.annee) === bulletinsFilterAnnee);
    }
    if (bulletinsFilterReussite !== "all") {
        const filterBool = bulletinsFilterReussite === "oui";
        filteredBulletins = filteredBulletins.filter(b => b.reussite === filterBool);
    }
    filteredBulletins = filteredBulletins.slice().sort((a, b) => {
        if (bulletinsSortField === "moyenne") {
            const aVal = a.moyenne_ponderee ?? -Infinity;
            const bVal = b.moyenne_ponderee ?? -Infinity;
            return bulletinsSortOrder === "asc" ? aVal - bVal : bVal - aVal;
        } else if (bulletinsSortField === "annee") {
            return bulletinsSortOrder === "asc" ? a.annee - b.annee : b.annee - a.annee;
        }
        return 0;
    });

    let filteredInscriptions = inscriptions ?? [];
    if (inscriptionsFilterAnnee !== "all") {
        filteredInscriptions = filteredInscriptions.filter(i => String(i.annee_etude) === inscriptionsFilterAnnee);
    }
    filteredInscriptions = filteredInscriptions.slice().sort((a, b) => {
        if (inscriptionsSortOrder === "asc") {
            return a.matricule.localeCompare(b.matricule);
        } else {
            return b.matricule.localeCompare(a.matricule);
        }
    });

    let sortedNotes = notesRaw ?? [];
    sortedNotes = sortedNotes.slice().sort((a, b) => {
        if (notesSortField === "note") {
            const aNote = a.note ?? -Infinity;
            const bNote = b.note ?? -Infinity;
            return notesSortOrder === "asc" ? aNote - bNote : bNote - aNote;
        } else if (notesSortField === "matricule") {
            return notesSortOrder === "asc" ? a.matricule.localeCompare(b.matricule) : b.matricule.localeCompare(a.matricule);
        }
        return 0;
    });

    let sortedCours = coursRaw ?? [];
    sortedCours = sortedCours.slice().sort((a, b) => {
        if (coursSortOrder === "asc") {
            return a.credit - b.credit;
        } else {
            return b.credit - a.credit;
        }
    });

    const anomaliesByType = (anomalies ?? []).reduce((acc: Record<string, any[]>, anomaly) => {
        if (!acc[anomaly.type]) acc[anomaly.type] = [];
        acc[anomaly.type].push(anomaly);
        return acc;
    }, {});

    const bulletinsYears = Array.from(new Set((bulletins ?? []).map(b => String(b.annee)))).sort();
    const inscriptionsYears = Array.from(new Set((inscriptions ?? []).map(i => String(i.annee_etude)))).sort();

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

                <TabsContent value="bulletins" className="mt-4">
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Trier par</span>
                            <Select
                                value={bulletinsSortField}
                                onValueChange={v => setBulletinsSortField(v as "moyenne" | "annee")}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="moyenne">Moyenne pondérée</SelectItem>
                                    <SelectItem value="annee">Année</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Ordre</span>
                            <Button
                                variant="outline"
                                className="w-40"
                                onClick={() => setBulletinsSortOrder(bulletinsSortOrder === "asc" ? "desc" : "asc")}
                            >
                                {bulletinsSortOrder === "asc" ? "Ascendant" : "Descendant"}
                            </Button>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Filtrer année</span>
                            <Select
                                value={bulletinsFilterAnnee}
                                onValueChange={v => setBulletinsFilterAnnee(v)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    {bulletinsYears.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Filtrer réussite</span>
                            <Select
                                value={bulletinsFilterReussite}
                                onValueChange={v => setBulletinsFilterReussite(v)}
                            >
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    <SelectItem value="oui">Oui</SelectItem>
                                    <SelectItem value="non">Non</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  items-start">
                        {filteredBulletins.map((b: any) => (
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
                    </div>
                </TabsContent>

                <TabsContent value="inscriptions" className="mt-4">
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Trier matricule</span>
                            <Button
                                variant="outline"
                                className="w-40"
                                onClick={() => setInscriptionsSortOrder(inscriptionsSortOrder === "asc" ? "desc" : "asc")}
                            >
                                {inscriptionsSortOrder === "asc" ? "Ascendant" : "Descendant"}
                            </Button>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Filtrer année</span>
                            <Select
                                value={inscriptionsFilterAnnee}
                                onValueChange={v => setInscriptionsFilterAnnee(v)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous</SelectItem>
                                    {inscriptionsYears.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredInscriptions.map((i: any) => {
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
                    </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-4">
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Trier par</span>
                            <Select
                                value={notesSortField}
                                onValueChange={v => setNotesSortField(v as "note" | "matricule")}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="note">Note</SelectItem>
                                    <SelectItem value="matricule">Matricule</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Ordre</span>
                            <Button
                                variant="outline"
                                className="w-32"
                                onClick={() => setNotesSortOrder(notesSortOrder === "asc" ? "desc" : "asc")}
                            >
                                {notesSortOrder === "asc" ? "Ascendant" : "Descendant"}
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedNotes.map((n: any) => (
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
                    </div>
                </TabsContent>

                <TabsContent value="cours" className="mt-4">
                    <div className="mb-4 flex flex-wrap gap-4 items-center">
                        <div className="flex flex-col">
                            <span className="text-xs mb-1">Trier crédit</span>
                            <Button
                                variant="outline"
                                className="w-40"
                                onClick={() => setCoursSortOrder(coursSortOrder === "asc" ? "desc" : "asc")}
                            >
                                {coursSortOrder === "asc" ? "Ascendant" : "Descendant"}
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedCours.map((c: any) => (
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
                    </div>
                </TabsContent>

                <TabsContent value="anomalies" className="">
                    <div className="md:hidden space-y-4">
                        <Accordion type="multiple" >
                            {Object.entries(anomaliesByType).map(([type, anomaliesList]) => (
                                <AccordionItem key={type} value={type}>
                                    <AccordionTrigger>{type} ({anomaliesList.length})</AccordionTrigger>
                                    <AccordionContent>
                                        {anomaliesList.map((a: any, idx: number) => (
                                            <Card key={idx} className="mb-2">
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
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div className="hidden md:flex gap-8 mt-4">
                        <div className="w-1/3 flex flex-col gap-2">
                            {Object.keys(anomaliesByType).map((type) => (
                                <button
                                    key={type}
                                    className={`px-4 py-2 rounded text-left border transition-colors ${selectedAnomalyType === type
                                        ? "bg-gray-200 border-gray-400 font-medium"
                                        : "bg-white border-gray-300 hover:bg-gray-100"
                                        }`}
                                    onClick={() => setSelectedAnomalyType(type)}
                                >
                                    {type} <span className="text-gray-500">({anomaliesByType[type].length})</span>
                                </button>
                            ))}
                        </div>
                        <div className="w-2/3 flex flex-col gap-4">
                            {(selectedAnomalyType && anomaliesByType[selectedAnomalyType]?.length > 0) ? (
                                anomaliesByType[selectedAnomalyType].map((a: any, idx: number) => (
                                    <Card key={idx} className="mb-2">
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
                                ))
                            ) : selectedAnomalyType ? (
                                <p className="text-gray-500">Aucune anomalie pour ce type.</p>
                            ) : (
                                <p className="text-gray-500">Aucun type sélectionné.</p>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}