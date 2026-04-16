import { turnMockById } from "./turn.mock";

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
  selectedProducts?: ChargeProduct[];
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
    treatment: "Bioestimulación facial",
    treatmentAmount: 100000,
    formattedTreatmentAmount: formatMoney(100000),
    selectedProducts: [
      {
        id: "p1",
        name: "Protector solar clínico",
        price: 40000,
        formattedPrice: formatMoney(40000),
      },
    ],
    availableProducts: [
      {
        id: "p1",
        name: "Protector solar clínico",
        price: 40000,
        formattedPrice: formatMoney(40000),
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
        method: "Efectivo",
        amount: 50000,
        formattedAmount: formatMoney(50000),
      },
      {
        id: "l2",
        method: "Transferencia",
        amount: 90000,
        formattedAmount: formatMoney(90000),
      },
    ],
  },
  a2: {
    id: "a2",
    patient: "Laura Pérez",
    treatment: "Full face con bioestimulador",
    treatmentAmount: 250000,
    formattedTreatmentAmount: formatMoney(250000),
    selectedProducts: [],
    availableProducts: [
      {
        id: "p4",
        name: "Sérum post procedimiento",
        price: 30000,
        formattedPrice: formatMoney(30000),
      },
    ],
    paymentLines: [
      {
        id: "l1",
        method: "Efectivo",
        amount: 0,
        formattedAmount: formatMoney(0),
      },
    ],
  },
};

export function chargeMockById(id?: string): ChargeMock {
  if (id && chargeMocks[id]) return chargeMocks[id];

  if (id) {
    const turn = turnMockById(id);

    if (turn.id === id) {
      const genericAmountByTurnId: Record<string, number> = {
        a3: 120000,
        a4: 135000,
        a5: 180000,
        a6: 90000,
      };

      const amount = genericAmountByTurnId[id] ?? 100000;

      return {
        id,
        patient: turn.patient,
        treatment: turn.treatment,
        treatmentAmount: amount,
        formattedTreatmentAmount: formatMoney(amount),
        selectedProducts: [],
        availableProducts: [
          {
            id: `${id}-p1`,
            name: "Producto complementario",
            price: 25000,
            formattedPrice: formatMoney(25000),
          },
        ],
        paymentLines: [
          {
            id: "l1",
            method: "Efectivo",
            amount: 0,
            formattedAmount: formatMoney(0),
          },
        ],
      };
    }
  }

  return chargeMocks.a1;
}
