import { api } from "./client";

export async function getNotes() {
  const res = await api.get("/notes");
  return res.data;
}

export async function getNotesByMatricule(matricule: string) {
  const res = await api.get(`/notes/${matricule}`);
  return res.data;
}

export async function getNoteByMatriculeAndCours(matricule: string, mnemonique: string) {
  const res = await api.get(`/notes/${matricule}/${mnemonique}`);
  return res.data;
}