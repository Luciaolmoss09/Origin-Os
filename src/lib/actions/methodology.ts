"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ProjectPhase } from "@prisma/client"

export type MasterTask = {
  title: string
  phaseKey: ProjectPhase
  priority: "alta" | "critica" | "media" | "baja"
  visibility: "client_visible" | "internal_only"
  description?: string
}

const MASTER_TASKS: MasterTask[] = [
  // FASE 1: ACTIVACIÓN
  { title: "Resumen de cierre registrado", phaseKey: "fase_1", priority: "media", visibility: "internal_only" },
  { title: "Acuerdos del caso por escrito", phaseKey: "fase_1", priority: "alta", visibility: "internal_only" },
  { title: "Contrato preparado y revisado", phaseKey: "fase_1", priority: "critica", visibility: "internal_only" },
  { title: "Firma de contrato validada", phaseKey: "fase_1", priority: "critica", visibility: "client_visible" },
  { title: "Pago inicial validado", phaseKey: "fase_1", priority: "critica", visibility: "client_visible" },
  { title: "Panel del cliente activo y revisado", phaseKey: "fase_1", priority: "alta", visibility: "internal_only" },
  { title: "Email de bienvenida enviado", phaseKey: "fase_1", priority: "alta", visibility: "client_visible" },

  // FASE 2: ONBOARDING
  { title: "Formulario situación actual completado", phaseKey: "fase_2", priority: "alta", visibility: "client_visible" },
  { title: "Definición de objetivo principal", phaseKey: "fase_2", priority: "critica", visibility: "client_visible" },
  { title: "Handoff interno de activos", phaseKey: "fase_2", priority: "media", visibility: "internal_only" },
  { title: "Acceso a herramientas facilitado (IG/Ads)", phaseKey: "fase_2", priority: "alta", visibility: "client_visible" },

  // FASE 3: ENTREVISTA P.
  { title: "Definición de Avatar Estratégico", phaseKey: "fase_3", priority: "critica", visibility: "client_visible" },
  { title: "Mapping de Narrativa y Big Idea", phaseKey: "fase_3", priority: "critica", visibility: "client_visible" },
  { title: "Arquitectura de Oferta Irresistible", phaseKey: "fase_3", priority: "critica", visibility: "client_visible" },

  // FASE 4: ANÁLISIS AUD.
  { title: "Auditoría de audiencia actual", phaseKey: "fase_4", priority: "alta", visibility: "client_visible" },
  { title: "Identificación de 3 dolores principales", phaseKey: "fase_4", priority: "alta", visibility: "client_visible" },
  { title: "Análisis de competidores (VLAD Engine)", phaseKey: "fase_4", priority: "media", visibility: "internal_only" },

  // FASE 8: CONVERSIÓN MASTERY (ADS)
  { title: "Set-up técnico de Meta Ads", phaseKey: "fase_8", priority: "critica", visibility: "internal_only" },
  { title: "Lanzamiento de campaña de conversión", phaseKey: "fase_8", priority: "critica", visibility: "client_visible" },
  { title: "Sincronización de reporte de ROI", phaseKey: "fase_8", priority: "alta", visibility: "client_visible" },
]

export async function initializeProjectMethodology(projectId: string) {
  try {
    // 1. Get the project to check which tasks already exist
    const existingTasks = await prisma.task.findMany({
      where: { projectId },
      select: { title: true }
    })
    const existingTitles = new Set(existingTasks.map(t => t.title))

    // 2. Filter tasks that don't exist yet
    const tasksToCreate = MASTER_TASKS.filter(mt => !existingTitles.has(mt.title))

    if (tasksToCreate.length === 0) return { success: true, message: "La metodología ya estaba inicializada." }

    // 3. Create tasks
    await prisma.task.createMany({
      data: tasksToCreate.map(mt => ({
        projectId,
        ...mt,
        status: "pendiente"
      }))
    })

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/portal/${projectId}`)

    return { 
      success: true, 
      message: `Metodología inicializada: ${tasksToCreate.length} tareas maestras creadas.` 
    }
  } catch (error) {
    console.error("Methodology Initialization Error:", error)
    return { success: false, error: "Error al inyectar la metodología Origin" }
  }
}
