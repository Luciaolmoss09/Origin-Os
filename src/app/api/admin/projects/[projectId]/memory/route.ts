import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { projectId } = await params
    const memory = await prisma.internalCaseMemory.findUnique({
      where: { projectId },
    })

    return NextResponse.json(memory || {})
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la memoria interna" }, { status: 500 })
  }
}
