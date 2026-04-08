import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import Link from "next/link"
import ProjectsList from "./ProjectsList"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            Proyectos en Curso
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Todos tus lanzamientos activos y planificados.
          </p>
        </div>
        <Link
          href="/clients/nuevo" // For now, creating a client creates a project
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </Link>
      </div>

      <ProjectsList projects={projects} />
    </div>
  )
}
