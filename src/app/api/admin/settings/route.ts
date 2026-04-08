import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const configs = await prisma.systemConfig.findMany()
    
    // Transform to useful object
    const settings: Record<string, string> = {}
    configs.forEach(c => {
      settings[c.key] = c.value
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings GET Error:", error)
    return NextResponse.json({ error: "Error al obtener ajustes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { key, value, category } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "Key es requerida" }, { status: 400 })
    }

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { value, category: category || "general" },
      create: { key, value, category: category || "general" },
    })

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error("Settings POST Error:", error)
    return NextResponse.json({ error: "Error al guardar ajuste" }, { status: 500 })
  }
}
