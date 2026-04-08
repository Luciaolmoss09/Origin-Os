import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProjectHealth } from "@/lib/actions/threats"
import PortalClient from "./PortalClient"

interface Props {
  params: Promise<{ clientId: string }>
}

export default async function PortalPage({ params }: Props) {
  const { clientId } = await params
  const session = await getServerSession(authOptions)

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          tasks: {
            where: { visibility: "client_visible" },
            orderBy: [{ phaseKey: "asc" }, { dueDate: "asc" }],
          },
          meetings: {
            where: { visibility: "client_visible" },
            orderBy: { scheduledAt: "asc" },
          },
          externalResources: {
            orderBy: { createdAt: "desc" },
          },
          metrics: {
            orderBy: { date: "desc" },
            take: 6,
          },
          phaseInstances: {
            orderBy: { phaseKey: "asc" },
          },
        },
      },
    },
  })

  if (!client) {
    notFound()
  }

  const project = client.projects[0] ?? null
  const healthRes = project ? await getProjectHealth(project.id) : null
  const hasOverdueTasks = healthRes?.status === "threat"

  // Phase unlock logic:
  // Phase N is unlocked if all client_visible tasks of phase N-1 are completada
  // Phase 1 is always unlocked
  const PHASES = [
    "fase_1",
    "fase_2",
    "fase_3",
    "fase_4",
    "fase_5",
    "fase_6",
    "fase_7",
    "fase_8",
  ] as const

  type PhaseKey = (typeof PHASES)[number]

  const phaseUnlockMap: Record<string, boolean> = {}

  PHASES.forEach((phase, idx) => {
    if (idx === 0) {
      phaseUnlockMap[phase] = true
      return
    }
    const prevPhase = PHASES[idx - 1]
    const prevPhaseTasks = project?.tasks.filter((t) => t.phaseKey === prevPhase) ?? []
    if (prevPhaseTasks.length === 0) {
      phaseUnlockMap[phase] = false
    } else {
      phaseUnlockMap[phase] = prevPhaseTasks.every((t) => t.status === "completada")
    }
  })

  return (
    <PortalClient
      client={client}
      project={project}
      hasOverdueTasks={hasOverdueTasks}
      phaseUnlockMap={phaseUnlockMap}
      userName={session?.user?.name ?? ""}
    />
  )
}
