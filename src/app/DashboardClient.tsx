"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardProps {
  userName: string;
  stats: {
    name: string;
    value: string;
    change: string;
    color: string;
  }[];
  activeProjects: any[];
  pendingValidations: any[];
}

// Map strings to their respective lucide-react icons based on stat name
const iconMap: Record<string, any> = {
  "Ingresos Mes": TrendingUp,
  "Proyectos Activos": Zap,
  "Validaciones": CheckCircle2,
  "Amenazas": AlertCircle,
};

export default function DashboardClient({ userName, stats, activeProjects, pendingValidations }: DashboardProps) {
  const currentDate = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-display font-bold tracking-tight text-slate-900 luxury-text">
          Bienvenido/a, <span className="text-slate-300 italic">{userName || "Admin"}</span>
        </h1>
        <p className="mt-3 text-slate-500 text-lg max-w-2xl font-medium">
          Tu ecosistema de alta performance está operativo. Tienes {pendingValidations.length} validaciones estratégicas listas para revisión.
        </p>
      </motion.div>

      {/* Today's Critical Path (Masterpiece Refinement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400">Ruta Crítica</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 uppercase tracking-tighter">
              <Clock className="w-3.5 h-3.5" />
              {currentDate}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {activeProjects.slice(0, 3).map((item, i) => (
               <Link href={`/projects/${item.id}`} key={i} className="metallic-card p-6 flex items-center justify-between group hover:translate-y-[-4px] transition-all cursor-pointer">
                  <div className="flex items-center gap-8">
                     <span className="text-sm font-bold text-slate-400 w-12 font-mono">LIVE</span>
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-inner text-blue-600 bg-blue-50`}>
                        {item.currentPhase.replace("_", " ")}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{item.name}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cliente: {item.clientName}</p>
                     </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
               </Link>
             ))}
             {activeProjects.length === 0 && (
                <div className="metallic-card p-6 flex items-center justify-center text-slate-400 font-medium text-sm">
                   No tienes proyectos activos en la Ruta de Conversión.
                </div>
             )}
          </div>
        </div>

        {/* Global Agency Status - Clean State */}
        <div className="metallic-card p-10 bg-white/80 backdrop-blur-xl border-slate-200/50 flex flex-col justify-between shadow-xl">
           <div className="relative z-10">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Estado Global Agency</h3>
              <div className="space-y-10">
                 <div>
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-2">ROAS Promedio Trimestral</span>
                    <p className="text-3xl font-sans font-bold text-slate-300 italic">--.--</p>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-slate-400">Objetivo Facturación</span>
                       <span className="text-slate-400 font-mono">%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-slate-300 w-0" />
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="pt-10 mt-10 border-t border-slate-100 relative z-10">
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Añade tu primera campaña en Finanzas para proyectar el rendimiento operativo.
              </p>
           </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <h2 className="text-xl font-bold mt-12 mb-6 uppercase tracking-widest text-slate-400 px-2">KPIs de Rendimiento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.name] || Target;
          return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="metallic-card p-8 group hover:translate-y-[-4px] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-[1.25rem] bg-slate-50 shadow-inner ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full shadow-sm">
                {stat.change}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.name}</span>
              <span className="text-3xl font-sans font-bold text-slate-900 mt-2">{stat.value}</span>
            </div>
          </motion.div>
        )})}
      </div>

      {/* Projects Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2 metallic-card p-12">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-display font-bold luxury-text uppercase tracking-widest">Rutas de Conversión Activas</h2>
                <Link href="/projects" className="text-xs font-bold text-slate-400 hover:text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-tighter">Explorar Todas →</Link>
            </div>
            
            <div className="space-y-8">
                {activeProjects.map((project, i) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-bold text-white text-xl luxury-text shadow-xl">
                        {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xl font-display italic">{project.name}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Status: {project.currentPhase.replace("_", " ")}</span>
                    </div>
                    </div>
                    <div className="flex items-center gap-10">
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-sans font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">€{project.actualSales || 0} Facturado</span>
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex shrink-0">
                          <div className={`bg-slate-900 h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.15)]`} style={{width: `${Math.min(100, Math.max(10, (project.actualSales / Math.max(1, project.targetSales)) * 100))}%`}}/>
                        </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    </div>
                </Link>
                ))}
                {activeProjects.length === 0 && (
                   <p className="text-sm font-medium text-slate-400">Sin rutas activas.</p>
                )}
            </div>
        </div>

        {/* Global Control Widget - Redesigned */}
        <div className="space-y-8">
            <div className="metallic-card p-10 bg-gradient-to-br from-slate-50 to-white shadow-xl border-slate-100">
                <h2 className="text-2xl font-display font-bold mb-6 luxury-text italic text-slate-900">Nueva Estrategia</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                    Despliega una nueva arquitectura de conversión optimizada para el cierre de activos.
                </p>
                <Link href="/clients/nuevo" className="w-full flex items-center justify-center bg-slate-900 text-white py-5 rounded-2xl font-bold hover:shadow-xl hover:translate-y-[-2px] transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em]">
                    Iniciar Auditoría
                </Link>
            </div>

            <div className="metallic-card p-8 border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Validaciones Pendientes ({pendingValidations.length})</h3>
                <div className="space-y-6">
                    {pendingValidations.slice(0, 3).map((item, i) => (
                        <Link href={`/validations`} key={i} className="flex group cursor-pointer">
                           <div>
                             <div className="flex items-center gap-3 mb-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-blue-500`} />
                                <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</p>
                             </div>
                             <p className="text-slate-400 text-xs pl-4 font-medium">{item.desc}</p>
                           </div>
                        </Link>
                    ))}
                    {pendingValidations.length === 0 && (
                       <p className="text-sm font-medium text-slate-400">Todo limpio.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
