# ProductsPage — Documentación definitiva

## Objetivo de la pantalla

Pantalla administrativa para visualizar, filtrar y operar el catálogo de **productos** del centro activo dentro del mock mobile-first.

Su comportamiento general debe ser el mismo que el de la pantalla de **Insumos**, manteniendo la misma lógica de layout, navegación y acciones, con la diferencia principal de que:

- cada ficha de producto muestra una **foto miniatura**;
- los productos **no requieren lote**.

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
4. **Bloque adaptable al espacio útil con la lista de productos**
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
- **+ :** navegar a la pantalla de alta de nuevo producto.

---

## 2. Bloque de centro activo

Bloque visualmente consistente con Disponibilidad, Tratamientos e Insumos.

### Contenido
- Label: `Centro actual`
- Valor: `Consultorio Melendez`

### Comportamiento
- En el caso del médico independiente, este bloque es solo informativo.
- Más adelante, en organizaciones, desde aquí podrá cambiarse el centro activo.

---

## 3. Bloque de filtrado

Debe seguir exactamente el patrón general de las pantallas administrativas del mock:

- input simple para buscar por nombre;
- botón a la derecha para abrir popup de filtros.

### En pantalla principal
- Placeholder del input: `Buscar producto`
- Botón de filtros a la derecha.

### Popup de filtros

Debe abrir un popup/modal con estas secciones:

#### A. Alertas
Opciones sumables:
- `Próximo vencimiento`
- `Bajo stock`

#### B. Foto
Opciones sumables:
- `Con foto`
- `Sin foto`

#### C. Stock
Opciones sumables:
- `Con stock`
- `Sin stock`

### Reglas de filtros
- Las opciones dentro de una misma dimensión pueden combinarse.
- Si ambas opciones de una misma dimensión quedan activas, equivale a no restringir esa dimensión.
- El popup debe tener acciones:
  - `Limpiar filtros`
  - `Aplicar`

---

## 4. Bloque de listado de productos

Es el bloque protagonista de la pantalla.

### Comportamiento general
- Debe ocupar todo el espacio útil restante entre filtros y acciones.
- Debe tener scroll interno.
- Debe mostrar contador de resultados visibles.
- Cada ficha debe ser seleccionable.
- El ítem seleccionado alimenta el bloque inferior de acciones.

### Encabezado del bloque
- Título: `Productos`
- Contador de resultados visibles a la derecha.

---

## 5. Estructura de cada ficha de producto

Cada ficha debe organizarse horizontalmente en tres zonas:

### A. Miniatura a la izquierda
- Mostrar la **foto miniatura** del producto.
- Debe tener tamaño fijo y consistente.
- Debe usar bordes redondeados.
- Si el producto no tiene foto, mostrar un placeholder visual coherente con el sistema.

### B. Información principal al centro
La información visible de la ficha debe ser:

1. **Nombre del producto**  
   - dato más destacado de la ficha.

2. **Stock**  
   - ejemplo: `Stock: 12 u`

3. **Vencimiento**  
   - ejemplo: `Vence: 18/10/2026`

4. **Alerta textual**, solo si corresponde:
   - `Bajo stock`
   - `Vence en menos de 30 días`

### C. Acción a la derecha
- Botón `Editar`
- Navega a la pantalla de edición de ese producto en particular.

---

## 6. Estados visuales de la ficha

### Estado normal
- fondo neutro.

### Bajo stock
- fondo violeta;
- mostrar texto `Bajo stock`.

### Próximo vencimiento
- fondo rojo;
- mostrar texto `Vence en menos de 30 días`.

### Selección del ítem
La selección del ítem debe verse con claridad incluso cuando la ficha ya tenga color violeta o rojo.

### Regla de implementación del resaltado seleccionado
El resaltado del ítem seleccionado debe ser independiente del color semántico de alerta y no depender solo de una leve diferencia de fondo.

### Recomendación
Aplicar una combinación de:
- borde más contrastado;
- outline o halo externo;
- elevación/sombra diferencial;
- opcionalmente un pequeño indicador extra.

Esto debe tomarse como criterio también para futuras pantallas y para el frontend productivo.

---

## 7. Bloque fijo inferior de acciones

Debe quedar fijo por encima de la bottom nav.

### Botones
Dos botones distribuidos equitativamente:

- `Stock`
- `Trasladar`

### Comportamiento

#### Botón `Stock`
Abre popup/modal para controlar el stock del producto seleccionado.

#### Botón `Trasladar`
Navega a la pantalla de traslados, que se implementará después.

---

## 8. Popup de Stock

Debe funcionar igual que en la pantalla de Insumos, con la salvedad de que los productos **no requieren lote**.

### Objetivo
Permitir:
- incrementar stock;
- disminuir stock;
- exigir nota justificativa al disminuir stock.

### Estructura sugerida del popup

#### Encabezado
- Nombre del producto
- Centro activo
- Cierre del modal

#### Resumen superior
- stock actual total

#### Operación
- selector de operación:
  - `Incrementar`
  - `Disminuir`
- campo de cantidad
- campo de nota justificativa obligatorio solo si se disminuye
- botón para confirmar

### Regla funcional
- Si la operación es **disminuir stock**, la **nota justificativa es obligatoria**.
- Si falta la nota, la acción no se acepta.

---

## 9. Navegaciones requeridas

### Desde esta pantalla
- volver a la pantalla anterior;
- ir a alta de nuevo producto;
- ir a edición de un producto;
- abrir popup de filtros;
- abrir popup de stock;
- ir a pantalla de traslados.

### Rutas stub permitidas
Si alguna pantalla todavía no existe, usar ruta preparada/stub sin romper la continuidad del mock.

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

## 11. Diferencias explícitas respecto de InsumosPage

La pantalla de productos es igual a la de insumos en estructura y funcionamiento general, con estas diferencias obligatorias:

1. Los productos **no llevan lote**.
2. En el filtrado, el bloque `Lote` se reemplaza por `Foto`.
3. Cada ficha de producto muestra **foto miniatura** a la izquierda.
4. La información visible por ficha es:
   - nombre;
   - stock;
   - vencimiento;
   - alerta textual si corresponde.
5. El popup de stock no debe contemplar selección de lote.

---

## 12. Resumen operativo de la pantalla

La pantalla definitiva de **Productos** queda compuesta por:

- botón de volver arriba a la izquierda;
- botón `+` arriba a la derecha;
- bloque de centro activo;
- bloque de filtrado por nombre con popup de filtros;
- bloque central adaptable con lista de productos;
- fichas con miniatura, nombre, stock y vencimiento;
- alertas visuales por bajo stock o próximo vencimiento;
- botón `Editar` por ficha;
- bloque fijo inferior con botones `Stock` y `Trasladar`;
- popup de stock sin manejo de lote y con nota obligatoria para decrementos.
