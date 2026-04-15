# AvailabilityPage — Documentación definitiva

## 1. Propósito de la pantalla

`AvailabilityPage` es la pantalla operativa donde el médico define y administra su disponibilidad de trabajo dentro del flujo mobile-first del producto.

Su función no es comportarse como una agenda visual ni como una configuración técnica pesada.  
Su objetivo es permitir, con la menor carga mental posible, estas tres operaciones:

- definir las **franjas habituales** de trabajo;
- registrar **bloqueos puntuales** sobre una fecha concreta;
- registrar **franjas extra** sobre una fecha concreta.

La pantalla debe sentirse como una herramienta de configuración operativa clara, directa y controlada, coherente con el principio general del producto de reducir fricción y evitar que el médico tenga que “navegar por software”.

---

## 2. Rol y contexto de uso

### Rol principal
- médico independiente.

### Momento de uso
- configuración secundaria del consultorio;
- mantenimiento de agenda y disponibilidad;
- definición de base semanal y excepciones puntuales.

### Lugar dentro del producto
Esta pantalla forma parte del conjunto de acciones administrativas accesibles desde `Más`.

No ocupa el corazón del flujo diario del médico, pero sí debe mantener el mismo estándar de claridad y consistencia visual que las pantallas operativas principales.

---

## 3. Ruta y navegación

### Ruta principal
```txt
/disponibilidad
```

### Entrada esperada
- desde la pantalla `Más`, mediante la opción `Disponibilidad`.

### Salida principal
- botón superior izquierdo → vuelve a `Hoy`.

### Regla de retorno
El botón de volver no debe depender de un historial de navegación incierto.

En la definición definitiva de la pantalla, el retorno superior izquierdo debe llevar a:

```txt
/
```

o a la ruta equivalente de `Hoy` dentro del router real.

El objetivo es evitar loops y mantener un retorno estable.

---

## 4. Objetivo UX

La pantalla debe resolver una configuración potencialmente compleja sin volverse ruidosa.

La lógica correcta es:

1. entender en qué centro se está trabajando;
2. elegir el tipo de disponibilidad que se quiere modificar;
3. definir fecha o día y horario;
4. agregar la franja;
5. revisar y, si hace falta, eliminar una franja ya existente.

La arquitectura visual debe priorizar:

- foco;
- baja carga mental;
- una sola tarea fuerte por vez;
- prevención de errores antes de guardar;
- consistencia con el resto del mock.

---

## 5. Estructura general de la pantalla

La pantalla queda organizada en **cinco zonas verticales** dentro del espacio comprendido entre la safe area superior y la bottom nav:

1. **Topbar mínima**
2. **Bloque fijo de centro actual**
3. **Bloque fijo de selector de modo**
4. **Bloque fijo de edición de fecha/día y horarios**
5. **Bloque adaptable de listado de franjas**

### Regla general de scroll
- la pantalla completa **no debe tener scroll global**;
- los bloques superiores deben permanecer fijos;
- el bloque que absorbe el espacio restante es el listado de franjas;
- el único scroll vertical permitido es el **scroll interno del listado de franjas**.

### Regla estructural crítica
Los controles para elegir día o fecha y hora **no deben desplazarse fuera de vista** al recorrer la lista.

Por lo tanto:
- el bloque de edición debe mantener posición y tamaño estables;
- el bloque de listado debe adaptarse al espacio útil restante.

---

## 6. Topbar superior

## 6.1. Contenido
La topbar debe ser mínima.

Sólo debe mostrar:
- botón de volver arriba a la izquierda.

## 6.2. Qué no debe mostrar
No debe mostrar:
- título textual `Disponibilidad`;
- nombre del centro en la franja superior;
- acciones secundarias adicionales.

## 6.3. Motivo
La zona superior debe mantenerse liviana, consistente con las demás pantallas mobile del mock y libre de ruido visual cerca de la safe area superior.

---

## 7. Bloque fijo de centro actual

## 7.1. Objetivo
Dar contexto inmediato sobre el centro sobre el que se está editando la disponibilidad.

## 7.2. Contenido
Este bloque debe mostrar:
- rótulo breve, por ejemplo `Centro actual`;
- nombre del centro activo.

### Ejemplo
```txt
Centro actual
Consultorio Martina López
```

## 7.3. Comportamiento en médico independiente
Para el médico independiente, el bloque es **informativo**.

No requiere selector ni acción adicional.

## 7.4. Evolución futura para organizaciones
Cuando se implemente el caso de organizaciones y médicos con múltiples centros asignados, este bloque podrá incorporar la acción para cambiar el centro activo.

Mientras eso no exista, debe comportarse sólo como feedback visual rápido.

---

## 8. Bloque fijo de selector de modo

## 8.1. Objetivo
Permitir alternar entre los tres tipos de disponibilidad sin convertir la pantalla en un formulario largo o en una configuración mezclada.

## 8.2. Opciones visibles
El bloque debe mostrar exactamente tres opciones:

- `Habitual`
- `Bloqueo`
- `Extra`

## 8.3. Comportamiento
Al presionar cualquiera de las tres opciones:
- cambia el modo activo;
- se actualizan el bloque de edición y el listado inferior;
- se mantienen la misma estructura general y la misma jerarquía espacial.

## 8.4. Estado por default
La pantalla debe abrir por default en:

```txt
Habitual
```

porque es la base operativa principal de toda la disponibilidad.

---

## 9. Significado funcional de cada modo

## 9.1. Habitual
Define las franjas semanales habituales del médico para el centro activo.

Es la base estructural de la disponibilidad.

## 9.2. Bloqueo
Define una excepción puntual sobre una fecha concreta para indicar una franja en la que el médico no estará disponible.

Debe sentirse como una acción restrictiva o prohibitiva.

## 9.3. Extra
Define una excepción puntual sobre una fecha concreta para indicar una franja adicional de trabajo fuera del horario habitual.

Debe sentirse como una acción aditiva.

---

## 10. Bloque fijo de edición de fecha/día y horarios

Este bloque es el bloque de trabajo principal de la pantalla.

Debe mantenerse siempre visible por encima del listado.

## 10.1. Estructura general
El bloque contiene:
- título contextual del editor;
- selector de día de semana o de fecha, según el modo;
- campo `Inicio`;
- campo `Fin`;
- botón `+` para agregar la franja.

## 10.2. Comportamiento del selector principal
### En modo `Habitual`
Debe permitir elegir el **día de semana** sobre el cual se cargarán las franjas semanales.

### En modo `Bloqueo`
Debe permitir elegir una **fecha exacta** desde calendario.

### En modo `Extra`
Debe permitir elegir una **fecha exacta** desde calendario.

## 10.3. Campos horarios
Los campos horarios deben ser claros, táctiles y equivalentes entre sí.

Rótulos esperados:
- `Inicio`
- `Fin`

Deben representar:
- hora de inicio de la franja;
- hora de fin de la franja.

## 10.4. Botón `+`
A la derecha de los controles horarios debe existir el botón de agregar.

### Función
Registrar la nueva franja en el modo activo.

### Estado
El botón sólo debe habilitarse cuando la combinación elegida es válida según las reglas del modo activo.

## 10.5. Criterio UX
La validación debe ocurrir antes de agregar, de forma preventiva.

La pantalla no debe incentivar que el médico pruebe horarios inválidos y reciba errores tardíos.

---

## 11. Reglas funcionales del modo `Habitual`

## 11.1. Objetivo
Permitir definir las franjas semanales convencionales de trabajo del médico en el centro activo.

## 11.2. Datos a elegir
En este modo, el médico debe poder definir:
- día de semana;
- hora de inicio;
- hora de fin.

## 11.3. Cantidad de franjas
Puede definir tantas franjas como necesite para un mismo día.

## 11.4. Restricción de solapamiento
Las franjas habituales de un mismo día no pueden solaparse entre sí.

La UI no debe permitir agregar una franja inválida.

## 11.5. Relación con el backend futuro
En el caso de organizaciones o médicos con múltiples centros asignados, la validación definitiva deberá contemplar también cruces con disponibilidad existente en otros centros del mismo profesional.

El frontend no debe intentar reconstruir esa lógica compleja por sí solo.

## 11.6. Jerarquía UX
Este modo debe recibir el mayor peso conceptual dentro de la pantalla porque constituye la base operativa sobre la que luego se aplican bloqueos y extras.

---

## 12. Reglas funcionales del modo `Bloqueo`

## 12.1. Objetivo
Permitir registrar un bloqueo puntual sobre una fecha concreta y una franja concreta.

## 12.2. Datos a elegir
En este modo, el médico debe poder definir:
- fecha puntual;
- hora de inicio;
- hora de fin.

## 12.3. Restricción principal
Una franja de bloqueo sólo puede aplicarse sobre una franja donde exista disponibilidad real previa.

Dicho de otro modo:
- no se puede bloquear una franja que ya sea indisponible;
- no se puede crear un bloqueo fuera del horario disponible de esa fecha.

## 12.4. Intención UX
El modo debe transmitir con claridad que el médico está cerrando disponibilidad, no agregándola.

## 12.5. Tratamiento visual
Cuando el modo activo sea `Bloqueo`:
- el bloque de edición debe tomar un tono rojo;
- el bloque de listado debe tomar un tono rojo;
- el cambio debe comunicar rápidamente una acción prohibitiva o restrictiva.

---

## 13. Reglas funcionales del modo `Extra`

## 13.1. Objetivo
Permitir registrar una franja adicional de trabajo sobre una fecha concreta.

## 13.2. Datos a elegir
En este modo, el médico debe poder definir:
- fecha puntual;
- hora de inicio;
- hora de fin.

## 13.3. Restricción principal
La franja extra no debe coincidir ni solaparse con una franja ya disponible para esa fecha.

Dicho de otro modo:
- no debe repetir disponibilidad habitual existente;
- no debe pisar una franja extra ya cargada;
- debe representar una extensión real, no un duplicado.

## 13.4. Intención UX
El modo debe sentirse como una extensión puntual de trabajo.

## 13.5. Tratamiento visual
Cuando el modo activo sea `Extra`:
- el bloque de edición debe tomar un tono verde;
- el bloque de listado debe tomar un tono verde;
- el cambio debe comunicar rápidamente una acción aditiva.

---

## 14. Bloque adaptable de listado de franjas

## 14.1. Objetivo
Mostrar las franjas ya registradas para el modo activo y el día o fecha seleccionados.

## 14.2. Ubicación
Debe vivir por debajo del bloque de edición y ocupar todo el espacio restante por encima de la bottom nav.

## 14.3. Scroll
Este bloque puede y debe usar scroll interno cuando el contenido exceda el espacio disponible.

La pantalla completa no debe desplazarse.

## 14.4. Estructura de cada fila
Cada ítem de lista debe mostrar:
- franja horaria visible en formato simple;
- botón `-` a la derecha para eliminar esa franja.

### Ejemplo
```txt
09:00 - 13:00        [-]
```

## 14.5. Botón `-`
Debe ser claramente visible y utilizar tratamiento rojo.

### Función
Eliminar la franja seleccionada.

## 14.6. Jerarquía visual
La lista debe ser clara y compacta.

No debe convertir cada franja en una tarjeta excesivamente grande ni competir con los controles de edición.

---

## 15. Comportamiento visual por modo

## 15.1. Modo `Habitual`
- tratamiento visual neutro o primario del sistema;
- sensación de configuración base.

## 15.2. Modo `Bloqueo`
- editor y listado en tono rojo;
- sensación visual de restricción.

## 15.3. Modo `Extra`
- editor y listado en tono verde;
- sensación visual de ampliación o agregado.

## 15.4. Regla de consistencia
El cambio cromático debe afectar a los dos bloques operativos principales:
- bloque de edición;
- bloque de listado.

El objetivo es que el operador entienda el tipo de acción actual con una sola mirada.

---

## 16. Reglas de validación funcional

## 16.1. Reglas generales
En cualquier modo:
- `Fin` debe ser posterior a `Inicio`;
- no se deben permitir franjas vacías;
- la UI debe reflejar claramente cuándo el botón `+` está habilitado o no.

## 16.2. En `Habitual`
No debe permitirse:
- superponer franjas del mismo día;
- duplicar una franja ya existente.

## 16.3. En `Bloqueo`
No debe permitirse:
- bloquear una franja sin disponibilidad real;
- bloquear fuera de la disponibilidad existente;
- crear un bloqueo inválido para la fecha elegida.

## 16.4. En `Extra`
No debe permitirse:
- agregar una franja que ya exista como disponibilidad habitual;
- agregar una franja que se solape con una extra ya existente;
- duplicar disponibilidad.

## 16.5. Relación Front / Backend
El frontend puede asistir con validaciones visibles y preventivas, pero no debe inventar lógica que contradiga las reglas reales de disponibilidad del backend.

Cuando existan validaciones multi-centro o dependencias estructurales más complejas, la fuente final de verdad seguirá siendo el backend.

---

## 17. Reglas de datos y alcance

## 17.1. Centro activo
La pantalla siempre trabaja sobre un centro activo visible.

## 17.2. Médico independiente
En el caso del médico independiente, el centro activo es único y el bloque superior funciona sólo como contexto.

## 17.3. Futuro multi-centro
En organizaciones, el centro activo podrá cambiar y la disponibilidad deberá respetar el alcance real del médico dentro de cada centro.

## 17.4. Regla de producto
La interfaz debe mostrar el contexto actual sin obligar al usuario a pensar en permisos técnicos ni en estructuras internas del sistema.

---

## 18. Responsive y layout

## 18.1. Principio general
La pantalla está diseñada como mobile-first.

Debe funcionar correctamente, como mínimo, en:
- 360 px
- 390 px
- 430 px

## 18.2. Jerarquía espacial
La prioridad del alto disponible debe distribuirse así:

1. bloque adaptable de listado;
2. bloque fijo de edición;
3. selector de modo;
4. bloque de centro;
5. topbar.

## 18.3. Regla de compactación
En alturas menores a 700 px, la pantalla debe compactar:
- paddings verticales;
- alturas de controles secundarios;
- tamaño de tipografías secundarias;
- tamaño del texto de botones, si hace falta.

Pero no debe perder:
- claridad de lectura;
- tocabilidad;
- visibilidad constante de los controles de edición.

## 18.4. Regla crítica
En pantallas bajas debe seguir viéndose con claridad:
- el centro activo;
- el modo seleccionado;
- el bloque de edición completo;
- una porción útil del listado.

---

## 19. Integración con el flujo general

`AvailabilityPage` forma parte del espacio administrativo accesible desde `Más`.

No reemplaza la lógica principal de:
- `Hoy`;
- `Agenda`;
- `Pacientes`;
- `Turno`;
- `Cobro`.

La complementa como una pantalla de mantenimiento operativo.

### Relación con `Más`
Desde `Más`, la opción `Disponibilidad` debe abrir esta pantalla.

### Relación con la agenda futura
La disponibilidad cargada aquí es uno de los insumos estructurales que condicionan la agenda real del profesional.

---

## 20. Contrato funcional esperado de datos

### Datos mínimos del contexto superior
- `centerId`
- `centerName`

### Datos mínimos del modo activo
- `mode`: `habitual | bloqueo | extra`

### Datos mínimos del editor
Según el modo:
- día de semana seleccionado o fecha seleccionada;
- hora de inicio;
- hora de fin;
- indicador de validez para habilitar el botón `+`.

### Datos mínimos del listado
Por cada franja:
- `id`
- día o fecha asociada;
- `startTime`
- `endTime`
- tipo de franja.

---

## 21. Criterio de producto que esta pantalla debe respetar

Esta pantalla no debe sentirse como una tabla técnica ni como una configuración administrativa pesada.

Debe responder a una lógica simple:
- elegir qué tipo de disponibilidad quiero editar;
- definir la franja;
- agregarla;
- ver qué ya está cargado;
- corregir rápido si hace falta.

El objetivo no es mostrar “muchas configuraciones”, sino permitir que el médico entienda y modifique su disponibilidad sin esfuerzo innecesario.

---

## 22. Estado de esta especificación

Esta documentación deja a `AvailabilityPage` como **pantalla definitiva del mock a nivel UX/UI estructural**.

A futuro podrán ajustarse:
- integración con calendario real;
- contratos exactos de backend;
- reglas multi-centro completas;
- microcopy de validaciones;
- estilos visuales finos.

Pero la arquitectura base de la pantalla queda fijada en estos términos.
