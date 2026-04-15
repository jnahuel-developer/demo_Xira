# PatientsPage — Documentación definitiva

## 1. Propósito de la pantalla

`PatientsPage` es la pantalla operativa para búsqueda, selección y acción rápida sobre pacientes dentro del flujo mobile del médico independiente.

Su objetivo no es reemplazar la ficha clínica ni funcionar como un CRM cargado.  
Su función es resolver, con la menor fricción posible, estas cuatro tareas:

- encontrar un paciente;
- filtrar la lista rápidamente;
- confirmar que se seleccionó el paciente correcto;
- disparar la siguiente acción operativa.

Dentro del mock, esta pantalla queda como versión definitiva de diseño y navegación.  
Los datos internos del bloque de resumen podrán evolucionar recién en la versión productiva.

---

## 2. Rol y contexto de uso

Esta pantalla forma parte de la navegación principal accesible desde la bottom nav del flujo mobile-first del médico.  
Se utiliza para trabajar sobre la base de pacientes ya cargados, revisar rápidamente contexto operativo y avanzar hacia acciones concretas como editar datos o agendar un nuevo turno.

Su lógica está alineada con los principios generales del proyecto:

- mobile first;
- contexto progresivo;
- baja carga mental;
- una prioridad fuerte por pantalla;
- navegación por momento operativo, no por estructura técnica.

---

## 3. Ruta y navegación

## 3.1. Ruta principal
```txt
/pacientes
```

## 3.2. Integración esperada en router
La pantalla debe existir como ruta real dentro del mock y estar conectada desde la bottom nav.

## 3.3. Navegaciones salientes
Desde `PatientsPage` deben existir estas salidas:

- `+` → `/nuevo-paciente`
- `Editar` → `/paciente/:id/editar`
- `Agendar turno` → `/nuevo-turno`

En el mock actual, estas rutas pueden apoyarse en `ContractStubPage` cuando la pantalla definitiva todavía no exista.

---

## 4. Objetivo UX

La pantalla debe sentirse como una vista de trabajo simple, clara y contenida.

No debe mostrar demasiada profundidad clínica ni una estructura de escritorio comprimida en mobile.  
La prioridad visual debe recaer sobre el bloque central de pacientes, mientras que la búsqueda y el resumen inferior deben comportarse como soporte contextual.

La lógica de interacción correcta es:

1. filtrar;
2. ver pacientes;
3. seleccionar;
4. actuar.

---

## 5. Estructura general de la pantalla

La pantalla queda organizada en cuatro zonas:

1. **Topbar mínima**
2. **Bloque fijo de búsqueda y filtros**
3. **Bloque central de lista de pacientes**
4. **Bloque fijo inferior de resumen y acciones**

### Regla general de layout
- no debe depender de scroll global para usarse;
- el contenido central debe absorber el espacio disponible;
- la lista de pacientes debe poder scrollear internamente;
- el bloque inferior debe quedar fijo por encima de la bottom nav;
- el contenido debe respetar `safe-area-inset-top` y `safe-area-inset-bottom`.

---

## 6. Topbar

## 6.1. Contenido
La topbar no debe incluir título textual.

No se debe mostrar `Pacientes` arriba.

Sólo debe mostrarse:

- botón `+` arriba a la derecha.

## 6.2. Función del botón `+`
Abre el flujo para alta de un nuevo paciente.

### Ruta esperada
```txt
/nuevo-paciente
```

## 6.3. Criterio visual
El botón debe mantener consistencia con el sistema visual ya usado en `AgendaPage`:

- forma circular;
- alto táctil correcto;
- estilo suave, claro y premium;
- alineado dentro de la zona superior segura.

---

## 7. Bloque fijo de búsqueda y filtros

## 7.1. Objetivo
Permitir búsqueda rápida directa y acceso secundario a filtros sin ocupar demasiado alto vertical.

## 7.2. Composición
Este bloque contiene únicamente:

- un input de búsqueda;
- un botón de filtros a la derecha.

No deben mostrarse chips permanentes ni selector de orden visible en la pantalla principal.

---

## 7.3. Input de búsqueda

### Función
Permite filtrar la lista por:

- nombre;
- apellido;
- teléfono.

### Placeholder
```txt
Buscar por nombre o teléfono
```

### Comportamiento
El filtrado debe aplicarse sobre la lista visible de pacientes usando coincidencia textual flexible.

### Criterio visual
- control principal del bloque;
- ocupa el mayor ancho disponible;
- estilo liviano y consistente con el resto del sistema;
- cómodo para uso táctil.

---

## 7.4. Botón de filtros

### Ubicación
A la derecha del input, en la misma fila.

### Función
Abre un popup/modal con filtros y ordenamiento.

### Criterio visual
- mismo alto que el input;
- alineación vertical exacta con el campo de búsqueda;
- ícono clásico de filtrado;
- apariencia coherente con el sistema de botones circulares suaves del mock.

---

## 8. Popup de filtros

## 8.1. Objetivo
Sacar de la pantalla principal toda la lógica secundaria de filtros y ordenamiento para preservar alto útil en mobile.

## 8.2. Contenido del popup

### A. Filtros de pacientes
- `Con turno agendado`
- `Todos`
- `Sin turno agendado`

### B. Ordenamiento
- `Próximo turno`
- `Apellido`
- `Última actividad`

### C. Acción auxiliar
- `Limpiar filtros`

### D. Acción de confirmación
- `Aplicar`

## 8.3. Estado default
La pantalla debe abrir por default con:

- filtro: `Con turno agendado`
- orden: `Próximo turno`

Ese default no necesita quedar visible como chip permanente en la pantalla principal.

## 8.4. Criterio UX
El popup debe sentirse corto, claro y secundario.  
No debe comportarse como pantalla aparte ni como panel complejo de configuración.

---

## 9. Bloque central de lista de pacientes

## 9.1. Rol de este bloque
Es el bloque principal de la pantalla.  
Debe ocupar el mayor alto disponible entre el bloque superior y el bloque inferior.

## 9.2. Scroll
Este bloque puede y debe scrollear internamente cuando haya más pacientes que espacio disponible.

La pantalla completa no debe depender de scroll global para operar.

## 9.3. Encabezado del bloque
El bloque muestra:

- título `Pacientes`
- contador con cantidad de pacientes visibles luego del filtro

## 9.4. Estado vacío
Si no hay resultados, debe mostrarse un empty state breve y claro.

Ejemplo esperado:
- `No se encontraron pacientes`
- `Probá con otro filtro o buscá por otro dato.`

---

## 10. Estructura de cada fila de paciente

Cada ítem de lista representa un paciente.

## 10.1. Composición visual
- foto a la izquierda;
- si no hay foto, mostrar iniciales;
- nombre y apellido en línea superior;
- teléfono en línea inferior.

## 10.2. Jerarquía del contenido
La fila debe ser simple y liviana.  
No debe cargar más datos que los necesarios para identificar rápidamente al paciente.

No deben mostrarse en la fila:
- próximo turno;
- último tratamiento;
- observaciones;
- alertas clínicas complejas;
- acciones inline.

## 10.3. Interacción
Al tocar una fila:

- no navega;
- no abre otra pantalla;
- selecciona al paciente;
- actualiza el bloque de resumen inferior.

## 10.4. Estado seleccionado
La fila seleccionada debe diferenciarse visualmente con un estado claro pero suave, consistente con el lenguaje visual del mock.

---

## 11. Bloque inferior fijo de resumen y acciones

## 11.1. Objetivo
Permitir actuar sobre el paciente seleccionado sin repetir información innecesaria ya visible en la lista.

## 11.2. Regla general
Este bloque vive fijo por encima de la bottom nav.

No debe repetir:
- foto;
- nombre completo.

Esos datos ya fueron vistos al seleccionar el paciente en la lista.

## 11.3. Estructura
El bloque se organiza en:

### Fila superior
Dos cards lado a lado:
- último tratamiento / último turno;
- próximo turno.

### Fila inferior
Dos botones:
- `Editar`
- `Agendar turno`

---

## 12. Card izquierda — último tratamiento

## 12.1. Contenido
No lleva título.

Debe mostrar únicamente:
- fecha arriba;
- nombre del tratamiento abajo.

### Ejemplo
```txt
18 mar 2026
Limpieza profunda
```

## 12.2. Estado sin datos
Si no existe historial previo, debe mostrar:

```txt
Sin turno previo
```

## 12.3. Intención UX
Brindar referencia rápida de actividad pasada sin sobrecargar la pantalla.

---

## 13. Card derecha — próximo turno

## 13.1. Contenido
No lleva título.

Debe mostrar únicamente:
- fecha arriba;
- nombre del tratamiento abajo.

### Ejemplo
```txt
Hoy · 10:30
Mesoterapia facial
```

## 13.2. Estado sin datos
Si no existe próximo turno, debe mostrar:

```txt
Sin turno próximo
```

## 13.3. Tratamiento visual
Esta card debe estar resaltada con un tono verde suave.

La intención es que el próximo turno se identifique rápido como el dato operativo más relevante del bloque inferior.

---

## 14. Botones de acción del bloque inferior

## 14.1. Botón `Editar`
Debe navegar a la pantalla de edición de datos del paciente seleccionado.

### Ruta esperada
```txt
/paciente/:id/editar
```

## 14.2. Botón `Agendar turno`
Debe navegar al flujo de alta de nuevo turno, llevando el contexto del paciente seleccionado.

### Ruta esperada
```txt
/nuevo-turno
```

### Comportamiento esperado
Puede pasar el `patientId` por state o por el mecanismo que el mock ya utilice, para que la futura pantalla de nuevo turno abra vinculada al paciente elegido.

---

## 15. Comportamiento funcional esperado

## 15.1. Carga inicial
Al abrir la pantalla:

- se aplica el filtro default `Con turno agendado`;
- se aplica el orden `Próximo turno`;
- se muestra la lista filtrada;
- si hay pacientes visibles, debe quedar seleccionado uno por default.

## 15.2. Selección
La selección del paciente debe mantenerse estable dentro del conjunto visible.

Si cambia el filtro o la búsqueda y el paciente seleccionado deja de estar visible, la pantalla debe seleccionar automáticamente el primer paciente visible.

## 15.3. Búsqueda
La búsqueda debe combinar nombre y teléfono como fuente de coincidencia.

## 15.4. Filtros
Los filtros del popup deben modificar la lista visible sin romper la estructura de la pantalla.

## 15.5. Ordenamiento
El orden debe aplicarse sobre la lista ya filtrada.

---

## 16. Responsive y layout

## 16.1. Principio general
La pantalla está diseñada como mobile-first.

Debe funcionar correctamente, como mínimo, en:
- 360 px
- 390 px
- 430 px

## 16.2. Jerarquía espacial
La prioridad de alto disponible debe distribuirse así:

1. lista de pacientes;
2. bloque inferior de resumen;
3. bloque superior de búsqueda.

## 16.3. Regla de compactación
En alturas menores a 700 px, la pantalla debe compactar:

- paddings verticales del bloque superior;
- paddings verticales del bloque inferior;
- tipografías secundarias si hace falta;

pero sin perder:
- legibilidad;
- tocabilidad;
- visibilidad real del listado.

## 16.4. Regla crítica
En pantallas bajas debe seguir viéndose claramente una porción útil del listado.  
La lista no puede desaparecer visualmente por culpa del alto del filtro o del resumen inferior.

---

## 17. Datos mock y estado actual del mock

La implementación actual de `PatientsPage` ya utiliza:

- ruta real `/pacientes`;
- datos desde `patients.mock.ts`;
- selección interna de pacientes;
- popup de filtros;
- navegación a `nuevo-paciente`, `nuevo-turno` y `paciente/:id/editar`. fileciteturn9file6 fileciteturn9file12 fileciteturn9file17

La ruta ya está integrada dentro del router principal del mock junto con `TodayPage`, `AgendaPage`, `TurnWorkspacePage` y `ChargePage`. fileciteturn9file17

---

## 18. Decisiones que quedan fijadas para esta versión definitiva

Se consideran fijadas para el mock:

- ausencia de título superior;
- botón `+` como única acción topbar;
- filtro principal por búsqueda directa;
- filtros secundarios en popup;
- lista simple con foto/iniciales, nombre y teléfono;
- selección sin navegación directa;
- resumen inferior compacto;
- card verde para próximo turno;
- acciones `Editar` y `Agendar turno`.

No es necesario rediscutir estos puntos salvo que cambie el enfoque funcional del producto.

---

## 19. Aspectos que podrán cambiar recién en productivo

Para la maqueta actual, el bloque de resumen queda suficiente con:

- último tratamiento;
- próximo turno.

Más adelante, en versión productiva, podrían reevaluarse:
- datos adicionales del resumen;
- presencia de alertas;
- más contexto operativo;
- vínculo con ficha clínica completa;
- mayor integración con agenda o continuidad terapéutica.

Por ahora, estos cambios quedan fuera de alcance.

---

## 20. Criterios de aceptación de la pantalla definitiva

La pantalla se considera correcta si cumple todo lo siguiente:

1. Existe como ruta real `/pacientes`.
2. Se accede desde la bottom nav.
3. No muestra título textual arriba.
4. Arriba sólo se ve el botón `+`.
5. El bloque superior contiene:
   - input de búsqueda;
   - botón de filtros.
6. Los filtros y el orden viven dentro de un popup.
7. La lista de pacientes ocupa el espacio central principal.
8. Cada fila muestra:
   - foto o iniciales;
   - nombre;
   - teléfono.
9. Al tocar una fila, se selecciona el paciente sin navegar.
10. El bloque inferior queda fijo por encima de la bottom nav.
11. El bloque inferior muestra:
    - último tratamiento;
    - próximo turno;
    - `Editar`;
    - `Agendar turno`.
12. Si faltan datos, se muestra:
    - `Sin turno previo`
    - `Sin turno próximo`
13. La pantalla mantiene buena legibilidad y balance en resoluciones mobile.

---

## 21. Síntesis conceptual

`PatientsPage` no debe sentirse como un panel pesado de gestión.  
Debe sentirse como una pantalla de selección operativa clara, donde el médico puede encontrar rápido a la persona correcta y avanzar a la próxima acción sin fricción.

La lista domina.  
Los filtros ayudan.  
El resumen confirma.  
Las acciones cierran el flujo.

Ese es el comportamiento definitivo de esta pantalla dentro del mock.
