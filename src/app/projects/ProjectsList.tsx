"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Project, Client } from "@prisma/client"

type ProjectWithClient = Project & { client: Client }

const PHASE_LABELS: Record<string, string> = {
  fase_1: "Fase 1 - Activación",
  fase_2: "Fase 2 - Onboarding",
  fase_3: "Fase 3 - Estrategia",
  fase_4: "Fase 4 - Análisis",
  fase_5: "Fase 5 - Contenido",
  fase_6: "Fase 6 - Calentamiento",
  fase_7: "Fase 7 - Conversión",
  fase_8: "Fase 8 - Optimización",
}

export default function ProjectsList({ projects }: { projects: ProjectWithClient[] }) {
  const [search, setSearch] = useState("")

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.currentPhase.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      {/* Search */}
      <div className="glass-card p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nombre, fase o cliente..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Sin proyectos encontrados
            </p>
          </div>
        ) : (
          filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all group bg-white"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-display font-bold text-white shadow-xl shadow-slate-900/10 group-hover:rotate-3 transition-transform">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                      {project.client.brandName || project.client.displayName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Fase Actual
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                      {PHASE_LABELS[project.currentPhase] || project.currentPhase}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Ventas
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                      {project.actualSales} / {project.targetSales}
                    </span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
