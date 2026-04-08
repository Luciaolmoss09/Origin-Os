"use strict";

import { prisma } from "@/lib/prisma";

/**
 * Context Engine: Aggregates project strategy and past deliverables 
 * to provide a "Total Memory" for AI agents.
 */
export async function getProjectContext(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        strategicProfile: {
          include: {
            offer: true,
            avatar: true,
            narrative: true,
            personalityProfile: true,
          },
        },
        content: {
          where: { status: "aprobado" },
          take: 5,
        },
        learningInsights: {
          where: { status: "aprobado" },
          take: 3,
        },
      },
    });

    if (!project) return "";

    const sp = project.strategicProfile;
    
    let contextString = `--- CONTEXTO ESTRATÉGICO DEL PROYECTO: ${project.name} ---\n`;
    
    if (sp) {
      contextString += `TESIS: ${sp.thesisSummary || "N/A"}\n`;
      contextString += `ÁNGULO: ${sp.launchAngle || "N/A"}\n`;
      
      if (sp.offer) {
        contextString += `OFERTA: ${sp.offer.name}\nPROMESA: ${sp.offer.promise}\nPRECIO: ${sp.offer.price}€\n`;
      }
      
      if (sp.avatar) {
        contextString += `AVATAR: ${sp.avatar.avatarName}\nDOLOR PRINCIPAL: ${sp.avatar.currentPain}\nESTADO DESEADO: ${sp.avatar.desiredState}\n`;
      }
      
      if (sp.narrative) {
        contextString += `BIG IDEA: ${sp.narrative.bigIdea}\nCREENCIA CENTRAL: ${sp.narrative.newBelief}\n`;
      }
    }

    if (project.learningInsights.length > 0) {
      contextString += `\nINSIGHTS APRENDIDOS:\n`;
      project.learningInsights.forEach(i => {
        contextString += `- ${i.patternDetected}\n`;
      });
    }

    contextString += `\n--- FIN DEL CONTEXTO ---\n`;
    
    return contextString;
  } catch (error) {
    console.error("Context Retrieval Error:", error);
    return "";
  }
}
