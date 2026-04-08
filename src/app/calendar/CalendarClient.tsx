"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns"
import { es } from "date-fns/locale"
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Target, 
  CheckCircle2, 
  Rocket, 
  Users,
  Calendar as CalendarIcon,
  X,
  ExternalLink,
  ChevronUp,
  Plus,
  Edit3
} from "lucide-react"
import { createTask, updateTask } from "@/lib/actions/tasks"
import { createMeeting, updateMeeting } from "@/lib/actions/meetings"
import { useRouter } from "next/navigation"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "meeting" | "task" | "phase"
  url?: string
  notes?: string
  targetRole?: string
  project?: {
    id: string
    name: string
    client: {
      displayName: string
    }
  }
}

interface CalendarClientProps {
  projects: { id: string; name: string }[]
}

export default function CalendarClient({ projects }: CalendarClientProps) {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [newEvent, setNewEvent] = useState({
    type: "task" as "task" | "meeting",
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    projectId: projects[0]?.id || "",
    description: "",
    priority: "media" as any,
    url: "",
    targetRole: "",
    status: ""
  })

  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const scheduledDate = new Date(`${newEvent.date}T${newEvent.time}:00`)
    
    try {
      if (isEditMode && editingEventId) {
        if (newEvent.type === "task") {
          await updateTask(editingEventId, {
            title: newEvent.title,
            description: newEvent.description,
            priority: newEvent.priority,
            dueDate: scheduledDate,
            url: newEvent.url,
            status: newEvent.status as any
          })
        } else {
          await updateMeeting(editingEventId, {
            meetingType: newEvent.title,
            scheduledAt: scheduledDate,
            notes: newEvent.description,
            url: newEvent.url,
            targetRole: newEvent.targetRole as any,
            status: newEvent.status as any
          })
        }
      } else {
        if (newEvent.type === "task") {
          await createTask({
            projectId: newEvent.projectId,
            phaseKey: "fase_1", // Default for direct creation
            title: newEvent.title,
            description: newEvent.description,
            priority: newEvent.priority,
            dueDate: scheduledDate,
            url: newEvent.url
          })
        } else {
          await createMeeting({
            projectId: newEvent.projectId,
            meetingType: newEvent.title,
            scheduledAt: scheduledDate,
            notes: newEvent.description,
            url: newEvent.url,
            targetRole: newEvent.targetRole as any
          })
        }
      }
      setIsAddModalOpen(false)
      setIsEditMode(false)
      setEditingEventId(null)
      setNewEvent({
        ...newEvent,
        title: "",
        description: "",
        url: "",
        targetRole: "",
        status: ""
      })
      fetchEvents()
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function openEditModal(event: CalendarEvent) {
    setIsEditMode(true)
    setEditingEventId(event.id)
    setNewEvent({
      type: event.type as any,
      title: event.title,
      date: format(event.date, "yyyy-MM-dd"),
      time: format(event.date, "HH:mm"),
      projectId: event.project?.id || "",
      description: event.notes || "",
      priority: "media",
      url: event.url || "",
      targetRole: event.targetRole || "",
      status: (event as any).status || ""
    })
    setIsAddModalOpen(true)
  }

  useEffect(() => {
    fetchEvents()
  }, [currentMonth])

  async function fetchEvents() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/calendar?month=${currentMonth.toISOString()}`)
      const data = await res.json()
      
      const aggregated: CalendarEvent[] = [
        ...data.meetings.map((m: any) => ({
          id: m.id,
          title: m.meetingType,
          date: new Date(m.scheduledAt),
          type: "meeting",
          project: m.project,
          url: m.url,
          notes: m.notes,
          targetRole: m.targetRole
        })),
        ...data.tasks.map((t: any) => ({
          id: t.id,
          title: t.title,
          date: new Date(t.dueDate),
          type: "task",
          project: t.project,
          url: t.url,
          notes: t.description
        })),
        ...data.phases.map((p: any) => ({
          id: p.id,
          title: `Inicio Fase: ${p.phaseKey}`,
          date: new Date(p.startedAt),
          type: "phase",
          project: p.project
        }))
      ]
      
      setEvents(aggregated)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  })

  function nextMonth() { setCurrentMonth(addMonths(currentMonth, 1)) }
  function prevMonth() { setCurrentMonth(subMonths(currentMonth, 1)) }

  return (
    <div className="space-y-10 font-sans pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block italic">
            Agenda Maestra
          </span>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            Calendario Origin
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Control de hitos, reuniones y tareas críticas en todo el ecosistema Origin.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all shadow-slate-900/10 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Evento
          </button>
          
          <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 px-4 min-w-[150px] text-center">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-3 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Legend */}
        <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-8">
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Reuniones
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tareas HOY
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Lanzamientos
           </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-100">
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
            <div key={day} className="bg-white p-5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
              {day}
            </div>
          ))}

          {days.map((day, i) => {
            const dayEvents = events.filter(e => isSameDay(e.date, day))
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isTodayDay = isToday(day)

            return (
              <div 
                key={i} 
                className={`bg-white min-h-[160px] p-4 transition-all hover:bg-slate-50 relative group ${!isCurrentMonth ? 'opacity-30' : ''}`}
              >
                <div className={`text-sm font-bold w-9 h-9 flex items-center justify-center rounded-xl mb-3 transition-all ${isTodayDay ? 'bg-slate-900 text-white shadow-xl rotate-3 scale-110' : 'text-slate-300 group-hover:text-slate-900 group-hover:scale-110'}`}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[100px] no-scrollbar">
                  {dayEvents.map((event) => {
                    const colorMap = {
                      meeting: "bg-blue-50 text-blue-700 border-blue-100",
                      task: "bg-amber-50 text-amber-700 border-amber-100",
                      phase: "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }
                    const iconMap = {
                      meeting: <Users className="w-2.5 h-2.5" />,
                      task: <Clock className="w-2.5 h-2.5" />,
                      phase: <Rocket className="w-2.5 h-2.5" />
                    }

                    return (
                      <motion.button
                        key={event.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setSelectedEvent(event)}
                        className={`w-full text-left p-2 rounded-lg border text-[8px] font-bold uppercase transition-all flex items-center gap-2 hover:scale-[1.03] hover:shadow-lg ${colorMap[event.type]}`}
                      >
                        <span className="shrink-0">{iconMap[event.type]}</span>
                        <span className="truncate">{event.title}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Event Details Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl p-12 overflow-y-auto"
            >
               <button 
                 onClick={() => setSelectedEvent(null)}
                 className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-2xl transition-all"
               >
                 <X className="w-6 h-6 text-slate-300" />
               </button>

               <div className="mt-12 space-y-10">
                 <div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border inline-block mb-4 ${
                      selectedEvent.type === 'meeting' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      selectedEvent.type === 'task' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {selectedEvent.type}
                    </span>
                    <h2 className="text-3xl font-display font-bold italic luxury-text leading-tight">
                      {selectedEvent.title}
                    </h2>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha y Hora</p>
                          <p className="text-sm font-bold text-slate-900">
                            {format(selectedEvent.date, "EEEE, d 'de' MMMM", { locale: es })}
                            {" a las "}
                            {format(selectedEvent.date, "HH:mm")}h
                          </p>
                       </div>
                    </div>

                    {(selectedEvent.url || selectedEvent.notes) && (
                      <div className="space-y-4">
                        {selectedEvent.notes && (
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notas / Descripción</p>
                            <p className="text-sm text-slate-600 leading-relaxed italic">"{selectedEvent.notes}"</p>
                          </div>
                        )}
                        {selectedEvent.url && (
                          <a 
                            href={selectedEvent.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-6 bg-blue-600 text-white rounded-3xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-600/10 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Enlace Directo</p>
                                <p className="text-sm font-bold">Abrir Recursos / Sala</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </a>
                        )}
                        {selectedEvent.targetRole && (
                          <div className="flex items-center gap-2 p-3 bg-slate-900 text-white rounded-2xl w-fit">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Para: {selectedEvent.targetRole}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedEvent.project && (
                      <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-white">
                               <Target className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Proyecto</p>
                               <p className="text-sm font-bold text-slate-900">{selectedEvent.project.name}</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-100">
                            <div>
                               <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Cliente</p>
                               <p className="text-xs font-bold text-slate-900">{selectedEvent.project.client.displayName}</p>
                            </div>
                            <a 
                              href={`/projects/${selectedEvent.project.id}`}
                              className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-slate-900 transition-all"
                            >
                               <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                         </div>
                      </div>
                    )}
                 </div>

                  <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button 
                      onClick={() => openEditModal(selectedEvent)}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-blue-600 shadow-lg shadow-slate-900/10"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar / Re-agendar
                    </button>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
                    >
                      Cerrar
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-slate-900 italic">
                  {isEditMode ? "Modificar Evento" : "Nuevo Evento"}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {isEditMode ? "Actualiza los detalles o re-agenda el hito" : "Hitos, reuniones o tareas en tu agenda"}
                </p>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, type: "task" })}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      newEvent.type === "task" 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-400"
                    }`}
                  >
                    Tarea
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewEvent({ ...newEvent, type: "meeting" })}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      newEvent.type === "meeting" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-400"
                    }`}
                  >
                    Reunión
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                      Seleccionar Proyecto
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm appearance-none"
                      value={newEvent.projectId}
                      onChange={(e) => setNewEvent({ ...newEvent, projectId: e.target.value })}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                      Título
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                      placeholder="Ej: Revisión estratégica Phase 2"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Fecha
                      </label>
                      <input
                        required
                        type="date"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Hora
                      </label>
                      <input
                        required
                        type="time"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                      Enlace (Zoom, Meet, Drive, etc.)
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm pl-12"
                        placeholder="https://..."
                        value={newEvent.url}
                        onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })}
                      />
                      <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    </div>
                  </div>

                  {newEvent.type === "meeting" && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Dirigido a (Rol)
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm appearance-none"
                        value={newEvent.targetRole}
                        onChange={(e) => setNewEvent({ ...newEvent, targetRole: e.target.value })}
                      >
                        <option value="">Cualquier Rol</option>
                        <option value="client">Cliente</option>
                        <option value="setter">Setter</option>
                        <option value="closer">Closer</option>
                        <option value="editor">Editor</option>
                        <option value="media_buyer">Media Buyer</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                      Notas / Instrucciones
                    </label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm min-h-[100px]"
                      placeholder="Instrucciones específicas para el colaborador o cliente..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>

                  {newEvent.type === "task" && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Prioridad
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["baja", "media", "alta", "critica"].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewEvent({ ...newEvent, priority: p })}
                            className={`py-2 rounded-xl text-[8px] font-bold uppercase tracking-widest border transition-all ${
                              newEvent.priority === p 
                                ? "bg-slate-900 text-white border-slate-900" 
                                : "bg-white text-slate-400 border-slate-100"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl transition-all disabled:opacity-50 ${
                      isEditMode ? "bg-blue-600 text-white shadow-blue-600/10" : "bg-slate-900 text-white shadow-slate-900/10"
                    }`}
                  >
                    {isSubmitting ? "Procesando..." : isEditMode ? "Guardar Cambios" : "Sincronizar Evento"}
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
