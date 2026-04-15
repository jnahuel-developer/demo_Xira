import { patientsMock } from "./patients.mock";

export type HistoryCategory = "inyectables" | "aparatologia";
export type HistoryPeriod = "30d" | "90d" | "any";

export type PatientHistoryPhoto = {
  id: string;
  kind: "before" | "after";
  url: string;
};

export type PatientHistoryEntry = {
  id: string;
  patientId: string;
  dateLabel: string;
  sortKey: string;
  treatment: string;
  category: HistoryCategory;
  professionalId: string;
  professionalName: string;
  centerId: string;
  centerName: string;
  publicNote?: string;
  privateNote?: string;
  photos: PatientHistoryPhoto[];
};

export type PatientHistoryScreenMock = {
  patientId: string;
  patientName: string;
  currentProfessionalId: string;
  entries: PatientHistoryEntry[];
};

function makePhotoDataUrl(label: string, colorA: string, colorB: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 220" fill="none">
      <defs>
        <linearGradient id="g" x1="18" y1="14" x2="150" y2="206" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colorA}" />
          <stop offset="1" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="180" height="220" rx="28" fill="url(#g)" />
      <circle cx="90" cy="82" r="34" fill="rgba(255,255,255,0.85)" />
      <path d="M36 180c8-28 32-46 54-46 22 0 46 18 54 46" fill="rgba(255,255,255,0.78)" />
      <rect x="48" y="18" width="84" height="28" rx="14" fill="rgba(255,255,255,0.82)" />
      <text x="90" y="37" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#244768">${label}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const patientHistoryEntries: PatientHistoryEntry[] = [
  {
    id: "h-p1-1",
    patientId: "p1",
    dateLabel: "14 abr 2026",
    sortKey: "2026-04-14",
    treatment: "Mesoterapia facial",
    category: "inyectables",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Buena tolerancia al procedimiento y respuesta uniforme.",
    privateNote: "Conviene mantener la misma profundidad en el próximo control.",
    photos: [
      {
        id: "h-p1-1-before",
        kind: "before",
        url: makePhotoDataUrl("Antes", "#d8e9fb", "#b2d0ef"),
      },
      {
        id: "h-p1-1-after",
        kind: "after",
        url: makePhotoDataUrl("Después", "#dcefdc", "#b7ddb7"),
      },
    ],
  },
  {
    id: "h-p1-2",
    patientId: "p1",
    dateLabel: "18 mar 2026",
    sortKey: "2026-03-18",
    treatment: "Limpieza profunda",
    category: "aparatologia",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Piel menos reactiva que en la visita anterior.",
    privateNote: "Puede tolerar subir intensidad en la próxima aparatología.",
    photos: [
      {
        id: "h-p1-2-before",
        kind: "before",
        url: makePhotoDataUrl("Antes", "#e6eefb", "#c8d7ef"),
      },
    ],
  },
  {
    id: "h-p1-3",
    patientId: "p1",
    dateLabel: "05 ene 2026",
    sortKey: "2026-01-05",
    treatment: "Radiofrecuencia facial",
    category: "aparatologia",
    professionalId: "m2",
    professionalName: "Dr. Ignacio Pereyra",
    centerId: "c2",
    centerName: "Centro Estético Norte",
    publicNote: "Se indicó seguimiento a 30 días.",
    photos: [],
  },
  {
    id: "h-p2-1",
    patientId: "p2",
    dateLabel: "11 abr 2026",
    sortKey: "2026-04-11",
    treatment: "Peeling suave",
    category: "aparatologia",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Se observó buena evolución, sin descamación marcada.",
    privateNote: "Mantener hidratación reforzada una semana más.",
    photos: [
      {
        id: "h-p2-1-before",
        kind: "before",
        url: makePhotoDataUrl("Antes", "#f1e5d7", "#e5c8a8"),
      },
      {
        id: "h-p2-1-after",
        kind: "after",
        url: makePhotoDataUrl("Después", "#e3efd5", "#c5deac"),
      },
    ],
  },
  {
    id: "h-p2-2",
    patientId: "p2",
    dateLabel: "22 feb 2026",
    sortKey: "2026-02-22",
    treatment: "Mesoterapia despigmentante",
    category: "inyectables",
    professionalId: "m2",
    professionalName: "Dr. Ignacio Pereyra",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Se indicó control en 6 semanas.",
    photos: [],
  },
  {
    id: "h-p3-1",
    patientId: "p3",
    dateLabel: "04 abr 2026",
    sortKey: "2026-04-04",
    treatment: "Control post peeling",
    category: "aparatologia",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Sin eritema residual.",
    privateNote: "Piel respondió mejor que en diciembre.",
    photos: [],
  },
  {
    id: "h-p3-2",
    patientId: "p3",
    dateLabel: "12 mar 2026",
    sortKey: "2026-03-12",
    treatment: "Relleno de surco",
    category: "inyectables",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Corrección sutil, sin edema posterior.",
    privateNote: "Usar misma marca si vuelve a pedir refuerzo.",
    photos: [
      {
        id: "h-p3-2-after",
        kind: "after",
        url: makePhotoDataUrl("Después", "#e8e1f5", "#cbc0e8"),
      },
    ],
  },
  {
    id: "h-p4-1",
    patientId: "p4",
    dateLabel: "27 feb 2026",
    sortKey: "2026-02-27",
    treatment: "Botox frente",
    category: "inyectables",
    professionalId: "m2",
    professionalName: "Dr. Ignacio Pereyra",
    centerId: "c2",
    centerName: "Centro Estético Norte",
    publicNote: "Resultado homogéneo al control de 15 días.",
    photos: [],
  },
  {
    id: "h-p5-1",
    patientId: "p5",
    dateLabel: "10 ene 2026",
    sortKey: "2026-01-10",
    treatment: "Consulta inicial",
    category: "aparatologia",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Se planificó secuencia de láser vascular.",
    privateNote: "Importante revisar sensibilidad previa al equipo.",
    photos: [],
  },
  {
    id: "h-p8-1",
    patientId: "p8",
    dateLabel: "12 abr 2026",
    sortKey: "2026-04-12",
    treatment: "Mesoterapia",
    category: "inyectables",
    professionalId: "m1",
    professionalName: "Dra. Martina López",
    centerId: "c1",
    centerName: "Consultorio Martina López",
    publicNote: "Sin molestias posteriores.",
    privateNote: "Buen candidato para bioestimulación en el próximo turno.",
    photos: [
      {
        id: "h-p8-1-before",
        kind: "before",
        url: makePhotoDataUrl("Antes", "#dfeaf8", "#bfd3ec"),
      },
    ],
  },
];

export function getPatientHistoryScreenMock(
  patientId?: string
): PatientHistoryScreenMock {
  const patient = patientsMock.find((item) => item.id === patientId) ?? patientsMock[0];

  return {
    patientId: patient.id,
    patientName: patient.fullName,
    currentProfessionalId: "m1",
    entries: patientHistoryEntries.filter((entry) => entry.patientId === patient.id),
  };
}
