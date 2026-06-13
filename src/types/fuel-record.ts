export type FuelRecord = {
  id: string;
  vagonId: string;    // relation to Vagon
  disNumber: string;
  personalNumber: string;
  date: string;       // ISO date string (YYYY-MM-DD)
  liters: number;
  preset: number;
  duration: number;   // in minutes
  createdAt: string;  // ISO date string
};

export type CreateFuelRecordInput = Omit<FuelRecord, "id" | "createdAt">;