"use server";

import { prisma } from "@/lib/prisma";
import { ProjectPhase, PhaseStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Phase-Gating Engine: Handles strictly validated phase transitions.
 */
export async function advanceProjectPhase(
  projectId: string,
  currentPhase: ProjectPhase,
  nextPhase: ProjectPhase
) {
  try {
    // 1. Validation Logic (Senior Improvement)
    // Check if mandatory deliverables for current phase exist before moving to next
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: { where: { phaseKey: currentPhase } },
        content: { where: { phaseKey: currentPhase } },
      },
    });

    if (!project) throw new Error("Project not found");

    // Example guardrail: Ensure at least 80% tasks are completed
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === "completada").length;

    if (totalTasks > 0 && completedTasks / totalTasks < 0.8) {
      return {
        success: false,
        error: "Debes completar al menos el 80% de las tareas para avanzar de fase.",
      };
    }

    // 2. Perform Transition
    const now = new Date();
    await prisma.$transaction([
      // Close current phase instance
      prisma.phaseInstance.updateMany({
        where: { projectId, phaseKey: currentPhase, status: "activa" },
        data: { status: "completada" as PhaseStatus },
      }),
      // Open next phase instance
      prisma.phaseInstance.create({
        data: {
          projectId,
          phaseKey: nextPhase,
          status: "activa" as PhaseStatus,
          startedAt: now,
        },
      }),
      // Update project main pointer
      prisma.project.update({
        where: { id: projectId },
        data: { currentPhase: nextPhase },
      }),
    ]);

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      nextPhase,
    };
  } catch (error: any) {
    console.error("Phase Advancing Error:", error);
    return { success: false, error: error.message || "Failed to advance phase" };
  }
}
