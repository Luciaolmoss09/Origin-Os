import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Anthropic } from "@anthropic-ai/sdk"

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

    // Fetch the "Mud"
    const memory = await prisma.internalCaseMemory.findUnique({
      where: { projectId },
    })

    if (!memory) {
      return NextResponse.json({ error: "No se encontró memoria interna para este proyecto." }, { status: 404 })
    }

    // Check database for API key first
    const dbConfig = await prisma.systemConfig.findUnique({
      where: { key: "ANTHROPIC_API_KEY" }
    })

    const apiKey = dbConfig?.value || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      // MOCK SUGGESTION if no API Key
      return NextResponse.json({
        thesisSummary: "TESIS SUGERIDA (MOCK): El cliente necesita delegar operaciones sin perder el toque de autor para escalar de 5k a 20k.",
        mechanismSummary: "MECANISMO SUGERIDO (MOCK): Sistema de 'SOPs Dinámicos' y equipo de appointment setters entrenados en su tono de voz.",
        launchAngle: "ÁNGULO SUGERIDO (MOCK): 'La Libertad del Fundador' - Cómo recuperar 20h/semana mientras tu negocio crece por ti.",
        clientDescription: "Carlos es un experto en fitness con un nicho saturado pero una oferta sólida que requiere diferenciación en el mecanismo.",
        note: "Configura ANTHROPIC_API_KEY en .env.local para usar Claude real."
      })
    }

    const anthropic = new Anthropic({ apiKey })

    const prompt = `
      Eres un estratega experto de Origin Agencia. Tu misión es analizar "El Barro" (notas crudas de una venta) y proponer la Estrategia V1.
      
      NOTAS CRUDAS:
      - Transcripción: ${memory.closingTranscription || "N/A"}
      - Resumen: ${memory.caseSummary || "N/A"}
      - Objeciones: ${memory.detectedObjections || "N/A"}
      - Acuerdos: ${memory.agreedConditions || "N/A"}
      - Notas: ${memory.internalNotes || "N/A"}

      Responde en formato JSON con los siguientes campos:
      - thesisSummary: Un resumen potente de la tesis de marketing.
      - mechanismSummary: El nombre y lógica del mecanismo único.
      - launchAngle: El ángulo de entrada para el lanzamiento.
      - clientDescription: Descripción del perfil del avatar según las notas.
      - viabilityDiagnosis: Breve diagnóstico de viabilidad.

      Responde SOLO el JSON.
    `

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    })

    const content = message.content[0].type === "text" ? message.content[0].text : ""
    const suggestion = JSON.parse(content)

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error("AI Diagnosis Error:", error)
    return NextResponse.json({ error: "Error al generar la sugerencia con IA" }, { status: 500 })
  }
}
