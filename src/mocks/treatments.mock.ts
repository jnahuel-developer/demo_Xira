export type TreatmentCategory = "Inyectables" | "Aparatología";
export type TreatmentStatus = "enabled" | "blocked";

export type TreatmentSupply = {
  id: string;
  name: string;
  quantityLabel: string;
};

export type TreatmentCertification = {
  id: string;
  name: string;
  expiresLabel: string;
};

export type TreatmentListItem = {
  id: string;
  name: string;
  category: TreatmentCategory;
  durationLabel: string;
  status: TreatmentStatus;
  critical: boolean;
  requiresEquipment: boolean;
  equipmentName: string | null;
  enabledInCurrentCenter: boolean;
  equipmentAvailable: boolean;
  suppliesAvailable: boolean;
  supplies: TreatmentSupply[];
  certifications: TreatmentCertification[];
};

export const activeCenterName = "Consultorio Melendez";

export const treatmentsMock: TreatmentListItem[] = [
  {
    id: "tx-hialuronico-full-face",
    name: "Acido hialuronico full face",
    category: "Inyectables",
    durationLabel: "60 min",
    status: "enabled",
    critical: true,
    requiresEquipment: false,
    equipmentName: null,
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-jeringa-5ml", name: "Jeringa 5 ml", quantityLabel: "Cantidad: 2" },
      { id: "ins-cannula-25g", name: "Cannula 25G", quantityLabel: "Cantidad: 2" },
      {
        id: "ins-hialuronico-premium",
        name: "Relleno acido hialuronico premium",
        quantityLabel: "Cantidad: 3 ampollas",
      },
    ],
    certifications: [
      {
        id: "cert-inyectables-avanzados",
        name: "Certificacion en inyectables avanzados",
        expiresLabel: "Vence: 12 dic 2026",
      },
      {
        id: "cert-urgencias-consultorio",
        name: "Manejo de urgencias en consultorio",
        expiresLabel: "Vence: 04 mar 2027",
      },
    ],
  },
  {
    id: "tx-botox-tercio-superior",
    name: "Toxina botulinica tercio superior",
    category: "Inyectables",
    durationLabel: "30 min",
    status: "enabled",
    critical: true,
    requiresEquipment: false,
    equipmentName: null,
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-agujas-30g", name: "Agujas 30G", quantityLabel: "Cantidad: 4" },
      { id: "ins-toxina-a", name: "Toxina botulinica tipo A", quantityLabel: "Cantidad: 1 vial" },
    ],
    certifications: [
      {
        id: "cert-toxina-facial",
        name: "Certificacion toxina facial",
        expiresLabel: "Vence: 21 ago 2026",
      },
    ],
  },
  {
    id: "tx-radiofrecuencia-facial",
    name: "Radiofrecuencia facial",
    category: "Aparatología",
    durationLabel: "45 min",
    status: "blocked",
    critical: false,
    requiresEquipment: true,
    equipmentName: "Radiofrecuencia Venus Viva",
    enabledInCurrentCenter: true,
    equipmentAvailable: false,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-gel-conductor", name: "Gel conductor", quantityLabel: "Cantidad: 1 pomo" },
    ],
    certifications: [
      {
        id: "cert-radiofrecuencia",
        name: "Certificacion radiofrecuencia",
        expiresLabel: "Vence: 07 ene 2027",
      },
    ],
  },
  {
    id: "tx-peeling-superficial",
    name: "Peeling quimico superficial",
    category: "Inyectables",
    durationLabel: "40 min",
    status: "enabled",
    critical: false,
    requiresEquipment: false,
    equipmentName: null,
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-acido-mandelico", name: "Acido mandelico", quantityLabel: "Cantidad: 1 frasco" },
      { id: "ins-gasas", name: "Gasa esteril", quantityLabel: "Cantidad: 4" },
    ],
    certifications: [],
  },
  {
    id: "tx-laser-co2",
    name: "Laser CO2 fraccionado",
    category: "Aparatología",
    durationLabel: "75 min",
    status: "blocked",
    critical: true,
    requiresEquipment: true,
    equipmentName: "Laser CO2 Fraccional SmartX",
    enabledInCurrentCenter: false,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-crema-anestesica", name: "Crema anestesica", quantityLabel: "Cantidad: 1" },
    ],
    certifications: [
      {
        id: "cert-laser-co2",
        name: "Certificacion laser CO2",
        expiresLabel: "Vence: 18 nov 2026",
      },
      {
        id: "cert-fotoproteccion",
        name: "Fotoproteccion post laser",
        expiresLabel: "Vence: 02 feb 2027",
      },
    ],
  },
  {
    id: "tx-mesoterapia-corporal",
    name: "Mesoterapia corporal",
    category: "Inyectables",
    durationLabel: "50 min",
    status: "blocked",
    critical: false,
    requiresEquipment: false,
    equipmentName: null,
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: false,
    supplies: [
      { id: "ins-fosfatidilcolina", name: "Fosfatidilcolina", quantityLabel: "Cantidad: 3 ampollas" },
      { id: "ins-agujas-27g", name: "Agujas 27G", quantityLabel: "Cantidad: 6" },
    ],
    certifications: [],
  },
  {
    id: "tx-hifu-facial",
    name: "HIFU facial",
    category: "Aparatología",
    durationLabel: "55 min",
    status: "enabled",
    critical: false,
    requiresEquipment: true,
    equipmentName: "Ultrasonido focalizado HIFU Pro",
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-gel-hifu", name: "Gel acoplante HIFU", quantityLabel: "Cantidad: 1 pomo" },
    ],
    certifications: [
      {
        id: "cert-hifu",
        name: "Certificacion HIFU",
        expiresLabel: "Vence: 29 sep 2026",
      },
    ],
  },
  {
    id: "tx-prp-capilar",
    name: "PRP capilar",
    category: "Inyectables",
    durationLabel: "45 min",
    status: "enabled",
    critical: false,
    requiresEquipment: true,
    equipmentName: "Centrifuga Clinica SpinLab",
    enabledInCurrentCenter: true,
    equipmentAvailable: true,
    suppliesAvailable: true,
    supplies: [
      { id: "ins-tubo-prp", name: "Tubo PRP", quantityLabel: "Cantidad: 2" },
      { id: "ins-kit-extraccion", name: "Kit de extraccion", quantityLabel: "Cantidad: 1" },
    ],
    certifications: [
      {
        id: "cert-prp",
        name: "Certificacion PRP",
        expiresLabel: "Vence: 14 abr 2027",
      },
    ],
  },
];
