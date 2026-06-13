import { Vagon } from "@/types/vagon";

export const mockSiteVagons: Vagon[] = [
  {
    id: "vagon-001",
    name: "TR-1001",
    tagNumber: "TAG-5001",
    createdAt: "2026-01-03T08:15:00Z",
  },
  {
    id: "vagon-002",
    name: "TR-1002",
    tagNumber: "TAG-5002",
    createdAt: "2026-01-05T09:20:00Z",
  },
  {
    id: "vagon-003",
    name: "TR-1003",
    tagNumber: "TAG-5003",
    createdAt: "2026-01-08T10:10:00Z",
  },
  {
      tagNumber: "TAG-999", name: "Unknown Wagon",
      id: null,
      createdAt: null
  },
  {
      tagNumber: "TAG-888", name: "Unknown Wagon",
      id: null,
      createdAt: null
  },
];