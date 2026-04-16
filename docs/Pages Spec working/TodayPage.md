# TodayPage — Descripción para implementación

## Objetivo de la pantalla

`TodayPage` debe ser la **pantalla principal operativa** del sistema para la médica independiente.

No debe funcionar como un dashboard genérico ni como una pantalla de métricas.  
Debe responder, con la menor carga mental posible, estas preguntas:

1. **Qué tengo ahora**
2. **Qué debo resolver ya**
3. **Qué sigue después**
4. **Qué quedó pendiente de cerrar**

La pantalla debe sentirse como el **centro operativo del día**, y no como una portada informativa.

---

## Contexto mock fijo

Usar como datos mock por defecto:

- **Médica:** Brenda Mansilla
- **Centro activo:** Consultorio Melendez

---

## Criterio general de UX

La pantalla debe seguir los principios ya consolidados del mock:

- mobile first;
- una sola prioridad fuerte por pantalla;
- contexto progresivo;
- navegación por momento operativo;
- baja carga mental;
- datos mockeados con navegación real;
- sin bloques equivalentes compitiendo entre sí.

### Regla principal
`TodayPage` debe decidir cuál es el **siguiente paso útil** para la médica y dejarlo visible arriba del todo.

### Qué evitar
No diseñarla como:

- dashboard de métricas;
- pantalla administrativa;
- resumen excesivo del negocio;
- apilado de muchas cards equivalentes;
- colección de atajos redundantes con la bottom nav.

---

## Estructura general de la pantalla

Orden vertical de bloques:

1. **Header fijo mínimo**
2. **Hero fijo contextual**
3. **Selector fijo de vista**
4. **Bloque central adaptable con scroll interno**
5. **Bottom nav visible**

### Regla general de layout
- Todos los bloques superiores deben quedar fijos.
- El único bloque con **scroll interno** debe ser el central.
- La pantalla no debe tener scroll global.
- La bottom nav debe permanecer visible.

---

## 1. Header fijo mínimo

Debe ser corto, contextual y no competir con el hero.

### Contenido
- saludo breve:
  - `Buen día`
- nombre de la médica:
  - `Brenda Mansilla`
- centro activo:
  - `Consultorio Melendez`
- fecha actual en formato corto, opcional
- badge o indicador pequeño con cantidad de pendientes, opcional

### Jerarquía visual
- el nombre de la médica debe ser el dato más visible del header;
- el centro activo debe verse como contexto secundario;
- el badge de pendientes, si existe, debe ser discreto.

### Comportamiento
- en esta etapa, el centro activo es solo informativo;
- más adelante, en organizaciones, el header podrá adaptarse al scope real.

---

## 2. Hero fijo contextual

Este es el **bloque más importante de la pantalla**.

No debe mostrar siempre el próximo turno cronológico.  
Debe mostrar el **evento operativo más prioritario del momento**.

### Regla de prioridad del hero

El hero debe resolverse según este orden:

#### Prioridad 1
**Sesión en curso**
- CTA principal: `Reanudar sesión`

#### Prioridad 2
**Sesión cerrada pendiente de cobro**
- CTA principal: `Ir al cobro`

#### Prioridad 3
**Paciente esperando o turno listo para iniciar**
- CTA principal: `Abrir turno`

#### Prioridad 4
**Próximo turno del día**
- CTA principal: `Abrir turno`

#### Prioridad 5
**No quedan turnos hoy**
- estado vacío útil;
- CTA principal: `Ver agenda`

### Objetivo
La médica no debe tener que interpretar qué hacer primero.  
La pantalla debe sugerirlo directamente.

---

## 2.1. Contenido del hero

El hero debe mostrar:

- chip de estado;
- hora del evento;
- nombre del paciente;
- tratamiento;
- una única línea de contexto útil;
- CTA principal;
- CTA secundaria.

### Línea de contexto útil
Debe ser una sola línea corta, según el caso. Ejemplos:

- `Última sesión hace 21 días`
- `Paciente esperando`
- `Cobro pendiente`
- `Comprobante pendiente`
- `Listo para iniciar`

### CTA principal
Debe variar según el estado:

- `Reanudar sesión`
- `Ir al cobro`
- `Abrir turno`
- `Ver agenda`

### CTA secundaria
Debe ser siempre:

- `Historial`

### Regla de navegación
El botón secundario del hero debe abrir el historial del paciente relacionado con el ítem del hero.

---

## 2.2. Estado visual del hero

El hero debe cambiar visualmente según el tipo de urgencia operativa, pero sin romper consistencia con el sistema.

### Sugerencia de tonos
- sesión en curso: tono activo / acento;
- pendiente de cobro: tono cálido o de atención;
- listo para iniciar / esperando: tono informativo;
- próximo turno: tono neutro o primario;
- sin turnos: tono calmo / vacío útil.

### Regla
El color debe ayudar a leer la prioridad, pero el hero no debe convertirse en una alarma visual permanente.

---

## 3. Selector fijo de vista

Debajo del hero debe existir un selector compacto con dos opciones:

- `Pendientes`
- `Agenda de hoy`

### Objetivo
Evitar apilar varias cards distintas debajo del hero y concentrar el trabajo en un único bloque adaptable.

### Comportamiento
- una sola opción activa a la vez;
- al cambiar la opción activa, cambia el contenido del bloque central;
- el selector debe quedar fijo, no perderse con el scroll.

### Valor por defecto
Por defecto debe abrir en:

- `Pendientes`, si existe al menos un pendiente accionable;
- `Agenda de hoy`, si no hay pendientes relevantes.

---

## 4. Bloque central adaptable con scroll interno

Es el único bloque que debe ocupar el espacio remanente y tener scroll interno.

Según el selector activo, puede renderizar una de estas dos vistas:

1. `Pendientes`
2. `Agenda de hoy`

---

## 4.1. Vista `Pendientes`

Debe mostrar solo pendientes **accionables**.  
No debe ser una bandeja genérica de notificaciones.

### Ejemplos válidos de pendientes
- cobro pendiente;
- comprobante de transferencia pendiente;
- consentimiento pendiente de un turno cercano;
- paciente esperando;
- sesión iniciada sin cerrar;
- cualquier otro pendiente operativo real del flujo del día.

### Ejemplos que no deberían aparecer acá
- alertas administrativas de stock;
- información general del negocio;
- mensajes sin acción concreta;
- recordatorios decorativos.

### Estructura de cada ítem pendiente
Cada ítem debe mostrar:

- tipo de pendiente;
- paciente o referencia principal;
- subtítulo corto;
- acción textual o affordance clara.

### Ejemplos de subtítulo
- `Toxina botulínica · 10:30`
- `Transferencia sin comprobante`
- `Consentimiento sin registrar`
- `Sesión iniciada hace 18 min`

### Comportamiento al tocar un pendiente
Debe navegar directamente al punto de resolución más lógico:

- pendiente clínico → `/turno/:id`
- cobro pendiente → `/cobro/:id`
- comprobante pendiente → ruta preparada o stub futuro relacionado al cobro o al pendiente de hoy

### Regla UX
La vista de pendientes debe sentirse como una cola de trabajo inmediata.

---

## 4.2. Vista `Agenda de hoy`

Debe mostrar una lista compacta de los turnos del día, pensada como continuidad rápida, no como reemplazo de `AgendaPage`.

### Qué debe mostrar cada fila
- hora;
- nombre del paciente;
- tratamiento;
- estado resumido.

### Estados esperables
Ejemplos:
- `Confirmado`
- `Por llegar`
- `Esperando`
- `Pendiente`
- `En curso`

### Comportamiento al tocar una fila
Debe abrir el turno correspondiente:
- `/turno/:id`

### Acción complementaria
Dentro de esta vista debe existir un acceso claro a:
- `Ver agenda completa`

### Comportamiento de `Ver agenda completa`
Debe navegar a:
- `/agenda`

### Regla UX
La vista de agenda dentro de `Hoy` debe ser compacta y resumida.  
La pantalla de agenda detallada sigue siendo `AgendaPage`.

---

## 5. Qué se elimina respecto de la implementación anterior

La nueva versión de `TodayPage` debe dejar de comportarse como la pantalla actual basada en varias cards independientes.

### Deben eliminarse
- el bloque separado `Pendientes de hoy` como card independiente;
- el bloque separado `Después sigue` como card independiente;
- el bloque de `Atajos`;
- cualquier duplicación innecesaria de navegación con la bottom nav.

### Motivo
La pantalla debe tener:

- un único hero fuerte;
- un único espacio central de trabajo;
- menos competencia visual;
- menos sensación de dashboard.

---

## 6. Bottom nav

La bottom nav debe seguir visible en esta pantalla.

### Motivo
`TodayPage` es una pantalla estable y principal del sistema, no una pantalla de flujo guiado como `TurnWorkspacePage`.

---

## 7. Reglas especiales para pendientes de transferencia

Ya quedó definido que en el flujo de cobro:

- el cobro puede confirmarse aunque falte adjuntar comprobante de transferencia;
- ese comprobante debe resolverse después;
- la pantalla `Hoy` debe ser el lugar donde ese pendiente reaparezca de manera visible y accionable.

### Regla para el mock
Debe existir al menos un caso mock de pendiente del tipo:
- `Comprobante pendiente`

### Comportamiento esperado
Ese ítem debe aparecer dentro de la vista `Pendientes`.

---

## 8. Navegaciones requeridas

Desde `TodayPage` deben poder ocurrir estas navegaciones:

- abrir turno;
- reanudar sesión;
- ir al cobro;
- abrir historial del paciente del hero;
- abrir turno desde una fila de agenda;
- ir a agenda completa;
- resolver un pendiente específico;
- navegar mediante bottom nav a:
  - `Agenda`
  - `Pacientes`
  - `Más`

---

## 9. Estados mock que la pantalla debe contemplar

La pantalla debe estar preparada para representar al menos estos estados:

### A. Hay sesión en curso
- hero muestra sesión en curso;
- CTA principal `Reanudar sesión`.

### B. Hay sesión cerrada pendiente de cobro
- hero muestra cobro pendiente;
- CTA principal `Ir al cobro`.

### C. Hay paciente esperando
- hero muestra turno listo;
- CTA principal `Abrir turno`.

### D. No hay urgencias, pero sí turnos próximos
- hero muestra próximo turno;
- CTA principal `Abrir turno`.

### E. No quedan turnos hoy
- hero muestra estado vacío útil;
- CTA principal `Ver agenda`.

### F. Existe comprobante pendiente de transferencia
- aparece en la vista `Pendientes`.

---

## 10. Responsive y layout

### Criterios generales
- Mobile first.
- contemplar anchos:
  - 360 px
  - 390 px
  - 430 px

### Regla de altura reducida
Cuando la pantalla tenga menos de **700 px de alto**:
- reducir proporcionalmente fuentes;
- reducir paddings y gaps;
- compactar altura del hero;
- compactar el selector de vistas;
- compactar altura de filas en pendientes o agenda;
- mantener tap targets correctos.

### Reglas fijas
- sin scroll horizontal;
- respetar safe areas superior e inferior;
- el bloque central es el único con scroll interno;
- la bottom nav debe permanecer visible.

---

## 11. Jerarquía visual esperada

La lectura ideal de la pantalla debe ser:

1. **Qué tengo que hacer ahora** → hero
2. **Qué cola operativa tengo abierta** → selector + bloque central
3. **Cómo me muevo al resto del sistema** → bottom nav

### Regla
No debe haber ningún bloque secundario compitiendo con el hero por atención.

---

## 12. Contenido mock esperado

Los mocks deben parecer reales y operativos.

Ejemplos plausibles:
- paciente con sesión en curso;
- paciente con sesión cerrada pendiente de cobro;
- transferencia sin comprobante;
- paciente esperando;
- próximos turnos del día;
- estado sin turnos restantes.

---

## 13. Resumen operativo de la pantalla

La nueva `TodayPage` debe quedar compuesta por:

- header mínimo con saludo, Brenda Mansilla y Consultorio Melendez;
- hero contextual fijo con el evento operativo más prioritario;
- CTA principal dinámico según el estado;
- CTA secundaria fija `Historial`;
- selector fijo con dos vistas:
  - `Pendientes`
  - `Agenda de hoy`
- bloque central adaptable con scroll interno;
- vista de pendientes solo con elementos accionables;
- vista compacta de agenda del día;
- acceso a `Ver agenda completa`;
- bottom nav visible;
- sin bloque de shortcuts;
- sin estructura tipo dashboard con varias cards equivalentes.

---

## 14. Criterio de reemplazo de la implementación actual

La implementación actual de `TodayPage` debe ser reemplazada por esta nueva estructura.

### Objetivo del reemplazo
Lograr una pantalla:

- más operativa;
- menos dashboard;
- más coherente con el flujo real del médico;
- más alineada con la regla de una sola prioridad fuerte;
- mejor integrada con turno, cobro, historial y agenda.
