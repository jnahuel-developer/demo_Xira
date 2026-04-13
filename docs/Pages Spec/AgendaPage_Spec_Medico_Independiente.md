# Screen Specification — Médico Independiente — AgendaPage

## 1. Purpose

`AgendaPage.tsx` is the **daily operational schedule screen** for the independent doctor in the mobile-first experience.

Its job is to let the doctor:

- understand the day quickly;
- review all appointments in chronological order;
- navigate between days;
- select an appointment;
- open the selected appointment workflow;
- jump to the patient record if needed;
- create a new appointment.

This screen is **not** the clinical workflow itself.  
It is the **temporal control layer** of the doctor's workday.

---

## 2. Product role of the screen

Within the doctor's navigation model:

- **Hoy** = immediate operational context
- **Agenda** = complete day view and day navigation
- **Pacientes** = search and clinical access
- **Más** = secondary management and configuration

So `AgendaPage` must feel like:

- simple;
- fast to scan;
- structured;
- calm;
- operational.

It must **not** feel like:

- a classic calendar app;
- a desktop table forced into mobile;
- a clinical history screen;
- a dashboard with business analytics.

---

## 3. Main UX objective

The screen must answer these questions very quickly:

1. What appointments do I have today?
2. Which one is relevant now?
3. Who is waiting?
4. What happens if I open this turn?
5. How do I create a new turn?

---

## 4. Priority order inside the screen

The visual priority must be:

1. **date context**
2. **daily summary**
3. **appointment list**
4. **selected appointment quick actions**
5. **global navigation**

This means the central element is always the **appointment list**, not the metrics.

---

## 5. General layout model

The screen must be implemented as a **single-column mobile screen**.

### Fixed areas
- safe top
- header
- bottom nav

### Scrollable content
- date bar
- summary cards
- appointment list
- selected appointment card

### Navigation type
- bottom navigation remains visible globally
- main content scrolls vertically

---

## 6. Supported mobile widths

The screen must render correctly at:

- **360 px**
- **390 px**
- **430 px**

These widths are mandatory because they cover the mobile-first validation range.

### Design rule
The screen must be designed from the narrowest case first.

If something works only at 390+ px, it is not acceptable.

---

## 7. Safe area and spacing rules

### Horizontal padding
- **16 px** at 360 px
- **20 px** at 390 / 430 px

### Vertical spacing between blocks
- **16 px** between main sections
- **12 px** between internal elements
- **8 px** between title and secondary content

### Tap targets
- minimum interactive size: **44 px**

### Scroll behavior
- vertical only
- never horizontal overflow

---

## 8. Screen structure

The screen must contain the following blocks, in this exact order:

1. Header
2. Date bar
3. Summary row
4. Appointment list
5. Selected appointment card
6. Bottom navigation

---

## 9. Header specification

## 9.1. Objective
Set immediate context and expose the action to create a new appointment.

## 9.2. Content
Left side:
- eyebrow label: `Jornada diaria`
- page title: `Agenda`

Right side:
- circular icon button with `+`
- action meaning: **Nuevo turno**

## 9.3. Visual hierarchy
- title must be prominent
- eyebrow is secondary
- plus button must be visible but not more dominant than the page title

## 9.4. Behavior
- tap on `+` must navigate to the new appointment flow

---

## 10. Date bar specification

## 10.1. Objective
Give clear context of the active day and allow day navigation.

## 10.2. Content
- previous day button
- centered date label
- next day button

Optional future element:
- Today chip, if user is browsing a different day

## 10.3. Mock label
`Martes 14 de mayo`

## 10.4. UX rule
This is not a monthly calendar.
It is a **compact date controller** for daily schedule navigation.

## 10.5. Height
Approx. **52–56 px**

---

## 11. Summary row specification

## 11.1. Objective
Give quick state of the day without becoming the main focus.

## 11.2. Required cards
- Confirmados
- Esperando
- Pendientes

## 11.3. Expected content
Each summary card contains:
- prominent numeric value
- short label

## 11.4. Behavior
Summary cards are informative only in the first prototype.
They do not need navigation behavior unless later requested.

## 11.5. Responsive rule
At narrow widths they may use:
- horizontal scroll row
or
- three compact cards in one row if they still fit cleanly

The important rule is:
**do not wrap into a visually broken layout**

---

## 12. Appointment list specification

This is the most important block of the screen.

## 12.1. Objective
Allow fast chronological scanning of the day.

## 12.2. Ordering
Appointments must be ordered strictly by time ascending.

## 12.3. Row format
Each appointment row must include:

### Left column
- appointment time

### Main column
- patient name
- treatment name
- optional short note

### Right column
- status chip
- chevron or directional indicator

## 12.4. Example row content
- `10:30`
- `Carla Fernández`
- `Mesoterapia facial`
- status: `Próximo`

## 12.5. Optional note examples
- `Última sesión hace 28 días`
- `Paciente en sala de espera`
- `Requiere equipo`

## 12.6. Row height
Recommended usable height:
- **78–92 px**

## 12.7. Visual state rules
A row may be:

- normal
- selected
- attention-required

### Selected row
Must be highlighted with:
- subtle tonal background
- soft border emphasis

### Attention row
May have:
- slightly warmer shadow or accent
- but must remain premium and calm

## 12.8. UX rule
This must feel like a **live list**, not a table.

That means:
- no rigid columns;
- no grid lines;
- no spreadsheet visual style.

---

## 13. Appointment statuses

The UI must use readable human statuses.

### Current mock statuses
- Próximo
- Confirmado
- Esperando
- En curso
- Pendiente
- Reprogramado

## 13.1. Status behavior
Statuses are visual indicators, not long text explanations.

## 13.2. Chip rule
Each status must be rendered as a compact chip:
- rounded
- short
- high contrast enough
- not aggressive

## 13.3. Semantic direction
Suggested tone:
- `Próximo` → primary / informational
- `Confirmado` → success / stable
- `Esperando` → attention / warm
- `Pendiente` → warning or soft danger
- `En curso` → primary / active
- `Reprogramado` → warning / soft neutral

---

## 14. Selected appointment card

## 14.1. Objective
Expose the next available actions for the selected appointment.

## 14.2. Why this exists
On mobile, there is no side panel.  
So once an appointment is selected from the list, the screen needs a clear action area below the list.

## 14.3. Required content
- title: `Turno seleccionado`
- status chip
- time
- patient name
- treatment
- optional note

## 14.4. Required actions
- **Abrir turno**
- **Ficha**

## 14.5. Secondary actions
- Reprogramar
- Cancelar

## 14.6. UX rule
The selected card must not overpower the list.
It is a **contextual action block**, not the screen hero.

---

## 15. Bottom navigation

The screen must work inside the global doctor navigation:

- Hoy
- Agenda
- Pacientes
- Más

### Active tab
- Agenda

### Rule
Bottom nav must stay consistent with other main doctor screens.

---

## 16. Interaction rules

## 16.1. Header plus button
Action:
- navigate to new appointment screen or route placeholder

## 16.2. Date arrows
Action:
- move to previous / next day in mocked state
- or remain non-destructive if not yet implemented

## 16.3. Appointment row tap
Action:
- select row
- update selected appointment card below

## 16.4. Open appointment
Action:
- navigate to `TurnWorkspacePage`

## 16.5. Patient file
Action:
- navigate to patient record route when available
- until then, can link to turn placeholder if needed in prototype

## 16.6. Secondary actions
For the mock:
- can be non-functional buttons
- but must exist visually

---

## 17. Data contract for the mock

The screen must consume data with the structure already defined in the prototype mocks.

## 17.1. AgendaMock

```ts
type AgendaAppointmentStatus =
  | "Próximo"
  | "Confirmado"
  | "Esperando"
  | "En curso"
  | "Pendiente"
  | "Reprogramado";

type AgendaAppointment = {
  id: string;
  time: string;
  patient: string;
  treatment: string;
  status: AgendaAppointmentStatus;
  requiresAttention?: boolean;
  note?: string;
};

type AgendaMock = {
  dateLabel: string;
  summary: {
    confirmed: number;
    waiting: number;
    pending: number;
  };
  appointments: AgendaAppointment[];
};
```

## 17.2. Current mock example

```ts
{
  dateLabel: "Martes 14 de mayo",
  summary: {
    confirmed: 8,
    waiting: 1,
    pending: 2,
  },
  appointments: [
    {
      id: "a1",
      time: "10:30",
      patient: "Carla Fernández",
      treatment: "Mesoterapia facial",
      status: "Próximo",
      note: "Última sesión hace 28 días",
    }
  ]
}
```

---

## 18. Data formatting rules

## 18.1. Time
- always short format: `HH:MM`
- no seconds
- 24-hour format is preferred

## 18.2. Date label
- natural Spanish human-readable format
- example: `Martes 14 de mayo`

## 18.3. Patient names
- realistic names
- no placeholders like `Paciente 1`
- no demo nonsense

## 18.4. Treatment names
- realistic treatment names from the aesthetic medical domain
- not generic labels like `Treatment A`

## 18.5. Notes
- short, contextual, useful
- max one line ideal
- never a paragraph inside the list

---

## 19. Visual style guidelines

This screen must preserve the professional portal tone.

## 19.1. Tone
- formal
- premium
- calm
- clinical
- modern
- clear

## 19.2. Avoid
- fintech dashboard look
- enterprise grid look
- playful consumer UI
- crowded clinic software style

## 19.3. Surfaces
- soft light background
- white cards
- subtle elevation
- large radii

## 19.4. Typography
- clear hierarchy
- big title
- medium row title
- restrained secondary text

## 19.5. Color logic
Use restrained accent usage:
- one primary brand accent
- one warm attention tone
- one success tone
- nothing too saturated

---

## 20. Layout priorities above the fold

At first load, without scrolling, the user should ideally see:

### On 390 / 430 px
- header
- date bar
- summary row
- at least the first part of the appointment list

### On 360 px
- header
- date bar
- summary row or beginning of list
- enough to understand the screen instantly

The selected appointment card may begin below the fold depending on content height.  
That is acceptable.

---

## 21. What must not appear in this screen

Do not add:

- monthly calendar grid as main component
- patient clinical history
- media thumbnails
- inventory data
- financial charts
- business KPIs
- product catalog
- bulky filter bars
- center selectors for the independent doctor

---

## 22. Navigation expectations in the prototype

For the interactive prototype, the minimum expected navigation is:

- `+` → new appointment flow placeholder
- row tap → selects row
- `Abrir turno` → `TurnWorkspacePage`
- `Ficha` → patient route or temporary placeholder
- bottom nav → routes between major doctor screens

---

## 23. Validation checklist for the agent implementing this screen

Before considering the screen correct, validate:

### Structure
- header exists
- date bar exists
- summary row exists
- appointment list exists
- selected appointment card exists
- bottom nav remains stable

### UX
- the list is easy to scan
- selected row is visually obvious
- the selected appointment card is useful but not dominant
- the screen feels operational, not administrative

### Responsive
- works at 360 px
- works at 390 px
- works at 430 px
- no horizontal overflow
- no broken chips
- no clipped titles

### Style
- premium enough for doctor portal
- not too heavy
- not too colorful
- not too generic

---

## 24. Implementation rule for the next agent

When implementing or refining `AgendaPage.tsx`, the agent must:

- preserve this functional structure;
- keep the mobile-first one-column model;
- keep chronological list as main interaction pattern;
- keep the selected appointment action card below the list;
- respect the data structure already defined in `agenda.mock.ts`;
- avoid redesigning the screen into a different concept without explicit approval.

This screen is already conceptually defined.  
Any improvement should happen **inside this model**, not by replacing the model itself.
