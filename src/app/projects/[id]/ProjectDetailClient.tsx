"use client"

import { ProjectHealth } from "@/lib/actions/threats"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Rocket,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
  Info,
  X,
  Zap,
  Brain,
} from "lucide-react"
import type {
  Project,
  Client,
  Task,
  Meeting,
  AdsCampaign,
  AdsMetric,
  PhaseInstance,
  FinancialEntry,
  AgentSuggestion,
} from "@prisma/client"

import { 
  advanceProjectPhase 
} from "@/lib/actions/phases"
import { 
  createTask, 
  toggleTaskStatus 
} from "@/lib/actions/tasks"
import { simulateApiSync } from "@/lib/actions/ingestion"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type ProjectWithRelations = Project & {
  client: Client
  tasks: Task[]
  meetings: Meeting[]
  adsCampaigns: (AdsCampaign & { metrics: AdsMetric[] })[]
  phaseInstances: PhaseInstance[]
  financialEntries: FinancialEntry[]
  suggestions: AgentSuggestion[]
}

const PHASE_LABELS: Record<string, string> = {
  fase_1: "M01: Activación",
  fase_2: "M02: Onboarding",
  fase_3: "M03: Personality Profiling",
  fase_4: "M04: Auditoría Estratégica",
  fase_5: "M05: Arquitectura de Oferta",
  fase_6: "M07: Mapping Narrativo",
  fase_7: "M10: Ejecución Contenido",
  fase_8: "M18: Optimización",
}

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

export default function ProjectDetailClient({
  project,
  health,
}: {
  project: ProjectWithRelations
  health?: ProjectHealth
}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showDrawer, setShowDrawer] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskUrl, setNewTaskUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const phaseFeatures = [
    {
      title: "M04: Auditoría Estratégica",
      description: "Diagnóstico profundo del ecosistema digital, embudos actuales y fugas de conversión.",
    },
    {
      title: "M05: Arquitectura de Oferta",
      description: "Creación de la promesa única, el mecanismo de entrega y la estructuración High-Ticket.",
    },
    {
      title: "M07: Mapping de Narrativa",
      description: "Diseño de la 'Big Idea' que romperá las objeciones del mercado mediante contenido estratégico.",
    },
  ]

  const currentPhaseTasks = project.tasks.filter((t) => t.phaseKey === project.currentPhase)
  const completedTasks = currentPhaseTasks.filter((t) => t.status === "completada")
  const progress =
    currentPhaseTasks.length > 0
      ? Math.round((completedTasks.length / currentPhaseTasks.length) * 100)
      : 0

  // Ads summary from real data
  const totalSpend = project.adsCampaigns.reduce(
    (acc: number, c: any) => acc + c.metrics.reduce((sum: number, m: any) => sum + m.spend, 0),
    0
  )
  const totalRevenue = project.adsCampaigns.reduce(
    (acc: number, c: any) => acc + c.metrics.reduce((sum: number, m: any) => sum + (m.revenue || 0), 0),
    0
  )
  const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : "0.0"

  async function handleAdvancePhase() {
    const currentIndex = PHASES.indexOf(project.currentPhase as any)
    if (currentIndex === -1 || currentIndex === PHASES.length - 1) return

    const nextPhase = PHASES[currentIndex + 1]
    if (!confirm(`¿Estás seguro de que quieres avanzar a la ${PHASE_LABELS[nextPhase]}?`)) return

    setLoading(true)
    setError(null)
    const res = await advanceProjectPhase(project.id, project.currentPhase as any, nextPhase as any)
    if (!res.success) {
      setError(res.error || "Error al avanzar fase")
    }
    setLoading(false)
  }

  async function handleToggleTask(taskId: string, currentStatus: any) {
    setLoading(true)
    const res = await toggleTaskStatus(taskId, currentStatus, project.id)
    if (!res.success) {
      alert("Error al actualizar la tarea")
    }
    setLoading(false)
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setLoading(true)
    const res = await createTask({
      projectId: project.id,
      phaseKey: project.currentPhase as any,
      title: newTaskTitle,
      url: newTaskUrl,
      visibility: "client_visible",
    })

    if (res.success) {
      setNewTaskTitle("")
      setNewTaskUrl("")
      setShowTaskModal(false)
    } else {
      alert("Error al crear la tarea")
    }
    setLoading(false)
  }

  async function handleSyncData() {
    setLoading(true)
    const res = await simulateApiSync(project.id)
    if (res.success) {
      alert(res.message)
    } else {
      alert("Error en la sincronización")
    }
    setLoading(false)
  }

  return (
    <div className="space-y-10 font-sans">
      {health?.status === "threat" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex items-center justify-between gap-8 shadow-xl shadow-rose-900/5"
        >
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-rose-900 italic">Amenaza Operativa Detectada</h3>
              <p className="text-sm text-rose-500 font-medium italic mt-1">{health.message}</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
            Resolver Cuello de Botella
          </button>
        </motion.div>
      )}

      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block italic">
            {project.status === "activo" ? "Lanzamiento Activo" : project.status}
          </span>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            {project.name}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs font-bold px-4 py-1.5 bg-slate-900 text-white rounded-full">
              Cliente: {project.client.displayName}
            </span>
            <span className="text-xs font-bold px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              {PHASE_LABELS[project.currentPhase] || project.currentPhase}
            </span>
            <button
              onClick={() => setShowDrawer(true)}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors group"
            >
              <Info className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncData}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm"
          >
            <BarChart3 className="w-4 h-4 text-blue-500" />
            {loading ? "Sincronizando..." : "Sincronizar Datos"}
          </button>
          <a 
            href={`/admin/projects/${project.id}/diagnosis`}
            className="flex items-center gap-2 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white text-blue-600 px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            <Brain className="w-4 h-4" />
            Diagnóstico IA
          </a>
          <button 
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            <Plus className="w-4 h-4" />
            Añadir Tarea
          </button>
          <button 
            onClick={handleAdvancePhase}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
          >
            <Rocket className="w-4 h-4" />
            {loading ? "Procesando..." : "Avanzar Fase"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center gap-3">
           <AlertTriangle className="w-5 h-5" />
           {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-100">
        {["overview", "tasks", "ads", "finance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-active"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
              />
            )}
          </button>
        ))}
        <a
          href={`/admin/projects/${project.id}/diagnosis`}
          className="pb-4 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-all flex items-center gap-1.5"
        >
          <Brain className="w-3 h-3" />
          Diagnóstico
        </a>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-20 bg-blue-500/10 blur-3xl rounded-full" />
                  <h3 className="font-display font-bold text-2xl italic mb-8 relative z-10">
                    Progreso de la Metodología
                  </h3>
                  <div className="grid grid-cols-8 gap-2 relative z-10">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                      const phaseKey = `fase_${i}`
                      const isPast =
                        Object.keys(PHASE_LABELS).indexOf(project.currentPhase) >= i - 1
                      return (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all duration-1000 ${
                            isPast ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/10"
                          }`}
                        />
                      )
                    })}
                  </div>
                  <div className="mt-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 relative z-10">
                    <span>{PHASE_LABELS[project.currentPhase] || project.currentPhase}</span>
                    <span className="text-white">{progress}% Completado</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-4 tracking-widest">
                      Hito Actual
                    </h4>
                    <p className="text-xl font-bold italic text-slate-900">
                      {completedTasks[0]?.title || "Estrategia en marcha"}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      Validación de metodología Origin activa para esta fase.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                    <h4 className="font-bold text-slate-400 text-[10px] uppercase mb-4 tracking-widest">
                      Rendimiento Ads
                    </h4>
                    <p className="text-xl font-bold text-slate-900">
                      €{totalSpend.toLocaleString("es-ES")}
                    </p>
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> ROAS actual: x{avgRoas}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-[2.5rem] p-8">
                  <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-900">
                    <Brain className="w-5 h-5 text-blue-600" />
                    Bandeja IA (M06)
                  </h3>
                  <div className="space-y-4">
                    {project.suggestions.slice(0, 3).map((suggestion: any) => (
                      <div key={suggestion.id} className="p-5 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest">
                            {suggestion.agentKey}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">
                            {format(new Date(suggestion.createdAt), "HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-2">{suggestion.summary}</p>
                      </div>
                    ))}
                    {project.suggestions.length === 0 && (
                      <p className="text-xs text-slate-400 font-medium italic text-center py-4">No hay propuestas pendientes para esta fase.</p>
                    )}
                  </div>
                  <button className="w-full mt-6 py-3 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                    Ver repositorio de orquestación →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold italic text-slate-900">
                  Tareas de {PHASE_LABELS[project.currentPhase]}
                </h3>
                <div className="flex gap-2 text-[10px] font-bold bg-slate-100 p-1 rounded-xl">
                  <button className="px-5 py-2.5 bg-white text-slate-900 rounded-lg shadow-sm uppercase tracking-widest">
                    Pendientes ({currentPhaseTasks.length - completedTasks.length})
                  </button>
                  <button className="px-5 py-2.5 text-slate-400 uppercase tracking-widest">
                    Completadas ({completedTasks.length})
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {currentPhaseTasks.map((task, i) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-10 h-10 rounded-2xl border-2 transition-all flex items-center justify-center ${
                          task.status === "completada"
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "border-slate-100 bg-slate-50 text-slate-200 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white"
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-bold transition-all ${task.status === 'completada' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Metodología Origin: {PHASE_LABELS[task.phaseKey] || task.phaseKey}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="text-[10px] font-bold text-slate-500">
                          {new Date(task.dueDate).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ads" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Plataformas Activas
                  </p>
                  <p className="text-3xl font-display font-bold text-slate-900 italic">
                    {project.adsCampaigns.length}
                  </p>
                </div>
                <div className="bg-white border border-blue-50 rounded-[2rem] p-8 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    ROAS ACUMULADO
                  </p>
                  <p className="text-3xl font-display font-bold text-blue-600 italic">x{avgRoas}</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    INVERSIÓN TOTAL
                  </p>
                  <p className="text-3xl font-display font-bold text-slate-900 italic">
                    €{totalSpend.toLocaleString("es-ES")}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-10 py-5">Campaña</th>
                      <th className="px-10 py-5 text-center">Inversión</th>
                      <th className="px-10 py-5 text-center">Clicks</th>
                      <th className="px-10 py-5 text-center">Leads</th>
                      <th className="px-10 py-5 text-right">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {project.adsCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center">
                           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin campañas de ads activas</p>
                        </td>
                      </tr>
                    ) : (
                      project.adsCampaigns.map((c: any, i: number) => {
                        const spend = c.metrics.reduce((sum: number, m: any) => sum + m.spend, 0)
                        const revenue = c.metrics.reduce((sum: number, m: any) => sum + (m.revenue || 0), 0)
                        const clicks = c.metrics.reduce((sum: number, m: any) => sum + (m.clicks || 0), 0)
                        const leads = c.metrics.reduce((sum: number, m: any) => sum + (m.leads || 0), 0)
                        const roas = spend > 0 ? (revenue / spend).toFixed(1) : "0.0"

                        return (
                          <tr key={c.id} className="text-sm hover:bg-slate-50/50 transition-colors group">
                            <td className="px-10 py-6">
                              <p className="font-bold text-slate-800">{c.name}</p>
                              <p className="text-[9px] font-bold text-blue-500 uppercase mt-1">
                                {c.platform}
                              </p>
                            </td>
                            <td className="px-10 py-6 text-center font-medium text-slate-500">
                              €{spend.toLocaleString("es-ES")}
                            </td>
                            <td className="px-10 py-6 text-center text-slate-500 font-medium">
                              {clicks}
                            </td>
                            <td className="px-10 py-6 text-center font-bold text-slate-900">
                              {leads}
                            </td>
                            <td className="px-10 py-6 text-right">
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100">
                                x{roas}
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Total Facturado Proyecto</p>
                  <p className="text-4xl font-display font-bold italic">€{project.actualSales.toLocaleString("es-ES")}</p>
                  <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Objetivo</p>
                      <p className="font-bold">€{project.targetSales.toLocaleString("es-ES")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Desviación</p>
                      <p className="font-bold text-rose-400">{((project.actualSales / project.targetSales - 1) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Movimientos Recientes</h4>
                    <div className="space-y-4">
                      {project.financialEntries.slice(0, 3).map(entry => (
                        <div key={entry.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{entry.concept}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{entry.category}</p>
                          </div>
                          <p className={`text-sm font-bold ${entry.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {entry.type === 'ingreso' ? '+' : '-'}€{entry.totalAmount.toLocaleString("es-ES")}
                          </p>
                        </div>
                      ))}
                      {project.financialEntries.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4">Sin movimientos registrados para este proyecto.</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/finanzas")}
                    className="w-full mt-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all"
                  >
                    Ver Gestión Financiera →
                  </button>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl p-10">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-display font-bold italic luxury-text">Historial de Operaciones</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">M14: Financial Management</p>
                </div>
                <table className="w-full text-left">
                   <thead className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <tr>
                       <th className="pb-4">Concepto</th>
                       <th className="pb-4">Fecha</th>
                       <th className="pb-4 text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody>
                     {project.financialEntries.map(entry => (
                       <tr key={entry.id} className="border-b border-slate-50 last:border-0">
                         <td className="py-4 text-sm font-bold text-slate-900">{entry.concept}</td>
                         <td className="py-4 text-xs text-slate-400">{format(new Date(entry.date), "dd/MM/yy")}</td>
                         <td className={`py-4 text-right text-sm font-bold ${entry.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            €{entry.totalAmount.toLocaleString("es-ES")}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="h-80 flex flex-col items-center justify-center text-slate-300 bg-white border border-dashed border-slate-200 rounded-[3rem] shadow-inner">
              <Clock className="w-12 h-12 mb-4 text-slate-200 animate-pulse" />
              <p className="font-bold uppercase tracking-widest text-xs">Módulo en construcción digital (M10)</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-10 text-center">
                Conectando con el motor de metodología Origin...
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Side Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-display font-bold italic luxury-text">
                  Protocolo de Fase
                </h2>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                  <h3 className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-2 italic">
                    {PHASE_LABELS[project.currentPhase] || project.currentPhase}
                  </h3>
                  <p className="text-xl font-bold text-slate-900 leading-tight italic">
                    Transformando la visión estratégica en activos de conversión real.
                  </p>
                </div>

                <div className="space-y-6">
                  {phaseFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="flex gap-5 p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        0{i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{f.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setShowTaskModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg"
            >
              <h2 className="text-3xl font-display font-bold italic luxury-text mb-8">Nueva Tarea</h2>
              <form onSubmit={handleCreateTask} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Título de la tarea</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    placeholder="Ej: Revisión de ganchos V2"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Enlace Operativo (Opcional)</label>
                  <input
                    type="url"
                    value={newTaskUrl}
                    onChange={(e) => setNewTaskUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                   <button 
                     type="button"
                     onClick={() => setShowTaskModal(false)}
                     className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="flex-3 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
                   >
                     {loading ? "Creando..." : "Añadir Tarea"}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { AlertTriangle, Info as InfoIcon } from "lucide-react"
