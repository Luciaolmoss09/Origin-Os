import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { token, name, email, password } = await request.json()

    if (!token || !name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios." },
        { status: 400 }
      )
    }

    // Find activation link
    const activationLink = await prisma.activationLink.findUnique({
      where: { token },
    })

    if (!activationLink) {
      return NextResponse.json(
        { error: "Enlace de invitación no válido." },
        { status: 404 }
      )
    }

    if (activationLink.linkStatus === "registered") {
      return NextResponse.json(
        { error: "Este enlace ya fue utilizado." },
        { status: 400 }
      )
    }

    if (
      activationLink.expiresAt &&
      new Date() > activationLink.expiresAt
    ) {
      return NextResponse.json(
        { error: "Este enlace ha expirado. Solicita uno nuevo." },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: activationLink.roleAssigned,
          status: "active",
        },
      })

      // Create workspace access if client has a clientId
      if (activationLink.clientId) {
        await tx.workspaceAccess.create({
          data: {
            userId: user.id,
            accessType: "client_portal",
            clientId: activationLink.clientId,
            projectId: activationLink.projectId,
            roleScope: activationLink.roleAssigned,
            mode: "limited",
            status: "active",
          },
        })
      }

      // Update activation link
      await tx.activationLink.update({
        where: { id: activationLink.id },
        data: {
          linkStatus: "registered",
          registeredAt: new Date(),
          targetUserId: user.id,
        },
      })

      return user
    })

    return NextResponse.json({ success: true, userId: result.id })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
