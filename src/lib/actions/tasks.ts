"use server"

import { prisma } from "@/lib/prisma"
import { ProjectPhase, TaskStatus, TaskPriority, TaskVisibility } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function createTask(data: {
  projectId: string
  phaseKey: ProjectPhase
  title: string
  description?: string
  priority?: TaskPriority
  visibility?: TaskVisibility
  dueDate?: Date
  url?: string
}) {
  try {
    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        phaseKey: data.phaseKey,
        title: data.title,
        description: data.description,
        priority: data.priority || "media",
        visibility: data.visibility || "internal_only",
        dueDate: data.dueDate,
        url: data.url,
        status: "pendiente" as TaskStatus,
      },
    })

    revalidatePath(`/projects/${data.projectId}`)
    
    // Notify about new task
    await createNotification({
      userId: "system", // Placeholder, ideally specific user
      title: "Nueva Tarea Asignada",
      message: `Se ha creado la tarea: ${data.title}`,
      type: "task",
      link: `/calendar`
    })

    return { success: true, task }
  } catch (error: any) {
    console.error("Create Task Error:", error)
    return { success: false, error: error.message || "Failed to create task" }
  }
}

export async function toggleTaskStatus(taskId: string, currentStatus: TaskStatus, projectId: string) {
  try {
    const newStatus: TaskStatus = currentStatus === "completada" ? "pendiente" : "completada"
    const now = new Date()

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        completedAt: newStatus === "completada" ? now : null,
      },
      include: { project: { select: { clientId: true } } },
    })

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/clients/${task.project.clientId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Toggle Task Error:", error)
    return { success: false, error: error.message || "Failed to update task" }
  }
}

export async function updateTask(taskId: string, data: {
  title?: string
  description?: string
  priority?: TaskPriority
  dueDate?: Date
  url?: string
  status?: TaskStatus
}) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data
      }
    })

    revalidatePath(`/projects/${task.projectId}`)
    revalidatePath("/calendar")
    return { success: true, task }
  } catch (error: any) {
    console.error("Update Task Error:", error)
    return { success: false, error: error.message || "Failed to update task" }
  }
}
