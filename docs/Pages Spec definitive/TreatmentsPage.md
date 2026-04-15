# TreatmentsPage — Documentación definitiva

## 1. Objetivo de la pantalla

`TreatmentsPage` es la pantalla administrativa desde la cual el médico gestiona el catálogo de tratamientos disponibles en su centro activo.

Su objetivo es permitir:

- ver la lista completa de tratamientos;
- filtrar rápidamente la lista;
- agregar un nuevo tratamiento;
- editar un tratamiento existente;
- consultar, para el tratamiento seleccionado, sus insumos y certificaciones asociadas.

La pantalla debe mantener una lógica **mobile-first**, con foco en claridad, baja carga mental y aprovechamiento eficiente del alto disponible.

---

## 2. Rol y contexto de uso

Esta pantalla pertenece al flujo secundario de administración accesible desde `Más`.

En esta etapa del mock, el rol principal es el **médico independiente**.

### Datos mock fijos actuales

- Médica: **Brenda Mansilla**
- Centro activo: **Consultorio Melendez**

Para médico independiente, el centro es solo informativo.
A futuro, en organizaciones, desde este mismo bloque se podrá cambiar el centro activo para operar sobre otro scope válido.

---

## 3. Estructura general de la pantalla

La pantalla se compone de cinco bloques verticales, en este orden:

1. **Topbar**
2. **Bloque de centro activo**
3. **Bloque de filtrado**
4. **Bloque de lista de tratamientos**
5. **Bloque fijo inferior de acciones**

### Regla de layout

- Todos los bloques son **fijos** en altura y posición, salvo el bloque de lista.
- El **único bloque adaptable al espacio libre y con scroll interno** es el de la lista de tratamientos.
- La pantalla no debe generar scroll global.
- Deben respetarse siempre el `safe area top` y el espacio ocupado por la `bottom nav`.

---

## 4. Comportamiento responsive

La pantalla debe diseñarse y probarse al menos en:

- **360 px**
- **390 px**
- **430 px**

### Regla para alturas reducidas

Cuando la altura disponible sea menor a **700 px**, se deben reducir proporcionalmente:

- tamaños de fuente;
- alturas de controles;
- paddings internos;
- separación entre bloques.

La reducción debe conservar legibilidad y tap targets correctos.

---

## 5. Topbar

Ubicada arriba del contenido útil, debajo del `safe area top`.

### Elementos

- **Botón volver** arriba a la izquierda.
- **Botón `+`** arriba a la derecha.

### Comportamiento

#### Botón volver
- vuelve a la pantalla anterior del flujo.

#### Botón `+`
- navega a la pantalla para **agregar un nuevo tratamiento**.

---

## 6. Bloque de centro activo

Debajo de la topbar.

### Objetivo

Dar feedback visual inmediato del centro sobre el cual se está evaluando la lista y la disponibilidad operativa de los tratamientos.

### Contenido

- título breve: `Centro actual`
- valor: `Consultorio Melendez`

### Comportamiento actual

- en médico independiente es **solo informativo**;
- no tiene selector ni acción asociada.

### Evolución futura

- en organizaciones, este bloque podrá permitir cambiar el centro activo.

---

## 7. Bloque de filtrado

Ubicado debajo del bloque de centro activo.

### Estructura visible en pantalla

- a la izquierda: campo de búsqueda por nombre del tratamiento;
- a la derecha: botón para abrir el popup de filtros.

### 7.1. Búsqueda directa

Debe permitir ingresar texto para buscar por nombre del tratamiento.

#### Regla
- la búsqueda debe filtrar la lista en tiempo real o con respuesta inmediata;
- el criterio de búsqueda es por nombre;
- la búsqueda debe ser simple, sin ocupar más espacio del necesario.

### 7.2. Botón de filtros

Abre un popup con filtros adicionales.

---

## 8. Popup de filtros

El popup debe concentrar los filtros secundarios para no ocupar espacio en la pantalla principal.

### Bloques de filtros del popup

#### A. Estado
Opciones:

- `Habilitados`
- `Bloqueados`

Reglas:

- son filtros sumables;
- puede quedar activo uno solo o ambos;
- no debe permitirse desactivar ambos al mismo tiempo.

#### B. Categoría
Opciones:

- `Inyectables`
- `Aparatología`

Reglas:

- son filtros sumables;
- puede quedar activa una sola o ambas;
- no debe permitirse desactivar ambas al mismo tiempo.

#### C. Criticidad
Opciones:

- `Crítico`
- `No crítico`

Reglas:

- son filtros sumables;
- puede quedar activa una sola o ambas;
- no debe permitirse desactivar ambas al mismo tiempo.

#### D. Requiere equipo
Opciones:

- `Sí`
- `No`

Reglas:

- son filtros sumables;
- puede quedar activa una sola o ambas;
- no debe permitirse desactivar ambas al mismo tiempo.

### Estado inicial por default

Al abrir la pantalla por primera vez:

- `Estado`: solo **Habilitados** activo;
- `Categoría`: **Inyectables** y **Aparatología** activos;
- `Criticidad`: **Crítico** y **No crítico** activos;
- `Requiere equipo`: **Sí** y **No** activos.

### Acciones del popup

- botón para **limpiar/restablecer filtros**;
- botón para **aplicar**.

---

## 9. Bloque de lista de tratamientos

Es el bloque principal de la pantalla.

### Reglas estructurales

- ocupa todo el espacio libre entre el bloque de filtrado y el bloque inferior de acciones;
- es el único bloque con scroll interno;
- debe adaptarse al alto disponible;
- no debe empujar fuera de pantalla al bloque inferior fijo.

### Encabezado del bloque

Debe mostrar:

- título: `Tratamientos`
- contador de resultados visibles

---

## 10. Fichas de la lista

Cada tratamiento visible se representa como una ficha seleccionable.

### Jerarquía visual

El nombre del tratamiento debe ser el dato más destacado de la ficha.

### Estructura de cada ficha

Cada ficha debe mostrar, en este orden:

#### Fila 1
- **Nombre del tratamiento**
- debe destacarse visualmente sobre el resto de la información

#### Fila 2
- **Categoría** y **duración**
- formato breve, en la misma línea
- ejemplo: `Inyectables · 60 min`

#### Fila 3
- **Equipo requerido**
- mostrar:
  - `No requiere equipo`, si no usa equipo;
  - o el nombre completo del equipo, si requiere uno.

#### Fila 4
- **Motivo del bloqueo**, solo si el tratamiento está bloqueado.
- esta línea **no existe** para tratamientos habilitados.

### Botón lateral de edición

A la derecha de cada ficha debe estar el botón para **Editar**.

#### Regla de interacción
- tocar la ficha selecciona el tratamiento;
- tocar el botón lateral abre la pantalla de edición del tratamiento.

La selección y la edición deben ser acciones separadas.

---

## 11. Tratamientos bloqueados

Los tratamientos bloqueados deben diferenciarse directamente dentro de la lista.

### Reglas visuales

- la ficha debe cambiar su color de fondo a **rojo** o a una variante suave de rojo;
- debe aparecer la cuarta línea con el **motivo del bloqueo**.

### Motivo mostrado

Solo se debe mostrar **un único motivo**, el más prioritario.

### Prioridad del motivo de bloqueo

1. **No habilitado en el centro activo**
2. **Equipo no disponible**
3. **Faltan insumos**

### Objetivo UX

El operador debe poder detectar de forma inmediata:

- si el tratamiento está habilitado o bloqueado;
- y, si está bloqueado, por qué.

No debe existir un bloque de resumen separado para mostrar esta información: debe resolverse dentro de la propia ficha.

---

## 12. Selección de tratamiento

La lista debe tener siempre una ficha seleccionada mientras existan resultados visibles.

### Reglas

- al entrar a la pantalla, si hay resultados, debe quedar seleccionada la primera ficha visible;
- al cambiar filtros o búsqueda, si la ficha seleccionada deja de estar visible, debe seleccionarse automáticamente la primera ficha del nuevo resultado;
- la ficha seleccionada debe verse resaltada frente a las demás.

La selección activa controla el contenido del bloque inferior de acciones.

---

## 13. Bloque fijo inferior de acciones

Ubicado por encima de la `bottom nav`.

### Regla estructural

- este bloque es **fijo**;
- no debe scrollear;
- debe permanecer visible aunque la lista sea larga.

### Contenido

Debe contener **dos botones distribuidos equitativamente**:

- `Insumos (X)`
- `Certificaciones (X)`

Donde `X` representa la cantidad de elementos asociados al tratamiento seleccionado.

### Comportamiento

#### Botón `Insumos (X)`
- abre un popup con el listado de insumos del tratamiento seleccionado.

#### Botón `Certificaciones (X)`
- abre un popup con el listado de certificaciones del tratamiento seleccionado.

---

## 14. Popup de insumos

Se abre desde el botón `Insumos (X)` del bloque fijo inferior.

### Objetivo

Permitir una consulta rápida de los insumos requeridos sin sobrecargar la pantalla principal.

### Estructura de cada ficha dentro del popup

Cada ítem debe mostrar únicamente:

1. **Nombre del insumo**
2. **Cantidad necesaria para el tratamiento**
3. Botón **`Detalle`**

### Comportamiento del botón `Detalle`

- navega a la pantalla de detalle de ese insumo;
- si el mock ya tiene el ID disponible desde la ficha, debe navegar directamente a esa ruta.

---

## 15. Popup de certificaciones

Se abre desde el botón `Certificaciones (X)` del bloque fijo inferior.

### Objetivo

Permitir una consulta rápida de certificaciones requeridas sin ocupar espacio permanente en la pantalla principal.

### Estructura de cada ficha dentro del popup

Cada ítem debe mostrar únicamente:

1. **Nombre de la certificación**
2. **Fecha de expiración**
3. Botón **`Detalle`**

### Comportamiento del botón `Detalle`

- navega a la pantalla de detalle de esa certificación;
- si el mock ya tiene el ID disponible desde la ficha, debe navegar directamente a esa ruta.

---

## 16. Eliminación de tratamientos

La eliminación **no** debe existir como acción directa en la lista.

### Regla

- el tratamiento se puede eliminar solo desde la pantalla de edición.

### Motivo UX

Esto reduce el riesgo de eliminación accidental dentro de una pantalla de consulta y selección rápida.

---

## 17. Reglas de contenido y consistencia

### La pantalla debe respetar estos criterios

- priorizar claridad por encima de densidad;
- evitar bloques de resumen que resten espacio útil a la lista;
- resolver la información crítica dentro de cada ficha;
- mantener consistencia con `PatientsPage`, `AgendaPage`, `TurnWorkspacePage`, `PatientHistoryPage`, `MorePage` y `AvailabilityPage`;
- usar datos mock plausibles y con apariencia productiva;
- no introducir reglas funcionales que contradigan la documentación madre del proyecto.

---

## 18. Resumen operativo final

La pantalla definitiva queda compuesta así:

1. botón volver arriba a la izquierda y botón `+` arriba a la derecha;
2. bloque de centro activo;
3. bloque de filtrado con búsqueda y botón de filtros;
4. bloque adaptable con la lista de tratamientos y scroll interno;
5. bloque fijo inferior con los botones `Insumos (X)` y `Certificaciones (X)`.

La información de bloqueo, disponibilidad operativa y equipo requerido se resuelve directamente dentro de cada ficha de tratamiento, con el objetivo de maximizar el espacio útil para la lista en pantallas mobile.
