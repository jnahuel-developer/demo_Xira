# Master Project Document — Parte 2

Modelo funcional profundo del sistema: agenda, turnos, sesiones clínicas, cobros, facturación, catálogo operativo y recursos

# 1. Alcance de esta parte

Esta parte documenta el corazón operativo y funcional de la plataforma: cómo se modela y funciona la agenda, cómo nacen y evolucionan los turnos, cómo se abre y se cierra una sesión clínica, cómo se cobra, cómo conviven tratamientos y productos dentro de una misma orden, y cómo se relacionan los tratamientos con equipos, insumos, disponibilidad y reglas de operación. El enfoque de este documento es funcional y de producto; no describe cronología de desarrollo ni decisiones históricas de conversación.

Se asume que el lector ya conoce, desde la Parte 1, la visión general del producto, el alcance del MVP, la definición de roles y el modelo organizacional general. Esta Parte 2 baja al detalle cómo debe entenderse el comportamiento del sistema en el día a día de la operación.

# 2. Núcleo operativo de la plataforma

La plataforma se organiza alrededor de un núcleo operativo central: cada atención real se articula a partir de un turno agendado, que luego puede convertirse en una sesión clínica en curso, y más tarde en una sesión cerrada con su correspondiente flujo de cobro, facturación y continuidad asistida. Todo lo demás — disponibilidad, tratamientos, equipos, insumos, productos, historial, alertas y validaciones — orbita alrededor de esa operación principal.

- El turno representa la reserva operativa y temporal de una atención.

- La sesión clínica representa la ejecución real de esa atención.

- La orden de cobro representa la formalización económica de lo atendido y de lo vendido.

- La disponibilidad, el tratamiento, el equipo y el stock determinan si una atención puede o no existir en una franja concreta.

- El historial concentra la evidencia clínica y operativa de lo ocurrido.

# 3. Agenda y disponibilidad

## 3.1. Propósito

La agenda no es solo un calendario visual. Es un sistema de validación y orquestación de disponibilidad que debe impedir conflictos, bloquear superposiciones y guiar la operatoria sin que el profesional tenga que razonar manualmente las reglas. La agenda debe representar tiempo disponible real, no tiempo teórico.

## 3.2. Modelo de disponibilidad

La disponibilidad base del profesional se define a partir de una plantilla semanal configurable. Sobre esa base pueden aplicarse excepciones puntuales por fecha, como cierres completos, horarios reducidos, extensiones excepcionales o bloqueos parciales.

- Disponibilidad semanal habitual por día y franja.

- Excepciones puntuales por fecha.

- Días cerrados explícitos.

- Franjas sin solapamiento; el sistema no debe permitir ni sugerir solapamientos.

- La agenda del profesional debe ser consistente con las reglas cargadas; el Front no debe reconstruir lógica compleja que ya resuelva el backend.

## 3.3. Slots sugeridos

Cuando se crea o mueve un turno, el sistema debe trabajar preferentemente con slots sugeridos y válidos en lugar de obligar al usuario a escribir horarios manualmente. El backend ya puede devolver ventanas resueltas y suggestedSlots para la disponibilidad general de agenda. En el estado actual del sistema, esos slots resuelven reglas semanales, overrides, turnos existentes y duración del tratamiento, pero todavía no consolidan la disponibilidad real de equipos requeridos ni reservas duras de insumos.

- El Front debe consumir slots válidos en vez de calcularlos.

- El Front no debe permitir overbooking manual ni bypass de validaciones.

- A futuro, los slots válidos deben contemplar también compatibilidad de equipo requerido.

- A futuro, deberían poder contemplar reservas operativas más completas ligadas al stock o preparación.

## 3.4. Reglas de no superposición

No existe la posibilidad de sobreagendar manualmente por permisos especiales. El backend bloquea solapamientos por profesional, paciente y equipo, y exige que el turno caiga dentro de disponibilidad válida. El producto, por definición, prefiere seguridad operativa y consistencia por encima de flexibilidad caótica.

- No hay bypass manual.

- No hay distinción de rol que permita romper reglas de agenda.

- La agenda debe transmitir esta seguridad como valor del sistema, no como limitación molesta.

# 4. Turnos

## 4.1. Definición

El turno es la unidad de programación de una atención. En el estado actual del producto, un turno representa una atención vinculada a un solo tratamiento. No existe todavía el concepto operativo de una misma sesión con múltiples tratamientos en paralelo, aunque se contempla como evolución futura a través de combinaciones definidas explícitamente.

- Un turno tiene un solo treatmentId.

- No existe, por ahora, un turno con múltiples tratamientos.

- La duración del turno deriva del tratamiento.

- endsAt se calcula a partir de startsAt + durationMin del tratamiento.

- La API pública no expone duración manual editable para el turno.

## 4.2. Campos funcionales clave del turno

Más allá de la implementación técnica exacta, a nivel funcional un turno necesita representar al menos:

- Paciente.

- Tratamiento.

- Profesional.

- Centro o contexto operativo donde se realizará.

- Fecha y hora de inicio.

- Hora de fin derivada.

- Estado del turno.

- Observaciones opcionales.

- Vínculo con la futura o actual sesión clínica.

- Vínculo con requerimientos de equipo cuando el tratamiento lo demande.

## 4.3. Estados operativos del turno

El sistema ya maneja estados explícitos para turnos y estados derivados del flujo. A nivel de producto, esto debe traducirse en una secuencia clara y entendible, no en una enumeración técnica incomprensible para el usuario.

- Turno programado / confirmado.

- Turno con paciente llegado o listo para check-in.

- Turno listo para iniciar sesión clínica.

- Turno con sesión en progreso.

- Turno con sesión cerrada y pendiente de cobro.

- Turno completado.

- Turno cancelado o reprogramado, cuando aplique.

## 4.4. Creación de turno

La creación de un turno debe ser guiada y simple. El usuario no debería construir el turno desde cero en modo libre, sino seleccionar paciente, tratamiento, día y slot sugerido. Las validaciones duras deben ocurrir siempre, pero el diseño del producto debe intentar que el usuario casi nunca llegue a una situación inválida.

- Buscar o confirmar paciente.

- Elegir tratamiento.

- Elegir día.

- Elegir horario sugerido.

- Agregar observación opcional.

- Guardar.

Cuando el tratamiento requiera equipo, la experiencia deseada es que el slot ya venga filtrado o validado con esa dependencia. En el estado actual esto todavía no está resuelto completamente a nivel backend, por lo que se considera una mejora a implementar antes o durante la evolución del MVP.

## 4.5. Continuidad y próximo turno

Cada tratamiento puede tener asociado un frequencyDays, pero el backend todavía no implementa la lógica que calcule y devuelva una sugerencia concreta de próximo turno. Esto implica que la plataforma necesita, a futuro cercano, una capacidad específica de sugerencia asistida de continuidad. El Front no debe asumir este cálculo; debe reservar el espacio conceptual para cuando el backend lo exponga.

- Hoy no existe servicio cerrado de próxima sugerencia.

- La regla funcional sí existe a nivel de intención de producto.

- Debe implementarse en backend para poder ofrecer continuidad asistida real.

# 5. Sesiones clínicas

## 5.1. Definición

La sesión clínica es una entidad propia, separada del turno, que representa la ejecución real de la atención. Aunque el schema permitiría conceptualmente un appointmentId nulo, el producto ya fijó una regla: no existirá sesión clínica sin turno previo. Toda sesión real debe nacer de un turno programado.

- No hay sesiones extraordinarias sin turno.

- La sesión se vincula operativamente al turno.

- La sesión tiene estado propio, timestamps, notas, media, consentimientos y snapshots.

## 5.2. Flujo clínico base

El flujo clínico mínimo del MVP es:

- El profesional entra al turno.

- Se confirma o resuelve la llegada/check-in.

- Se valida el consentimiento informado.

- Se puede registrar foto de antes, si se desea.

- Se puede revisar referencia previa del paciente y última configuración utilizada para el tratamiento, si existe.

- Se inicia la sesión clínica.

- Durante la sesión se pueden dejar notas o registrar acciones opcionales.

- Se puede registrar foto de después, si se desea.

- Se cierra la sesión.

- La atención pasa al flujo de cobro.

Este flujo no debe percibirse como una carga administrativa pesada, sino como una secuencia guiada que reduce olvidos.

## 5.3. Consentimiento informado

El consentimiento es obligatorio para todas las sesiones. No es opcional ni contextual. El producto debe tratarlo como una condición real de inicio de sesión clínica.

- Siempre obligatorio.

- Puede estar ya resuelto o pendiente.

- El backend ya lo deriva como parte del checklist/workflowState.

- El Front debe presentarlo como parte central del paso actual, no como una acción escondida.

## 5.4. Fotos antes y después

Las fotos de antes y después son opcionales, pero estratégicamente importantes para el valor del sistema. Deben presentarse al profesional de forma visible, sencilla y contextual, sin convertir la atención en un ritual burocrático. Cuando se usan, deben integrarse al historial automáticamente, sin obligar al profesional a guardar archivos en su teléfono o a subirlos manualmente desde otras aplicaciones.

- Opcionales, no bloqueantes.

- Deben sugerirse en el momento adecuado.

- Deben quedar claramente asociadas a la sesión.

- No deben requerir una carga compleja.

Además, hay una corrección funcional ya fijada para el backend: solo los médicos deben poder acceder al contenido multimedia del historial, y cada médico solo debería ver la media que él mismo generó, no la producida por otros médicos para el mismo paciente.

## 5.5. Notas

Las notas no forman parte del checklist derivado, sino que son campos directos de la sesión clínica. A nivel producto, esto permite distinguir entre lo que es un paso obligatorio del flujo y lo que es enriquecimiento clínico opcional.

- notesShort y notesLong forman parte de ClinicalSession.

- No son un requisito duro para cerrar la sesión.

- Deben poder capturarse fácilmente sin entorpecer la operación.

- La experiencia debe sugerir su uso, pero no imponerla.

## 5.6. Estado de sesión y workflow

El backend ya resuelve estados explícitos de Appointment, ClinicalSession y workflowState derivado (por ejemplo READY_FOR_CHECK_IN, READY_FOR_CONSENT, IN_PROGRESS, PENDING_PAYMENT). Esto es una fortaleza clave del producto porque permite que el Front no tenga que adivinar el flujo, sino acompañarlo. La interfaz del profesional debe construirse siempre sobre la lógica de “paso actual recomendado” derivada de ese estado.

- No son eventos sueltos; hay estados codificados.

- El Front debe consumirlos como base del workspace del turno.

- La UI debe destacar el siguiente paso, no mostrar todo con el mismo peso.

# 6. Historial clínico

## 6.1. Propósito

El historial clínico debe ser una cronología ordenada, legible y útil del recorrido del paciente. No debe ser una tabla gris, ni una carpeta de archivos, ni una historia clínica tradicional opaca. Debe permitir que el profesional entienda rápidamente qué pasó antes, qué se registró y qué evidencia existe.

- Turnos.

- Sesiones.

- Consentimientos.

- Adjuntos.

- Fotos y media permitida.

- Evoluciones o notas clínicas, según permisos.

- Actividad reciente resumida.

## 6.2. Restricciones de acceso

Todavía no está resuelta de forma final en backend la versión resumida que debe ver el staff administrativo. A nivel de producto ya está definido que:

- Los administrativos y administradores de centro no deben ver la misma profundidad clínica que el médico.

- No deben acceder a media sensible.

- No deben ver notas internas largas del médico.

- El médico debe tener acceso a su propia media, pero no a la media creada por otro médico para el mismo paciente.

Esto requiere una refactorización y explicitación del modelo de permisos y vistas resumidas del historial. Es una deuda funcional identificada y prioritaria para lograr una UX correcta y segura.

## 6.3. Historial compartido entre profesionales

Una funcionalidad futura importante del producto es que, cuando el paciente forme parte del ecosistema general, los profesionales puedan consultar historial previo de otros profesionales con autorización explícita del paciente. Esta autorización todavía no está modelada en backend. Actualmente el acceso se resuelve por scope organizacional y PatientAssignment/PatientCenter, no por un consentimiento de portabilidad clínica otorgado por el paciente.

- No existe aún una entidad de autorización del paciente para compartir historial.

- Debe salir en el MVP o inmediatamente posterior, según priorización.

- Es central para la propuesta de valor de continuidad clínica del ecosistema.

# 7. Cobro y órdenes

## 7.1. Definición

El cobro no debe entenderse solo como un movimiento de caja, sino como la formalización económica de una atención y, eventualmente, de productos adicionales vendidos dentro del mismo contexto. El backend ya permite órdenes mixtas donde conviven el tratamiento realizado y los productos vendidos en esa misma interacción.

- Una SaleOrder puede incluir líneas de SESSION_TREATMENT y PRODUCT.

- El backend permite una orden MIXED.

- El producto debe aprovechar esto para evitar flujos separados y torpes para tratamiento y venta complementaria.

## 7.2. Pago parcial y medios combinados

Técnicamente el backend permite órdenes parcialmente pagadas y recalcula estados como PENDING_PAYMENT, PARTIALLY_PAID y PAID. A nivel de producto, sin embargo, la decisión fijada es que a futuro no se promueva la lógica de deuda parcial prolongada, pero sí se permitan medios de pago combinados en una misma operación.

- Se puede pagar con combinación de medios.

- Ejemplo: parte en efectivo y parte con tarjeta.

- El sistema puede registrar múltiples Payment por orden.

- No debe promoverse dejar saldos abiertos como forma habitual de trabajo.

Esto significa que la UI de cobro debe permitir múltiples líneas de pago, pero conducir al cierre total de la orden como expectativa por defecto.

## 7.3. Flujo de cobro

El flujo económico ideal, desde la perspectiva de producto, es:

- La sesión se cierra.

- Se muestra un resumen de lo realizado.

- Se pueden agregar productos de venta complementaria.

- Se seleccionan uno o varios medios de pago.

- Se valida el total.

- Se decide si se emite o no factura.

- Se confirma el cobro.

Para el médico independiente este flujo forma parte natural del cierre de una atención. No debería sentirse como entrar a un módulo de caja desconectado del turno.

## 7.4. Facturación

Hoy la emisión electrónica todavía no está cerrada porque el endpoint de ARCA no está completamente implementado. Sin embargo, el objetivo funcional del MVP es que la factura electrónica pueda emitirse, siempre como decisión del operador. La política de producto ya cambió respecto de ideas anteriores: no habrá una exclusión estructural para efectivo. Cualquier medio de pago podrá derivar en emisión, siempre que el operador quiera hacerlo. Si elige no emitir, esa decisión debe quedar registrada para trazabilidad y eventual auditoría.

- La factura no es obligatoria por sistema.

- La decisión de emitir u omitir es del operador.

- Debe quedar auditado si no se emite.

- La UI no debe bloquear el cobro si la factura se difiere u omite.

# 8. Tratamientos

## 8.1. Rol funcional del tratamiento

El tratamiento es una de las piezas más importantes del sistema porque no solo define una oferta comercial o clínica: define duración, requisitos operativos, frecuencia y dependencias del resto del ecosistema.

- Define la duración del turno.

- Define, a futuro, la sugerencia de continuidad mediante frequencyDays.

- Puede requerir equipo.

- Puede consumir insumos específicos.

- Puede exigir habilitaciones o certificaciones profesionales, especialmente en organizaciones.

## 8.2. Restricción actual

En el estado actual del MVP, un turno y una sesión solo admiten un treatmentId. Las combinaciones múltiples quedan explícitamente fuera del alcance presente, aunque el producto prevé un futuro donde puedan definirse tratamientos combinables.

- No modelar hoy sesiones con múltiples tratamientos.

- No diseñar UI que sugiera una combinación libre si el backend aún no la soporta.

- Cuando se incorpore, debe hacerse con reglas explícitas de combinabilidad, no con mezcla arbitraria.

# 9. Equipos

## 9.1. Propósito

Los equipos no son solo inventario fijo; son recursos operativos críticos que condicionan la posibilidad real de agendar y ejecutar tratamientos. El sistema debe saber si un tratamiento necesita equipo y, llegado el momento, debe impedir que un turno se cree o se mantenga si el equipo no está disponible, no está en el centro correcto, está en service o entra en conflicto horario con otro uso.

- El backend ya resuelve elegibilidad real al crear/editar turnos si se pasa por esa validación.

- El endpoint general de availability todavía no incorpora esta capa en suggestedSlots.

- Esto debe mejorarse para que el usuario nunca vea un slot falso que luego el sistema rechace por equipo.

## 9.2. Autoasignación

A nivel backend, cuando un tratamiento requiere equipo, el sistema puede autoasignar uno libre si no se indica uno. La UX del producto debería capitalizar esto y evitar pedirle al usuario que elija manualmente equipo salvo casos muy excepcionales. La experiencia deseada es que la plataforma resuelva el recurso y, a lo sumo, informe qué equipo fue asociado.

- No pedir selector libre de equipo en el flujo normal.

- Informar equipo asignado si corresponde.

- Ocultar complejidad operacional salvo cuando sea necesaria.

# 10. Insumos

## 10.1. Propósito

Los insumos son otro recurso crítico que diferencia al producto de una agenda genérica. El sistema no solo debe guardar stock; debe ser capaz de anticipar demanda futura a partir de tratamientos agendados y requisitos asociados.

- Cada tratamiento puede consumir insumos.

- El backend ya puede calcular una proyección analítica de consumos contra stock disponible a través de inventory/overview.

- Todavía no existe una reserva persistida por turno ni una validación inline directa al agendar.

## 10.2. Dirección futura

La visión del producto es que el profesional nunca se vea sorprendido por faltantes evitables. Por eso, aunque el Front no deba inventar lógica, el backend necesita evolucionar hacia una reserva o consolidación operativa más fuerte, o al menos hacia endpoints que devuelvan preparación y alertas listas para consumir por el workspace diario.

- El Front no debe asumir reserva dura hoy.

- El sistema sí debe, a futuro, poder advertir faltantes operativos vinculados a turnos reales.

- La UX ideal es preventiva, no reactiva.

# 11. Productos

## 11.1. Definición

Los productos son todos los artículos comercializables por el profesional o la organización fuera del tratamiento en sí. Por ejemplo, cosmética post-sesión o productos de mantenimiento. A nivel de UX y negocio, deben ser fáciles de agregar dentro del flujo de cobro para que la venta complementaria no implique una operación separada.

- No son tratamientos.

- Se venden dentro del mismo ecosistema.

- Pueden convivir en la misma orden con la atención clínica.

- Deben poder integrarse luego al portal paciente y al marketplace futuro.

# 12. Regla operativa madre del producto

La plataforma debe reducir trabajo mental. Todas las piezas descritas en esta Parte 2 se subordinan a una sola regla: el profesional no debería tener que coordinar manualmente agenda, cumplimiento clínico mínimo, recursos, cierre y cobro. El sistema debe anticipar, validar y acompañar, dejando al profesional enfocado en atender.

- La agenda debe devolver tiempo real y válido.

- El turno debe abrir un workspace contextual, no una ficha cargada de datos sin jerarquía.

- La sesión clínica debe guiar el siguiente paso.

- El cobro debe sentirse como continuación natural del cierre.

- Los tratamientos, equipos e insumos deben operar en segundo plano, sin desaparecer pero sin invadir.

# 13. Deudas y mejoras ya identificadas

El proyecto ya tiene identificadas varias piezas que el backend debe completar o ajustar para que el producto alcance su mejor expresión funcional. Son mejoras conocidas, no ideas nuevas sueltas.

# 14. Criterios de diseño derivados de esta parte

Aunque este documento es funcional y no visual, de aquí se derivan criterios directos para la UX del front:

- El usuario no debe navegar por módulos técnicos para completar una atención.

- El flujo principal debe ser turno → sesión → cierre → cobro → continuidad.

- La información opcional debe sugerirse, no imponerse.

- La información crítica debe presentarse como paso actual recomendado.

- La agenda debe ser una representación de disponibilidad real, no una promesa que luego falla.

- El sistema debe priorizar anticipación, no corrección tardía.

# 15. Cierre de la Parte 2

Esta Parte 2 deja documentado el modelo funcional profundo del núcleo operativo de la plataforma. La Parte 3 completará la documentación madre abordando el funcionamiento organizacional ampliado, los permisos, la auditoría y trazabilidad, la dimensión multi-centro, las integraciones futuras, los principios de UX del sistema y el glosario de conceptos. Con las Partes 1, 2 y 3 combinadas, el proyecto quedará documentado a nivel producto de forma integral, sin depender de la cronología del desarrollo conversacional.