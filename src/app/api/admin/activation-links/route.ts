import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Solo admins pueden generar links de activación
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { clientId, projectId, email, roleAssigned } = await request.json()

    if (!clientId || !projectId) {
      return NextResponse.json({ error: "clientId y projectId son requeridos" }, { status: 400 })
    }

    // Generar token único de 48h
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    const activationLink = await prisma.activationLink.create({
      data: {
        token,
        clientId,
        projectId,
        email: email || null,
        roleAssigned: roleAssigned || "client",
        linkType: "client",
        expiresAt,
        createdById: session.user.id,
        linkStatus: "pending",
      },
    })

    // Construir la URL completa
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const url = `${baseUrl}/activar/${token}`

    return NextResponse.json({ url, token, expiresAt })
  } catch (error) {
    console.error("Error generating activation link:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
