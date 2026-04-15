export type EquipmentLocationType = "active_center" | "other_center" | "service";

export type EquipmentSupplyRef = {
  id: string;
  name: string;
};

export type EquipmentItem = {
  id: string;
  name: string;
  descriptor: string;
  locationType: EquipmentLocationType;
  locationLabel: string;
  supplies: EquipmentSupplyRef[];
};

export const activeEquipmentCenterName = "Consultorio Melendez";

export const equipmentMock: EquipmentItem[] = [
  {
    id: "eq-hifu-pro",
    name: "Ultrasonido focalizado",
    descriptor: "HIFU Pro 4D",
    locationType: "active_center",
    locationLabel: "Disponible en Consultorio Melendez",
    supplies: [
      { id: "sup-gel-conductor", name: "Gel conductor" },
      { id: "sup-mascara-conductiva", name: "Máscara conductiva" },
    ],
  },
  {
    id: "eq-radiofrecuencia-venus",
    name: "Radiofrecuencia facial",
    descriptor: "Venus Viva",
    locationType: "service",
    locationLabel: "En service técnico",
    supplies: [{ id: "sup-gel-conductor", name: "Gel conductor" }],
  },
  {
    id: "eq-laser-co2-smartx",
    name: "Láser CO2 fraccional",
    descriptor: "SmartX CO2",
    locationType: "other_center",
    locationLabel: "Asignado a Centro Norte",
    supplies: [
      { id: "sup-crema-anestesica", name: "Crema anestésica" },
      { id: "sup-gafas-laser", name: "Gafas de protección láser" },
    ],
  },
  {
    id: "eq-centrifuga-spinlab",
    name: "Centrífuga clínica",
    descriptor: "SpinLab 8 tubos",
    locationType: "active_center",
    locationLabel: "Disponible en Consultorio Melendez",
    supplies: [{ id: "sup-tubo-prp", name: "Tubo PRP" }],
  },
  {
    id: "eq-mascara-led",
    name: "Máscara LED facial",
    descriptor: "Photocare Home Pro",
    locationType: "active_center",
    locationLabel: "Disponible en Consultorio Melendez",
    supplies: [],
  },
  {
    id: "eq-criolipolisis-coolshape",
    name: "Criolipólisis corporal",
    descriptor: "CoolShape X2",
    locationType: "other_center",
    locationLabel: "Asignado a Centro Belgrano",
    supplies: [
      { id: "sup-membrana-crio", name: "Membrana anticongelante" },
      { id: "sup-gel-conductor", name: "Gel conductor" },
    ],
  },
  {
    id: "eq-dermapen-m8",
    name: "Microneedling",
    descriptor: "Dermapen M8",
    locationType: "active_center",
    locationLabel: "Disponible en Consultorio Melendez",
    supplies: [
      { id: "sup-cartucho-12", name: "Cartucho 12 puntas" },
      { id: "sup-serum-vitamina-c", name: "Serum vitamina C" },
    ],
  },
  {
    id: "eq-rf-multipolar",
    name: "Radiofrecuencia corporal",
    descriptor: "RF Multi Body 3.1",
    locationType: "service",
    locationLabel: "En service técnico",
    supplies: [],
  },
];
