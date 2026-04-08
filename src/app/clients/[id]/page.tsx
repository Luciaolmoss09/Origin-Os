import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Calendar, Target, CheckCircle2,
  Clock, AlertTriangle, FileText, Users, Zap, BarChart2
} from "lucide-react"

const PHASE_NAMES: Record<string, string> = {
  fase_1: "Activación & Onboarding",
  fase_2: "Diagnóstico Estratégico",
  fase_3: "Arquitectura Estratégica",
  fase_4: "Producción & Setup",
  fase_5: "Siembra & Calentamiento",
  fase_6: "Conversión",
  fase_7: "Cierre & Resultados",
  fase_8: "Aprendizaje & Continuidad",
}

const PHASE_ORDER = ["fase_1","fase_2","fase_3","fase_4","fase_5","fase_6","fase_7","fase_8"]

const LAUNCH_LABELS: Record<string, string> = {
  express_15_dias: "Express 15 Días",
  webinar: "Webinar",
  masterclass: "Masterclass",
  challenge: "Challenge",
  dm_launch: "DM Launch",
  evergreen: "Evergreen",
  hybrid: "Hybrid",
}

const TASK_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pendiente: { label: "Pendiente", color: "bg-slate-50 text-slate-500", icon: <Clock className="w-3 h-3" /> },
  en_progreso: { label: "En progreso", color: "bg-blue-50 text-blue-600", icon: <Zap className="w-3 h-3" /> },
  completada: { label: "Completada", color: "bg-emerald-50 text-emerald-600", icon: <CheckCircle2 className="w-3 h-3" /> },
  bloqueada: { label: "Bloqueada", color: "bg-rose-50 text-rose-600", icon: <AlertTriangle className="w-3 h-3" /> },
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          phaseInstances: true,
          tasks: { orderBy: [{ phaseKey: "asc" }, { createdAt: "asc" }] },
          meetings: { orderBy: { scheduledAt: "asc" }, take: 10 },
          strategicProfile: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  if (!client) notFound()

  const project = client.projects[0]
  const currentPhaseIndex = project ? PHASE_ORDER.indexOf(project.currentPhase) : 0
  const tasks = project?.tasks ?? []
  const meetings = project?.meetings ?? []
  const completedTasks = tasks.filter(t => t.status === "completada").length
  const totalTasks = tasks.length

  return (
    <div className="space-y-10 font-sans">
      {/* Back */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Mis Clientes
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center font-display font-bold text-white text-3xl shadow-xl shadow-slate-900/10">
            {client.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
              {client.displayName}
            </h1>
            {client.brandName && (
              <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">{client.brandName}</p>
            )}
            <p className="text-sm text-slate-400 font-medium mt-0.5">{client.niche}</p>
          </div>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-emerald-50 text-emerald-600">
          {client.status}
        </span>
      </div>

      {project ? (
        <>
          {/* Project overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Target className="w-4 h-4" />, label: "Tipo de lanzamiento", value: LAUNCH_LABELS[project.launchType] ?? project.launchType },
              { icon: <BarChart2 className="w-4 h-4" />, label: "Fase actual", value: PHASE_NAMES[project.currentPhase] ?? project.currentPhase },
              { icon: <CheckCircle2 className="w-4 h-4" />, label: "Tareas completadas", value: `${completedTasks} / ${totalTasks}` },
              { icon: <Calendar className="w-4 h-4" />, label: "Inicio", value: project.startDate ? new Date(project.startDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "Pendiente" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  {stat.icon}
                  <span className="text-[9px] font-bold uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="font-bold text-slate-900 text-sm">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Phase roadmap */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-display font-bold text-xl text-slate-900 italic">Ruta de Conversión</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PHASE_ORDER.map((phaseKey, index) => {
                const isCurrent = index === currentPhaseIndex
                const isCompleted = index < currentPhaseIndex
                const isLocked = index > currentPhaseIndex
                return (
                  <div
                    key={phaseKey}
                    className={`relative p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/15"
                        : isCompleted
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${isCurrent ? "text-slate-300" : "text-slate-400"}`}>
                        Fase {index + 1}
                      </span>
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {isCurrent && <Zap className="w-3.5 h-3.5 text-white animate-pulse" />}
                    </div>
                    <p className={`text-xs font-bold leading-tight ${isCurrent ? "text-white" : isCompleted ? "text-emerald-700" : "text-slate-400"}`}>
                      {PHASE_NAMES[phaseKey]}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tasks + Meetings side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-900 italic">Tareas</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {completedTasks}/{totalTasks}
                  </span>
                  {project && (
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-[9px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-widest"
                    >
                      Ver proyecto →
                    </Link>
                  )}
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Sin tareas aún</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.filter(t => t.phaseKey === project?.currentPhase).slice(0, 8).map((task) => {
                    const statusConfig = TASK_STATUS_CONFIG[task.status] ?? TASK_STATUS_CONFIG.pendiente
                    return (
                      <div key={task.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className={`text-sm font-medium truncate ${task.status === "completada" ? "line-through text-slate-300" : "text-slate-900"}`}>
                            {task.title}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            {task.taskType ?? "tarea"}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0 ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>
                    )
                  })}
                  {tasks.filter(t => t.phaseKey === project?.currentPhase).length === 0 && (
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-widest text-center py-4">Sin tareas en la fase actual</p>
                  )}
                </div>
              )}
            </div>

            {/* Meetings */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 italic">Reuniones</h2>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Sin reuniones programadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-900 leading-none">
                          {new Date(meeting.scheduledAt).getDate()}
                        </span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold">
                          {new Date(meeting.scheduledAt).toLocaleString("es-ES", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{meeting.meetingType}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(meeting.scheduledAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}h
                        </p>
                      </div>
                      <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        meeting.status === "realizada" ? "bg-emerald-50 text-emerald-600" :
                        meeting.status === "cancelada" ? "bg-rose-50 text-rose-400" :
                        "bg-blue-50 text-blue-500"
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Strategic profile */}
          {project.strategicProfile && (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 italic">Perfil Estratégico</h2>
                <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                  project.strategicProfile.strategyStatus === "aprobada" ? "bg-emerald-50 text-emerald-600" :
                  project.strategicProfile.strategyStatus === "en_revision" ? "bg-amber-50 text-amber-600" :
                  "bg-slate-50 text-slate-400"
                }`}>
                  {project.strategicProfile.strategyStatus}
                </span>
              </div>
              {project.strategicProfile.thesisSummary && (
                <p className="text-sm text-slate-600 leading-relaxed">{project.strategicProfile.thesisSummary}</p>
              )}
              {!project.strategicProfile.thesisSummary && (
                <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Perfil pendiente de completar</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-16 text-center shadow-sm">
          <Target className="w-10 h-10 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin proyecto activo</p>
          <p className="text-xs text-slate-300 mt-2">Crea un proyecto para este cliente para empezar a gestionar su lanzamiento.</p>
        </div>
      )}
    </div>
  )
}
