# PatientHistoryPage — Documentación definitiva

## 1. Propósito de la pantalla

`PatientHistoryPage` es la pantalla secundaria del flujo clínico del médico para consultar el historial de atención de un paciente dentro del mock mobile-first.

Su función no es reemplazar una historia clínica tradicional ni mostrar una ficha pesada.  
Su objetivo es resolver de forma simple estas tareas:

- revisar rápidamente el recorrido asistencial del paciente;
- filtrar el historial por categoría, período o tratamiento;
- seleccionar una sesión puntual del historial;
- ver abajo un resumen claro de esa sesión;
- acceder, cuando corresponde, a contenido sensible generado por el mismo profesional.

Dentro del flujo general del prototipo, esta pantalla actúa como una **cronología clínica operativa**, coherente con la lógica del producto de priorizar contexto progresivo, baja carga mental y navegación por momento de trabajo. fileciteturn11file1 fileciteturn11file0 fileciteturn11file3

---

## 2. Estado de definición

Esta pantalla queda considerada **cerrada a nivel de maqueta UX/UI**.

Eso fija para el mock actual:

- la estructura general;
- la navegación de entrada y salida;
- el sistema de filtros;
- la lista de sesiones del historial;
- el bloque inferior de resumen;
- la visibilidad condicionada de acciones privadas.

Los detalles finos del contenido clínico podrán evolucionar recién en la versión productiva, pero la arquitectura general de la pantalla ya queda definida.

---

## 3. Rol y contexto de uso

### Rol principal
- médico independiente.

### Momento de uso
- consulta de antecedentes recientes del paciente;
- revisión rápida de sesiones previas;
- acceso contextual a nota privada y fotos propias.

### Lugar dentro del flujo
La pantalla se usa como salida secundaria desde:

- `TodayPage`, desde el bloque del próximo turno;
- `AgendaPage`, desde el bloque inferior del turno seleccionado.

Esto mantiene coherencia con el enfoque del producto: el historial no es un menú principal, sino una capa contextual a la que el médico accede cuando necesita ampliar el contexto del paciente sin perder continuidad operativa. fileciteturn11file1 fileciteturn11file3

---

## 4. Ruta y navegación

### Ruta principal
```txt
/paciente/:id/historial
```

### Entradas esperadas
- desde `TodayPage`, mediante el botón `Historial`;
- desde `AgendaPage`, mediante el botón `Historial`.

### Salida principal
- botón atrás superior izquierdo → vuelve a la pantalla desde la que fue llamada.

### Regla de retorno
El botón superior izquierdo debe resolver un retorno claro y estable hacia el origen inmediato de navegación.

Para la maqueta, alcanza con navegación simple hacia atrás.

---

## 5. Estructura general de la pantalla

La pantalla queda organizada en cuatro zonas verticales:

1. **Topbar mínima**
2. **Bloque fijo de filtros**
3. **Bloque central de listado de sesiones**
4. **Bloque fijo inferior de resumen y acciones**

### Regla general de scroll
- la pantalla completa no debe depender de scroll global;
- el bloque central del listado puede usar scroll interno;
- el bloque inferior debe quedar fijo por encima de la bottom nav;
- el contenido debe respetar `safe-area-inset-top` y `safe-area-inset-bottom`.

Esta decisión sigue la misma lógica estructural ya validada en `AgendaPage`, `PatientsPage` y `TurnWorkspacePage`: bloques fijos arriba y abajo, con el contenido central absorbiendo el espacio útil. fileciteturn11file3 fileciteturn11file11 fileciteturn11file13 fileciteturn11file12

---

## 6. Topbar superior

## 6.1. Contenido
La topbar debe ser mínima.

Sólo debe mostrar:
- botón de volver arriba a la izquierda.

## 6.2. Qué no debe mostrar
No debe mostrar:
- el texto `Historial`;
- el nombre del paciente en la franja superior.

## 6.3. Motivo
La zona superior convive con notch, Dynamic Island, status bar y safe area superior.  
Por eso no conviene cargar esa área con contexto textual principal.

El nombre del paciente debe mostrarse más abajo, dentro del bloque del listado, donde tiene mejor lectura y mejor aprovechamiento del espacio.

---

## 7. Bloque fijo de filtrado

## 7.1. Objetivo
Permitir segmentar rápidamente el historial sin quitar protagonismo al listado.

## 7.2. Contenido visible en pantalla
Debajo de la safe area superior debe existir un bloque fijo con:

- botón `Inyectables`;
- botón `Aparatología`;
- botón de filtros a la derecha, con ícono de filtrado.

## 7.3. Categorías principales
`Inyectables` y `Aparatología` representan las dos familias de tratamientos del historial.

### Reglas
- ambas opciones son accionables;
- pueden usarse combinadas;
- funcionan como filtro rápido del listado;
- deben tener un estado visual claro cuando están activas.

## 7.4. Botón de filtros
A la derecha de los dos botones de categoría debe existir el botón para abrir el popup de filtros avanzados.

### Objetivo
Concentrar filtros secundarios sin recargar la pantalla principal.

---

## 8. Popup de filtros

## 8.1. Objetivo
Permitir refinamiento adicional del historial sin ocupar espacio permanente en la pantalla principal.

## 8.2. Contenido esperado
El popup debe incluir:

### A. Filtro por período
Opciones:
- `Últimos 30 días`
- `Últimos 90 días`
- `Cualquier fecha`

### B. Filtro por tratamiento
Un input para ingresar el nombre del tratamiento y filtrar el historial por coincidencia textual.

### Placeholder sugerido
```txt
Buscar tratamiento
```

## 8.3. Comportamiento
Los filtros del popup deben aplicarse sobre la misma lista visible del historial.

## 8.4. Criterio UX
El popup debe sentirse liviano, claro y secundario.  
No debe comportarse como una pantalla nueva ni como una configuración compleja.

---

## 9. Bloque central del historial

## 9.1. Rol
Es el bloque principal de la pantalla.

Debe ocupar todo el alto disponible entre el bloque de filtros y el bloque fijo inferior.

## 9.2. Encabezado del bloque
En lugar del título genérico `Atenciones`, el encabezado del bloque debe mostrar:

- el **nombre del paciente**, centrado horizontalmente dentro del bloque.

Puede convivir con el contador de resultados, pero el centro visual del encabezado debe ser el nombre del paciente.

### Ejemplo
```txt
Laura Pérez
```

## 9.3. Contador
A la derecha del encabezado puede mantenerse un contador con la cantidad de sesiones visibles luego de aplicar filtros.

## 9.4. Scroll
La lista debe scrollear internamente cuando haya más elementos que espacio disponible.

La pantalla completa no debe desplazarse.

---

## 10. Estructura de cada ítem del historial

Cada ítem representa una sesión ya realizada del historial del paciente.

## 10.1. Información visible por fila
Cada fila debe mostrar únicamente:
- fecha de realización;
- nombre del tratamiento.

### Ejemplo
```txt
11 abr 2026
Peeling suave
```

## 10.2. Interacción
Al tocar una fila:
- no navega;
- no abre otra pantalla;
- selecciona esa sesión;
- actualiza el bloque inferior de resumen.

## 10.3. Estado seleccionado
La sesión seleccionada debe distinguirse de forma clara respecto de las demás.

Puede resolverse mediante combinación de:
- reborde más marcado;
- fondo levemente diferente;
- sombra sutil;
- acento visual coherente con el resto del sistema.

La selección visible es obligatoria porque esta pantalla depende completamente de entender qué ficha del historial está activa en cada momento. fileciteturn11file3

---

## 11. Bloque fijo inferior de resumen y acciones

## 11.1. Objetivo
Mostrar el contexto útil de la sesión seleccionada sin obligar al médico a entrar a otra pantalla.

Este bloque vive fijo por encima de la bottom nav.

## 11.2. Información base visible
El bloque debe mostrar siempre:

- una card con el nombre del profesional que realizó el tratamiento;
- una card con el nombre del centro donde se realizó;
- la nota pública de esa sesión.

## 11.3. Card de profesional
Debe mostrar el nombre del profesional que realizó la atención.

### Regla visual
La card del profesional debe destacarse con un tratamiento visual diferencial cuando la sesión **no** fue realizada por el médico actualmente logueado.

### Objetivo
Que el médico identifique rápido si está viendo una sesión propia o ajena.

## 11.4. Card de centro
A la derecha de la card del profesional debe existir una card con el nombre del centro donde se realizó la atención.

## 11.5. Nota pública
Debajo de las dos cards superiores debe mostrarse el bloque de `Nota pública`.

### Reglas
- mantener rótulo claro;
- mostrar el contenido si existe;
- si no existe, mostrar:

```txt
Sin nota pública
```

La nota pública forma parte del historial visible y no requiere interacción adicional para consultarse.

---

## 12. Acciones privadas del bloque inferior

## 12.1. Botones
Debajo de la nota pública deben existir dos botones:

- `Ver nota privada`
- `Ver fotos`

## 12.2. Regla de visibilidad
Estos dos botones **solo deben estar visibles cuando la sesión seleccionada fue realizada por el mismo profesional que está logueado en la app**.

## 12.3. Si la sesión pertenece a otro médico
Si la sesión seleccionada fue realizada por otro profesional:

- no mostrar `Ver nota privada`;
- no mostrar `Ver fotos`.

## 12.4. Motivo funcional
La plataforma ya fija como decisión de producto que el historial clínico sensible no debe exponerse indiscriminadamente según rol, alcance o autoría. En particular, la media sensible y las notas profundas deben respetar restricciones de visibilidad. fileciteturn11file0 fileciteturn11file1

## 12.5. Comportamiento de `Ver nota privada`
Para la maqueta, este botón debe abrir un modal simple con:
- título `Nota privada`;
- contenido de la nota;
- acción de cierre.

Si no existe nota privada, puede mostrar:
```txt
Sin nota privada
```

## 12.6. Comportamiento de `Ver fotos`
Para la maqueta, este botón debe abrir un modal o drawer simple con las fotos asociadas a la sesión.

Puede mostrar:
- fotos del antes;
- fotos del después;
- thumbnails o cards simples.

---

## 13. Comportamiento funcional esperado

## 13.1. Carga inicial
Al abrir la pantalla:
- se carga el historial del paciente indicado en la ruta;
- se aplican los filtros por default;
- si hay sesiones visibles, una debe quedar seleccionada por default.

## 13.2. Filtros rápidos
`Inyectables` y `Aparatología` deben impactar inmediatamente sobre la lista visible.

## 13.3. Filtros avanzados
El popup debe permitir afinar la lista por:
- período;
- nombre del tratamiento.

## 13.4. Selección estable
Si cambia el filtro y la sesión seleccionada deja de estar visible, el sistema debe seleccionar automáticamente la primera sesión visible del nuevo conjunto filtrado.

## 13.5. Estado vacío
Si no hay resultados para el filtro actual, debe mostrarse un empty state breve y claro en el bloque de lista, y el bloque inferior debe reflejar que no hay una ficha activa para resumir.

---

## 14. Responsive y layout

## 14.1. Principio general
La pantalla está diseñada como mobile-first.

Debe funcionar correctamente, como mínimo, en:
- 360 px
- 390 px
- 430 px

## 14.2. Jerarquía espacial
La prioridad de alto disponible debe distribuirse así:

1. bloque del listado;
2. bloque inferior de resumen;
3. bloque de filtros.

## 14.3. Regla de compactación
En alturas menores a 700 px, la pantalla debe compactar:
- paddings verticales;
- tipografías secundarias;
- espacios entre bloques;

pero sin perder:
- legibilidad;
- claridad de selección;
- tocabilidad de controles;
- visibilidad real del listado.

## 14.4. Regla crítica
En pantallas bajas debe seguir viéndose una porción útil de la lista.  
El bloque de filtros y el bloque inferior no pueden comerse visualmente el espacio central.

---

## 15. Integración con el flujo general

`PatientHistoryPage` se integra como pantalla contextual dentro del flujo ya definido del médico.

No reemplaza:
- `TodayPage`;
- `AgendaPage`;
- `TurnWorkspacePage`.

Las complementa.

### Relación con TodayPage
Desde `TodayPage`, el botón secundario del bloque del próximo turno debe decir `Historial` y abrir esta pantalla para el paciente de ese turno. fileciteturn11file8

### Relación con AgendaPage
Desde `AgendaPage`, el botón secundario del bloque inferior del turno seleccionado debe decir `Historial` y abrir esta pantalla para el paciente del turno activo. fileciteturn11file13

### Relación con el modelo funcional del producto
El historial debe comportarse como una cronología ordenada, útil y legible del recorrido del paciente, no como una tabla gris ni una carpeta opaca de archivos. fileciteturn11file1

---

## 16. Decisiones que quedan fijadas para esta versión definitiva

Se consideran fijadas para el mock:

- topbar mínima sin título textual `Historial`;
- nombre del paciente dentro del bloque del listado;
- filtros rápidos por `Inyectables` y `Aparatología`;
- popup con filtro por período y por nombre de tratamiento;
- lista simple de sesiones con fecha y tratamiento;
- estado seleccionado claramente visible;
- bloque inferior con profesional, centro y nota pública;
- botones `Ver nota privada` y `Ver fotos` sólo para el profesional autor de la sesión.

No es necesario reabrir estos puntos salvo que cambie el enfoque funcional del producto.

---

## 17. Aspectos que podrán cambiar recién en productivo

En una versión productiva podrían reevaluarse:
- más filtros avanzados;
- más contexto clínico en el resumen;
- políticas más finas de visibilidad por organización o scope;
- tratamiento más rico del historial compartido;
- una galería de fotos más completa;
- resumen clínico resumido para roles no médicos.

Pero esos cambios quedan fuera del alcance del mock actual. El producto ya contempla diferencias de permisos, vistas resumidas y restricciones de acceso al contenido clínico sensible como una necesidad estructural, aunque no todo ese refinamiento esté resuelto todavía en esta fase. fileciteturn11file0

---

## 18. Criterios de aceptación

La pantalla se considera correcta si cumple todo lo siguiente:

1. Existe como ruta real `/paciente/:id/historial`.
2. Se puede abrir desde `TodayPage`.
3. Se puede abrir desde `AgendaPage`.
4. Arriba sólo se ve el botón de volver.
5. No aparece el texto `Historial` en la parte superior.
6. El nombre del paciente aparece como encabezado centrado del bloque del listado.
7. El bloque superior de filtros muestra:
   - `Inyectables`;
   - `Aparatología`;
   - botón de filtros.
8. El popup de filtros permite filtrar por:
   - período;
   - nombre del tratamiento.
9. La lista central muestra por fila:
   - fecha;
   - tratamiento.
10. Al tocar una fila, se selecciona sin navegar.
11. El ítem seleccionado se distingue claramente.
12. El bloque inferior queda fijo por encima de la bottom nav.
13. El bloque inferior muestra:
   - profesional;
   - centro;
   - nota pública.
14. `Ver nota privada` y `Ver fotos` sólo aparecen para el profesional autor.
15. La pantalla mantiene buena legibilidad y balance en resoluciones mobile.

---

## 19. Síntesis conceptual

`PatientHistoryPage` no debe sentirse como una historia clínica pesada ni como una tabla de registros.

Debe sentirse como una **línea de tiempo clínica operativa**:

- los filtros ayudan;
- la lista organiza;
- la selección enfoca;
- el resumen amplía;
- las acciones privadas aparecen sólo cuando corresponde.

Ese es el comportamiento definitivo de esta pantalla dentro del mock.
