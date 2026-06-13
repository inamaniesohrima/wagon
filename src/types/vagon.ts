export type Vagon = {
  id: string | null;
  name: string | null;       // plate number or display name
  tagNumber: string;
  createdAt: string | null;  // ISO date string
};

export type CreateVagonInput = Omit<Vagon, "id" | "createdAt">;