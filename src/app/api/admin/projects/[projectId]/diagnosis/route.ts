import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { projectId } = await params
    const { 
      thesisSummary, 
      mechanismSummary, 
      launchAngle, 
      clientDescription, 
      viabilityDiagnosis 
    } = await request.json()

    const strategicProfile = await prisma.strategicProfile.upsert({
      where: { projectId },
      update: {
        thesisSummary,
        mechanismSummary,
        launchAngle,
        clientDescription,
        viabilityDiagnosis,
        strategyStatus: "aprobada"
      },
      create: {
        projectId,
        thesisSummary,
        mechanismSummary,
        launchAngle,
        clientDescription,
        viabilityDiagnosis,
        strategyStatus: "aprobada"
      }
    })

    return NextResponse.json(strategicProfile)
  } catch (error) {
    console.error("Diagnosis save error:", error)
    return NextResponse.json({ error: "Error al guardar el diagnóstico" }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { projectId } = await params
    const profile = await prisma.strategicProfile.findUnique({
      where: { projectId }
    })

    return NextResponse.json(profile || {})
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 })
  }
}
