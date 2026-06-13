import type { FuelRecord, CreateFuelRecordInput } from "@/types/fuel-record";
import { mockFuelRecords } from "./mockFuelRecords";

const STORAGE_KEY = "fuel_records";

function getAll(): FuelRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FuelRecord[]) : [];
  } catch {
    return [];
  }
}

function save(records: FuelRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export const fuelRecordService = {
  getAll,

  getById(id: string): FuelRecord | undefined {
    return getAll().find((r) => r.id === id);
  },

  getByVagonId(vagonId: string): FuelRecord[] {
    return getAll().filter((r) => r.vagonId === vagonId);
  },

  create(input: CreateFuelRecordInput): FuelRecord {
    const record: FuelRecord = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    save([...getAll(), record]);
    return record;
  },

  addMocks(): void {
    if (getAll().length === 0) {
      save(mockFuelRecords);
    }
  },

  update(id: string, input: Partial<CreateFuelRecordInput>): FuelRecord | null {
    const all = getAll();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const updated = { ...all[index], ...input };
    all[index] = updated;
    save(all);
    return updated;
  },

  delete(id: string): boolean {
    const all = getAll();
    const filtered = all.filter((r) => r.id !== id);
    if (filtered.length === all.length) return false;
    save(filtered);
    return true;
  },

  deleteByVagonId(vagonId: string): number {
    const all = getAll();
    const filtered = all.filter((r) => r.vagonId !== vagonId);
    save(filtered);
    return all.length - filtered.length;
  },
};