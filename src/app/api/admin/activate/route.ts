import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const { clientId, email, name, projectId } = await request.json()

    if (!clientId || !email || !name) {
      return NextResponse.json(
        { error: "clientId, email y name son obligatorios." },
        { status: 400 }
      )
    }

    // Verify client exists
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) {
      return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 })
    }

    // Find admin user to set as creator
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!adminUser) {
      return NextResponse.json({ error: "Usuario admin no encontrado." }, { status: 404 })
    }

    // Generate unique token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const activationLink = await prisma.activationLink.create({
      data: {
        token,
        email,
        name,
        linkType: "client",
        roleAssigned: "client",
        clientId,
        projectId: projectId ?? null,
        linkStatus: "sent",
        sentAt: new Date(),
        expiresAt,
        createdById: adminUser.id,
      },
    })

    const registrationUrl = `${process.env.NEXTAUTH_URL}/register/${token}`

    return NextResponse.json({
      success: true,
      registrationUrl,
      token: activationLink.token,
      expiresAt,
    })
  } catch (error) {
    console.error("Activate error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
