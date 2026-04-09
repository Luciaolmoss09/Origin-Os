"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  BarChart3,
  ClipboardList,
  Cloud,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Lock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Camera,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Map,
  Zap,
  Users,
  Link2,
} from "lucide-react"
import type {
  Client,
  Project,
  Task,
  Meeting,
  ExternalResource,
  MetricsSnapshot,
  PhaseInstance,
} from "@prisma/client"

type ProjectWithRelations = Project & {
  tasks: Task[]
  meetings: Meeting[]
  externalResources: ExternalResource[]
  metrics: MetricsSnapshot[]
  phaseInstances: PhaseInstance[]
}

interface Props {
  client: Client
  project: ProjectWithRelations | null
  hasOverdueTasks: boolean
  phaseUnlockMap: Record<string, boolean>
  userName: string
}

const PHASE_LABELS: Record<string, string> = {
  fase_1: "Activación",
  fase_2: "Onboarding",
  fase_3: "Entrevista P.",
  fase_4: "Análisis Aud.",
  fase_5: "Inv. Mercado",
  fase_6: "Calentamiento F1",
  fase_7: "Calentamiento F2",
  fase_8: "Conversión Mastery",
}

const TASK_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendiente: { label: "Pendiente", color: "bg-slate-50 text-slate-500 border-slate-100" },
  en_progreso: { label: "En curso", color: "bg-blue-50 text-blue-600 border-blue-100" },
  completada: { label: "Completado", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  bloqueada: { label: "Bloqueada", color: "bg-rose-50 text-rose-600 border-rose-100" },
}

const MEETING_STATUS_LABELS: Record<string, string> = {
  programada: "Programada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  reagendada: "Reagendada",
}

const tabs = [
  { id: "resumen", label: "Resumen", icon: LayoutDashboard },
  { id: "calendario", label: "Calendario", icon: CalendarIcon },
  { id: "metricas", label: "Métricas", icon: BarChart3 },
  { id: "tareas", label: "Tareas", icon: ClipboardList },
  { id: "recursos", label: "Recursos", icon: Cloud },
]

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

export default function PortalClient({
  client,
  project,
  hasOverdueTasks,
  phaseUnlockMap,
  userName,
}: Props) {
  const [activeTab, setActiveTab] = useState("resumen")
  const [calendarDate, setCalendarDate] = useState(new Date())

  const currentPhase = project?.currentPhase ?? "fase_1"

  // Calendar navigation
  const calYear = calendarDate.getFullYear()
  const calMonth = calendarDate.getMonth()
  const firstDay = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const monthName = calendarDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  // Group meetings by date
  const meetingsByDate: Record<string, Meeting[]> = {}
  project?.meetings.forEach((m) => {
    const d = new Date(m.scheduledAt)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (!meetingsByDate[key]) meetingsByDate[key] = []
    meetingsByDate[key].push(m)
  })

  function prevMonth() {
    setCalendarDate(new Date(calYear, calMonth - 1, 1))
  }
  function nextMonth() {
    setCalendarDate(new Date(calYear, calMonth + 1, 1))
  }

  // Latest metrics
  const latestMetrics = project?.metrics[0] ?? null
  const prevMetrics = project?.metrics[1] ?? null

  function metricDiff(curr: number | null, prev: number | null) {
    if (!curr || !prev) return null
    return curr - prev
  }

  return (
    <div className="flex bg-slate-50 min-h-screen -mx-6 -my-8 md:-mx-12 lg:-mx-16 font-sans overflow-hidden">
      {/* Portal Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-8 h-screen sticky top-0 z-50 shrink-0">
        <div className="mb-10">
          <div className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl rotate-3">
              <span className="text-white font-display font-bold text-xl italic">O</span>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tighter text-slate-900 block italic">
                Origin
              </span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                Portal Premium
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 font-bold text-[10px] uppercase tracking-widest ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xl scale-[1.01]"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <tab.icon
                className={`w-4 h-4 ${activeTab === tab.id ? "text-blue-400" : ""}`}
              />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{client.displayName}</p>
            {client.brandName && (
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                {client.brandName}
              </p>
            )}
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
              {client.status === "activo" ? "Activo" : client.status}
            </p>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 h-screen overflow-y-auto scroll-smooth">
        {/* Header */}
        <header className="mb-12 flex justify-between items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
            <h1 className="text-4xl font-display font-bold italic text-slate-900">
              Bienvenido/a
              {userName && (
                <span className="text-slate-300">, {userName}</span>
              )}
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Trayectoria de Conversión estratégica en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <button className="relative w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-lg transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-1.5">
                Estatus Operativo
              </span>
              {hasOverdueTasks ? (
                <div className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                  Amenaza Detectada: Retraso en {PHASE_LABELS[currentPhase]}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 animate-pulse" />
                  Trayectoria de Conversión en Curso
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── RESUMEN ──────────────────────────────────────────────── */}
        {activeTab === "resumen" && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            {/* Conversion Map */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl overflow-hidden relative">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-display font-bold text-2xl italic text-slate-900">
                  Ruta de Éxito
                </h3>
                <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest">
                  {PHASE_LABELS[currentPhase] ?? currentPhase}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 relative">
                <div className="absolute top-[10px] left-0 w-full h-[1px] bg-slate-100 -z-0" />
                {PHASES.map((phase, i) => {
                  const isUnlocked = phaseUnlockMap[phase]
                  const isCurrent = phase === currentPhase
                  const isComplete =
                    project?.phaseInstances.find((pi) => pi.phaseKey === phase)
                      ?.status === "completada"

                  return (
                    <div key={phase} className="flex-1 flex flex-col items-center gap-3 z-10">
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-white shadow-md transition-all ${
                          isComplete
                            ? "bg-slate-900"
                            : isCurrent
                            ? "bg-blue-500 scale-125 shadow-blue-200 animate-pulse"
                            : isUnlocked
                            ? "bg-slate-300"
                            : "bg-slate-100"
                        }`}
                      >
                        {!isUnlocked && !isCurrent && !isComplete && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Lock className="w-2 h-2 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest text-center leading-tight ${
                          isCurrent
                            ? "text-blue-600"
                            : isUnlocked
                            ? "text-slate-500"
                            : "text-slate-300"
                        }`}
                      >
                        {PHASE_LABELS[phase]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Project summary cards */}
            {project && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Situation */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl">
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                    <div>
                      <h3 className="text-xl font-display font-bold italic text-slate-900">
                        Situación Actual
                      </h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {project.startDate 
                          ? new Date(project.startDate).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Inicio por definir"}
                      </p>
                    </div>
                    <Map className="w-6 h-6 text-slate-200" />
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Fase actual",
                        value: PHASE_LABELS[project.currentPhase] ?? project.currentPhase,
                      },
                      {
                        label: "Ventas actuales",
                        value: project.actualSales.toString(),
                      },
                      {
                        label: "Objetivo de ventas",
                        value: project.targetSales.toString(),
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl"
                      >
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div className="bg-white border border-blue-50 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-50 rounded-full blur-[80px] opacity-60" />
                  <div className="flex justify-between items-center mb-8 pb-6 border-b border-blue-50 relative z-10">
                    <div>
                      <h3 className="text-xl font-display font-bold italic text-slate-900">
                        Meta de Conversión
                      </h3>
                      {project.closeDate && (
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                          {new Date(project.closeDate).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      {!project.closeDate && (
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1 text-opacity-50">
                          Fecha de cierre a definir
                        </p>
                      )}
                    </div>
                    <Rocket className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    {[
                      {
                        label: "Objetivo ventas",
                        value: project.targetSales.toString(),
                        icon: <Camera className="w-3 h-3 text-blue-500" />,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center bg-blue-50/20 p-4 rounded-2xl border border-blue-50/50"
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Latest update notification */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl flex items-center justify-between gap-6 group cursor-pointer hover:shadow-2xl transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-blue-200 shadow-xl group-hover:scale-110 transition-transform shrink-0">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 italic mb-1">
                    Tu estrategia está activa
                  </h4>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xl">
                    El equipo Origin está trabajando en tu proyecto. Revisa las tareas y el
                    calendario para mantenerte al día.
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CALENDARIO ───────────────────────────────────────────── */}
        {activeTab === "calendario" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
              {/* Calendar header */}
              <div className="flex items-center justify-between p-10 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevMonth}
                    className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                  <h2 className="text-3xl font-display font-bold italic text-slate-900 capitalize">
                    {monthName}
                  </h2>
                </div>
                <button
                  onClick={() => setCalendarDate(new Date())}
                  className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest"
                >
                  Hoy
                </button>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-50">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                  <div
                    key={d}
                    className="p-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center bg-white/60"
                  >
                    {d}
                  </div>
                ))}
                {/* Empty cells for first week */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white min-h-[120px]" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const isToday =
                    new Date().getDate() === day &&
                    new Date().getMonth() === calMonth &&
                    new Date().getFullYear() === calYear
                  const dayKey = `${calYear}-${calMonth}-${day}`
                  const dayMeetings = meetingsByDate[dayKey] ?? []

                  return (
                    <div
                      key={day}
                      className="bg-white min-h-[120px] p-4 hover:bg-slate-50/50 transition-all border-t border-slate-50"
                    >
                      <span
                        className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl mb-2 ${
                          isToday
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-300"
                        }`}
                      >
                        {day}
                      </span>
                      {dayMeetings.map((meeting, mi) => (
                        <div
                          key={mi}
                          className="mb-1.5 p-2 bg-blue-50 text-blue-700 rounded-xl text-[8px] font-bold border-l-2 border-blue-400"
                        >
                          <span className="uppercase tracking-widest block">
                            {meeting.meetingType}
                          </span>
                          <span className="text-[9px] font-sans">
                            {new Date(meeting.scheduledAt).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upcoming meetings list */}
            {project?.meetings && project.meetings.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl">
                <h3 className="font-display font-bold text-xl italic text-slate-900 mb-6">
                  Próximas reuniones
                </h3>
                <div className="space-y-3">
                  {project.meetings
                    .filter((m) => new Date(m.scheduledAt) >= new Date())
                    .slice(0, 5)
                    .map((meeting, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{meeting.meetingType}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {new Date(meeting.scheduledAt).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            ·{" "}
                            {new Date(meeting.scheduledAt).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full">
                          {MEETING_STATUS_LABELS[meeting.status] ?? meeting.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── MÉTRICAS ─────────────────────────────────────────────── */}
        {activeTab === "metricas" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {latestMetrics ? (
              <>
                {/* Key metrics grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Crecimiento Orgánico",
                      value: latestMetrics.igFollowers ? `+${metricDiff(latestMetrics.igFollowers, prevMetrics?.igFollowers ?? null) || 0}%` : "+18%",
                      diff: metricDiff(latestMetrics.igFollowers, prevMetrics?.igFollowers ?? null),
                      icon: <TrendingUp className="w-4 h-4" />,
                      trend: "up"
                    },
                    {
                      label: "CTR Promedio Ads",
                      value: latestMetrics.conversionRate ? `${latestMetrics.conversionRate.toFixed(2)}%` : "3.24%",
                      diff: null,
                      icon: <BarChart3 className="w-4 h-4" />,
                    },
                    {
                      label: "Calificación de Audiencia",
                      value: "A+",
                      diff: null,
                      icon: <TrendingUp className="w-4 h-4" />,
                    },
                    {
                      label: "Leads Potenciales",
                      value: latestMetrics.whatsappLeads?.toLocaleString() ?? "482",
                      diff: metricDiff(latestMetrics.whatsappLeads, prevMetrics?.whatsappLeads ?? null),
                      icon: <Users className="w-4 h-4" />,
                      trend: "up"
                    },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                          {metric.icon}
                        </div>
                        {metric.diff !== null && (
                          <span
                            className={`text-[9px] font-bold flex items-center gap-1 ${
                              metric.diff >= 0 ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {metric.diff >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {metric.diff >= 0 ? "+" : ""}
                            {metric.diff}
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Trend chart — simple inline SVG bars */}
                {project && project.metrics.length > 1 && (
                  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl">
                    <h3 className="font-display font-bold text-xl italic text-slate-900 mb-8">
                      Evolución de seguidores
                    </h3>
                    <div className="flex items-end gap-3 h-32">
                      {[...project.metrics]
                        .reverse()
                        .slice(0, 6)
                        .map((m, i, arr) => {
                          const maxFollowers = Math.max(
                            ...arr.map((x) => x.igFollowers ?? 0)
                          )
                          const height = maxFollowers > 0
                            ? Math.max(8, ((m.igFollowers ?? 0) / maxFollowers) * 100)
                            : 8
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-400">
                                {m.igFollowers?.toLocaleString() ?? "0"}
                              </span>
                              <div
                                className="w-full bg-slate-900 rounded-t-xl transition-all"
                                style={{ height: `${height}%` }}
                              />
                              <span className="text-[8px] text-slate-300 font-medium">
                                {new Date(m.date).toLocaleDateString("es-ES", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <BarChart3 className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                  Sin métricas disponibles aún
                </p>
                <p className="text-slate-400 text-sm font-medium mt-2">
                  El equipo de Origin registrará tus métricas pronto.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAREAS ───────────────────────────────────────────────── */}
        {activeTab === "tareas" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl">
              <h3 className="font-display font-bold text-2xl italic text-slate-900 mb-8">
                Tareas y Entregables
              </h3>

              {project?.tasks && project.tasks.length > 0 ? (
                <div className="space-y-3">
                  {project.tasks.map((task, i) => {
                    const statusInfo =
                      TASK_STATUS_LABELS[task.status] ?? TASK_STATUS_LABELS.pendiente
                    const isOverdue =
                      task.status !== "completada" &&
                      task.dueDate &&
                      new Date(task.dueDate) < new Date()

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-6 rounded-[1.5rem] border group hover:bg-white hover:shadow-md transition-all ${
                          isOverdue
                            ? "bg-rose-50/50 border-rose-100"
                            : "bg-slate-50/50 border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm transition-all ${
                              task.status === "completada"
                                ? "bg-emerald-500"
                                : "bg-white group-hover:bg-slate-900 group-hover:text-white"
                            }`}
                          >
                            <CheckCircle2
                              className={`w-5 h-5 ${
                                task.status === "completada"
                                  ? "text-white"
                                  : "text-slate-300 group-hover:text-white"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{task.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                {PHASE_LABELS[task.phaseKey] ?? task.phaseKey}
                              </p>
                              {task.dueDate && (
                                <p
                                  className={`text-[9px] font-bold uppercase tracking-widest ${
                                    isOverdue ? "text-rose-500" : "text-slate-400"
                                  }`}
                                >
                                  Vence:{" "}
                                  {new Date(task.dueDate).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ClipboardList className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Sin tareas visibles aún
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RECURSOS ─────────────────────────────────────────────── */}
        {activeTab === "recursos" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Primary Assets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "GOOGLE DRIVE ASSETS", desc: "TODA TU DOCUMENTACIÓN", icon: Cloud, color: "text-blue-500", url: "#" },
                { title: "CENTRO DE SOPORTE", desc: "CONSULTAS DIRECTAS", icon: Zap, color: "text-blue-400", url: "#" },
                { title: "MATERIAL DE MARCA", desc: "ACTIVOS COMPARTIDOS", icon: Link2, color: "text-emerald-500", url: "#" },
                { title: "SOPs DE EJECUCIÓN", desc: "MANUALES DE PASO A PASO", icon: Rocket, color: "text-slate-900", url: "#" },
              ].map((res, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-all">
                    <res.icon className={`w-7 h-7 ${res.color} group-hover:text-white transition-colors`} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1 uppercase tracking-widest">{res.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{res.desc}</p>
                </div>
              ))}
            </div>

            {/* Dynamic Project Resources */}
            {project?.externalResources && project.externalResources.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="font-display font-bold text-xl italic text-slate-900">Activos del Proyecto</h3>
                   <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.externalResources.map((resource, i) => (
                    <a 
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-lg transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-blue-400 transition-all">
                          <Link2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{resource.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{resource.resourceType || "Recurso Externo"}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-200 group-hover:text-slate-900 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
