export type AvailabilityMode = "habitual" | "blocked" | "extra";
export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type TimeRange = {
  id: string;
  start: string;
  end: string;
};

export type AvailabilityException = {
  id: string;
  date: string;
  start: string;
  end: string;
};

export type AvailabilityScreenMock = {
  centerName: string;
  weeklySchedule: Record<WeekdayKey, TimeRange[]>;
  blockedRanges: AvailabilityException[];
  extraRanges: AvailabilityException[];
};

export const weekdayLabels: Record<WeekdayKey, string> = {
  mon: "Lun",
  tue: "Mar",
  wed: "Mié",
  thu: "Jue",
  fri: "Vie",
  sat: "Sáb",
};

export const availabilityMock: AvailabilityScreenMock = {
  centerName: "Consultorio Martina López",
  weeklySchedule: {
    mon: [
      { id: "mon-1", start: "09:00", end: "13:00" },
      { id: "mon-2", start: "14:00", end: "18:00" },
    ],
    tue: [
      { id: "tue-1", start: "10:00", end: "14:00" },
      { id: "tue-2", start: "15:00", end: "18:00" },
    ],
    wed: [{ id: "wed-1", start: "09:00", end: "17:00" }],
    thu: [
      { id: "thu-1", start: "09:00", end: "13:00" },
      { id: "thu-2", start: "14:30", end: "18:30" },
    ],
    fri: [{ id: "fri-1", start: "09:30", end: "15:30" }],
    sat: [{ id: "sat-1", start: "10:00", end: "13:30" }],
  },
  blockedRanges: [
    { id: "block-1", date: "2026-04-21", start: "10:00", end: "11:30" },
    { id: "block-2", date: "2026-04-24", start: "13:00", end: "14:00" },
  ],
  extraRanges: [
    { id: "extra-1", date: "2026-04-22", start: "18:30", end: "20:00" },
    { id: "extra-2", date: "2026-04-25", start: "09:00", end: "12:00" },
  ],
};
