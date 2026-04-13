Master Project Document
Parte 3

Organización, permisos, auditoría, integraciones futuras, principios de UX y glosario





# 1. Organizaciones, centros y modelo multi-scope

## 1.1 Organización como entidad madre

Una organización representa una estructura empresarial que puede operar uno o más centros de estética bajo una misma administración. A diferencia del médico independiente, la organización no se limita a un solo centro ni a una sola persona operando. La organización consolida recursos, usuarios, reglas, tratamientos, equipos, stock, trazabilidad y auditoría bajo una capa superior que permite gobernar todo el ecosistema interno.

## 1.2 Centros como unidades operativas

Cada centro es una unidad operativa concreta donde se atienden pacientes, se encuentran físicamente equipos y stock, y trabajan profesionales o administrativos. Un centro puede compartir definiciones con toda la organización, pero también puede tener configuraciones particulares, como tratamientos habilitados, agenda específica, inventario local o personal asignado. El sistema debe tratar cada centro como una unidad operativa real, no como una etiqueta administrativa.

## 1.3 Scope de acceso

Salvo el dueño de la organización, todos los usuarios operan dentro de uno o más scopes asignados. Un scope puede ser toda la organización o un subconjunto de centros. Esta definición es crítica porque determina qué usuarios, pacientes, recursos y acciones son visibles para cada actor. El sistema no debe mezclar scopes de forma implícita. Toda vista, búsqueda, acción o auditoría debe estar filtrada por el alcance efectivo del usuario.

## 1.4 Recursos organizacionales compartidos y locales

La organización puede definir recursos a nivel global y luego habilitarlos en uno o varios centros. Esto aplica especialmente a tratamientos, reglas de habilitación, tipos de recursos, productos y ciertos catálogos. En cambio, el stock y los equipos tienen una ubicación física actual, por lo que siempre deben estar asociados a un centro presente, aunque puedan moverse entre centros. El sistema necesita diferenciar claramente lo “global” de lo “local” para evitar inconsistencias operativas.

# 2. Roles organizacionales y alcances

## 2.1 Dueño de la organización

El dueño de la organización posee acceso total a toda la estructura. Puede crear cualquier usuario, asignar roles, operar sobre todos los centros, revisar trazabilidad, definir reglas y administrar el negocio de punta a punta. Es el único rol que siempre tiene alcance transversal por definición.

## 2.2 Administrador de centro

El administrador de centro puede tener permisos equivalentes al dueño dentro de los centros que se le asignan, pero nunca fuera de ellos. Puede crear usuarios dentro de su alcance, gestionar recursos operativos, revisar alertas, tomar decisiones administrativas y mantener la operación del centro. Si la organización no utiliza este rol, dichas funciones recaen en el dueño o en el staff administrativo según configuración.

## 2.3 Staff administrativo

El staff administrativo gestiona agenda, pacientes, cobros y controles operativos de stock y catálogo, pero no debería acceder a la totalidad del contenido clínico sensible. Puede interactuar con turnos y pacientes desde una perspectiva operativa, comercial y administrativa. En la experiencia del producto, este rol no debe heredar la profundidad clínica del médico.

## 2.4 Médico de organización

El médico dentro de organización trabaja sobre su agenda y sus pacientes asignados, tal como lo hace un médico independiente en su centro propio. La diferencia fundamental es que no suele operar el cobro y que puede moverse entre centros de la misma organización según sus asignaciones. El sistema debe procurar que esta diferencia afecte lo menos posible su experiencia clínica diaria.

## 2.5 Técnicos y auditores internos

La organización puede contar con técnicos y auditores propios. Su comportamiento funcional es equivalente al de sus versiones independientes, pero con acceso permanente o preconfigurado a determinados centros o a toda la organización, según diseño interno.

# 3. Permisos, visibilidad y modelo RBAC

## 3.1 Principio general

La plataforma utiliza permisos y scopes para determinar qué ve y qué puede hacer cada rol. A nivel de experiencia, el RBAC no debe sentirse como un sistema técnico de permisos sino como una simplificación contextual de la interfaz. El usuario debería ver solo lo que necesita para trabajar dentro de su alcance.

## 3.2 Permisos funcionales vs. visibilidad de interfaz

No basta con que el backend restrinja acciones. El frontend debe estar diseñado para no exponer navegación, botones o bloques que no correspondan al rol. La experiencia ideal es que el sistema ya llegue recortado mentalmente para ese usuario, sin obligarlo a interpretar límites.

## 3.3 Contenido sensible del historial

Una regla importante ya fijada es que el staff administrativo y los roles no clínicos no deberían acceder al contenido multimedia sensible del historial ni a las notas clínicas profundas. El backend actual no está alineado todavía con esta definición y deberá ser corregido. El documento funcional del proyecto debe tratar esta restricción como una decisión de producto consolidada, no como una preferencia opcional.

## 3.4 Historial resumido para roles no médicos

Para administrativos y administradores de centro debe existir una vista resumida del historial del paciente, útil para operar turnos y cobros, pero sin exponer material clínico sensible. Esa vista aún no está implementada y constituye una necesidad clara del producto.

# 4. Habilitaciones profesionales y reglas de operación

## 4.1 Certificaciones y habilitaciones

La plataforma contempla que ciertos tratamientos o equipos exijan certificados o habilitaciones específicas. Esto es especialmente importante en láseres y aparatología avanzada. La organización puede definir estas exigencias y el sistema debe impedir que un turno sea agendado con un profesional no habilitado.

## 4.2 Impacto en la agenda

La habilitación no es solo un dato documental. Tiene impacto operativo directo en la disponibilidad real de profesionales para tratamientos concretos. El sistema no debería mostrar profesionales no habilitados para procedimientos que exigen una certificación determinada.

## 4.3 UX recomendada

Desde la experiencia de usuario, estas reglas deben sentirse preventivas y claras, no punitivas ni técnicas. Cuando un tratamiento no puede ser asignado por falta de habilitación, el sistema debe resolverlo aguas arriba, evitando mostrar opciones inválidas siempre que el backend lo permita.

# 5. Equipos, ubicación y trazabilidad física

## 5.1 Equipos como recursos físicos vivos

Cada equipo tiene una ubicación física actual y un estado operativo. Puede estar disponible, reservado, trasladado, en service o inactivo. En organizaciones con múltiples centros, esto es central para evitar agendados inválidos y para poder auditar movimientos.

## 5.2 Traslados entre centros

Los equipos pueden trasladarse entre centros. Estos traslados deben quedar programados y trazados. El sistema debe saber dónde se encuentra cada equipo en cada momento para condicionar la agenda correctamente.

## 5.3 Services técnicos

Cuando un equipo se envía a service, deja de estar disponible para agenda. Aunque el front técnico quedará fuera del alcance principal por ahora, esta realidad operativa debe estar reflejada en el modelo funcional del producto, porque afecta agenda, alertas y experiencia de médicos y organizaciones.

# 6. Stock, insumos y productos en organizaciones

## 6.1 Diferencia entre insumos y productos

Los insumos son recursos de uso interno requeridos por tratamientos o equipos. Los productos son artículos comerciales que el profesional u organización puede vender al paciente. Ambos requieren control de stock, pero su lógica de uso y de interfaz no es la misma.

## 6.2 Stock local por centro

El stock se considera local al centro en el que físicamente se encuentra. Puede trasladarse entre centros, pero siempre debe existir una ubicación actual real.

## 6.3 Proyección y alertas

El backend ya calcula consumo proyectado en ciertos puntos, pero todavía no persiste reservas duras por turno. Desde producto, la visión correcta es que el sistema anticipe faltantes y vencimientos sin obligar al médico a pensar manualmente en ellos.

## 6.4 UX recomendada para roles clínicos

El médico no debería administrar stock en su día a día, salvo excepciones. Debe recibir solo las alertas mínimas necesarias. Los administrativos y dueños, en cambio, sí pueden necesitar vistas de control más completas.

# 7. Auditoría, trazabilidad y control

## 7.1 Trazabilidad como capacidad estructural

La plataforma no debe limitarse a registrar datos finales. Debe dejar trazabilidad de acciones: quién hizo qué, cuándo, en qué scope y sobre qué entidad. Esto aplica a agenda, pacientes, stock, equipos, habilitaciones, órdenes, facturación y grants de auditoría.

## 7.2 Auditoría operativa y auditoría externa

Existe una diferencia entre auditoría operativa interna y auditoría realizada por un auditor independiente o externo. Para estos últimos, el acceso debe estar regido por grants temporales o alcances específicos.

## 7.3 AuditGrant

El backend ya contempla AuditGrant como concepto para acceso de auditoría. Aunque el front de auditoría no será prioritario en esta fase, el proyecto lo considera una capacidad estructural relevante.

## 7.4 Experiencia de auditoría

La experiencia de auditoría debe centrarse en evidencia, trazabilidad y revisión guiada, no en operación clínica ni administrativa cotidiana. Esta decisión afecta el diseño futuro del rol auditor.

# 8. Integraciones y visión futura de ecosistema

## 8.1 Portal de pacientes

Una expansión estratégica central del producto es el portal de pacientes. Desde allí, los pacientes podrán gestionar turnos, ver historial, descubrir profesionales, acceder a tratamientos, comprar productos y eventualmente cargar comprobantes o documentación.

## 8.2 Compartición de historial entre profesionales

El producto prevé que, con autorización del paciente, un nuevo profesional pueda acceder a información relevante del historial previo para continuar tratamientos con mayor contexto. El backend todavía no modela formalmente esta autorización y deberá incorporarlo en el MVP o evolución inmediata.

## 8.3 Proveedores y laboratorios

A futuro, se prevé la incorporación de proveedores y laboratorios para publicar catálogos, permitir pedidos de compra dentro del ecosistema y consolidar una red comercial y operativa integrada.

## 8.4 Asistentes virtuales y entorno inteligente

La visión a largo plazo incluye la integración con asistentes virtuales con voz y pantalla, como Amazon Echo Show y dispositivos equivalentes. Esto permitiría agendar turnos, consultar historial, mostrar antes y después, registrar acciones por voz y controlar el entorno del consultorio. Esta visión posiciona a la plataforma como un sistema operativo del trabajo estético, no simplemente como un software de gestión.

## 8.5 Control del entorno del consultorio

En etapas posteriores, el sistema podría gobernar aspectos del entorno físico, como iluminación ambiente, configuración de escena o interacción con dispositivos conectados, según el tipo de tratamiento.

# 9. Principios rectores de experiencia de usuario

## 9.1 El producto vende experiencia, no solo funcionalidad

La plataforma debe sentirse como una experiencia que reduce carga mental y operativa. La promesa no es “tener más módulos”, sino “hacer que el trabajo sea más simple, claro y asistido”.

## 9.2 Navegación por modo de trabajo, no por estructura técnica

Una de las decisiones más importantes del proyecto es evitar que la navegación principal refleje los dominios técnicos del backend. En especial para médicos, la experiencia debe organizarse por momento operativo: qué tengo ahora, qué debo resolver, qué sigue después.

## 9.3 Mobile first para médicos y pacientes

Los médicos y pacientes operarán mayormente desde teléfonos. Por eso, la experiencia principal debe diseñarse mobile-first. Desktop será central para staff, administradores y algunos roles de control, pero no debe dictar la experiencia principal del producto.

## 9.4 Contexto progresivo y foco

Las pantallas críticas no deben mostrar todo. Deben priorizar el siguiente paso útil, los pendientes relevantes y la continuidad mínima necesaria. Menos bloques compitiendo, más contexto progresivo.

## 9.5 El sistema debe acompañar, no interrumpir

Especialmente en el caso del médico, el sistema no debe obligar a “navegar por software” durante una sesión. Debe presentarse como una capa de soporte contextual que acompaña la operación clínica.

# 10. Estado actual del proyecto y deudas conocidas

## 10.1 Backend sólido pero incompleto en experiencia asistida

El backend actual cubre muchas validaciones y estructuras base, pero todavía no expone todas las entidades compuestas ideales para una experiencia frontend excelente. Faltan, por ejemplo, sugerencia de próximo turno, preparación consolidada del próximo turno, disponibilidad ya filtrada por equipo y ciertas restricciones de visibilidad clínica.

## 10.2 Front en fase de redefinición

El frontend se encuentra en fase de rediseño funcional. Antes de integrar definitivamente con backend, se decidió construir un prototipo mockeado navegable para validar flujos, jerarquía de pantallas y experiencia real de uso.

## 10.3 Prioridad de diseño

La prioridad inmediata de diseño es: médico independiente, luego staff administrativo, luego dueños y admins de organización, luego pacientes. Técnicos y auditores quedan fuera del foco principal del front en esta etapa, aunque sus conceptos ya existen en el backend.

# 11. Glosario funcional

## 11.1 Appointment / Turno

Reserva temporal que vincula paciente, profesional, centro, tratamiento y horario.

## 11.2 ClinicalSession / Sesión clínica

Entidad operativa real de atención vinculada al turno. Tiene estados, notas, consentimientos y artefactos.

## 11.3 Treatment / Tratamiento

Procedimiento clínico o estético que define duración, frecuencia y requisitos asociados.

## 11.4 Equipment / Equipo

Recurso físico utilizado en tratamientos, con ubicación, estado y trazabilidad.

## 11.5 Supply / Insumo

Elemento consumible de uso interno requerido por tratamientos o por equipos.

## 11.6 Product / Producto

Artículo comercial que puede venderse al paciente, fuera del servicio clínico principal.

## 11.7 SaleOrder / Orden de venta o cobro

Entidad económica que agrupa la línea del tratamiento realizado y, eventualmente, productos agregados.

## 11.8 Payment / Pago

Registro de un medio de pago concreto aplicado a una orden.

## 11.9 ConsentRecord / Consentimiento

Constancia del consentimiento informado requerido para una sesión.

## 11.10 SessionMedia / Media de sesión

Fotos o artefactos multimedia asociados a una sesión clínica.

## 11.11 Scope

Alcance organizacional o por centro que delimita visibilidad y permisos.

## 11.12 AuditGrant

Concesión de acceso de auditoría para un actor externo o no permanente.