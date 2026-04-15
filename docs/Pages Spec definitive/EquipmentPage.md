# EquipmentPage — Documentación definitiva

## Objetivo de la pantalla

Pantalla administrativa para visualizar, filtrar y operar el catálogo de **equipos** del centro activo dentro del mock mobile-first.

La pantalla sigue la misma lógica estructural ya consolidada en **Tratamientos**, **Insumos** y **Productos**, pero con foco en la **disponibilidad física** y la **ubicación actual** de cada equipo.

---

## Contexto operativo

- Los equipos son recursos físicos con **ubicación actual real**.
- Siempre deben estar asignados a un centro o a una situación operativa equivalente.
- En el caso del **médico independiente**, los equipos estarán asignados a su único centro y solo podrán dejar de estar disponibles cuando estén en **service técnico**.
- En el caso de **organizaciones**, los equipos podrán trasladarse entre distintos centros de la organización.
- Si un equipo está asignado a un centro distinto del centro activo, debe considerarse **no disponible** en la pantalla actual.
- Los equipos pueden tener **insumos asociados**, pero esos insumos no deben mostrarse dentro de cada ficha de la lista.
- Las validaciones complejas de disponibilidad, consistencia entre centros y reglas de traslado corresponden al **backend**, no al Front.

---

## Contexto mock fijo

Usar como datos mock por defecto:

- **Médica:** Brenda Mansilla
- **Centro activo:** Consultorio Melendez

---

## Estructura general de la pantalla

Orden vertical de bloques:

1. **Topbar**
2. **Bloque de centro activo**
3. **Bloque de filtrado**
4. **Bloque adaptable al espacio útil con la lista de equipos**
5. **Bloque fijo inferior de acciones**, por encima de la bottom nav

### Regla general de layout
- Todos los bloques son fijos excepto el listado central.
- El listado central debe ocupar el alto remanente.
- El listado central es el único bloque con **scroll interno**.
- La pantalla no debe tener scroll global.

---

## 1. Topbar

### Elementos
- Botón de **volver** arriba a la izquierda.
- Botón **+** arriba a la derecha.

### Comportamiento
- **Volver:** regresar a la pantalla anterior dentro del flujo administrativo.
- **+ :** navegar a la pantalla de alta de nuevo equipo.

---

## 2. Bloque de centro activo

Bloque visualmente consistente con las demás pantallas administrativas.

### Contenido
- Label: `Centro actual`
- Valor: `Consultorio Melendez`

### Comportamiento
- En el caso del médico independiente, este bloque es solo informativo.
- Más adelante, en organizaciones, desde aquí podrá cambiarse el centro activo.

---

## 3. Bloque de filtrado

Debe seguir el mismo patrón general de las pantallas administrativas:

- input simple para buscar por nombre;
- botón a la derecha para abrir popup de filtros.

### En pantalla principal
- Placeholder del input: `Buscar equipo`
- Botón de filtros a la derecha.

### Popup de filtros

Debe abrir un popup/modal con estas secciones:

#### A. Estado
Opciones sumables:
- `Disponibles`
- `No disponibles`

#### B. Ubicación
Opciones sumables:
- `Centro activo`
- `Otro centro`
- `Service técnico`

#### C. Insumos
Opciones sumables:
- `Con insumos`
- `Sin insumos`

### Reglas de filtros
- Las opciones dentro de una misma dimensión pueden combinarse.
- Si quedan activas todas las opciones de una misma dimensión, equivale a no restringir esa dimensión.
- El popup debe tener acciones:
  - `Limpiar filtros`
  - `Aplicar`

---

## 4. Bloque de listado de equipos

Es el bloque protagonista de la pantalla.

### Comportamiento general
- Debe ocupar todo el espacio útil restante entre filtros y acciones.
- Debe tener scroll interno.
- Debe mostrar contador de resultados visibles.
- Cada ficha debe ser seleccionable.
- El ítem seleccionado alimenta el bloque inferior de acciones.

### Encabezado del bloque
- Título: `Equipos`
- Contador de resultados visibles a la derecha.

---

## 5. Estructura de cada ficha de equipo

Cada ficha debe organizarse como una fila con contenido principal a la izquierda y acción a la derecha.

### Información principal de la ficha

#### Fila 1
- **Nombre del equipo**
- Es el dato más destacado de la ficha.

#### Fila 2
- **Tipo, modelo o identificador corto**
- Si en el mock existe un modelo comercial, mostrarlo aquí.
- Si no existe ese dato, usar serial o identificador breve.

#### Fila 3
- **Ubicación o disponibilidad actual**
- Ejemplos:
  - `Disponible en Consultorio Melendez`
  - `Asignado a Centro Norte`
  - `En service técnico`

#### Fila 4
- Mostrar solo cuando el equipo no esté disponible en el centro activo.
- Debe indicar el motivo principal de no disponibilidad.
- Ejemplos:
  - `No disponible en el centro actual`
  - `En service técnico`

### Acción a la derecha
- Botón `Editar`
- Navega a la pantalla de edición del equipo en particular.

---

## 6. Estados visuales de la ficha

### Estado normal
- fondo neutro;
- corresponde a equipos disponibles en el centro activo.

### Estado no disponible
- fondo rojo;
- corresponde a equipos que no están disponibles para operar en el centro activo, ya sea porque:
  - están asignados a otro centro;
  - están en service técnico.

### Selección del ítem
El ítem seleccionado debe verse claramente incluso cuando la ficha ya tenga fondo rojo.

### Regla de implementación del resaltado seleccionado
El resaltado del seleccionado debe ser independiente del color semántico del estado y no depender solo de una leve diferencia de fondo.

### Recomendación
Aplicar una combinación de:
- borde más contrastado;
- outline o halo externo;
- elevación o sombra diferencial;
- opcionalmente un indicador adicional.

Este criterio debe mantenerse también para futuras pantallas y para el frontend productivo.

---

## 7. Bloque fijo inferior de acciones

Debe quedar fijo por encima de la bottom nav.

### Botones
Dos botones distribuidos equitativamente:

- `Insumos (X)`
- `Trasladar`

### Comportamiento

#### Botón `Insumos (X)`
- Abre popup o modal con el listado de insumos asociados al equipo seleccionado.
- La cantidad entre paréntesis indica cuántos insumos están asociados al equipo.

#### Botón `Trasladar`
- Navega a la pantalla de traslados, que se implementará después.

---

## 8. Popup de Insumos del equipo

Debe abrirse desde el botón `Insumos (X)` del bloque inferior.

### Objetivo
Permitir ver rápidamente qué insumos requiere o utiliza el equipo sin recargar la ficha principal de la lista.

### Estructura sugerida del popup
- título: `Insumos`
- subtítulo opcional con el nombre del equipo seleccionado
- listado simple de insumos asociados

### Cada ítem del listado
Debe mostrar:
- nombre del insumo
- botón `Detalle`

### Comportamiento del botón `Detalle`
- Navega a la pantalla de detalle de ese insumo, si ya existe la ruta.
- Si todavía no existe, usar ruta stub preparada.

### Regla UX
No incluir información extensa dentro de este popup.  
La idea es ver rápidamente el listado asociado y, si hace falta, ir al detalle del insumo.

---

## 9. Navegaciones requeridas

### Desde esta pantalla
- volver a la pantalla anterior;
- ir a alta de nuevo equipo;
- ir a edición de un equipo;
- abrir popup de filtros;
- abrir popup de insumos;
- ir a pantalla de traslados.

### Rutas stub permitidas
Si alguna pantalla todavía no existe, usar ruta preparada o stub sin romper la continuidad del mock.

---

## 10. Responsive y layout

### Criterios generales
- Mobile first.
- Anchos a contemplar:
  - 360 px
  - 390 px
  - 430 px

### Regla de altura reducida
Cuando la pantalla tenga menos de **700 px de alto**:
- reducir proporcionalmente tamaños de fuente;
- reducir altura de controles;
- reducir paddings y gaps de forma moderada;
- mantener tocabilidad correcta.

### Reglas fijas
- sin scroll horizontal;
- respetar safe area superior e inferior;
- la lista es el único bloque con scroll interno;
- el bloque de acciones inferior debe permanecer siempre visible.

---

## 11. Contenido mock esperado

Los mocks deben parecer reales y no absurdos.

Ejemplos esperables:
- equipos clínicos plausibles;
- casos disponibles en el centro activo;
- casos asignados a otro centro;
- casos en service técnico;
- equipos con y sin insumos asociados.

---

## 12. Resumen operativo de la pantalla

La pantalla definitiva de **Equipos** queda compuesta por:

- botón de volver arriba a la izquierda;
- botón `+` arriba a la derecha;
- bloque de centro activo;
- bloque de filtrado por nombre con popup de filtros;
- bloque central adaptable con lista de equipos;
- fichas con nombre, tipo, modelo o identificador, ubicación o disponibilidad y motivo de no disponibilidad si corresponde;
- botón `Editar` por ficha;
- fondo rojo para equipos no disponibles en el centro activo;
- bloque fijo inferior con botones `Insumos (X)` y `Trasladar`;
- popup de insumos asociados al equipo.
