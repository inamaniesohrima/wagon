import type { Vagon, CreateVagonInput } from "@/types/vagon";
import { mockVagons } from "./mockVagons";

const STORAGE_KEY = "vagons";

function getAll(): Vagon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Vagon[]) : [];
  } catch {
    return [];
  }
}

function save(vagons: Vagon[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vagons));
}

export const vagonService = {
  getAll,

  getById(id: string): Vagon | undefined {
    return getAll().find((v) => v.id === id);
  },

  create(input: CreateVagonInput): Vagon {
    const vagon: Vagon = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save([...getAll(), vagon]);
    return vagon;
  },

  addMocks(): void {
    if (getAll().length === 0) {
      save(mockVagons);
    }
  },


  update(id: string, input: Partial<CreateVagonInput>): Vagon | null {
    const all = getAll();
    const index = all.findIndex((v) => v.id === id);
    if (index === -1) return null;
    const updated = { ...all[index], ...input };
    all[index] = updated;
    save(all);
    return updated;
  },

  delete(id: string): boolean {
    const all = getAll();
    const filtered = all.filter((v) => v.id !== id);
    if (filtered.length === all.length) return false;
    save(filtered);
    return true;
  },
};