const API = "https://rickandmortyapi.com/api";

export type RMCharacter = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
  episode: string[];
};

export type PageInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

export async function fetchCharacters(page = 1) {
  const res = await fetch(`${API}/character?page=${page}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data as { info: PageInfo; results: RMCharacter[] };
}

export async function fetchCharacter(id: number) {
  const res = await fetch(`${API}/character/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as RMCharacter;
}