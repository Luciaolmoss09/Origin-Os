import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Token no proporcionado" }, { status: 400 })
  }

  const link = await prisma.activationLink.findUnique({
    where: { token },
    include: { client: true }
  })

  if (!link || link.linkStatus !== "pending") {
    return NextResponse.json({ error: "Enlace inválido o ya utilizado" }, { status: 400 })
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.json({ error: "El enlace ha expirado (48h)" }, { status: 400 })
  }

  return NextResponse.json({ 
    email: link.email || "", 
    name: link.name || link.client?.displayName || ""
  })
}

export async function POST(request: Request) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const link = await prisma.activationLink.findUnique({
      where: { token },
      include: { client: true, project: true }
    })

    if (!link || link.linkStatus !== "pending") {
      return NextResponse.json({ error: "Enlace inválido" }, { status: 400 })
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      return NextResponse.json({ error: "El enlace ha expirado" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Transacción atómica: crear usuario, acceso y notificación admin
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el usuario cliente
      const user = await tx.user.create({
        data: {
          email: link.email || `${link.token.slice(0, 8)}@origin-auto.com`,
          name: name,
          passwordHash,
          role: link.roleAssigned,
          status: "active",
        },
      })

      // 2. Vincular WorkspaceAccess
      await tx.workspaceAccess.create({
        data: {
          userId: user.id,
          clientId: link.clientId,
          projectId: link.projectId,
          accessType: "full",
          roleScope: "client",
          status: "active",
        },
      })

      // 3. Marcar link como usado
      await tx.activationLink.update({
        where: { id: link.id },
        data: {
          linkStatus: "registered",
          targetUserId: user.id,
          registeredAt: new Date(),
          accessActivatedAt: new Date(),
        },
      })

      // 4. Crear notificación in-app para el admin
      const adminUser = await tx.user.findFirst({
        where: { role: "admin" },
        select: { id: true },
      })

      if (adminUser) {
        await tx.notification.create({
          data: {
            userId: adminUser.id,
            title: `✅ ${name} ha activado su cuenta`,
            message: `El cliente "${name}" (${link.client?.displayName ?? link.clientId}) ha completado la activación de su Suite Privada.`,
            type: "activation",
            link: `/clients/${link.clientId}`,
          },
        })
      }

      return user
    })

    // 5. Email de notificación (via Resend si está configurado)
    const adminEmail = process.env.ADMIN_EMAIL
    const resendKey = process.env.RESEND_API_KEY

    if (adminEmail && resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Origin OS <onboarding@resend.dev>",
            to: [adminEmail],
            subject: `✅ ${name} ha activado su Suite — Origin`,
            html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
                <h1 style="font-size: 22px; font-weight: bold; color: #0f172a;">Nuevo cliente activo</h1>
                <p style="color: #475569; font-size: 15px;">
                  <strong>${name}</strong> acaba de activar su Suite Privada en Origin OS.
                </p>
                <p style="color: #475569; font-size: 15px;">
                  Ya puede acceder a su portal en <a href="http://localhost:3000/portal" style="color: #2563eb;">localhost:3000/portal</a>.
                </p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; letter-spacing: 0.1em;">ORIGIN AGENCY OS — Sistema Interno</p>
              </div>
            `,
          }),
        })
      } catch (emailError) {
        // Non-fatal: log but don't fail the activation
        console.warn("Email notification failed (non-fatal):", emailError)
      }
    } else {
      // Console fallback when Resend is not configured
      console.log(`\n🔔 ORIGIN ACTIVATION ALERT\n   Cliente: ${name}\n   Email: ${link.email}\n   Proyecto: ${link.project?.name}\n   Hora: ${new Date().toLocaleString("es-ES")}\n`)
    }

    return NextResponse.json({ success: true, userId: result.id })
  } catch (error) {
    console.error("Activation error:", error)
    return NextResponse.json({ error: "Error al procesar la activación" }, { status: 500 })
  }
}
