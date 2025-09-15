import { api } from "./client";

export async function getInscriptions() {
  
  const res = await api.get("/inscriptions");
  return res.data;
}

export async function getInscription(matricule: string, annee: number) {
  const res = await api.get(`/inscriptions/${matricule}/${annee}`);
  return res.data;
}