"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createNotification(data: {
  userId: string
  title: string
  message: string
  type?: string
  link?: string
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "info",
        link: data.link,
      },
    })

    revalidatePath("/") // Usually top level to update counters
    return { success: true, notification }
  } catch (error: any) {
    console.error("Create Notification Error:", error)
    return { success: false, error: error.message }
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Mark Read Error:", error)
    return { success: false, error: error.message }
  }
}

export async function getUnreadCount(userId: string) {
  try {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    })
    return count
  } catch (error) {
    return 0
  }
}
