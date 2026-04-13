export type ChargePaymentMethod = "Efectivo" | "Transferencia" | "Posnet";

export type ChargeProduct = {
  id: string;
  name: string;
  price: number;
  formattedPrice: string;
};

export type ChargePaymentLine = {
  id: string;
  method: ChargePaymentMethod;
  amount: number;
  formattedAmount: string;
};

export type ChargeMock = {
  id: string;
  patient: string;
  treatment: string;
  treatmentAmount: number;
  formattedTreatmentAmount: string;
  availableProducts: ChargeProduct[];
  paymentLines: ChargePaymentLine[];
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const chargeMocks: Record<string, ChargeMock> = {
  a1: {
    id: "a1",
    patient: "Carla Fernández",
    treatment: "Mesoterapia facial",
    treatmentAmount: 85000,
    formattedTreatmentAmount: formatMoney(85000),
    availableProducts: [
      {
        id: "p1",
        name: "Crema post tratamiento",
        price: 18000,
        formattedPrice: formatMoney(18000),
      },
      {
        id: "p2",
        name: "Sérum calmante",
        price: 14500,
        formattedPrice: formatMoney(14500),
      },
      {
        id: "p3",
        name: "Protector solar clínico",
        price: 21000,
        formattedPrice: formatMoney(21000),
      },
    ],
    paymentLines: [
      {
        id: "l1",
        method: "Transferencia",
        amount: 60000,
        formattedAmount: formatMoney(60000),
      },
    ],
  },
  a2: {
    id: "a2",
    patient: "Laura Pérez",
    treatment: "Peeling suave",
    treatmentAmount: 62000,
    formattedTreatmentAmount: formatMoney(62000),
    availableProducts: [
      {
        id: "p4",
        name: "Crema reparadora",
        price: 16000,
        formattedPrice: formatMoney(16000),
      },
    ],
    paymentLines: [
      {
        id: "l1",
        method: "Efectivo",
        amount: 62000,
        formattedAmount: formatMoney(62000),
      },
    ],
  },
};

export function chargeMockById(id?: string): ChargeMock {
  if (id && chargeMocks[id]) return chargeMocks[id];
  return chargeMocks.a1;
}