"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function simulateApiSync(projectId: string) {
  try {
    const today = new Date()
    
    // 1. Simulate Instagram Metrics (Phase 2: Instagram SDK / Apify)
    // We fetch the last snapshot to add a realistic increment
    const lastSnapshot = await prisma.metricsSnapshot.findFirst({
      where: { projectId },
      orderBy: { date: "desc" }
    })

    const followerIncrement = Math.floor(Math.random() * 50) + 10 // +10-60 followers
    const currentFollowers = (lastSnapshot?.igFollowers ?? 1000) + followerIncrement
    
    await prisma.metricsSnapshot.create({
      data: {
        projectId,
        date: today,
        igFollowers: currentFollowers,
        igReach: (lastSnapshot?.igReach ?? 5000) + Math.floor(Math.random() * 200),
        whatsappLeads: (lastSnapshot?.whatsappLeads ?? 10) + Math.floor(Math.random() * 5),
        conversionRate: 2.5 + (Math.random() * 1)
      }
    })

    // 2. Simulate Meta Ads Metrics (Phase 2: Meta Ads API)
    const campaigns = await prisma.adsCampaign.findMany({
      where: { projectId }
    })

    for (const campaign of campaigns) {
      await prisma.adsMetric.create({
        data: {
          campaignId: campaign.id,
          date: today,
          spend: 20 + Math.random() * 30, // €20-50 spend
          clicks: Math.floor(Math.random() * 100) + 50,
          leads: Math.floor(Math.random() * 10),
          revenue: Math.random() > 0.5 ? (Math.random() * 200) : 0 // Random sales
        }
      })
    }

    revalidatePath(`/portal/${projectId}`)
    revalidatePath(`/projects/${projectId}`)
    revalidatePath("/ads")

    // 3. Mark the Master Task from Methodology as completed if it exists
    await prisma.task.updateMany({
      where: { projectId, title: "Sincronización de reporte de ROI" },
      data: { status: "completada" }
    })

    return { 
      success: true, 
      message: `Sincronización completada. +${followerIncrement} seguidores detectados.` 
    }
  } catch (error) {
    console.error("Simulation Sync Error:", error)
    return { success: false, error: "Error en la sincronización de APIs" }
  }
}
