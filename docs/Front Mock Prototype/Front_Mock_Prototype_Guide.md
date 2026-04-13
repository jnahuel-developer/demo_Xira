# Front Mock Prototype Guide — Plataforma integral para salud estética

## 1. Propósito del documento

Este documento define cómo debe construirse, organizarse y mantenerse el **Front mockeado navegable** del proyecto, con el objetivo de:

- validar navegación y experiencia de uso antes de integrar con el backend real;
- probar jerarquía visual, densidad de información y flujo operativo por rol;
- detectar problemas de UX, layout y arquitectura de pantallas lo más temprano posible;
- permitir que distintos agentes de desarrollo agreguen, modifiquen o reemplacen pantallas sin romper el prototipo general;
- servir como base intermedia entre la documentación funcional del producto y la implementación real del frontend integrado.

Este documento **no describe el backend** ni cómo deben implementarse los endpoints reales.  
Tampoco define el branding final del producto.  
Su foco es exclusivamente el **prototipo funcional del frontend**, usando datos mockeados y navegación real.

---

## 2. Filosofía del prototipo

El prototipo no es una maqueta estática.  
Tampoco es una demo visual cerrada.  
Debe ser tratado como una **aplicación navegable de validación UX**, con estas características:

- puede ejecutarse localmente;
- tiene rutas reales;
- tiene navegación funcional;
- usa datos mockeados;
- permite probar distintos estados de cada pantalla;
- permite reemplazar una pantalla sin reestructurar el resto del proyecto.

### 2.1. Qué se busca validar

El prototipo debe servir para validar, al menos, estas dimensiones:

#### A. Navegación
- si el usuario entiende cómo moverse;
- si las transiciones entre pantallas son lógicas;
- si el retorno a estados estables está bien resuelto.

#### B. Jerarquía visual
- si lo importante realmente domina;
- si los bloques compiten entre sí o no;
- si la pantalla se entiende rápido.

#### C. Densidad
- si hay demasiado contenido para mobile;
- si hay pantallas sobrecargadas;
- si se puede simplificar la experiencia.

#### D. Operación
- si el flujo principal del rol se resuelve con pocos toques;
- si el sistema acompaña o interrumpe;
- si la sensación general es de ayuda real y no de carga administrativa.

#### E. Responsive
- si la pantalla funciona bien en distintos anchos mobile;
- si el layout se rompe;
- si los botones siguen siendo tocables y legibles.

---

## 3. Qué es y qué no es este prototipo

## 3.1. Qué sí es

El prototipo es:

- un frontend navegable;
- una representación funcional del sistema;
- una herramienta de prueba y discusión;
- una base para definir el frontend real futuro;
- un entorno donde se pueden cambiar pantallas rápido.

## 3.2. Qué no es

El prototipo no es:

- el frontend productivo final;
- una capa conectada al backend real;
- una implementación cerrada;
- una versión definitiva del diseño visual;
- una maqueta estática de Figma exportada.

---

## 4. Principios rectores del prototipo

### 4.1. Mobile first

Todo debe diseñarse y pensarse primero para mobile, especialmente para:

- médico independiente;
- médico dentro de organización;
- paciente.

Desktop existirá después como adaptación, salvo roles que naturalmente trabajen más en escritorio.

### 4.2. Navegación real, lógica fake

La navegación debe ser real.  
Los datos pueden ser fake.  
Esto significa que:

- las rutas deben existir;
- los botones deben llevar a otras pantallas reales;
- los cambios de estado pueden estar mockeados localmente;
- la lógica de negocio dura no se implementa todavía.

### 4.3. Probar primero, integrar después

Ninguna pantalla debería conectarse al backend real antes de validar:

- claridad de navegación;
- orden de prioridad;
- densidad correcta;
- flujo de uso;
- comportamiento responsive.

### 4.4. El prototipo no debe inventar reglas del backend

El prototipo puede simular datos y estados, pero no debe fijar comportamientos de negocio que contradigan la documentación funcional.

Ejemplos:

- un turno no debe simular múltiples tratamientos si el sistema actual no lo soporta;
- un horario no debe verse como agendable si conceptualmente el backend no permitiría ese tipo de override;
- no deben existir sesiones sin turno previo, porque el sistema no las contempla.

---

## 5. Alcance del prototipo

El prototipo debe cubrir, por etapas, los principales frentes de experiencia del sistema.

## 5.1. Primera prioridad
- médico independiente

## 5.2. Segunda prioridad
- staff administrativo / secretaria

## 5.3. Tercera prioridad
- dueño de organización / administrador de centro

## 5.4. Cuarta prioridad
- paciente

## 5.5. Fuera de foco por ahora
- técnico
- auditor

Estos últimos pueden tener prototipos básicos si hace falta, pero no son prioridad de diseño profundo en esta etapa.

---

## 6. Stack sugerido para el prototipo

## 6.1. Recomendación principal

Se recomienda trabajar con:

- **React**
- **TypeScript**
- **Vite**
- **React Router**
- CSS simple, CSS Modules o Tailwind, según comodidad del agente

### Motivos
- velocidad de arranque;
- componentes reutilizables;
- navegación fácil;
- buen flujo para agentes;
- fácil reemplazo de pantallas.

## 6.2. Qué evitar en esta etapa

No conviene incorporar todavía:

- backend real;
- autenticación real;
- Redux complejo;
- Zustand si no es realmente necesario;
- formularios con validación productiva completa;
- servicios HTTP reales;
- analytics;
- PWA final;
- persistencia fuerte.

El prototipo debe mantenerse liviano.

---

## 7. Estructura sugerida de carpetas

La estructura mínima recomendada es:

```txt
src/
  app/
    router.tsx
  components/
    BottomNav.tsx
    AppHeader.tsx
    SectionCard.tsx
    StatusChip.tsx
    EmptyState.tsx
  pages/
    TodayPage.tsx
    AgendaPage.tsx
    TurnWorkspacePage.tsx
    ChargePage.tsx
  mocks/
    today.mock.ts
    agenda.mock.ts
    turn.mock.ts
    charge.mock.ts
  styles/
    globals.css
  App.tsx
  main.tsx
```

### 7.1. Regla importante
Las pantallas viven en `pages/`.  
Los datos mockeados viven en `mocks/`.  
Los estilos globales viven en `styles/`.  
Los componentes reutilizables viven en `components/`.

No mezclar mock de pantalla dentro del router, salvo en casos mínimos y temporales.

---

## 8. Convenciones de nombres

## 8.1. Pantallas
Usar nombres explícitos:

- `TodayPage`
- `AgendaPage`
- `TurnWorkspacePage`
- `ChargePage`

Evitar nombres ambiguos como:
- `Home`
- `Main`
- `View1`
- `Dashboard2`

## 8.2. Mocks
Cada pantalla o grupo funcional debe tener un mock propio:

- `today.mock.ts`
- `agenda.mock.ts`
- `turn.mock.ts`
- `charge.mock.ts`

Si una pantalla crece mucho, se puede separar:
- `turn.header.mock.ts`
- `turn.state.mock.ts`
- `turn.media.mock.ts`

pero solo si la complejidad lo justifica.

## 8.3. Componentes
Nombrar por función, no por apariencia:
- `BottomNav`
- `StatusChip`
- `EmptyState`
- `ActionCard`

Evitar:
- `BlueBox`
- `RoundedSection`
- `Card3`

---

## 9. Sistema de rutas

## 9.1. Objetivo
Las rutas deben permitir recorrer el flujo de forma real, aunque los datos sean mockeados.

## 9.2. Principios
- cada pantalla importante tiene ruta propia;
- las rutas deben ser simples y legibles;
- el prototipo debe poder abrir una pantalla específica directamente.

## 9.3. Ejemplo base

```txt
/
 /agenda
 /turno/:id
 /cobro/:id
```

A futuro:
```txt
/pacientes
/paciente/:id
/nuevo-turno
/nuevo-paciente
/disponibilidad
```

## 9.4. Estados alternativos
Para pruebas, se permite modelar estados alternativos por:

- query string,
- id mock,
- o archivos mock diferenciados.

Ejemplos:
- `/turno/a1`
- `/turno/a2`
- `/turno/a3`

donde cada id representa un estado distinto del flujo:
- consentimiento pendiente,
- listo para iniciar,
- sesión en curso,
- sesión cerrada pendiente de cobro.

---

## 10. Sistema de mocks

## 10.1. Objetivo
Los mocks deben representar estados reales del sistema, no solo contenido de relleno.

## 10.2. Regla principal
Cada mock debe estar alineado con las reglas funcionales ya definidas en el Master Project Document.

Ejemplos:
- un turno = un tratamiento;
- la duración deriva del tratamiento;
- el consentimiento es obligatorio;
- fotos y notas son opcionales;
- el cobro puede combinar medios;
- no hay sesión sin turno.

## 10.3. Tipos de mocks

### A. Mock de pantalla
Contiene la estructura que una pantalla necesita renderizar.

### B. Mock de entidad
Representa una entidad concreta:
- paciente
- turno
- sesión
- orden de cobro

### C. Mock de estados
Representa variantes:
- turno próximo
- paciente esperando
- sesión en curso
- cobro pendiente

## 10.4. Recomendación
Trabajar con mocks pequeños y explícitos, no con un gran JSON monstruoso.

---

## 11. Cómo crear una nueva pantalla

Cuando un agente necesite agregar una pantalla nueva al prototipo, debe seguir esta secuencia:

### Paso 1
Definir claramente:
- el objetivo de la pantalla;
- el rol que la usa;
- el momento del flujo donde aparece.

### Paso 2
Crear el archivo de mock correspondiente:
- ejemplo: `patients.mock.ts`

### Paso 3
Crear la página:
- ejemplo: `PatientsPage.tsx`

### Paso 4
Agregar la ruta al router.

### Paso 5
Conectar la navegación desde botones o tabs existentes.

### Paso 6
Probar la pantalla en anchos:
- 360
- 390
- 430

### Paso 7
Validar:
- comprensión rápida
- densidad
- orden de jerarquía
- navegación de ida y vuelta

---

## 12. Cómo integrar una pantalla sin romper el prototipo

## 12.1. Regla de reemplazo controlado
Una pantalla nueva debe poder reemplazar a una anterior sin obligar a reescribir:
- router completo,
- mocks de otras pantallas,
- navegación global,
- componentes compartidos.

## 12.2. Reglas concretas
- no cambiar rutas existentes sin necesidad;
- no acoplar una pantalla a mocks de otra;
- no mover la bottom nav global por pantalla salvo justificación fuerte;
- no introducir dependencias técnicas nuevas sin motivo.

---

## 13. Reglas de layout mobile-first

## 13.1. Breakpoints obligatorios
El prototipo debe diseñarse contemplando:

- **360 px**
- **390 px**
- **430 px**

## 13.2. Márgenes laterales
- 16 px en 360
- 20 px en 390 / 430

## 13.3. Tap targets
Todo botón o acción importante:
- mínimo 44 px de alto o ancho usable

## 13.4. Scroll
- vertical natural;
- no debe existir scroll horizontal;
- evitar pantallas que exijan demasiada profundidad de scroll para entenderse.

## 13.5. Safe areas
Siempre respetar:
- safe top
- safe bottom
- notch / dynamic island / Android status bar

---

## 14. Reglas de jerarquía visual

## 14.1. Una sola prioridad fuerte por pantalla
Cada pantalla debe tener un único bloque protagonista.

Ejemplos:
- Hoy → tarjeta principal contextual
- Agenda → lista de turnos
- Turno → siguiente paso
- Cobro → resumen + acción de pago

## 14.2. No más de una tarjeta hero por pantalla
Si dos bloques compiten por la atención, la pantalla se vuelve ruidosa.

## 14.3. Resumen breve, detalle progresivo
La pantalla debe resumir primero y dejar detalles como acciones secundarias, secciones más abajo o navegación posterior.

---

## 15. Reglas de contenido en el prototipo

## 15.1. Los textos deben ser concretos
Evitar lorem ipsum y copy genérico.

Los mocks deben parecer del sistema real:
- paciente con nombre realista;
- tratamiento plausible;
- estado concreto;
- acciones específicas.

## 15.2. Evitar datos demo absurdos
No usar:
- Juan Pérez en todo;
- “Test 1”;
- “Lorem treatment”;
- fechas incoherentes.

## 15.3. Los mocks deben ayudar a evaluar UX
El contenido debe exponer realmente:
- prioridades,
- estados,
- pendientes,
- densidad.

---

## 16. Validación mínima por pantalla

Cada pantalla agregada al prototipo debe responder a estas preguntas:

### A. ¿Se entiende en menos de 5 segundos?
### B. ¿La acción principal es obvia?
### C. ¿El contenido importante entra arriba del pliegue?
### D. ¿Hay algo compitiendo innecesariamente?
### E. ¿La navegación de retorno es clara?
### F. ¿El layout sigue funcionando en 360 px?

Si falla dos o más de esas preguntas, la pantalla no está lista.

---

## 17. Checklist de navegación

Antes de considerar una pantalla usable, hay que validar:

- se puede entrar desde una ruta real;
- se puede volver sin perderse;
- no hay dead ends;
- hay continuidad con el flujo anterior y el siguiente;
- las acciones principales llevan al destino correcto;
- no se crean loops confusos.

---

## 18. Checklist de densidad

Antes de aprobar una pantalla:

- ¿hay más de una prioridad fuerte?
- ¿hay demasiados chips?
- ¿hay demasiadas cards?
- ¿hay demasiados textos secundarios?
- ¿la pantalla parece un dashboard cuando debería ser operativa?
- ¿hay elementos que podrían bajar de jerarquía o desaparecer?

---

## 19. Checklist responsive

Probar siempre en:
- 360 × 800
- 390 × 844
- 430 × 932

Verificar:
- sin cortes de texto importantes;
- sin overflow horizontal;
- sin footers tapando contenido clave;
- botones tocables;
- bottom nav estable;
- listas legibles.

---

## 20. Qué no hacer en el prototipo

### 20.1. No sobreconstruir
No meter:
- capas técnicas innecesarias;
- stores globales complejos;
- validaciones de negocio pesadas;
- persistencia real;
- backend falso complejo.

### 20.2. No enamorarse del mock
El prototipo existe para cambiar rápido.  
No debe volverse rígido.

### 20.3. No cerrar diseño visual final demasiado temprano
Se puede trabajar con estética cuidada, pero sin obsesionarse con:
- branding final,
- microanimaciones,
- detalle visual definitivo.

Primero se valida UX.

---

## 21. Evolución del prototipo hacia frontend real

Cuando una pantalla ya fue suficientemente validada en el prototipo, recién ahí conviene pensar su migración al frontend integrado.

### Secuencia correcta
1. validar pantalla mock;
2. validar navegación;
3. validar estados;
4. congelar estructura y prioridades;
5. recién entonces pedir soporte backend si hace falta;
6. integrar después.

### Regla
Nunca adaptar UX al backend solo porque ya existe.  
Primero hay que validar qué experiencia es la correcta.

---

## 22. Relación con el backend futuro

El prototipo debe mantenerse desacoplado, pero sí documentar qué necesitará del backend real para convertirse en pantalla productiva.

Cada pantalla importante debería dejar anotado:
- qué datos mock usa;
- qué endpoint o agregado futuro necesitaría;
- qué campos son obligatorios;
- qué estados espera consumir.

Esto permite que backend y frontend converjan después con menos fricción.

---

## 23. Ejemplo canónico de pantalla bien prototipada

Una pantalla bien prototipada debería cumplir esto:

- vive en `pages/`;
- usa datos de `mocks/`;
- tiene navegación real;
- no llama APIs reales;
- soporta 360/390/430;
- tiene una jerarquía clara;
- puede reemplazarse después por la versión integrada sin cambiar el router entero.

---

## 24. Ejemplo canónico de flujo prototipado

Para el médico independiente, el flujo base que debe poder recorrerse en el prototipo es:

1. **Hoy**
2. abrir turno
3. pasar por el workspace del turno
4. cerrar sesión
5. ir al cobro
6. volver a Hoy

Ese ciclo debe sentirse estable.  
Si ese ciclo no funciona, el producto todavía no está listo aunque las pantallas “se vean lindas”.

---

## 25. Resultado esperado del pilar 2

Cuando este pilar esté bien ejecutado, el proyecto debería contar con:

- un prototipo navegable;
- pantallas desacopladas y fáciles de reemplazar;
- mocks realistas por flujo;
- validación responsive consistente;
- base clara para que distintos agentes agreguen nuevas pantallas sin romper lo anterior;
- una metodología de trabajo que evite diseñar “en abstracto”.

Este documento debe usarse como la guía operativa para cualquier agente que intervenga en el prototipo del frontend.
