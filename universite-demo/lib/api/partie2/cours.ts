import { api } from "./client";

export async function getCours() {
  const res = await api.get("/cours");
  return res.data;
}

export async function getCoursById(mnemonique: string) {
  const res = await api.get(`/cours/${mnemonique}`);
  return res.data;
}