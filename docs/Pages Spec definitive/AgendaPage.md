# AgendaPage — Documentación definitiva

## 1. Objetivo de la pantalla

`AgendaPage` es la pantalla operativa diaria del médico para consultar y accionar sobre los turnos del día seleccionado.

Su función principal es permitir tres tareas con el menor esfuerzo posible:

1. cambiar rápidamente el día visible de la agenda;
2. revisar la lista de turnos de ese día;
3. operar sobre el turno seleccionado desde un bloque de acción fijo y siempre visible.

La pantalla está pensada como una vista **mobile-first**, con foco en claridad, baja carga mental y continuidad operativa.

---

## 2. Rol y contexto de uso

- **Rol principal:** médico independiente;
- **Momento de uso:** consulta rápida de agenda, selección del próximo turno y acceso a acciones inmediatas;
- **Ubicación en el flujo principal:** `Hoy -> Agenda -> Turno -> Cobro -> Hoy`.

---

## 3. Ruta y navegación

### Ruta principal
- `/agenda`

### Entradas habituales
- desde la bottom nav, pestaña `Agenda`;
- desde la pantalla `Hoy`, usando accesos a agenda o atajos relacionados.

### Salidas principales
- abrir popup de calendario para elegir una fecha libre;
- abrir popup o flujo de creación de nuevo turno desde el botón superior derecho;
- abrir la ficha del paciente desde el bloque inferior;
- abrir el turno desde el bloque inferior, cuando corresponda.

---

## 4. Estructura general de layout

La pantalla se divide en **cuatro zonas verticales** dentro del alto disponible entre el safe area superior y la bottom nav:

1. **Top actions**
   - botón calendario arriba a la izquierda;
   - botón `+` arriba a la derecha.

2. **Bloque fijo del día**
   - selector rápido `Ayer / Hoy / Mañana`;
   - fecha visible;
   - disponibilidad del médico para el día seleccionado.

3. **Bloque de lista de turnos**
   - título `Turnos del día`;
   - control `Ver toda / Ver menos`;
   - lista interna scrolleable sólo dentro del bloque.

4. **Bloque fijo de acción del turno seleccionado**
   - paciente;
   - estado;
   - hora;
   - tratamiento;
   - botón `Ficha` siempre visible;
   - botón `Abrir turno` sólo cuando corresponde.

### Regla de scroll
- la **pantalla completa no debe scrollear**;
- el único scroll vertical permitido es el de la **lista interna de turnos**;
- el bloque inferior de acción debe permanecer **siempre visible** por encima de la bottom nav.

---

## 5. Safe area superior en iPhone

En iPhone, la zona negra superior centrada se llama **Dynamic Island** en los modelos que la tienen.

A nivel de layout, la regla correcta no es diseñar “debajo de la isla”, sino respetar la **safe area superior**.

En documentación de UI conviene hablar así:

- **Dynamic Island**: el elemento físico/visual del iPhone;
- **top safe area** o **safe area superior**: el margen operativo que la interfaz debe respetar.

Para esta pantalla, los primeros controles visuales arrancan **debajo de la safe area superior**.

---

## 6. Zona superior de acciones

### 6.1. Botón calendario
Ubicado arriba a la izquierda.

#### Función
Abrir un popup simple para seleccionar libremente una fecha y cambiar el día visible de la agenda.

#### Requisitos
- debe tener formato de icon button circular, visualmente equivalente al botón `+`;
- no debe convivir con el título textual `Agenda`;
- reemplaza por completo el encabezado anterior basado en título.

### 6.2. Botón nuevo turno
Ubicado arriba a la derecha.

#### Función
Abrir el flujo o popup de creación de un nuevo turno.

#### Requisitos
- mismo lenguaje visual que el botón calendario;
- no debe competir visualmente con el bloque del día.

---

## 7. Bloque fijo del día

Este bloque es el primer bloque fijo de contenido operativo de la pantalla.

### 7.1. Contenido
Debe mostrar:
- selector rápido de día con tres opciones: `Ayer`, `Hoy`, `Mañana`;
- fecha completa del día seleccionado;
- disponibilidad del médico para ese día.

### 7.2. Selector rápido
#### Reglas
- las tres opciones deben vivir dentro del mismo bloque;
- no se requieren chips o indicadores adicionales;
- no debe existir botón `Volver a hoy` en la versión definitiva.

### 7.3. Estado visual del día actual
Cuando el día seleccionado sea **Hoy**:
- el bloque completo debe resaltarse en **verde**;
- ese cambio debe comunicar rápidamente “estás viendo el día actual”.

Cuando el día seleccionado no sea hoy:
- el bloque vuelve a su estilo neutro normal.

### 7.4. Fecha
Debe mostrarse debajo de la fila de botones del selector.

#### Requisito
La fecha debe ser el dato dominante dentro del bloque, por encima de la disponibilidad.

### 7.5. Disponibilidad
Debe mostrarse debajo de la fecha.

#### Formato esperado
Ejemplo:
- `Disponible de 09:00 a 18:00`

#### Objetivo
Dar contexto operativo inmediato sobre la franja disponible del médico para el día que se está viendo.

---

## 8. Popup de calendario

### Objetivo
Permitir navegación libre a cualquier fecha, más allá del acceso rápido por `Ayer / Hoy / Mañana`.

### Comportamiento esperado
- se abre desde el botón superior izquierdo;
- permite elegir una fecha puntual;
- al confirmar, actualiza el día visible de la agenda;
- el bloque del día y la lista de turnos deben recalcularse para la fecha elegida.

### Requisito UX
Debe ser un popup simple, claro y liviano. No debe sentirse como un módulo externo pesado.

---

## 9. Bloque `Turnos del día`

Este bloque contiene la lista operativa del día seleccionado y es el **único bloque con scroll interno** de la pantalla.

### 9.1. Encabezado
Debe mostrar:
- título `Turnos del día`;
- acción `Ver toda` o `Ver menos` arriba a la derecha.

### 9.2. Estado inicial comprimido
Por default, la lista debe mostrarse comprimida.

#### Regla general
- mostrar sólo los **primeros 3 turnos del día**.

#### Excepción para hoy
Si el día seleccionado es **Hoy**:
- mostrar el **próximo turno** y los **2 siguientes**.

### 9.3. Expansión de la lista
#### Botón `Ver toda`
- expande la lista para mostrar todos los turnos del día.

#### Botón `Ver menos`
- vuelve al estado comprimido.

### 9.4. Scroll interno
Cuando la lista esté expandida:
- el scroll debe ocurrir **sólo dentro del bloque de lista**;
- la pantalla completa no debe desplazarse.

### 9.5. Selección de turno
Al presionar cualquier turno de la lista:
- ese turno pasa a ser el turno seleccionado;
- el bloque inferior de acción debe actualizarse con sus datos.

### 9.6. Contenido mínimo de cada fila
Cada fila de turno debe mostrar:
- hora;
- nombre del paciente;
- tratamiento;
- chip de estado.

### 9.7. Estados visuales posibles
El chip de estado puede mostrar, según corresponda:
- `Próximo`;
- `Esperando`;
- `Confirmado`;
- otros estados operativos equivalentes definidos por el sistema.

---

## 10. Bloque fijo de acción del turno seleccionado

Este bloque vive fijo al pie de la pantalla, por encima de la bottom nav.

Su objetivo es concentrar la acción operativa inmediata del turno que el médico tiene actualmente seleccionado.

### 10.1. Contenido
Debe mostrar:
- nombre del paciente;
- chip de estado del turno;
- hora del turno;
- nombre del tratamiento;
- acción sobre ficha;
- acción sobre turno, cuando corresponda.

### 10.2. Jerarquía interna
#### Línea 1
- nombre del paciente;
- chip de estado.

#### Línea 2
- hora;
- tratamiento.

#### Línea 3
- botones de acción.

### 10.3. Botón `Ficha`
Debe estar **siempre visible**, en cualquier condición.

#### Regla de ancho
Cuando sea la única acción disponible:
- debe ocupar todo el ancho disponible del bloque.

### 10.4. Botón `Abrir turno`
Debe aparecer sólo bajo la condición operativa correcta.

#### Regla productiva
Mostrar `Abrir turno` únicamente cuando:
- el turno seleccionado sea el **próximo turno disponible de hoy**;
- y falten **menos de 5 minutos** para la hora programada.

#### Distribución de botones
Cuando `Abrir turno` esté visible:
- `Abrir turno` y `Ficha` comparten la misma fila;
- ambos reparten el ancho disponible en partes iguales.

#### Cuando no corresponda abrir turno
- sólo se muestra `Ficha`;
- `Ficha` ocupa todo el ancho disponible.

### 10.5. Regla actual de maqueta
En el mock actual no se exige validar la hora real del sistema.

Sin embargo, la documentación funcional definitiva deja fijada la regla correcta para productivo:
- `Abrir turno` debe depender de que falten menos de 5 minutos para el inicio del próximo turno del día actual.

---

## 11. Comportamiento por contexto

### 11.1. Si el día seleccionado es hoy
- el bloque del día se muestra resaltado en verde;
- la lista comprimida toma como ancla el próximo turno y los dos siguientes;
- el bloque inferior puede habilitar `Abrir turno` si además se cumple la regla temporal productiva.

### 11.2. Si el día seleccionado no es hoy
- el bloque del día vuelve a estilo neutro;
- la lista comprimida muestra los primeros 3 turnos cronológicos del día;
- el bloque inferior no debe mostrar `Abrir turno`.

### 11.3. Si se selecciona un turno cualquiera
- el bloque inferior cambia al turno seleccionado;
- la lista no pierde el foco general ni rompe su estructura.

---

## 12. Reglas visuales y de UX

### 12.1. Prioridad de la pantalla
La prioridad principal de esta pantalla es:
- **entender rápido el día visible**;
- **localizar el turno relevante**;
- **accionar desde el bloque inferior sin entrar todavía al turno**.

### 12.2. Qué no debe pasar
- no debe haber scroll global de pantalla;
- no debe haber superposición con la bottom nav;
- no debe haber bloques que compitan con la lista y el bloque inferior;
- no deben agregarse indicadores innecesarios en el bloque del día.

### 12.3. Sensación buscada
La pantalla debe sentirse:
- clara;
- estable;
- rápida de leer;
- muy operativa;
- sin ruido visual.

---

## 13. Responsive y restricciones de altura

### Breakpoints base
Validar siempre en:
- 360 px de ancho;
- 390 px de ancho;
- 430 px de ancho.

### Regla para alturas menores a 700 px
En resoluciones con menos de 700 px de alto:
- reducir proporcionalmente tamaños de texto;
- reducir paddings verticales;
- mantener visibles el bloque del día y el bloque inferior;
- preservar la legibilidad de la lista sin solapes.

### Regla estructural
El bloque que puede adaptarse en tamaño según el espacio disponible es el bloque de la lista de turnos.

Los bloques que deben mantenerse estables son:
- top actions;
- bloque del día;
- bloque inferior de acción.

---

## 14. Contrato funcional esperado de datos

### Datos mínimos del día
- fecha seleccionada;
- indicador de si la fecha corresponde a hoy;
- disponibilidad del médico para esa fecha.

### Datos mínimos de la lista
Por cada turno:
- `id`;
- `time`;
- `patient`;
- `treatment`;
- `status`.

### Datos mínimos del bloque inferior
- `id` del turno seleccionado;
- `patient`;
- `time`;
- `treatment`;
- `status`;
- indicador de si es el próximo turno de hoy;
- indicador productivo de si ya está habilitado para abrir.

---

## 15. Criterio de producto que esta pantalla debe respetar

Esta pantalla no debe comportarse como un calendario técnico ni como una agenda administrativa pesada.

Debe responder a una lógica de trabajo real:
- ver el día;
- identificar el turno correcto;
- entrar rápido a la acción disponible;
- mantener la navegación simple.

En términos de UX, el objetivo no es mostrar “muchos turnos”, sino permitir que el médico **entienda qué tiene y qué puede hacer ahora**.

---

## 16. Estado de esta especificación

Esta documentación deja a `AgendaPage` como **pantalla definitiva del mock**.

A futuro, podrán ajustarse:
- contenido exacto de disponibilidad;
- lógica integrada con fecha/hora real;
- popup real de calendario;
- conexión con backend.

Pero la arquitectura UX base de la pantalla queda fijada en estos términos.
