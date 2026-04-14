# TurnWorkspacePage — Especificación técnica v4

## Objetivo

Rediseñar `TurnWorkspacePage` para que funcione como un **workspace asistido de sesión** centrado en el siguiente paso útil, con una experiencia mobile-first sobria, clara y consistente con una pantalla de producción.

La pantalla debe acompañar el flujo real del turno del médico independiente, minimizar fricción operativa y evitar bloques paralelos o información secundaria que compita con la acción principal.

---

## Principios obligatorios

1. **Una sola prioridad fuerte por estado**.
2. **Sin textos ni comportamientos que delaten que esto es un mock**.
3. **El sistema guía una secuencia**, no muestra múltiples acciones clínicas en paralelo.
4. **El top central no se usa** para mostrar datos del turno, para respetar notch / dynamic island / status bar.
5. **Si el contenido del estado entra completo en pantalla, la vista no debe scrollear**.
6. **Solo se permite scroll vertical como fallback** cuando la altura real del dispositivo no alcance, aun después de compactar la UI.
7. **La bottom nav nunca debe tapar CTAs ni contenido relevante**.

---

## Cambios obligatorios respecto de la versión actual

### Quitar

- el bloque superior con hora + paciente;
- el dato del operador / profesional logueado;
- cualquier referencia al último control, última sesión o datos históricos no críticos para este flujo;
- el bloque paralelo que aparece durante la ventana final con foto del después y notas;
- cualquier copy del estilo “en el mock”, “para probar”, “para ver”, o equivalentes.

### Mantener o corregir

- botón de volver atrás: debe navegar a `/` (**Hoy**);
- botón `Ficha`: mantenerlo como acción secundaria de cabecera;
- contador de tiempo: mantenerlo, pero **centrado visualmente** dentro del bloque hero;
- cambio de tono del bloque hero cuando falten 30 segundos: mantenerlo;
- duración de la sesión para pruebas: **1 minuto**.

---

## Flujo funcional obligatorio

El flujo del turno pasa a ser:

`Consentimiento -> Antes -> Sesión -> Después -> Cobro`

### Regla clave

No existe un paso visible de `Cierre` como etapa separada de progreso.

### Secuencia correcta

1. **Consentimiento**
   - obligatorio;
   - no se puede iniciar la sesión sin capturarlo;
   - el botón principal debe llamarse `Tomar consentimiento`.

2. **Antes**
   - foto del antes opcional;
   - opciones: `Tomar foto del antes` y `Omitir`.

3. **Sesión**
   - inicia luego del paso anterior;
   - muestra timer de 1 minuto;
   - cuando faltan 30 segundos, se habilita `Cerrar sesión`;
   - en esta etapa **no** deben aparecer foto del después ni notas.

4. **Después**
   - solo aparece **una vez cerrada la sesión**;
   - secuencia obligatoria de pasos opcionales:
     1. foto del después;
     2. nota pública;
     3. nota privada.
   - cada uno tiene acción primaria y acción de omisión.

5. **Cobro**
   - al terminar la secuencia posterior al cierre, la pantalla queda lista para ir a cobro;
   - al confirmar el cobro, el flujo del turno se reinicia a estado inicial.

---

## Modelo de estados recomendado

Actualizar `turnFlow.mock.ts` para trabajar con estados secuenciales explícitos.

### Estados

```ts
export type TurnFlowState =
  | "CONSENT_REQUIRED"
  | "BEFORE_PHOTO_OPTIONAL"
  | "IN_PROGRESS"
  | "AFTER_PHOTO_OPTIONAL"
  | "PUBLIC_NOTE_OPTIONAL"
  | "PRIVATE_NOTE_OPTIONAL"
  | "PAYMENT_REQUIRED";
```

### Campo derivado adicional

```ts
canCloseSession: boolean;
```

Regla:
- `canCloseSession = true` cuando `state === "IN_PROGRESS" && secondsLeft <= 30`.
- El estado sigue siendo `IN_PROGRESS`; no se crea una etapa nueva de progreso.

### Estados de acciones opcionales

No usar solo booleanos simples para distinguir “todavía no resuelto” de “omitido”.

Usar una tri-estado por acción opcional:

```ts
export type OptionalCaptureStatus = "pending" | "done" | "skipped";
```

Aplicar a:

```ts
beforePhotoStatus: OptionalCaptureStatus;
afterPhotoStatus: OptionalCaptureStatus;
publicNoteStatus: OptionalCaptureStatus;
privateNoteStatus: OptionalCaptureStatus;
```

### Texto de notas

```ts
publicNoteText?: string;
privateNoteText?: string;
```

### Runtime sugerido

```ts
export type TurnFlowRuntime = {
  turnId: string;
  patient: string;
  treatment: string;
  durationSeconds: number; // 60
  slotLabel: string;
  observation?: string;
  state: TurnFlowState;
  secondsLeft: number;
  canCloseSession: boolean;
  consentTaken: boolean;
  beforePhotoStatus: OptionalCaptureStatus;
  afterPhotoStatus: OptionalCaptureStatus;
  publicNoteStatus: OptionalCaptureStatus;
  privateNoteStatus: OptionalCaptureStatus;
  publicNoteText?: string;
  privateNoteText?: string;
};
```

---

## Progreso visual

La barra de progreso debe mostrar **5 etapas**:

```txt
Consentimiento | Antes | Sesión | Después | Cobro
```

### Mapeo

- `CONSENT_REQUIRED` -> índice 0
- `BEFORE_PHOTO_OPTIONAL` -> índice 1
- `IN_PROGRESS` -> índice 2
- `AFTER_PHOTO_OPTIONAL` -> índice 3
- `PUBLIC_NOTE_OPTIONAL` -> índice 3
- `PRIVATE_NOTE_OPTIONAL` -> índice 3
- `PAYMENT_REQUIRED` -> índice 4

### Regla

Durante toda la secuencia posterior al cierre (`AFTER_PHOTO_OPTIONAL`, `PUBLIC_NOTE_OPTIONAL`, `PRIVATE_NOTE_OPTIONAL`) la etapa actual visible es **Después**.

---

## Estructura visual final de la pantalla

La pantalla debe quedar compuesta por:

### 1. Safe top
Respetar `env(safe-area-inset-top)`.

### 2. Topbar compacta
Solo dos acciones:

- izquierda: botón circular `Volver`;
- derecha: botón cápsula `Ficha`.

No mostrar paciente, tratamiento, hora ni operador en esta franja superior.

### 3. Card hero de estado
Es el bloque dominante de la pantalla.

Debe contener:
- chip de estado;
- título principal;
- descripción breve;
- barra de progreso;
- timer centrado cuando la sesión está en curso;
- CTA o CTAs del estado actual.

### 4. Card secundaria variable
Debe ocupar el segundo lugar y cambiar según la etapa:

- **antes de cerrar sesión**: `Contexto útil`;
- **después de cerrar sesión**: `Resumen de sesión`.

No deben convivir ambos bloques al mismo tiempo.

---

## Contenido del bloque `Contexto útil`

Solo antes del cierre de sesión.

Debe incluir:
- paciente;
- tratamiento;
- duración estimada (`1 min`);
- franja horaria;
- observación breve, solo si existe.

### No incluir

- operador;
- última sesión;
- equipo;
- configuración previa;
- datos de auditoría;
- historial resumido.

---

## Contenido del bloque `Resumen de sesión`

Debe reemplazar a `Contexto útil` inmediatamente después de cerrar la sesión.

### Cuándo aparece

Desde `AFTER_PHOTO_OPTIONAL` en adelante.

### Debe incluir

- paciente;
- tratamiento;
- duración planificada;
- franja del turno;
- consentimiento: `Registrado`;
- foto del antes: `Tomada` u `Omitida`;
- foto del después: `Tomada`, `Omitida` o `Pendiente` según el paso actual;
- nota pública: `Agregada`, `Omitida` o `Pendiente`;
- nota privada: `Agregada`, `Omitida` o `Pendiente`.

### Regla visual

Este bloque debe sentirse como resumen operativo claro, no como una tabla técnica.

---

## Comportamiento del hero por estado

## Estado 1 — `CONSENT_REQUIRED`

### Chip
`Consentimiento pendiente`

### Título
`Primero registrá el consentimiento`

### Descripción
Texto corto, serio y realista. Ejemplo:
`Necesitás registrarlo antes de iniciar la atención.`

### CTA
- único botón;
- ancho completo;
- label: `Tomar consentimiento`.

### Regla
No existe botón alternativo para confirmar manualmente algo ya cargado.

### Acción
Al presionar:
- marcar `consentTaken = true`;
- avanzar a `BEFORE_PHOTO_OPTIONAL`.

---

## Estado 2 — `BEFORE_PHOTO_OPTIONAL`

### Chip
`Listo para continuar`

### Título
`Podés registrar la foto del antes`

### Descripción
Texto breve aclarando que es opcional.

### CTAs
Dos botones:
- `Tomar foto del antes`
- `Omitir`

### Acción
- si toma foto: `beforePhotoStatus = "done"`;
- si omite: `beforePhotoStatus = "skipped"`;
- en ambos casos:
  - avanzar a `IN_PROGRESS`;
  - setear `secondsLeft = 60`;
  - setear `canCloseSession = false`.

---

## Estado 3 — `IN_PROGRESS`

### Chip
`Sesión en curso`

### Título
`La sesión está en marcha`

### Descripción
Breve, sin ruido.

### Timer
Debe mostrarse grande y centrado:
- label centrado;
- valor centrado (`00:59`, `00:58`, etc.);
- sin desplazamientos laterales por presencia de otros elementos.

### Regla de cierre
Cuando `secondsLeft > 30`:
- no mostrar acciones secundarias clínicas;
- no mostrar foto del después;
- no mostrar notas;
- no mostrar resumen post sesión.

Cuando `secondsLeft <= 30`:
- mantener el mismo paso de progreso (`Sesión`);
- cambiar el tono del hero a versión de atención / warning suave;
- habilitar botón principal `Cerrar sesión`.

### CTA cuando faltan 30 segundos o menos
- único botón;
- ancho completo;
- label: `Cerrar sesión`.

### Acción al cerrar
- avanzar a `AFTER_PHOTO_OPTIONAL`;
- conservar `secondsLeft` en el valor actual o congelarlo;
- ocultar el timer si visualmente mejora la claridad del estado post sesión.

---

## Estado 4 — `AFTER_PHOTO_OPTIONAL`

### Chip
`Sesión cerrada`

### Título
`Podés registrar la foto del después`

### Descripción
Breve, opcional y contextual.

### CTAs
Dos botones:
- `Tomar foto del después`
- `Omitir`

### Acción
- si toma foto: `afterPhotoStatus = "done"`;
- si omite: `afterPhotoStatus = "skipped"`;
- avanzar a `PUBLIC_NOTE_OPTIONAL`.

### Regla
En este estado ya no existe `Contexto útil`; se muestra `Resumen de sesión`.

---

## Estado 5 — `PUBLIC_NOTE_OPTIONAL`

### Chip
`Sesión cerrada`

### Título
`Podés agregar una nota pública`

### Descripción
Ejemplo de tono:
`Se verá en el historial clínico del paciente y por otros médicos con acceso.`

### CTAs
Dos botones:
- `Agregar nota pública`
- `Omitir`

### Acción primaria
Abre modal.

### Acción secundaria
- `publicNoteStatus = "skipped"`;
- avanzar a `PRIVATE_NOTE_OPTIONAL`.

### Modal de nota pública

#### Título
`Nota pública`

#### Descripción
`Esta nota quedará visible en el historial clínico del paciente.`

#### Controles
- textarea;
- botón `Guardar nota`;
- botón `Cancelar`.

#### Reglas
- `Cancelar` cierra el modal sin avanzar estado;
- `Guardar nota` requiere texto no vacío;
- al guardar:
  - `publicNoteStatus = "done"`;
  - `publicNoteText = valorIngresado`;
  - cerrar modal;
  - avanzar a `PRIVATE_NOTE_OPTIONAL`.

---

## Estado 6 — `PRIVATE_NOTE_OPTIONAL`

### Chip
`Sesión cerrada`

### Título
`Podés agregar una nota privada`

### Descripción
Ejemplo de tono:
`Solo será visible para vos. El paciente no podrá verla.`

### CTAs
Dos botones:
- `Agregar nota privada`
- `Omitir`

### Acción primaria
Abre modal.

### Acción secundaria
- `privateNoteStatus = "skipped"`;
- avanzar a `PAYMENT_REQUIRED`.

### Modal de nota privada

#### Título
`Nota privada`

#### Descripción
`Esta nota solo será visible para el médico tratante.`

#### Controles
- textarea;
- botón `Guardar nota`;
- botón `Cancelar`.

#### Reglas
- `Cancelar` cierra el modal sin avanzar estado;
- `Guardar nota` requiere texto no vacío;
- al guardar:
  - `privateNoteStatus = "done"`;
  - `privateNoteText = valorIngresado`;
  - cerrar modal;
  - avanzar a `PAYMENT_REQUIRED`.

---

## Estado 7 — `PAYMENT_REQUIRED`

### Chip
`Lista para cobrar`

### Título
`La atención está lista para cobro`

### Descripción
Breve y directa.

### CTA principal
- ancho completo si es el único CTA visible;
- label: `Ir a cobro`.

### CTA secundaria opcional
Puede existir `Volver a Hoy` si visualmente no compite.

### Regla de layout
En este estado debe seguir mostrándose `Resumen de sesión`, actualizado con el resultado final de todas las acciones.

---

## Modales de notas

## Reglas visuales

- deben abrirse como overlay centrado o bottom sheet según convenga más al mobile;
- deben sentirse consistentes con el diseño general del producto;
- no deben ocupar todo el alto salvo en dispositivos muy bajos;
- el foco inicial debe ir al textarea.

## Reglas funcionales

- cerrar por `Cancelar` o por `X` si se agrega;
- no cerrar automáticamente por tap afuera si eso puede provocar pérdidas accidentales de texto;
- preservar el texto mientras el modal esté abierto.

## Contenido del textarea

- multiline;
- altura cómoda pero contenida;
- placeholder realista;
- sin textos de demo o mock.

---

## Reglas de CTA y ancho

### CTA único
Cuando un estado tenga un solo botón principal, debe ocupar **todo el ancho disponible**.

Aplica a:
- `Tomar consentimiento`;
- `Cerrar sesión`;
- `Ir a cobro` cuando se use como única acción principal.

### CTA doble
Cuando haya acción primaria y omisión:
- usar 2 columnas desde 390 px en adelante si entra limpio;
- en 360 px permitir apilado vertical si mejora claridad;
- ambas acciones deben seguir siendo táctiles y legibles.

---

## Reglas de copy

### Debe ser
- concreto;
- profesional;
- breve;
- realista;
- consistente con una interfaz productiva.

### No debe incluir
- referencias a prototipo o mock;
- aclaraciones meta;
- explicaciones de implementación;
- copy tutorial innecesario.

---

## Reglas responsive

La pantalla debe optimizarse para:
- `360 x 800`
- `390 x 844`
- `430 x 932`

### Ancho

- 360 px: padding horizontal `16px`;
- 390 px y 430 px: padding horizontal `20px`.

### Alto disponible

Seguir el mismo criterio ya aplicado en `AgendaPage` para alturas menores a `700px`.

#### Media query obligatoria

```css
@media (max-height: 700px) { ... }
```

### Qué compactar debajo de 700 px

- reducir paddings internos de cards;
- reducir gaps verticales;
- bajar 1 nivel los tamaños del hero title;
- bajar 1 nivel el tamaño de labels y descripciones;
- compactar botones a `44px` si hace falta;
- compactar el timer sin perder protagonismo;
- evitar que el conjunto obligue a scroll si todavía puede entrar completo.

### Regla principal

En altura baja, primero **compactar**. Solo después permitir scroll si realmente no entra.

---

## Reglas de layout para evitar scroll innecesario

### Objetivo
Si el estado activo entra completo en la altura disponible, la pantalla debe quedar fija, sin scroll.

### Sugerencia de implementación

Tomar como referencia el enfoque de `AgendaPage`:

```css
.turn-screen {
  min-height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
  height: calc(100dvh - 92px - env(safe-area-inset-bottom, 0px));
  overflow: hidden;
}

.turn-content {
  height: calc(100% - env(safe-area-inset-top, 0px));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}
```

### Comportamiento esperado

- topbar fija dentro del contenido útil;
- stack interior distribuye espacio;
- scroll vertical solo dentro del stack si el alto real no alcanza.

---

## Reemplazo de bloques según etapa

### Antes del cierre
Mostrar:
- hero;
- contexto útil.

### Después del cierre
Mostrar:
- hero;
- resumen de sesión.

### No permitir
- `Contexto útil` + `Resumen de sesión` juntos;
- hero + bloque extra paralelo de acciones post sesión;
- acciones de foto y notas en cards separadas debajo del hero.

Toda la secuencia posterior al cierre debe resolverse desde el hero y el resumen.

---

## Archivos a tocar

## 1. `TurnWorkspacePage.tsx`

Actualizar para:
- quitar bloque superior con datos del turno;
- mantener topbar simple `Volver` + `Ficha`;
- rehacer el hero con los nuevos estados y CTAs;
- eliminar el bloque paralelo actual de acciones finales;
- mostrar timer centrado;
- reemplazar `Contexto útil` por `Resumen de sesión` una vez cerrada la sesión;
- agregar modales de nota pública y nota privada;
- asegurar CTA full width cuando corresponda;
- asegurar navegación atrás a `/`.

## 2. `turnFlow.mock.ts`

Actualizar para:
- usar la nueva máquina de estados;
- agregar `canCloseSession`;
- cambiar booleans simples por estado tri-valor en acciones opcionales;
- almacenar texto de nota pública y privada;
- reiniciar correctamente el ciclo al terminar cobro.

## 3. `ChargePage.tsx`

Mantener:
- al confirmar cobro, llamar `resetTurnFlow(turnId)`;
- navegar a `/`.

No modificar copy de cobro para mencionar pruebas o reset.

## 4. `turn.mock.ts`

Mantenerlo solo como origen de datos base del turno:
- paciente;
- tratamiento;
- hora;
- observación breve si existe.

No depender de `turn.mock.ts` para copy del hero por estado.

---

## Lógica de transición recomendada

```txt
CONSENT_REQUIRED
  -> (Tomar consentimiento)
BEFORE_PHOTO_OPTIONAL
  -> (Tomar foto del antes | Omitir)
IN_PROGRESS
  -> timer corre
  -> cuando faltan 30s: canCloseSession = true
  -> (Cerrar sesión)
AFTER_PHOTO_OPTIONAL
  -> (Tomar foto del después | Omitir)
PUBLIC_NOTE_OPTIONAL
  -> (Guardar nota pública | Omitir)
PRIVATE_NOTE_OPTIONAL
  -> (Guardar nota privada | Omitir)
PAYMENT_REQUIRED
  -> (Ir a cobro)
ChargePage confirmCharge
  -> resetTurnFlow(turnId)
  -> navigate("/")
```

---

## Criterios de aceptación

La implementación se considera correcta si cumple todo lo siguiente:

1. No se muestra nombre del profesional en la pantalla.
2. No existe bloque superior central con hora y paciente.
3. El botón volver navega a `Hoy`.
4. El progreso visible es de 5 pasos: `Consentimiento / Antes / Sesión / Después / Cobro`.
5. `Tomar consentimiento` ocupa todo el ancho disponible.
6. La foto del antes es opcional y se resuelve con `Tomar` u `Omitir`.
7. Durante la sesión solo se ve el timer y, al final, el botón `Cerrar sesión`.
8. Antes de cerrar sesión no aparecen foto del después ni notas.
9. Al cerrar sesión desaparece `Contexto útil`.
10. Después del cierre aparece `Resumen de sesión`.
11. La foto del después, la nota pública y la nota privada se resuelven en secuencia, nunca en paralelo.
12. Las notas se capturan en modal.
13. El copy no delata que se trata de un mock.
14. En alturas menores a 700 px la pantalla compacta tipografías y tamaños antes de necesitar scroll.
15. Si el contenido del estado activo entra en pantalla, la vista no scrollea.
16. Al confirmar el cobro, el turno vuelve a estado inicial.

---

## Nota de criterio UX

Esta pantalla no debe sentirse como una ficha cargada ni como una checklist plana. Debe sentirse como una **asistencia clínica secuencial**, donde el sistema muestra solo lo necesario para completar el siguiente paso con comodidad y baja carga mental.