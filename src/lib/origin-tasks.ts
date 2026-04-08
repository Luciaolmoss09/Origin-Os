import { TaskVisibility, TaskPriority, ProjectPhase } from "@prisma/client"

export interface OriginTaskTemplate {
  phaseKey: ProjectPhase
  title: string
  description: string
  priority: TaskPriority
  visibility: TaskVisibility
  taskType: string
}

export const ORIGIN_TASK_TEMPLATES: OriginTaskTemplate[] = [
  // ── FASE 1: Activación & Onboarding ────────────────────────────────────────
  { phaseKey: "fase_1", title: "Completar formulario de onboarding", description: "Rellenar el cuestionario de bienvenida con datos del negocio, audiencia, historial de lanzamientos y resultados previos.", priority: "alta", visibility: "client_visible", taskType: "onboarding" },
  { phaseKey: "fase_1", title: "Firmar contrato de servicio", description: "Revisar y firmar el contrato de colaboración con Origin Agency.", priority: "critica", visibility: "client_visible", taskType: "admin" },
  { phaseKey: "fase_1", title: "Confirmar acceso a Drive de trabajo", description: "Aceptar invitación a la carpeta compartida de Google Drive con toda la documentación del proyecto.", priority: "alta", visibility: "client_visible", taskType: "admin" },
  { phaseKey: "fase_1", title: "Reunión de kickoff — presentación del sistema Origin", description: "Sesión de bienvenida donde se explica el flujo de las 8 fases, herramientas de trabajo, canales de comunicación y expectativas.", priority: "alta", visibility: "client_visible", taskType: "reunion" },
  { phaseKey: "fase_1", title: "Configurar acceso a herramientas (Notion / Suite)", description: "Dar de alta al cliente en las herramientas de gestión del lanzamiento: Notion, portal Origin, grupos de comunicación.", priority: "media", visibility: "internal_only", taskType: "setup" },
  { phaseKey: "fase_1", title: "Configurar perfil en Origin OS", description: "Crear el perfil del cliente en la plataforma con su marca, nicho, tipo de lanzamiento inicial y fecha de inicio.", priority: "alta", visibility: "internal_only", taskType: "setup" },

  // ── FASE 2: Diagnóstico Estratégico ────────────────────────────────────────
  { phaseKey: "fase_2", title: "Auditoría del perfil de Instagram y redes", description: "Análisis del perfil público: bio, feed, highlights, engagement rate, consistencia de marca y posicionamiento percibido.", priority: "alta", visibility: "internal_only", taskType: "analisis" },
  { phaseKey: "fase_2", title: "Análisis de audiencia existente (Customer Dev)", description: "Revisar estadísticas, hacer 3-5 entrevistas de customer development con clientes/seguidores para detectar lenguaje real, dolores y deseos.", priority: "critica", visibility: "internal_only", taskType: "investigacion" },
  { phaseKey: "fase_2", title: "Análisis de competidores principales", description: "Mapear 3-5 competidores: oferta, precio, mecanismo, posicionamiento y brecha de oportunidad.", priority: "alta", visibility: "internal_only", taskType: "investigacion" },
  { phaseKey: "fase_2", title: "Definir tesis estratégica del lanzamiento", description: "Consolidar el diagnóstico en una tesis: problema central, mecanismo único, ángulo de lanzamiento y promesa principal.", priority: "critica", visibility: "internal_only", taskType: "estrategia" },
  { phaseKey: "fase_2", title: "Reunión de diagnóstico — presentar hallazgos al cliente", description: "Presentar los resultados del diagnóstico estratégico, la tesis propuesta y el plan de lanzamiento recomendado.", priority: "alta", visibility: "client_visible", taskType: "reunion" },
  { phaseKey: "fase_2", title: "Validar tipo de lanzamiento definitivo", description: "Acordar con el cliente el tipo de lanzamiento a ejecutar (Webinar, Challenge, Express 15d, etc.) basado en el diagnóstico.", priority: "critica", visibility: "client_visible", taskType: "decision" },

  // ── FASE 3: Arquitectura Estratégica ───────────────────────────────────────
  { phaseKey: "fase_3", title: "Diseñar oferta irresistible", description: "Definir nombre, promesa, mecanismo, formato, precio, bonus y garantía del programa/producto a lanzar.", priority: "critica", visibility: "internal_only", taskType: "estrategia" },
  { phaseKey: "fase_3", title: "Construir Avatar del comprador ideal", description: "Perfil detallado del cliente ideal: datos demográficos, dolores, deseos, objeciones, lenguaje y triggers de compra.", priority: "alta", visibility: "internal_only", taskType: "estrategia" },
  { phaseKey: "fase_3", title: "Desarrollar narrativa y Big Idea del lanzamiento", description: "Definir la narrativa central: gran idea, problema que resuelve, nueva creencia, historia del mecanismo y prueba social.", priority: "critica", visibility: "internal_only", taskType: "copywriting" },
  { phaseKey: "fase_3", title: "Planificar calendario de contenido por fase", description: "Diseñar el calendario editorial completo de siembra, calentamiento y conversión con los formatos y fechas de cada pieza.", priority: "alta", visibility: "internal_only", taskType: "planificacion" },
  { phaseKey: "fase_3", title: "Validar arquitectura estratégica con cliente", description: "Sesión de revisión de la arquitectura completa: oferta, avatar, narrativa y calendario. Obtener aprobación antes de producción.", priority: "critica", visibility: "client_visible", taskType: "reunion" },

  // ── FASE 4: Producción & Setup ─────────────────────────────────────────────
  { phaseKey: "fase_4", title: "Producir scripts de contenido de siembra", description: "Escribir guiones para reels, carruseles y stories de la fase de siembra según la narrativa aprobada.", priority: "alta", visibility: "internal_only", taskType: "produccion" },
  { phaseKey: "fase_4", title: "Crear página de ventas o landing page", description: "Diseñar y maquetar la página de ventas con copywriting optimizado, testimonios, oferta y CTA de conversión.", priority: "critica", visibility: "internal_only", taskType: "setup" },
  { phaseKey: "fase_4", title: "Configurar checkout y sistema de pago", description: "Conectar plataforma de pago (Stripe, HotMart, ThriveCart, etc.), validar flujo de compra y confirmación automática.", priority: "critica", visibility: "internal_only", taskType: "setup" },
  { phaseKey: "fase_4", title: "Preparar secuencia de emails (preventa y post-compra)", description: "Escribir y programar secuencias de email marketing: nurturing previo al evento, recordatorios y bienvenida post-compra.", priority: "alta", visibility: "internal_only", taskType: "produccion" },
  { phaseKey: "fase_4", title: "Cliente: grabar contenido de siembra (ronda 1)", description: "El cliente graba los reels y stories de siembra siguiendo los scripts proporcionados. Entregar en carpeta compartida.", priority: "alta", visibility: "client_visible", taskType: "produccion" },
  { phaseKey: "fase_4", title: "Revisión y aprobación de materiales de producción", description: "Revisar todos los activos producidos (copies, landing, scripts) y dar feedback antes de lanzar.", priority: "alta", visibility: "client_visible", taskType: "revision" },

  // ── FASE 5: Siembra & Calentamiento ────────────────────────────────────────
  { phaseKey: "fase_5", title: "Publicar contenido de siembra semana 1", description: "Subir y publicar los contenidos de siembra: posts de posicionamiento, historias de autoridad y reels de problema/solución.", priority: "alta", visibility: "client_visible", taskType: "publicacion" },
  { phaseKey: "fase_5", title: "Activar campaña de anuncios de siembra (si aplica)", description: "Lanzar campañas de Meta/IG Ads de siembra para amplificar alcance orgánico hacia audiencia fría.", priority: "media", visibility: "internal_only", taskType: "ads" },
  { phaseKey: "fase_5", title: "Ejecutar estrategia de calentamiento en DM/Stories", description: "Iniciar conversaciones estratégicas en DMs, polls en stories, preguntas que activen la audiencia y generen anticipación.", priority: "alta", visibility: "client_visible", taskType: "engagement" },
  { phaseKey: "fase_5", title: "Publicar contenido de calentamiento semana 2", description: "Contenido de calentamiento: prueba social, behind the scenes, objeciones + respuestas, mecanismo en acción.", priority: "alta", visibility: "client_visible", taskType: "publicacion" },
  { phaseKey: "fase_5", title: "Seguimiento de métricas de siembra (reach, engagement, leads)", description: "Monitorear semanalmente: alcance, engagement, nuevos seguidores, leads capturados y temperatura de la audiencia.", priority: "media", visibility: "internal_only", taskType: "analisis" },

  // ── FASE 6: Conversión ─────────────────────────────────────────────────────
  { phaseKey: "fase_6", title: "Lanzar evento/mecanismo de conversión", description: "Ejecutar el evento central del lanzamiento: webinar, challenge, masterclass o apertura de DM launch según tipo acordado.", priority: "critica", visibility: "client_visible", taskType: "evento" },
  { phaseKey: "fase_6", title: "Publicar contenido de conversión (apertura carrito)", description: "Secuencia de contenido: apertura de carrito, urgencia, testimonios en tiempo real, historias de objeciones resueltas.", priority: "critica", visibility: "client_visible", taskType: "publicacion" },
  { phaseKey: "fase_6", title: "Activar campaña de ads de conversión", description: "Escalar inversión en Meta Ads con creativos de conversión directa: retargeting de audiencia caliente y lookalike.", priority: "alta", visibility: "internal_only", taskType: "ads" },
  { phaseKey: "fase_6", title: "Gestionar DMs de prospects calientes", description: "Responder DMs de interesados, manejar objeciones en tiempo real, guiar hacia la página de ventas o agendar llamada.", priority: "critica", visibility: "client_visible", taskType: "ventas" },
  { phaseKey: "fase_6", title: "Seguimiento diario de ventas y métricas de conversión", description: "Revisar dashboard cada día: ventas totales, revenue, conversión, tickets promedio y ROI de ads.", priority: "alta", visibility: "internal_only", taskType: "analisis" },
  { phaseKey: "fase_6", title: "Ejecutar secuencia de cierre de carrito (últimas 24h)", description: "Publicar contenido de urgencia en las últimas 24h: recordatorio de cierre, historia de resultados, email de last call.", priority: "critica", visibility: "client_visible", taskType: "ventas" },

  // ── FASE 7: Cierre & Resultados ────────────────────────────────────────────
  { phaseKey: "fase_7", title: "Cerrar carrito y comunicar resultados a la audiencia", description: "Anunciar el cierre oficial del lanzamiento, agradecer a compradores y mantener la marca para futuros clientes.", priority: "alta", visibility: "client_visible", taskType: "comunicacion" },
  { phaseKey: "fase_7", title: "Recopilar resultados finales del lanzamiento", description: "Consolidar métricas definitivas: total de ventas, revenue, ROI de ads, leads generados, conversión y KPIs pactados.", priority: "critica", visibility: "internal_only", taskType: "analisis" },
  { phaseKey: "fase_7", title: "Reunión de cierre y entrega de reporte de resultados", description: "Sesión de cierre con el cliente: revisión de resultados vs objetivos, celebración de logros y análisis de gaps.", priority: "alta", visibility: "client_visible", taskType: "reunion" },
  { phaseKey: "fase_7", title: "Gestionar bienvenida a nuevos compradores", description: "Enviar email de bienvenida, dar acceso al programa, configurar grupos y asegurarse de que el onboarding del alumno sea perfecto.", priority: "alta", visibility: "client_visible", taskType: "admin" },
  { phaseKey: "fase_7", title: "Recopilar testimonios y capturas de ventas", description: "Solicitar testimonios en video/texto a los primeros compradores para reutilizar en futuros lanzamientos.", priority: "media", visibility: "client_visible", taskType: "produccion" },

  // ── FASE 8: Aprendizaje & Continuidad ─────────────────────────────────────
  { phaseKey: "fase_8", title: "Análisis post-lanzamiento profundo", description: "Análisis completo: qué funcionó, qué no funcionó, objeciones más frecuentes, contenido con mayor conversión y lecciones clave.", priority: "alta", visibility: "internal_only", taskType: "analisis" },
  { phaseKey: "fase_8", title: "Documentar framework del lanzamiento en Knowledge Base", description: "Registrar el playbook específico de este lanzamiento: ángulo ganador, copies que convirtieron, secuencia óptima.", priority: "media", visibility: "internal_only", taskType: "documentacion" },
  { phaseKey: "fase_8", title: "Planificar siguiente lanzamiento o continuidad", description: "Acordar con el cliente el plan de continuidad: upsell al siguiente nivel, relanzamiento, lanzamiento evergreen o nueva temporada.", priority: "alta", visibility: "client_visible", taskType: "planificacion" },
  { phaseKey: "fase_8", title: "Reunión de estrategia — roadmap próximo trimestre", description: "Sesión estratégica para definir el roadmap de los próximos 90 días: objetivos, hitos, tipo de lanzamiento siguiente.", priority: "alta", visibility: "client_visible", taskType: "reunion" },
  { phaseKey: "fase_8", title: "Configurar sistema de retargeting y evergreen", description: "Activar campañas evergreen o retargeting automatizado para captar compradores que no cerraron en el lanzamiento.", priority: "media", visibility: "internal_only", taskType: "ads" },
]
