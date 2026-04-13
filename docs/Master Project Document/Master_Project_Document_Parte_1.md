# Master Project Document
## Plataforma integral para salud estética

**Parte 1 de 3**
Visión, alcance, roles y modelo operativo

## Índice de la documentación madre

- Parte 1: visión del producto, problema, propuesta de valor, públicos objetivo, roles, alcances y modelo operativo general.

- Parte 2: modelo funcional profundo del sistema: agenda, turnos, sesiones clínicas, consentimientos, fotos, notas, cobros, facturación, catálogo clínico y recursos operativos.

- Parte 3: organizaciones, centros, permisos, auditoría, integraciones futuras, principios de UX y glosario funcional.

## 1. Visión general del producto

La plataforma es un sistema integral orientado a la salud estética. Su objetivo no es resolver solo una agenda ni solo una historia clínica, sino articular la operación completa de profesionales independientes, organizaciones con múltiples centros y, en etapas posteriores, pacientes, proveedores y otras piezas del ecosistema.

El producto está pensado como un sistema operativo de trabajo para el rubro: acompaña la operación diaria, organiza la agenda, conecta pacientes y profesionales, administra recursos clínicos y comerciales, y construye trazabilidad para auditoría y control.

La promesa central del producto es reducir fricción operativa y aumentar control sin volver técnica la experiencia. La plataforma no debe sentirse como una herramienta administrativa más, sino como una capa de asistencia que permite al profesional enfocarse en la atención y no en la gestión.

La lógica global del sistema es ecosistémica. Aunque el primer foco comercial y de diseño está puesto en el médico independiente, la arquitectura conceptual contempla desde el inicio a centros, staff administrativo, técnicos, auditores, pacientes y futuras integraciones con asistentes virtuales, automatización ambiental y marketplace de productos.

## 2. Problema que resuelve

El rubro de estética médica y estética profesional suele operar con herramientas fragmentadas: agendas genéricas, mensajería personal, controles de stock improvisados, registros clínicos parciales, cobros por fuera del sistema y documentación dispersa. Esa fragmentación genera pérdida de tiempo, mayor carga cognitiva, menor trazabilidad y riesgos operativos.

Para el médico independiente, el problema principal es que el trabajo clínico convive con tareas administrativas y logísticas: coordinar turnos, recordar consentimientos, registrar fotos, resolver cobros, controlar insumos, vigilar stock y sostener seguimiento de pacientes. Cuando eso no está unificado, el profesional se distrae del tratamiento y baja la calidad de su operación.

Para organizaciones y centros, el problema escala: múltiples centros, múltiples profesionales, desplazamiento de equipos, stock distribuido, habilitaciones por tratamiento y necesidad de auditar quién hizo qué. Los sistemas tradicionales no suelen modelar bien esas relaciones ni sostener una trazabilidad práctica para el día a día.

Para pacientes, el problema es la dispersión de información: sus turnos, historial, consentimientos, productos y continuidad de tratamientos quedan repartidos entre conversaciones, archivos sueltos, fotos fuera del sistema y registros que no siempre pueden consultar.

## 3. Propuesta de valor

La plataforma ofrece una propuesta de valor integral: concentrar en un mismo entorno la operatoria clínica, administrativa y de continuidad comercial del rubro, con una experiencia orientada al flujo real de trabajo de cada rol.

Para el médico, la propuesta es asistencia contextual: saber qué turno sigue, qué debe preparar, qué consentimiento falta, cuál fue la configuración previa utilizada, qué fotos conviene registrar, cómo cerrar la sesión y cómo pasar al cobro con el menor esfuerzo posible.

Para la organización, la propuesta es coordinación y control: disponibilidad de equipos y profesionales, asignación por centros, trazabilidad de traslados, administración de staff, reglas de habilitación, auditoría de acciones y resumen del estado del negocio.

Para el paciente, la propuesta futura es autogestión y continuidad: ver su historial, solicitar turnos, comprar productos, consultar información relevante y, a largo plazo, interactuar con la plataforma también mediante asistentes virtuales y experiencias más ambientales.

## 4. Público objetivo

El público objetivo inicial principal es el médico independiente que trabaja en salud estética y que necesita una herramienta móvil, directa y asistida para ordenar su jornada completa. Este perfil es prioritario porque concentra alta frecuencia de uso, sensibilidad al valor operativo y necesidad concreta de simplificación.

El segundo público objetivo son los centros y organizaciones de estética que requieren ordenar agenda, pacientes, cobros, stock, equipos, habilitaciones y trazabilidad entre múltiples actores. Dentro de este grupo, el staff administrativo y los administradores de centro tienen un peso operativo muy alto.

El público objetivo futuro incluye pacientes finales, que pasan de ser receptores de la operación a usuarios activos del ecosistema, y también proveedores o laboratorios, que podrán publicar catálogos y participar del circuito de abastecimiento dentro de la plataforma.

## 5. Principios rectores del producto

El producto debe vender una experiencia y no solo una suma de funcionalidades. Eso implica que cada decisión de interfaz, de navegación y de arquitectura del front debe responder a un criterio de claridad, asistencia y continuidad.

El sistema debe estar organizado por modo de trabajo y no por estructura de base de datos. Para los usuarios operativos, especialmente médicos, la plataforma debe responder siempre a preguntas concretas: qué tengo ahora, qué sigue, qué me falta resolver y qué debo preparar.

La experiencia debe ser mobile-first para los médicos y pacientes, pero sin resignar una buena adaptación desktop para roles más administrativos o de supervisión. La plataforma no debe sentirse distinta entre dispositivos; debe sostener la misma lógica con distinta densidad y distinto aprovechamiento del espacio.

La plataforma debe minimizar la cantidad de decisiones manuales innecesarias. Cuando el sistema pueda sugerir, anticipar, filtrar o bloquear con criterio, debe hacerlo. El objetivo no es dejar todo configurable, sino resolver bien el problema operativo.

## 6. Alcance del MVP

El MVP incluye el front para médicos independientes, médicos que operan dentro de organizaciones, staff administrativo, dueños o administradores de centros y, en un alcance posterior dentro del mismo ecosistema, pacientes. Técnicos y auditores ya existen a nivel conceptual y de backend, pero su front no constituye la prioridad de diseño actual.

En el MVP, los médicos podrán gestionar agenda, turnos, pacientes, sesiones, consentimientos, fotos clínicas opcionales, notas, cobros, productos adicionales en la orden, emisión opcional de factura, disponibilidad semanal, tratamientos, equipos, insumos y productos.

En organizaciones, el MVP contempla múltiples centros, múltiples profesionales, staff administrativo, dueños y administradores, con reglas de alcance por centro, habilitaciones profesionales, equipos y stock trasladables y trazabilidad de acciones.

Quedan fuera del MVP, o en estado parcial, las comunicaciones internas integradas, la autorización explícita del paciente para compartir historial entre profesionales, la experiencia profunda de técnicos y auditores en front y algunas asistencias inteligentes que ya están previstas pero aún no resueltas completamente en backend.

## 7. Alcance futuro y visión expandida

La plataforma está pensada para evolucionar desde un sistema operativo de práctica estética hacia un ecosistema más amplio. En una segunda etapa, los pacientes tendrán un portal propio desde el cual podrán buscar profesionales, solicitar turnos, gestionar su historial y comprar productos.

En una etapa posterior, se prevé la incorporación de proveedores o laboratorios, para permitir catálogos integrados y circuitos de compra dentro del mismo entorno.

La visión de largo plazo incluye integración con asistentes virtuales con pantalla, comandos de voz para operar agenda y sesiones, comparación visual de antes y después en dispositivos ambientales y, más adelante, control del entorno físico del consultorio, como iluminación contextual según tratamiento.

## 8. Tipos de uso profesional y estructura de roles

El sistema contempla cuatro grandes clases de uso profesional: médico independiente, organizaciones con múltiples roles internos, técnicos y auditores. Aunque no todos tienen el mismo peso comercial ni el mismo alcance de front en esta etapa, la plataforma debe modelarlos con coherencia conceptual desde el inicio.

El médico independiente es un profesional que tiene un único centro propio y puede, como máximo, sumar una secretaria. Tiene control pleno de su agenda, pacientes, tratamientos, disponibilidad, cobros, promociones, equipos, insumos y productos. La experiencia de producto para este rol debe ser la más pulida y asistida del sistema.

Las organizaciones pueden tener uno o más centros, dueños generales, administradores de centro, staff administrativo, médicos, técnicos y auditores propios. Dentro de ellas, el dueño tiene alcance total sobre toda la organización, mientras que el resto de los usuarios queda limitado a los centros que se les asignen.

Los técnicos independientes o internos gestionan services, presupuestos, retiros, entregas y trazabilidad de equipos. Los auditores independientes o internos reciben grants o alcances de lectura para revisar movimientos, consentimientos, stock, acciones críticas y cumplimiento general. Su front quedará básico por ahora, pero el modelo funcional ya forma parte del proyecto madre.

## 9. Médico independiente: definición funcional

El médico independiente es el usuario prioritario del diseño. Opera principalmente desde el teléfono y utiliza la plataforma durante la jornada clínica real. Su foco no debe estar en administrar el sistema, sino en atender pacientes, ejecutar tratamientos, cerrar sesiones y resolver cobros con mínima fricción.

Para este rol, la plataforma debe funcionar como asistente operativo: anticipar el próximo turno, mostrar el contexto relevante del paciente, recordar consentimientos, ofrecer fotos antes y después como acciones simples, sugerir configuraciones previas, ayudar a cerrar la sesión y encadenar naturalmente el cobro y la continuidad del tratamiento.

El médico independiente también gestiona la configuración secundaria de su centro: disponibilidad semanal, tratamientos, equipos, insumos, productos y promociones. Sin embargo, esas tareas no deben ocupar el corazón de la navegación diaria; viven como capas secundarias dentro del producto.

## 10. Organizaciones y roles internos

Las organizaciones son estructuras multi-centro o multi-profesional. Su complejidad principal radica en la distribución de personas, recursos y permisos. Una misma organización puede tener profesionales trabajando en distintos centros y en diferentes franjas, mientras los equipos permanecen físicamente asociados a centros concretos o en tránsito entre ellos.

El dueño de la organización tiene acceso global a todos los centros y puede crear cualquier usuario en cualquier scope. El administrador de centro, cuando existe, tiene un alcance similar pero limitado a los centros asignados. El staff administrativo opera principalmente agenda, pacientes, cobros, tratamientos, stock y configuraciones operativas. Los médicos de la organización conservan una experiencia muy parecida a la del médico independiente, salvo por la restricción habitual de no cobrar directamente.

Las organizaciones también pueden tener técnicos y auditores propios. Además, el sistema contempla que un médico independiente pueda ser invitado a formar parte de una organización sin perder su identidad de uso independiente; esta pieza aún no está implementada, pero es parte del modelo.

## 11. Reglas de alcance y scope

Salvo el dueño de organización, todos los usuarios trabajan dentro de un scope concreto. Eso significa que un administrativo del centro A no debe poder operar pacientes, agenda o stock del centro B, y que un médico asignado a un centro específico no debe poder definir franjas horarias ni acceder a operaciones fuera de su alcance.

El scope también afecta la disponibilidad real de equipos, productos e insumos. Los equipos siempre pertenecen físicamente a un centro en un momento dado, y eso impacta en la posibilidad de agendar turnos para tratamientos que los requieran. Del mismo modo, los tratamientos pueden estar habilitados a nivel organización o restringidos a ciertos centros específicos.

La interfaz debe hacer visible el contexto actual sin obligar al usuario a pensar en permisos técnicos. La regla general es que el sistema debe filtrar, restringir y sugerir en base al scope correcto, evitando exponer operaciones inválidas.

## 12. Decisiones funcionales ya fijadas

Un turno tiene, en el estado actual del producto, un único tratamiento asociado. No hay combinaciones múltiples dentro de una misma sesión en el MVP, aunque sí se contempla a futuro la posibilidad de tratamientos combinables.

La duración del turno se deriva del tratamiento y no es editable manualmente en la API pública. El sistema debe trabajar con esa regla como base para disponibilidad, bloqueos y sugerencias.

No existe sobreagendado manual ni bypass por rol. Si un slot no es válido por agenda, profesional, paciente o equipo, no debe poder seleccionarse.

No existen sesiones extraordinarias sin turno previo. La sesión clínica nace de un turno existente.

El consentimiento es obligatorio para todas las sesiones. Las fotos antes y después y las notas son opcionales, aunque la UX debe sugerirlas claramente.

El cobro puede combinar distintos medios de pago dentro de una misma orden. La factura electrónica será opcional, no obligatoria, y su emisión quedará registrada.

## 13. Temas abiertos que siguen en desarrollo

El backend aún debe completar varias piezas para soportar la UX ideal: sugerencia de próximo turno basada en frequencyDays, disponibilidad de agenda filtrada también por compatibilidad real de equipo, proyección o reserva operativa de insumos por turno y un endpoint consolidado de “qué preparar para el próximo turno”.

También debe redefinirse la vista resumida del historial para staff administrativo y administradores, restringiendo multimedia y notas sensibles según el criterio de producto ya establecido.

La autorización explícita del paciente para compartir historial entre profesionales todavía no está implementada y forma parte del MVP pendiente. De igual modo, las comunicaciones internas dentro de la plataforma y la participación plena de médicos independientes invitados a organizaciones siguen abiertas.

## 14. Resumen ejecutivo de actores principales

---
Fin de la Parte 1.
La Parte 2 profundizará el modelo funcional del sistema: agenda, turnos, sesiones clínicas, consentimientos, fotos, notas, cobros, catálogo clínico y recursos operativos.
