import Anthropic from "@anthropic-ai/sdk";
import { readOriginMethodology, readDocumentContent } from "../drive/google";
import { prisma } from "../prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Audit a project by cross-referencing its data with the Origin Methodology stored in Drive.
 */
export async function auditProjectWithMethodology(projectId: string) {
  try {
    // 1. Gather Project Data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true, phaseInstances: true, tasks: true }
    });

    if (!project) return { success: false, error: "Proyecto no encontrado." };

    console.log(`🧠 Iniciando Auditoría para proyecto: ${project.name}`);

    // 2. Read Origin Brain (Google Drive Methodology Documents)
    const brainRes = await readOriginMethodology();
    let methodologyContext = "Origin OS Methodology Guidelines:\n";

    if (brainRes.success && brainRes.files) {
      for (const file of brainRes.files) {
        // Solo leer documentos de google docs
        if (file.mimeType === "application/vnd.google-apps.document" && file.id) {
            const docRes = await readDocumentContent(file.id);
            if (docRes.success && docRes.text) {
                methodologyContext += `--- Document: ${file.name} ---\n${docRes.text}\n\n`;
            }
        }
      }
    } else {
      methodologyContext += "No se pudieron cargar los documentos base de la carpeta del Cerebro.\n";
    }

    // 3. Construct AI Prompt
    const prompt = `
Eres la Inteligencia Artificial Central (Origin OS Brain) de una agencia digital de lujo (High-Ticket).
Tu objetivo es analizar el estado de un proyecto actual y compararlo de forma estricta con los documentos de metodología oficiales de la agencia.

## Metodología Operativa Oficial (Origin SOPs):
${methodologyContext}

## Estado Actual del Proyecto:
- Proyecto: ${project.name}
- Fase Actual: ${project.currentPhase}
- Tareas completadas: ${project.tasks.filter(t => t.status === "completada").length}
- Tareas pendientes: ${project.tasks.filter(t => t.status === "pendiente").length}

## Misión:
Analiza el proyecto contra la metodología y devuelve un análisis accionable y directo.
Si las tareas que están en el proyecto no coinciden con lo que dice la metodología para la Fase actual, haz una advertencia severa.
Genera un informe súper clínico, directo, "Luxury-grade", en español. Formato puro texto/markdown. No saludes.
`;

    // 4. Ask Claude
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: "Eres el Origin Agent. El cerebro central. Clínico, directo y preciso.",
      messages: [{ role: "user", content: prompt }]
    });

    const aiAnalysis = (response.content[0] as any).text;

    // 5. Save the Agent Suggestion to DB
    const suggestion = await prisma.agentSuggestion.create({
      data: {
        projectId: project.id,
        agentKey: "claude_auditor",
        suggestionType: "AUDIT",
        summary: "Auditoría de IA completada por Claude 3.5 Sonnet",
        proposedAction: aiAnalysis,
        approvalStatus: "pendiente"
      }
    });

    return { success: true, analysis: aiAnalysis, suggestionId: suggestion.id };

  } catch (error: any) {
    console.error("❌ Error en El Cerebro de Origin:", error);
    return { success: false, error: error.message };
  }
}
