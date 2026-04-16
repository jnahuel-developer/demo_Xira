# ChargePage — Documentación definitiva

## Objetivo de la pantalla

Pantalla de **cierre económico del turno** luego de terminada la sesión clínica.

Debe sentirse como la continuación natural del flujo del turno, no como un módulo de caja separado.  
La pantalla llega con el tratamiento ya realizado y con el **monto de la orden ya definido**, pero permite agregar productos a la misma orden y resolver el cobro con combinación de medios.

---

## Contexto mock fijo

Usar como datos mock por defecto:

- **Médica:** Brenda Mansilla
- **Centro activo:** Consultorio Melendez

---

## Estructura general de la pantalla

Orden vertical de bloques:

1. **Topbar mínima**
2. **Bloque fijo de contexto y monto**
3. **Bloque fijo de medios de pago**
4. **Bloque adaptable al espacio útil con la lista de productos agregados**
5. **Bloque fijo inferior de acciones**, por encima de la bottom nav

### Regla general de layout
- La pantalla mantiene la **bottom nav visible**.
- Todos los bloques son fijos excepto el listado de productos.
- El listado de productos debe ocupar el alto remanente y tener el único **scroll interno**.
- La pantalla no debe tener scroll global.

---

## 1. Topbar mínima

### Elementos
- Botón de **volver** arriba a la izquierda.

### Comportamiento
- `Volver` regresa a la pantalla del turno.

---

## 2. Bloque fijo de contexto y monto

Debe quedar debajo del safe area y comunicar en un golpe de vista qué se está cobrando.

### Contenido
- nombre del paciente;
- chip de estado:
  - `Sesión cerrada`;
- monto total de la orden, centrado y muy destacado.

### Jerarquía visual
- El **monto** es el dato más importante del bloque.
- Debe mostrarse grande, centrado y fácil de distinguir rápidamente.
- El nombre del paciente acompaña como contexto principal.
- El chip `Sesión cerrada` funciona como feedback rápido del estado del flujo.

---

## 3. Bloque fijo de medios de pago

Debe quedar inmediatamente debajo del bloque de contexto.

### Título
- `Medios de pago`

### Objetivo
Permitir distribuir libremente el cobro entre distintos medios.

### Medios disponibles
- `Efectivo`
- `Transferencia`
- `Posnet`

### Reglas de selección
- Cada medio de pago puede elegirse **como máximo una vez**.
- No se puede repetir un medio dentro de varias líneas.
- Se permite usar uno, dos o los tres medios disponibles.

### Estructura de cada línea de pago
Cada línea debe incluir:

- selector de medio;
- campo de monto;
- botón para quitar esa línea.

### Comportamiento de los montos
- No hay validación dura sobre los montos ingresados.
- Los precios y montos deben **formatearse en tiempo real** para evitar errores de lectura y carga.

### Acción adicional
Debajo de las líneas debe existir el enlace o botón:
- `+ Agregar otro medio`

### Regla UX
El bloque de medios de pago es fijo y no debe perderse al hacer scroll en la lista de productos.

---

## 4. Bloque adaptable de productos agregados a la orden

Este es el único bloque adaptable al espacio útil restante.

### Comportamiento general
- Debe ocupar el alto remanente entre medios de pago y acciones.
- Debe tener **scroll interno**.
- Muestra únicamente los productos agregados a la orden.

### Encabezado del bloque
- título: `Productos`
- botón arriba a la derecha:
  - `Agregar producto`

### Comportamiento del botón `Agregar producto`
Debe abrir un popup o modal con:

- buscador simple;
- lista de productos disponibles.

### Cada ítem del popup debe mostrar
- nombre del producto;
- precio.

### Comportamiento al agregar un producto
Cuando un producto es agregado a la orden:

- aparece como ficha dentro del bloque de productos;
- se puede modificar la cantidad;
- se muestra el precio unitario;
- se muestra el precio total para esa línea.

### Estructura de cada ficha de producto agregado
Debe incluir:

- nombre del producto;
- precio unitario;
- cantidad actual;
- total de la línea;
- controles para aumentar o disminuir cantidad;
- botón `Quitar`.

### Ejemplo visual esperado
- `Crema post tratamiento`
- `$ 18.000 c/u`
- `1 x $ 18.000 = $ 18.000`

### Regla UX
No mostrar catálogo expandido dentro de la pantalla principal.  
La selección de productos debe resolverse siempre desde popup/modal.

---

## 5. Bloque fijo inferior de acciones

Debe quedar fijo por encima de la bottom nav.

### Objetivo
Concentrar el cierre del cobro.

### Composición
- botón principal de cobro;
- mensajes auxiliares debajo del botón según estado del pago;
- acción secundaria para volver al turno.

---

## 5.1. Botón principal de cobro

El botón principal cambia según la relación entre:

- total de la orden;
- suma de los montos cargados en los medios de pago.

### Caso A. El total cargado es menor al total de la orden
- el botón debe mostrarse en **naranja**;
- debe indicar la cantidad faltante para completar el cobro.

Ejemplo conceptual:
- `Faltan $ 23.000`

### Caso B. El total cargado es igual o mayor al total de la orden
- el botón debe mostrarse en **verde**;
- debe indicar:
  - `Confirmar cobro`

### Regla UX
El color del botón debe dar feedback inmediato del estado del cobro:
- naranja = incompleto;
- verde = listo para cerrar.

---

## 5.2. Vuelto

Si el monto total cargado supera el total de la orden **y hay efectivo entre los medios de pago**, debajo del botón principal debe mostrarse el vuelto a entregar.

### Ejemplo
- `Vuelto $ 2.000`

### Regla
El vuelto solo se muestra en este caso.  
No mostrar lógica de vuelto cuando no interviene efectivo.

---

## 5.3. Acción secundaria

Debajo del mensaje de vuelto, o debajo del botón si no hay vuelto, debe mostrarse:

- `Volver al turno`

Como acción secundaria discreta.

---

## 6. Confirmación final del cobro

Cuando el operador presiona `Confirmar cobro`, no se cierra directamente la orden.

### Debe abrirse un popup o modal de confirmación
Texto:
- `¿Querés emitir la factura por la orden?`

### Opciones
- `Sí`
- `No`

### Regla UX
La decisión de emitir factura se toma **después** de confirmar que el cobro ya está resuelto, no antes.

---

## 7. Comprobante de transferencia

La acción de adjuntar comprobante **no** forma parte de esta pantalla definitiva.

### Regla definida
- Si hay transferencia, el comprobante podrá adjuntarse **después de confirmar el cobro**.
- No debe entorpecer el flujo principal de cierre.

### Consecuencia operativa
Debe quedar un aviso o pendiente posterior en la pantalla de **Hoy** para recordarle al médico que falta adjuntar el comprobante de transferencia.

### Alcance de esta pantalla
En esta pantalla solo se resuelve:
- distribución de montos;
- agregado de productos;
- cierre del cobro;
- decisión de emitir o no factura.

No se implementa aquí la carga del comprobante.

---

## 8. Navegaciones requeridas

### Desde esta pantalla
- volver al turno;
- abrir popup para agregar productos;
- quitar productos de la orden;
- confirmar cobro;
- abrir popup final de decisión de factura.

### Luego de confirmar el cobro
Debe cerrarse el flujo y navegar a una pantalla estable del sistema, preferentemente:
- `Hoy`

---

## 9. Responsive y layout

### Criterios generales
- Mobile first.
- contemplar anchos:
  - 360 px
  - 390 px
  - 430 px

### Regla de altura reducida
Cuando la pantalla tenga menos de **700 px de alto**:
- reducir proporcionalmente tamaños de fuente;
- reducir paddings y gaps;
- compactar las líneas de medios de pago;
- compactar las fichas de productos;
- mantener tap targets correctos.

### Reglas fijas
- sin scroll horizontal;
- respetar safe area superior e inferior;
- el bloque de productos es el único con scroll interno;
- el bloque de acciones debe permanecer siempre visible;
- la bottom nav permanece visible en esta pantalla.

---

## 10. Contenido mock esperado

Los mocks deben representar situaciones realistas, por ejemplo:

- tratamiento ya finalizado con monto definido;
- cobro con un solo medio;
- cobro combinado entre transferencia y efectivo;
- cobro combinado entre tres medios;
- casos con uno o más productos agregados;
- caso con vuelto cuando interviene efectivo.

---

## 11. Resumen operativo de la pantalla

La pantalla definitiva de **Cobro** queda compuesta por:

- botón de volver arriba a la izquierda;
- bloque fijo con nombre del paciente, chip `Sesión cerrada` y monto protagonista;
- bloque fijo de medios de pago con selector de medio, monto y eliminación de línea;
- bloqueo de repetición de medios de pago;
- formateo en tiempo real de montos;
- bloque adaptable con lista de productos agregados;
- popup para buscar y agregar productos;
- modificación de cantidad y total por línea de producto;
- bloque fijo inferior con CTA de cobro;
- botón naranja cuando falta dinero;
- botón verde `Confirmar cobro` cuando ya se cubrió la orden;
- indicación de vuelto cuando corresponde y hay efectivo;
- popup final preguntando si se desea emitir la factura;
- comprobante de transferencia diferido para resolución posterior desde `Hoy`.
