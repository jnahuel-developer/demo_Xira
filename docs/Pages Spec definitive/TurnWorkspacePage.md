# TurnWorkspacePage — Documentación definitiva

## 1. Propósito de esta pantalla

`TurnWorkspacePage` es la pantalla operativa central del flujo clínico del médico independiente dentro del prototipo mobile-first.

Su función no es mostrar una ficha cargada de datos, sino **acompañar la ejecución real del turno** con una lógica secuencial, clara y de baja carga mental. La pantalla está diseñada para que el médico entienda rápidamente en qué punto de la sesión está, qué acción corresponde ahora y qué sigue después.

Dentro del flujo principal del prototipo, esta pantalla ocupa el tramo:

`Hoy / Agenda → Turno → Cobro → Hoy`

## 2. Estado de definición

Esta pantalla queda considerada **cerrada a nivel de maqueta UX/UI**.

Esto significa que:

- el flujo de interacción queda fijado;
- la lógica visual principal queda fijada;
- la estructura de bloques queda fijada;
- la jerarquía general de la pantalla queda fijada.

Lo que **sí podrá cambiar recién en una etapa productiva** es el contenido fino de los chips o cards internas de:

- `Contexto útil`
- `Resumen de sesión`

Esos bloques quedan aceptados para la maqueta actual y no requieren más iteración en esta fase.

---

## 3. Objetivo UX

La pantalla debe comportarse como una **consola de sesión asistida**.

El principio rector es:

- una sola prioridad fuerte visible;
- una acción principal por momento;
- contexto progresivo;
- continuidad natural hacia el cobro;
- mínima fricción durante la atención.

No debe sentirse como un formulario ni como una ficha administrativa.

---

## 4. Ruta y navegación

### Ruta

```txt
/turno/:id
```

### Entradas válidas

La pantalla puede abrirse desde:

- `TodayPage`
- `AgendaPage`

### Salidas válidas

- botón atrás superior → vuelve a `Hoy` (`/`)
- botón `Ir al cobro` → navega a `/cobro/:id`
- botón `Volver a Hoy` al final del flujo → navega a `/`

### Regla de retorno

El botón superior izquierdo siempre debe resolver un retorno simple, estable y predecible hacia `Hoy`.

No debe depender de historial complejo de navegación.

---

## 5. Estructura fija de la pantalla

La pantalla se divide en dos zonas principales:

### A. Hero superior fijo

Es el bloque principal de estado y acción.

Debe permanecer siempre visible en pantalla.

Contiene:

- chip de estado;
- título del paso actual;
- barra de progreso del flujo;
- timer, cuando aplica;
- CTA principal o CTAs del paso actual.

### B. Bloque inferior variable

Ocupa todo el espacio disponible entre el Hero y la bottom bar.

Este bloque cambia según el momento del flujo:

- antes de cerrar la sesión: `Contexto útil`
- después de cerrar la sesión: `Resumen de sesión`

### Regla de scroll

La pantalla **no debe tener scroll global**.

Solo puede existir scroll interno dentro del bloque inferior cuando el contenido exceda el espacio disponible.

Por lo tanto:

- el Hero superior queda fijo;
- la bottom nav queda fija;
- el bloque inferior absorbe el alto restante;
- el scroll, si existe, vive solo dentro del contenido interno del bloque inferior.

---

## 6. Safe areas y mobile-first

La pantalla debe respetar safe areas superiores e inferiores.

En particular:

- no debe apoyarse contenido crítico en la franja central superior que pueda verse afectada por notch, Dynamic Island o barra de estado;
- debe convivir correctamente con la bottom nav fija;
- no debe generar solapamientos con el área inferior del dispositivo.

Resoluciones objetivo de validación:

- `360 × 800`
- `390 × 844`
- `430 × 932`

Además, en alturas menores a `700px`, debe compactar tipografías y espacios de forma proporcional, manteniendo la misma jerarquía visual.

---

## 7. Flujo definitivo de la sesión

El flujo de la pantalla queda fijado como:

```txt
Pre → Antes → Sesión → Después → Cobro
```

Este flujo se representa visualmente en el progress bar del Hero.

### Etiquetas del progress bar

```txt
Pre | Antes | Sesión | Después | Cobro
```

No debe mostrarse un estado separado de `Cierre`.

---

## 8. Estados funcionales del Hero

## 8.1. Estado 1 — Registrar el consentimiento

### Objetivo
Destrabar el inicio de la atención.

### Comportamiento
- el consentimiento es obligatorio;
- no se puede omitir;
- hasta que no se registre, no se puede avanzar.

### UI esperada
- chip centrado horizontalmente;
- Hero con tono rojo / crítico;
- título: `Registrar el consentimiento`;
- único botón visible: `Tomar foto`;
- el botón ocupa todo el ancho disponible del área de acciones.

### Regla
Al confirmar esta acción, la pantalla avanza al estado `Registrar el antes`.

---

## 8.2. Estado 2 — Registrar el antes

### Objetivo
Permitir registrar evidencia previa al tratamiento.

### Comportamiento
- la foto del antes es opcional;
- el médico puede tomarla u omitirla.

### UI esperada
- título: `Registrar el antes`;
- botón primario: `Tomar foto`;
- botón secundario: `Omitir`.

### Regla
Cualquiera de las dos decisiones inicia inmediatamente la sesión.

---

## 8.3. Estado 3 — Sesión en marcha

### Objetivo
Acompañar la sesión activa sin distraer.

### Comportamiento
- se muestra el timer de la sesión;
- el tiempo de prueba queda fijado en `1 minuto`;
- el timer debe verse centrado dentro del Hero;
- mientras falten más de 30 segundos, no debe aparecer el botón de cierre.

### UI esperada
- título: `Sesión en marcha`;
- timer grande y central;
- sin acciones secundarias paralelas;
- sin foto del después ni notas visibles todavía.

### Regla crítica
Cuando faltan `30 segundos` o menos:

- el Hero cambia de tono para llamar la atención;
- se habilita el botón `Cerrar sesión`.

---

## 8.4. Estado 4 — Registrar el después

### Objetivo
Registrar evidencia posterior al tratamiento.

### Comportamiento
- solo se habilita después de cerrar la sesión;
- no debe convivir en paralelo con la sesión en marcha;
- la foto del después es opcional.

### UI esperada
- título: `Registrar el después`;
- botón primario: `Tomar foto`;
- botón secundario: `Omitir`.

### Regla
Al resolver este paso, la pantalla avanza a `Agregar nota pública`.

---

## 8.5. Estado 5 — Agregar nota pública

### Objetivo
Permitir registrar una nota visible en historial clínico compartido.

### Comportamiento
- es opcional;
- puede tomarse o omitirse;
- si se toma, abre un modal.

### UI esperada
- título: `Agregar nota pública`;
- botón primario: `Tomar nota`;
- botón secundario: `Omitir`.

### Modal esperado
- título: `Nota pública`;
- texto aclaratorio: visible en el historial clínico del paciente y para otros médicos con acceso;
- textarea para ingresar contenido;
- acciones: `Cancelar` y `Guardar nota`.

### Regla
Después de guardar u omitir, la pantalla avanza a `Agregar nota privada`.

---

## 8.6. Estado 6 — Agregar nota privada

### Objetivo
Permitir registrar una nota de uso exclusivo del médico.

### Comportamiento
- es opcional;
- puede tomarse o omitirse;
- si se toma, abre un modal.

### UI esperada
- título: `Agregar nota privada`;
- botón primario: `Tomar nota`;
- botón secundario: `Omitir`.

### Modal esperado
- título: `Nota privada`;
- texto aclaratorio: solo visible para el médico; el paciente no puede verla;
- textarea para ingresar contenido;
- acciones: `Cancelar` y `Guardar nota`.

### Regla
Después de guardar u omitir, la pantalla avanza a `Turno finalizado`.

---

## 8.7. Estado 7 — Turno finalizado

### Objetivo
Cerrar el flujo clínico y derivar al económico o al retorno estable.

### Comportamiento
- el Hero cambia a verde;
- desaparece `Contexto útil`;
- aparece `Resumen de sesión`;
- se ofrecen dos caminos de salida.

### UI esperada
- título: `Turno finalizado`;
- botón primario: `Ir al cobro`;
- botón secundario: `Volver a Hoy`.

### Regla
- `Ir al cobro` navega a la pantalla de cobro del turno;
- `Volver a Hoy` vuelve al inicio del flujo del médico.

---

## 9. Bloque Contexto útil

## 9.1. Cuándo se muestra
Se muestra durante estas etapas:

- consentimiento pendiente;
- foto del antes;
- sesión en marcha.

## 9.2. Objetivo
Dar al médico la información mínima necesaria para iniciar y ejecutar la sesión.

## 9.3. Contenido esperado en maqueta
En la maqueta actual, este bloque queda aceptado con información simple y directa, suficiente para validar el uso real de la pantalla.

No requiere más refinamiento en esta etapa.

## 9.4. Criterio funcional
Este bloque podrá cambiar en producción según validación con médicos, pero en la maqueta se considera estable y suficiente.

---

## 10. Bloque Resumen de sesión

## 10.1. Cuándo se muestra
Se muestra una vez cerrada la sesión y completados los pasos posteriores.

Reemplaza completamente al bloque `Contexto útil`.

## 10.2. Objetivo
Dar un resumen rápido de cómo quedó registrada la sesión.

## 10.3. Contenido esperado
Debe priorizar únicamente información útil para el cierre.

No debe volver a mostrar datos irrelevantes como:

- duración planificada;
- franja horaria;
- consentimiento.

## 10.4. Información que sí puede mostrar
- paciente;
- tratamiento;
- estado de foto del antes;
- estado de foto del después;
- estado de nota pública;
- estado de nota privada.

## 10.5. Criterio visual
Puede mantener cambios sutiles de color para reforzar estados relevantes, especialmente cuando ya está lista para ir al cobro.

Ese comportamiento visual queda aceptado y debe mantenerse.

---

## 11. Reglas de interacción

### 11.1. Secuencialidad
Las acciones posteriores al cierre deben ejecutarse en orden y nunca en paralelo:

```txt
Cerrar sesión → Foto después → Nota pública → Nota privada → Cobro
```

### 11.2. Opcionalidad
Son opcionales:

- foto del antes;
- foto del después;
- nota pública;
- nota privada.

No es opcional:

- consentimiento.

### 11.3. Persistencia mock
La pantalla puede usar un runtime mock local para mantener el estado del turno mientras se navega dentro del prototipo.

### 11.4. Reinicio de ciclo
Una vez confirmado el cobro, el flujo del turno debe reiniciarse a estado base para que el prototipo pueda reutilizar siempre el mismo caso de prueba.

---

## 12. Tono visual de estados

### Hero crítico
Se usa cuando falta consentimiento.

Objetivo:
- llamar la atención;
- comunicar bloqueo real.

### Hero de atención / cierre
Se usa cuando faltan 30 segundos o menos y ya puede cerrarse la sesión.

Objetivo:
- destacar que el tratamiento está entrando en su tramo final.

### Hero de éxito
Se usa cuando el turno ya quedó finalizado y listo para cobrar.

Objetivo:
- transmitir cierre correcto del flujo.

---

## 13. Reglas de copy

El copy de esta pantalla debe sentirse productivo y real.

Por lo tanto:

- no deben aparecer textos que hablen del prototipo o del mock;
- no deben aparecer aclaraciones del tipo “en esta maqueta…” o “para pruebas…” dentro de la UI;
- todo texto visible debe parecer propio de una versión real del sistema.

La lógica fake puede existir, pero nunca debe filtrarse al lenguaje visible para el usuario.

---

## 14. Restricciones de layout

### No permitido
- scroll global de pantalla;
- bloque inferior cortado sin posibilidad de leerlo;
- acciones finales en paralelo durante la sesión en marcha;
- duplicación de datos irrelevantes;
- CTA inferior tapado por bottom nav;
- uso de header central cargado en la zona alta sensible del dispositivo.

### Obligatorio
- Hero siempre visible;
- safe areas respetadas;
- timer claramente legible;
- CTA principal obvio en cada paso;
- transición limpia entre `Contexto útil` y `Resumen de sesión`.

---

## 15. Criterios de aceptación

La pantalla se considera correcta si cumple todo lo siguiente:

1. En menos de 5 segundos se entiende el estado actual del turno.
2. El consentimiento bloquea correctamente el inicio.
3. La foto del antes puede tomarse u omitirse.
4. La sesión arranca con timer visible y centrado.
5. El botón `Cerrar sesión` aparece solo cuando faltan 30 segundos o menos.
6. La foto del después y las notas aparecen solo después del cierre.
7. La nota pública y la privada se resuelven con modales diferenciados.
8. Al terminar, aparece `Resumen de sesión` en lugar de `Contexto útil`.
9. La pantalla no tiene scroll global.
10. El bloque inferior usa scroll interno si lo necesita.
11. La navegación hacia cobro y hacia Hoy es directa y estable.
12. El lenguaje visible se siente productivo y no de demo.

---

## 16. Relación con la pantalla de cobro

Esta pantalla termina en `ChargePage`.

A nivel de prototipo, el comportamiento esperado del ciclo completo es:

1. se completa el flujo del turno;
2. se navega al cobro;
3. se confirma el cobro;
4. se reinicia el turno mock;
5. se vuelve a `Hoy`.

Esto permite probar repetidamente el flujo completo sin necesidad de datos distintos en cada ejecución.

---

## 17. Conclusión

`TurnWorkspacePage` queda definida como la pantalla que materializa el corazón operativo del médico independiente: una experiencia asistida, secuencial, clara y mobile-first para ejecutar un turno clínico desde el consentimiento hasta el paso al cobro.

Su definición de maqueta queda cerrada en esta etapa.
