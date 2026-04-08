"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Map, 
  CheckCircle2, 
  Link as LinkIcon,
  Clock,
  ArrowRight,
  Play,
  Cloud,
  LayoutDashboard,
  Calendar as CalendarIcon,
  BarChart3,
  ClipboardList,
  Target,
  Zap,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
  Camera,
  Bell,
  AlertTriangle
} from "lucide-react";

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [selectedTask, setSelectedTask] = useState<null | {title: string, desc: string}>(null);

  const tabs = [
    { id: "resumen", label: "Resumen", icon: LayoutDashboard },
    { id: "calendario", label: "Calendario", icon: CalendarIcon },
    { id: "metricas", label: "Métricas", icon: BarChart3 },
    { id: "tareas", label: "Tareas", icon: ClipboardList },
    { id: "recursos", label: "Recursos", icon: Cloud },
  ];

  const phases = [
    { name: "Activación", status: "complete" },
    { name: "Onboarding", status: "complete" },
    { name: "Entrevista P.", status: "complete" },
    { name: "Análisis Aud.", status: "active" },
    { name: "Inv. Mercado", status: "pending" },
    { name: "Calentamiento F1", status: "pending" },
    { name: "Calentamiento F2", status: "pending" },
    { name: "Conversión", status: "pending" },
  ];

  const initialStats = [
    { label: "Seguidores Actuales", value: "1,240", icon: Camera },
    { label: "Clientes Actuales", value: "12" },
    { label: "Objetivo Ventas Mínimo", value: "20" },
    { label: "Objetivo Ventas OK", value: "35" },
    { label: "Objetivo Ventas TOP", value: "50" },
    { label: "Objetivo Facturación Mínimo", value: "€10k" },
    { label: "Objetivo Facturación OK", value: "€25k" },
    { label: "Objetivo Facturación TOP", value: "€50k" },
  ];

  const finalStats = [
    { label: "Seguidores Meta", value: "5,000+", icon: Camera },
    { label: "Clientes Meta", value: "45" },
    { label: "Objetivo Ventas Mínimo", value: "25" },
    { label: "Objetivo Ventas OK", value: "40" },
    { label: "Objetivo Ventas TOP", value: "60" },
    { label: "Objetivo Facturación Mínimo", value: "€15k" },
    { label: "Objetivo Facturación OK", value: "€30k" },
    { label: "Objetivo Facturación TOP", value: "€65k" },
  ];

  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="flex bg-slate-50 min-h-screen -m-12 font-sans overflow-hidden">
      {/* Private Client Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-10 h-screen sticky top-0 z-50">
        <div className="mb-14">
          <div className="flex items-center gap-4 py-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
              <span className="text-white font-display font-bold text-2xl italic">O</span>
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tighter luxury-text block">Origin</span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Portal Premium</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
           {tabs.map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-2xl transition-all duration-300 font-bold text-[11px] uppercase tracking-widest ${
                  activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-2xl scale-[1.02]" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
             >
                <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? "text-blue-400" : ""}`} />
                {tab.label}
             </button>
           ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-slate-50">
           <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-slate-200" />
              <div>
                 <p className="text-xs font-bold text-slate-900">Cliente Alpha</p>
                 <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Activo</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-16 h-screen overflow-y-auto scroll-smooth">
        <header className="mb-16 flex justify-between items-start">
           <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">10:45 AM</span>
              </div>
              <h1 className="text-5xl font-display font-bold luxury-text italic">Bienvenido/a, <span className="text-slate-300">Cliente Alpha</span></h1>
              <p className="mt-3 text-slate-500 text-lg font-medium">Trayectoria de conversión estratégica en tiempo real.</p>
           </div>
           
           <div className="flex items-center gap-8">
              {/* Notification Center */}
              <button className="relative w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:shadow-xl transition-all group">
                 <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                 <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              </button>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Estatus Operativo</span>
                <div className="flex items-center gap-3 px-6 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-full shadow-sm text-xs font-bold">
                   <AlertTriangle className="w-4 h-4 animate-pulse" />
                   Amenaza Detectada: Retraso en Fase 4
                </div>
              </div>
           </div>
        </header>

        {activeTab === "resumen" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            {/* Timeline */}
            <div className="metallic-card p-12 relative overflow-hidden backdrop-blur-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between mb-12 relative z-10">
                <h3 className="font-display font-bold text-2xl luxury-text">Ruta de Conversión</h3>
                <div className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Análisis Audiencia</div>
              </div>
              <div className="flex items-center justify-between gap-6 relative">
                 <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 -z-10" />
                 {phases.map((phase, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-5">
                       <div className={`w-5 h-5 rounded-full border-4 border-white shadow-lg transition-all ${
                         phase.status === "complete" ? "bg-slate-900" : phase.status === "active" ? "bg-blue-500 scale-125 shadow-blue-200 animate-pulse" : "bg-slate-100"
                       }`} />
                       <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${phase.status === "active" ? "text-blue-600" : "text-slate-400"}`}>{phase.name}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* Comparison Tables - Premium Colors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Initial */}
              <div className="metallic-card p-10 bg-white border-slate-200 shadow-xl">
                <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                   <div>
                      <h3 className="text-2xl font-display font-bold luxury-text italic">Situación Inicial</h3>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Onboarding 01/04/2025</p>
                   </div>
                   <Map className="w-7 h-7 text-slate-200" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {initialStats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-3">
                         {stat.icon && <stat.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                      </div>
                      <span className="text-sm font-sans font-bold text-slate-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final - Titanium White Style */}
              <div className="metallic-card p-10 bg-white border-blue-100 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-[100px] z-0" />
                <div className="flex justify-between items-center mb-10 border-b border-blue-50 pb-8 relative z-10">
                   <div>
                      <h3 className="text-2xl font-display font-bold text-slate-900 italic">Situación Final</h3>
                      <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mt-1">Meta de Conversión: 15/05/2025</p>
                   </div>
                   <Rocket className="w-7 h-7 text-blue-500" />
                </div>
                <div className="grid grid-cols-1 gap-4 relative z-10">
                  {finalStats.map((stat, i) => (
                    <div key={i} className="flex justify-between items-center bg-blue-50/10 p-4 rounded-2xl group hover:bg-blue-50/30 transition-all border border-blue-50/50">
                      <div className="flex items-center gap-3">
                         {stat.icon && <stat.icon className="w-4 h-4 text-blue-500" />}
                         <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{stat.label}</span>
                      </div>
                      <span className="text-sm font-sans font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Human Notifications */}
            <div className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-xl flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all">
               <div className="flex items-center gap-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-blue-200 shadow-2xl group-hover:scale-110 transition-transform">
                     <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h4 className="text-xl font-bold text-slate-900 mb-1 italic">Actualización de Estrategia</h4>
                     <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                        Acabamos de finalizar el mapeo de tu audiencia principal. Los resultados muestran que podemos duplicar la efectividad de los anuncios optimizando los ganchos de apertura.
                     </p>
                  </div>
               </div>
               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === "calendario" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="metallic-card overflow-hidden bg-white shadow-2xl border-slate-100">
                <div className="flex items-center justify-between p-12 border-b border-slate-50">
                   <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <button className="p-4 hover:bg-slate-50 rounded-2xl transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
                        <button className="p-4 hover:bg-slate-50 rounded-2xl transition-all"><ChevronRight className="w-6 h-6 text-slate-400" /></button>
                      </div>
                      <h2 className="text-4xl font-display font-bold italic luxury-text">Abril 2025</h2>
                   </div>
                   <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl">Hoy</button>
                </div>

                <div className="grid grid-cols-7 bg-slate-50/50 gap-px">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                    <div key={d} className="p-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center bg-white/40">{d}</div>
                  ))}
                  {days.map((day, i) => (
                    <div key={i} className="bg-white min-h-[160px] p-4 group border-none hover:bg-slate-50 transition-all cursor-pointer relative border-t border-l border-slate-50">
                       <span className={`text-lg font-sans font-bold w-10 h-10 flex items-center justify-center rounded-2xl mb-4 ${day === 8 ? "bg-slate-900 text-white shadow-xl" : "text-slate-300 group-hover:text-slate-900"}`}>{day}</span>
                       
                       {day === 12 && (
                         <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl text-[9px] font-bold border-l-4 border-blue-500 shadow-sm">
                            <span className="uppercase tracking-widest block mb-1">Reunión</span>
                            <span className="text-sm font-sans truncate block">Estrategia V1 (16:00h)</span>
                         </div>
                       )}
                       {day === 15 && (
                         <div className="p-4 bg-slate-900 text-white rounded-2xl text-[9px] font-bold shadow-lg">
                            <span className="uppercase tracking-widest block mb-1 text-blue-400">Hito</span>
                            <span className="text-sm font-display italic truncate block">Cierre de Fase</span>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
             </div>
          </motion.div>
        )}

        {/* Métricas Tab - Redes Sociales + Reporte Cliente */}
        {activeTab === "metricas" && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* YouTube Card */}
                <div className="metallic-card p-10 bg-white shadow-xl hover:translate-y-[-4px] transition-all group">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-rose-600 group-hover:text-white transition-all">
                         <Play className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activo</span>
                   </div>
                   <h3 className="text-2xl font-display font-bold luxury-text italic">YouTube Training</h3>
                   <p className="text-slate-500 font-medium mt-2 leading-relaxed">Accede a tus vídeos formativos y protocolos de escalabilidad.</p>
                   <button className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:gap-5 transition-all">
                      Abrir Repositorio <ArrowRight className="w-4 h-4" />
                   </button>
                </div>

                {/* Instagram Card */}
                <div className="metallic-card p-10 bg-white shadow-xl hover:translate-y-[-4px] transition-all group">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all">
                         <Camera className="w-8 h-8" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Monitoreo</span>
                   </div>
                   <h3 className="text-2xl font-display font-bold luxury-text italic">Instagram Perfil</h3>
                   <p className="text-slate-500 font-medium mt-2 leading-relaxed">Monitoreo de marca y salud de audiencia en tiempo real.</p>
                   <button className="mt-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:gap-5 transition-all">
                      Ver Estadísticas <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Client Reported Results - Refined Titanium White Style */}
              <div className="metallic-card p-12 bg-white border-slate-100 shadow-2xl overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-24 bg-blue-50 opacity-40 blur-[120px] -z-10 group-hover:opacity-60 transition-opacity" />
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-12 border-b border-slate-50 pb-8">
                       <div>
                          <h3 className="text-3xl font-display font-bold italic luxury-text">Reporte de Resultados</h3>
                          <p className="text-blue-500 text-sm font-bold uppercase tracking-widest mt-1">Avance Estratégico Real</p>
                       </div>
                       <BarChart3 className="w-10 h-10 text-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                       {[
                         { label: "Crecimiento Orgánico", value: "+18%", trend: "up" },
                         { label: "CTR Promedio Ads", value: "3.24%", trend: "up" },
                         { label: "Calificación de Audiencia", value: "A+", trend: "stable" },
                         { label: "Leads Potenciales", value: "482", trend: "up" },
                       ].map((stat, i) => (
                         <div key={i} className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group/stat">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 group-hover/stat:text-blue-500 transition-colors uppercase">{stat.label}</span>
                            <div className="flex items-end gap-3">
                               <p className="text-4xl font-sans font-bold text-slate-900">{stat.value}</p>
                               <span className="text-xs text-emerald-500 font-bold mb-1.5 flex items-center gap-1 group-hover/stat:translate-y-[-2px] transition-transform">
                                  <TrendingUp className="w-3.5 h-3.5" />
                               </span>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 blur-3xl" />
                       <p className="text-sm text-slate-300 italic font-medium max-w-2xl relative z-10">
                          "La respuesta al primer ángulo ha sido superior a la media. El cliente reporta una mejora en la calidad de los mensajes recibidos."
                       </p>
                       <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all relative z-10">Informar Nueva Métrica</button>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === "tareas" && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="metallic-card p-12 bg-white shadow-xl">
                 <h3 className="text-2xl font-display font-bold mb-10 italic">Tareas y Entregables</h3>
                 <div className="space-y-4">
                    {[
                      { title: "Definición Avatar Pro", status: "Completado", date: "05/04" },
                      { title: "Revisión Ganchos Ads", status: "Hoy", date: "08/04" },
                      { title: "Entrega Scripts V1", status: "Pendiente", date: "15/04" },
                    ].map((t, i) => (
                       <div key={i} className="flex justify-between items-center p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                          <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <CheckCircle2 className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="font-bold text-slate-900 text-xl">{t.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hito: {t.date}</p>
                             </div>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full ${t.status === 'Completado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{t.status}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === "recursos" && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: "Google Drive Assets", icon: Cloud, desc: "Toda tu documentación", color: "text-blue-500" },
                { name: "Recursos Varios", icon: Rocket, desc: "Documentos extra", color: "text-slate-900" },
                { name: "Material de Marca", icon: LinkIcon, desc: "Activos compartidos", color: "text-emerald-500" },
                { name: "Centro de Soporte", icon: Zap, desc: "Consultas directas", color: "text-blue-400" },
              ].map((r, i) => (
                <div key={i} className="metallic-card p-10 bg-white shadow-xl hover:translate-y-[-8px] transition-all group cursor-pointer border-slate-100">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:bg-slate-900 transition-all group-hover:text-white">
                      <r.icon className={`w-7 h-7 ${r.color} group-hover:text-white transition-all`} />
                   </div>
                   <h4 className="text-sm font-bold uppercase tracking-tight mb-1">{r.name}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.desc}</p>
                </div>
              ))}
           </motion.div>
        )}
      </main>

      {/* Detail Modal placeholder */}
      {selectedTask && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="absolute inset-0" onClick={() => setSelectedTask(null)} />
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="metallic-card w-full max-w-xl p-12 bg-white relative z-50 shadow-3xl">
             <button onClick={() => setSelectedTask(null)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-2xl"><X className="w-6 h-6 text-slate-300" /></button>
             <h2 className="text-3xl font-display font-bold italic luxury-text mb-8">{selectedTask.title}</h2>
             <div className="p-8 bg-slate-50 rounded-3xl mb-10 text-slate-600 font-medium leading-relaxed">{selectedTask.desc}</div>
             <button className="w-full py-6 bg-slate-900 text-white rounded-3xl font-bold">Marcar como Revisado</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
