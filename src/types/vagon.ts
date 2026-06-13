export type Vagon = {
  id: string;
  name: string;       // plate number or display name
  tagNumber: string;
  createdAt: string;  // ISO date string
};

export type CreateVagonInput = Omit<Vagon, "id" | "createdAt">;