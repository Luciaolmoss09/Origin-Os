"use server"

import { prisma } from "@/lib/prisma"
import { MeetingStatus, TaskVisibility, UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notifications"

export async function createMeeting(data: {
  projectId: string
  meetingType: string
  scheduledAt: Date
  notes?: string
  visibility?: TaskVisibility
  url?: string
  targetRole?: UserRole
}) {
  try {
    const meeting = await prisma.meeting.create({
      data: {
        projectId: data.projectId,
        meetingType: data.meetingType,
        scheduledAt: data.scheduledAt,
        notes: data.notes,
        visibility: data.visibility || "internal_only",
        url: data.url,
        status: "programada" as MeetingStatus,
      } as any,
    })

    revalidatePath("/calendar")
    revalidatePath(`/projects/${data.projectId}`)

    // Notify about new meeting
    await createNotification({
      userId: "system",
      title: "Nueva Reunión Programada",
      message: `Reunión: ${data.meetingType} - Dirigida a: ${data.targetRole || 'Todos'}`,
      type: "meeting",
      link: `/calendar`
    })

    return { success: true, meeting }
  } catch (error: any) {
    console.error("Create Meeting Error:", error)
    return { success: false, error: error.message || "Failed to create meeting" }
  }
}

export async function updateMeetingStatus(meetingId: string, status: MeetingStatus) {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status },
    })

    revalidatePath("/calendar")
    revalidatePath(`/projects/${meeting.projectId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Update Meeting Error:", error)
    return { success: false, error: error.message || "Failed to update meeting" }
  }
}

export async function updateMeeting(meetingId: string, data: {
  meetingType?: string
  scheduledAt?: Date
  status?: MeetingStatus
  notes?: string
  url?: string
  targetRole?: UserRole
}) {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        ...data
      } as any
    })

    revalidatePath("/calendar")
    revalidatePath(`/projects/${meeting.projectId}`)
    return { success: true, meeting }
  } catch (error: any) {
    console.error("Update Meeting Error:", error)
    return { success: false, error: error.message || "Failed to update meeting" }
  }
}
