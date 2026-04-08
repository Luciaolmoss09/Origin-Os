"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPendingValidations() {
  try {
    const [contentPieces, strategicProfiles, copyBlocks, assetVersions] = await Promise.all([
      prisma.contentPiece.findMany({
        where: { status: "en_revision" },
        include: { project: { select: { name: true } } },
      }),
      prisma.strategicProfile.findMany({
        where: { strategyStatus: "en_revision" },
        include: { project: { select: { name: true } } },
      }),
      prisma.copyBlock.findMany({
        where: { status: "en_revision" },
        include: { project: { select: { name: true } } },
      }),
      prisma.assetVersion.findMany({
        where: { assetStatus: "en_revision" },
        include: { project: { select: { name: true } } },
      }),
    ])

    // Normalize data for the UI
    const allValidations = [
      ...contentPieces.map(c => ({
        id: c.id,
        type: "GENT-COPY",
        title: c.title,
        project: c.project.name,
        category: "Content Piece",
        model: "contentPiece",
        date: c.createdAt,
      })),
      ...strategicProfiles.map(s => ({
        id: s.id,
        type: "STRAT-AI",
        title: "Perfiles Estratégicos y Tesis",
        project: s.project.name,
        category: "Strategic Profile",
        model: "strategicProfile",
        date: s.id, // Placeholder for date if missing
      })),
      ...copyBlocks.map(cb => ({
        id: cb.id,
        type: "GENT-COPY",
        title: cb.blockType,
        project: cb.project.name,
        category: "Copy Block",
        model: "copyBlock",
        date: cb.createdAt,
      })),
      ...assetVersions.map(av => ({
        id: av.id,
        type: "ASSET-V",
        title: `${av.assetType} V${av.version}`,
        project: av.project.name,
        category: "Asset Version",
        model: "assetVersion",
        date: av.createdAt,
      })),
    ]

    return { success: true, data: allValidations }
  } catch (error) {
    console.error("Fetch Validations Error:", error)
    return { success: false, error: "Failed to fetch pending validations" }
  }
}

export async function processValidation(id: string, model: string, decision: "approve" | "reject") {
  try {
    const status = decision === "approve" ? "aprobado" : "borrador"
    const stratStatus = decision === "approve" ? "aprobada" : "pendiente"

    switch (model) {
      case "contentPiece":
        await prisma.contentPiece.update({ where: { id }, data: { status: status as any } })
        break
      case "strategicProfile":
        const sp = await prisma.strategicProfile.update({ where: { id }, data: { strategyStatus: stratStatus as any } })
        if (decision === "approve") {
          await prisma.task.updateMany({ 
            where: { projectId: sp.projectId, title: "Definición de Avatar Estratégico" }, 
            data: { status: "completada" } 
          })
        }
        break
      case "copyBlock":
        const cb = await prisma.copyBlock.update({ where: { id }, data: { status: decision === "approve" ? "aprobado" : "borrador" } })
        if (decision === "approve") {
          await prisma.task.updateMany({ 
            where: { projectId: cb.projectId, title: "Mapping de Narrativa y Big Idea" }, 
            data: { status: "completada" } 
          })
        }
        break
      case "assetVersion":
        await prisma.assetVersion.update({ where: { id }, data: { assetStatus: decision === "approve" ? "aprobado" : "borrador" } })
        break
    }

    revalidatePath("/validations")
    return { success: true }
  } catch (error) {
    console.error("Process Validation Error:", error)
    return { success: false, error: "Failed to process validation" }
  }
}
