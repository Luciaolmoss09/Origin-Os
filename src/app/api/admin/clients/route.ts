import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LaunchType } from "@prisma/client"
import { ORIGIN_TASK_TEMPLATES } from "@/lib/origin-tasks"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const { 
      displayName, 
      brandName, 
      email, 
      phone, 
      instagram, 
      niche, 
      launchType, 
      startDate, 
      targetSales,
      closingTranscription,
      caseSummary,
      detectedObjections,
      agreedConditions,
      internalNotes,
      internalFolderUrl
    } = await request.json()

    if (!displayName || !niche || !startDate) {
      return NextResponse.json(
        { error: "displayName, niche y startDate son obligatorios." },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          displayName,
          brandName: brandName || null,
          email: email || null,
          phone: phone || null,
          instagram: instagram || null,
          niche,
          status: "activo",
        },
      })

      const project = await tx.project.create({
        data: {
          clientId: client.id,
          name: `${displayName} — ${launchType?.replace(/_/g, " ") || 'A definir'}`,
          launchType: (launchType as LaunchType) || 'a_definir',
          status: "activo",
          currentPhase: "fase_1",
          startDate: new Date(startDate),
          targetSales: targetSales || 0,
        },
      })

      // Create internal memory (The "Mud")
      await tx.internalCaseMemory.create({
        data: {
          projectId: project.id,
          closingTranscription: closingTranscription || null,
          caseSummary: caseSummary || null,
          detectedObjections: detectedObjections || null,
          agreedConditions: agreedConditions || null,
          internalNotes: internalNotes || null,
          internalFolderUrl: internalFolderUrl || null,
        }
      })

      // Create initial phase instances
      await tx.phaseInstance.createMany({
        data: [
          { projectId: project.id, phaseKey: "fase_1", status: "activa" },
          { projectId: project.id, phaseKey: "fase_2", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_3", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_4", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_5", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_6", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_7", status: "pendiente" },
          { projectId: project.id, phaseKey: "fase_8", status: "pendiente" },
        ],
      })

      // Auto-seed Origin methodology tasks
      await tx.task.createMany({
        data: ORIGIN_TASK_TEMPLATES.map((t) => ({
          projectId: project.id,
          phaseKey: t.phaseKey,
          title: t.title,
          description: t.description,
          priority: t.priority,
          visibility: t.visibility,
          taskType: t.taskType,
          status: "pendiente",
        })),
      })

      // Create strategic profile
      await tx.strategicProfile.create({
        data: { projectId: project.id, strategyStatus: "pendiente" },
      })

      return { client, project }
    })

    return NextResponse.json({
      success: true,
      clientId: result.client.id,
      projectId: result.project.id,
    })
  } catch (error) {
    console.error("Create client error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
