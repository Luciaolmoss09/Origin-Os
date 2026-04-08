import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProjectDetailClient from "./ProjectDetailClient"
import { getProjectHealth } from "@/lib/actions/threats"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      tasks: {
        orderBy: [{ phaseKey: "asc" }, { dueDate: "asc" }],
      },
      meetings: {
        orderBy: { scheduledAt: "asc" },
      },
      adsCampaigns: {
        include: {
          metrics: {
            orderBy: { date: "desc" },
          },
        },
      },
      phaseInstances: {
        orderBy: { phaseKey: "asc" },
      },
      financialEntries: {
        orderBy: { date: "desc" },
      },
      suggestions: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const healthRes = await getProjectHealth(project.id)

  return <ProjectDetailClient project={project as any} health={healthRes} />
}
