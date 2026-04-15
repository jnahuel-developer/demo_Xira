# InsumosPage — Documentación definitiva

## Objetivo de la pantalla

Pantalla administrativa para visualizar, filtrar y operar el catálogo de **insumos** del centro activo dentro del mock mobile-first.

Debe mantener la misma lógica general ya consolidada en las pantallas administrativas del mock:

- topbar mínima;
- bloque fijo de contexto;
- bloque fijo de filtrado;
- bloque central adaptable con **scroll interno** para la lista;
- bloque fijo inferior de acciones;
- sin scroll global de la pantalla.

## Contexto operativo

- Tanto los **insumos** como los **equipos** tienen siempre una **ubicación física**.
- En el caso del **médico independiente**, el centro activo será siempre el único centro asignado.
- En organizaciones, los insumos estarán asociados a un centro concreto y podrán trasladarse entre centros.
- Las validaciones complejas de disponibilidad o consistencia entre centros **no son responsabilidad del Front**. El backend resolverá esas reglas.
- La pantalla solo debe reflejar estados mockeados y disparar navegación o popups acordes al flujo.

## Contexto mock fijo

A partir de esta etapa, usar como datos mock por defecto:

- **Médica:** Brenda Mansilla
- **Centro activo:** Consultorio Melendez

## Estructura general de la pantalla

Orden vertical de bloques:

1. **Topbar**
2. **Bloque de centro activo**
3. **Bloque de filtrado**
4. **Bloque adaptable de lista de insumos**
5. **Bloque fijo inferior de acciones**, por encima de la bottom nav

Todos los bloques son fijos excepto el listado central, que debe ocupar el alto remanente y ser el único con scroll interno.

---

## 1. Topbar

### Elementos
- Botón **volver** arriba a la izquierda.
- Botón **+** arriba a la derecha.

### Comportamiento
- **Volver:** regresar a la pantalla anterior dentro del flujo administrativo.
- **+ :** navegar a la pantalla de alta de nuevo insumo.

---

## 2. Bloque de centro activo

Bloque informativo, visualmente consistente con Disponibilidad y Tratamientos.

### Contenido
- Label superior: `Centro actual`
- Valor principal: `Consultorio Melendez`

### Comportamiento
- En el mock del médico independiente, este bloque es solo informativo.
- A futuro, en organizaciones, desde aquí podrá cambiarse el centro activo.

---

## 3. Bloque de filtrado

Debe seguir el patrón ya usado en otras pantallas del mock:

- input simple de búsqueda por nombre;
- botón a la derecha para abrir popup de filtros.

### En pantalla principal
- Placeholder del input: `Buscar insumo`
- Botón de filtros a la derecha.

### Popup de filtros

Debe abrir un popup/modal con estas secciones:

#### A. Alertas
Opciones sumables:
- `Próximo vencimiento`
- `Bajo stock`

#### B. Lote
Opciones sumables:
- `Requiere lote`
- `No requiere lote`

#### C. Stock
Opciones sumables:
- `Con stock`
- `Sin stock`

### Reglas de filtros
- Las opciones dentro de cada bloque pueden combinarse.
- Si quedan ambas activas dentro de una misma dimensión, equivale a no restringir esa dimensión.
- El popup debe tener acciones estándar:
  - `Limpiar filtros`
  - `Aplicar`

---

## 4. Bloque de listado de insumos

Es el bloque protagonista de la pantalla.

### Comportamiento general
- Debe ocupar todo el espacio útil restante entre el bloque de filtros y el bloque de acciones.
- Debe tener **scroll interno**.
- Debe mostrar contador de resultados visibles.
- Cada ítem debe ser seleccionable.
- El ítem seleccionado alimenta el bloque inferior de acciones.

### Encabezado del bloque
- Título: `Insumos`
- Contador de resultados visibles a la derecha.

### Estructura de cada ficha

Cada ficha de la lista debe mostrar:

#### Columna izquierda / contenido principal
1. **Nombre del insumo**  
   - dato más destacado de la ficha.

2. **Vencimiento**  
   - si no requiere lote o tiene un solo lote, mostrar la fecha de vencimiento principal.
   - si tiene varios lotes, mostrar como dato principal la fecha del **primer lote a vencer**.

3. **Stock y lote**
   - mostrar stock total.
   - indicar si requiere lote o no.
   - ejemplos:
     - `Stock: 24 u · No requiere lote`
     - `Stock: 58 u · 3 lotes activos`

4. **Alerta textual**, solo si corresponde:
   - `Bajo stock`
   - `Vence en menos de 30 días`

#### Columna derecha / acción
- Botón `Editar`
- Navega a la pantalla de edición de ese insumo.

### Estados visuales de la ficha

#### Estado normal
- fondo neutro.

#### Bajo stock
- fondo violeta.
- mostrar texto `Bajo stock`.

#### Próximo vencimiento
- fondo rojo.
- mostrar texto `Vence en menos de 30 días`.

### Prioridad visual del vencimiento
Cuando el insumo tenga varios lotes:
- el vencimiento visible en la ficha debe ser el del **lote más próximo a vencer**;
- este es el dato operativo más importante para la lista.

### Selección del ítem
Aunque en la maqueta actual el resaltado del seleccionado no se percibe bien cuando el fondo ya es violeta o rojo, la definición definitiva debe fijar lo siguiente:

- el ítem seleccionado debe tener un sistema de resaltado **independiente del color de alerta**;
- no debe depender solo de una leve variación de fondo;
- debe seguir siendo claramente visible sobre fichas neutras, violetas o rojas.

### Recomendación de implementación del resaltado seleccionado
Aplicar una combinación de:
- borde más contrastado;
- outline o halo externo visible;
- elevación/sombra diferencial;
- opcionalmente un pequeño indicador lateral o superior.

No alterar el color semántico de alerta para resolver la selección.

---

## 5. Bloque fijo inferior de acciones

Debe quedar fijo por encima de la bottom nav.

### Botones
Dos botones distribuidos equitativamente:

- `Stock`
- `Trasladar`

### Comportamiento

#### Botón `Stock`
Abre popup/modal para controlar el stock del insumo seleccionado.

#### Botón `Trasladar`
Navega a la pantalla de traslados, que se implementará después.

---

## 6. Popup de Stock

Este popup es la forma de operar el stock manual del insumo seleccionado.

### Objetivo
Permitir:

- incrementar stock;
- disminuir stock;
- elegir lote cuando corresponda;
- exigir justificación al disminuir stock.

### Estructura sugerida del popup

#### Encabezado
- Nombre del insumo
- Centro activo
- Cierre del modal

#### Resumen superior
- stock actual total
- si requiere lote o no

### Caso A. Insumo sin lote
Mostrar:
- stock actual;
- selector de operación:
  - `Incrementar`
  - `Disminuir`
- campo de cantidad;
- campo de nota justificativa obligatorio solo si se disminuye;
- botón para confirmar.

### Caso B. Insumo con lote
Mostrar:
- listado de stocks por lote;
- cada lote debe indicar:
  - identificador o nombre del lote;
  - vencimiento;
  - cantidad disponible;
- permitir seleccionar el lote sobre el que se quiere operar;
- luego mostrar:
  - selector de operación;
  - cantidad;
  - nota justificativa obligatoria si se disminuye;
  - botón para confirmar.

### Reglas funcionales del popup
- Si la operación es **disminuir stock**, la **nota justificativa es obligatoria**.
- Si falta la nota, la acción no se acepta.
- Si requiere lote, la acción debe operar sobre un lote elegido.
- El mock no necesita lógica productiva compleja, pero sí debe representar correctamente estas reglas visuales y de interacción.

---

## 7. Resolución UX para múltiples lotes

Para la pantalla principal **no** se debe listar lote por lote dentro de cada ficha, porque volvería la lista demasiado alta y poco legible en mobile.

### Regla definitiva
En la lista principal:
- mostrar **stock total agregado**;
- mostrar cantidad de lotes activos;
- mostrar el **vencimiento más próximo**.

El detalle lote por lote queda exclusivamente dentro del popup de `Stock`.

Esta decisión debe mantenerse también para el frontend productivo salvo que exista una razón funcional fuerte para cambiarla.

---

## 8. Navegaciones requeridas

### Desde esta pantalla
- volver a la pantalla anterior;
- ir a alta de nuevo insumo;
- ir a edición de un insumo;
- abrir popup de filtros;
- abrir popup de stock;
- ir a pantalla de traslados.

### Rutas stub permitidas
Si alguna pantalla todavía no existe, usar ruta preparada/stub sin romper la navegación.

---

## 9. Responsive y layout

### Criterios generales
- Mobile first.
- Anchos a contemplar:
  - 360 px
  - 390 px
  - 430 px

### Regla de altura reducida
Cuando la pantalla tenga menos de **700 px de alto**:
- reducir proporcionalmente tamaños de fuente;
- reducir altura vertical de controles;
- reducir paddings y gaps de forma moderada;
- conservar siempre tocabilidad correcta.

### Reglas fijas
- sin scroll horizontal;
- respetar safe area superior e inferior;
- la lista es el único bloque con scroll interno;
- el bloque de acciones inferior debe permanecer siempre visible.

---

## 10. Contenido mock esperado

Los mocks deben parecer reales y no absurdos.

Ejemplos esperables:
- insumos clínicos plausibles;
- casos con lote y sin lote;
- casos con stock normal, bajo stock y próximo vencimiento;
- combinaciones donde el vencimiento visible provenga del lote más próximo.

---

## 11. Resumen operativo de la pantalla

La pantalla definitiva de **Insumos** queda compuesta por:

- botón de volver arriba a la izquierda;
- botón `+` arriba a la derecha;
- bloque de centro activo;
- bloque de filtrado por nombre con popup de filtros;
- bloque central adaptable con lista de insumos;
- fichas con nombre, vencimiento, stock y condición de lote;
- alertas visuales por bajo stock o próximo vencimiento;
- botón `Editar` por ficha;
- bloque fijo inferior con botones `Stock` y `Trasladar`;
- popup de stock con soporte para lote y nota obligatoria al disminuir stock.
