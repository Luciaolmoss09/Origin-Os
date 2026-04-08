"use server"

import { prisma } from "@/lib/prisma"

export type ProjectHealth = {
  status: "normal" | "threat"
  message: string
  criticalOverdueCount: number
}

export async function getProjectHealth(projectId: string): Promise<ProjectHealth> {
  try {
    const today = new Date()
    
    // Check for critical or high priority tasks that are overdue
    const criticalOverdueTasks = await prisma.task.findMany({
      where: {
        projectId,
        status: { not: "completada" },
        priority: { in: ["critica", "alta"] },
        dueDate: { lt: today }
      }
    })

    if (criticalOverdueTasks.length > 0) {
      return {
        status: "threat",
        message: `Amenaza Detectada: ${criticalOverdueTasks.length} tarea(s) crítica(s) fuera de plazo.`,
        criticalOverdueCount: criticalOverdueTasks.length
      }
    }

    return {
      status: "normal",
      message: "Trayectoria en Curso",
      criticalOverdueCount: 0
    }
  } catch (error) {
    console.error("Fetch Project Health Error:", error)
    return {
      status: "normal",
      message: "Error al calcular estatus",
      criticalOverdueCount: 0
    }
  }
}
