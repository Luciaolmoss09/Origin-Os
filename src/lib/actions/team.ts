"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function inviteCollaborator(data: {
  email: string
  name: string
  role: string
}) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { success: false, error: "Este colaborador ya está registrado." }
    }

    // In a real scenario, we'd use Resend here to send an email with an activation link.
    // For now, we'll create the user with a 'pendiente' status (if we had that field) 
    // or just create it with a random password and notify the admin.
    
    // Let's create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role as any,
        password: Math.random().toString(36).slice(-10), // Placeholder password
      }
    })

    // Notify about new team member
    await createNotification({
      userId: "system",
      title: "Nuevo Colaborador Invitado",
      message: `${data.name} (${data.role}) ha sido invitado al equipo.`,
      type: "info",
      link: "/settings"
    })

    revalidatePath("/settings")
    return { success: true, user }
  } catch (error: any) {
    console.error("Invite Error:", error)
    return { success: false, error: error.message }
  }
}
