"use strict";

import { prisma } from "@/lib/prisma";
import { ProjectPhase, ProjectStatus, UserRole } from "@prisma/client";
import { sendWelcomeEmail } from "@/lib/mail/resend";
import { initializeProjectMethodology } from "./methodology";

/**
 * Onboarding Engine: Converts a successful payment into a project.
 */
export async function activateClientProject(payload: {
  email: string;
  name: string;
  projectName: string;
  launchType: any; // Using dynamic type for now to avoid enum issues before build
  clientId?: string;
}) {
  try {
    // 1. Ensure user exists or create
    let user = await prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          role: "client" as UserRole,
        },
      });
    }

    // 2. Ensure client entry exists
    let client = payload.clientId
      ? await prisma.client.findUnique({ where: { id: payload.clientId } })
      : await prisma.client.findFirst({ where: { displayName: payload.name } });

    if (!client) {
      client = await prisma.client.create({
        data: {
          displayName: payload.name,
          primaryContactUserId: user.id,
          niche: "Pendiente", // To be filled in onboarding form
        },
      });
    }

    // 3. Create Project & Phase 1
    const pStartDate = new Date();
    const project = await prisma.project.create({
      data: {
        clientId: client.id,
        name: payload.projectName,
        launchType: payload.launchType,
        startDate: pStartDate,
        status: "activo" as ProjectStatus,
        currentPhase: "fase_1" as ProjectPhase,
        phaseInstances: {
          create: {
            phaseKey: "fase_1" as ProjectPhase,
            status: "activa",
            startedAt: pStartDate,
          },
        },
      },
      include: {
        phaseInstances: true,
      },
    });

    // 4. Initialize Methodology (SOPs & Tasks)
    await initializeProjectMethodology(project.id);

    // 5. Create Activation Link (Stub for Resend integration)
    const activationLink = await prisma.activationLink.create({
      data: {
        linkType: "client",
        targetUserId: user.id,
        clientId: client.id,
        projectId: project.id,
        roleAssigned: "client" as UserRole,
        createdById: "SYSTEM", // System generated
      },
    });

    // 6. Send Welcome Email (Integration)
    const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/activate?id=${activationLink.id}`;
    await sendWelcomeEmail(payload.email, payload.name, loginLink);

    return {
      success: true,
      projectId: project.id,
      activationLinkId: activationLink.id,
    };
  } catch (error) {
    console.error("Onboarding Error:", error);
    return { success: false, error: "Failed to activate project" };
  }
}
