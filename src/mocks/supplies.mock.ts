export type SupplyLot = {
  id: string;
  label: string;
  expiresOn: string;
  stock: number;
};

export type SupplyItem = {
  id: string;
  name: string;
  requiresLot: boolean;
  stockOnHand: number;
  expiresOn: string | null;
  lots: SupplyLot[];
  lowStockThreshold: number;
};

export const activeSupplyCenterName = "Consultorio Melendez";

export const suppliesMock: SupplyItem[] = [
  {
    id: "sup-gasas-esteriles",
    name: "Gasas estériles",
    requiresLot: false,
    stockOnHand: 24,
    expiresOn: "2026-10-18",
    lots: [],
    lowStockThreshold: 6,
  },
  {
    id: "sup-acido-hialuronico-1ml",
    name: "Ácido hialurónico 1 ml",
    requiresLot: true,
    stockOnHand: 0,
    expiresOn: null,
    lots: [
      { id: "lot-ah1", label: "Lote A231", expiresOn: "2026-05-18", stock: 12 },
      { id: "lot-ah2", label: "Lote A364", expiresOn: "2026-06-24", stock: 21 },
      { id: "lot-ah3", label: "Lote A401", expiresOn: "2026-09-12", stock: 25 },
    ],
    lowStockThreshold: 10,
  },
  {
    id: "sup-lidocaina-topica",
    name: "Lidocaína tópica",
    requiresLot: false,
    stockOnHand: 4,
    expiresOn: "2026-07-30",
    lots: [],
    lowStockThreshold: 5,
  },
  {
    id: "sup-tubo-prp",
    name: "Tubo PRP",
    requiresLot: false,
    stockOnHand: 0,
    expiresOn: "2027-01-14",
    lots: [],
    lowStockThreshold: 3,
  },
  {
    id: "sup-toxina-botulinica-a",
    name: "Toxina botulínica tipo A",
    requiresLot: true,
    stockOnHand: 0,
    expiresOn: null,
    lots: [
      { id: "lot-tx1", label: "Lote TX-19", expiresOn: "2026-04-28", stock: 1 },
      { id: "lot-tx2", label: "Lote TX-24", expiresOn: "2026-05-08", stock: 2 },
    ],
    lowStockThreshold: 5,
  },
  {
    id: "sup-gel-conductor",
    name: "Gel conductor",
    requiresLot: false,
    stockOnHand: 12,
    expiresOn: "2026-12-04",
    lots: [],
    lowStockThreshold: 4,
  },
  {
    id: "sup-cannula-25g",
    name: "Cánula 25G",
    requiresLot: false,
    stockOnHand: 2,
    expiresOn: "2026-08-22",
    lots: [],
    lowStockThreshold: 5,
  },
  {
    id: "sup-crema-anestesica",
    name: "Crema anestésica",
    requiresLot: true,
    stockOnHand: 0,
    expiresOn: null,
    lots: [
      { id: "lot-ca1", label: "Lote CA-88", expiresOn: "2026-05-02", stock: 8 },
    ],
    lowStockThreshold: 4,
  },
];
