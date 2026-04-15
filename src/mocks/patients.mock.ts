function makeAvatarSvgDataUrl(primary: string, secondary: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
      <defs>
        <linearGradient id="g" x1="12" y1="8" x2="82" y2="88" gradientUnits="userSpaceOnUse">
          <stop stop-color="${primary}" />
          <stop offset="1" stop-color="${secondary}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="28" fill="url(#g)" />
      <circle cx="48" cy="36" r="18" fill="rgba(255,255,255,0.95)" />
      <path d="M22 82c4-16 18-24 26-24s22 8 26 24" fill="rgba(255,255,255,0.9)" />
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export type PatientListItem = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  hasScheduledTurn: boolean;
  nextAppointment?: {
    dateLabel: string;
    treatment: string;
    sortKey: string;
  };
  lastTreatment?: {
    dateLabel: string;
    treatment: string;
    sortKey: string;
  };
};

export const patientsMock: PatientListItem[] = [
  {
    id: "p1",
    firstName: "Carla",
    lastName: "Fernández",
    fullName: "Carla Fernández",
    phone: "+54 9 11 5421 8823",
    avatarUrl: makeAvatarSvgDataUrl("#9CC6F0", "#6FA3D7"),
    hasScheduledTurn: true,
    nextAppointment: {
      dateLabel: "Hoy · 10:30",
      treatment: "Mesoterapia facial",
      sortKey: "2026-04-14T10:30:00",
    },
    lastTreatment: {
      dateLabel: "18 mar 2026",
      treatment: "Limpieza profunda",
      sortKey: "2026-03-18",
    },
  },
  {
    id: "p2",
    firstName: "Laura",
    lastName: "Pérez",
    fullName: "Laura Pérez",
    phone: "+54 9 11 6188 1407",
    avatarUrl: makeAvatarSvgDataUrl("#EABFD2", "#D18FB0"),
    hasScheduledTurn: true,
    nextAppointment: {
      dateLabel: "Hoy · 11:15",
      treatment: "Peeling suave",
      sortKey: "2026-04-14T11:15:00",
    },
    lastTreatment: {
      dateLabel: "02 abr 2026",
      treatment: "Consulta control",
      sortKey: "2026-04-02",
    },
  },
  {
    id: "p3",
    firstName: "Ana",
    lastName: "Ruiz",
    fullName: "Ana Ruiz",
    phone: "+54 9 11 4772 9314",
    hasScheduledTurn: true,
    nextAppointment: {
      dateLabel: "Mañana · 12:30",
      treatment: "Consulta control",
      sortKey: "2026-04-15T12:30:00",
    },
    lastTreatment: {
      dateLabel: "04 abr 2026",
      treatment: "Control post peeling",
      sortKey: "2026-04-04",
    },
  },
  {
    id: "p4",
    firstName: "Julia",
    lastName: "Sosa",
    fullName: "Julia Sosa",
    phone: "+54 9 11 3914 0085",
    avatarUrl: makeAvatarSvgDataUrl("#BFD8C4", "#8DB69A"),
    hasScheduledTurn: false,
    lastTreatment: {
      dateLabel: "27 feb 2026",
      treatment: "Botox frente",
      sortKey: "2026-02-27",
    },
  },
  {
    id: "p5",
    firstName: "Micaela",
    lastName: "Ríos",
    fullName: "Micaela Ríos",
    phone: "+54 9 11 7062 5519",
    hasScheduledTurn: true,
    nextAppointment: {
      dateLabel: "Mañana · 16:00",
      treatment: "Láser vascular",
      sortKey: "2026-04-15T16:00:00",
    },
    lastTreatment: {
      dateLabel: "10 ene 2026",
      treatment: "Consulta inicial",
      sortKey: "2026-01-10",
    },
  },
  {
    id: "p6",
    firstName: "Valentina",
    lastName: "Moreno",
    fullName: "Valentina Moreno",
    phone: "+54 9 11 5881 3246",
    avatarUrl: makeAvatarSvgDataUrl("#F3C89B", "#E6A76D"),
    hasScheduledTurn: false,
    lastTreatment: {
      dateLabel: "22 mar 2026",
      treatment: "Dermaplaning",
      sortKey: "2026-03-22",
    },
  },
  {
    id: "p7",
    firstName: "Lucía",
    lastName: "Gómez",
    fullName: "Lucía Gómez",
    phone: "+54 9 11 2641 1173",
    hasScheduledTurn: false,
    nextAppointment: undefined,
    lastTreatment: undefined,
  },
  {
    id: "p8",
    firstName: "Sofía",
    lastName: "Navarro",
    fullName: "Sofía Navarro",
    phone: "+54 9 11 4329 6701",
    avatarUrl: makeAvatarSvgDataUrl("#C9C3F4", "#9689DA"),
    hasScheduledTurn: true,
    nextAppointment: {
      dateLabel: "Viernes · 09:00",
      treatment: "Bioestimulación",
      sortKey: "2026-04-17T09:00:00",
    },
    lastTreatment: {
      dateLabel: "12 abr 2026",
      treatment: "Mesoterapia",
      sortKey: "2026-04-12",
    },
  },
];
