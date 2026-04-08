"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-20 border-b border-slate-100 bg-white/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar - Apple Style */}
      <div className="relative w-96 hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar clientes, proyectos o métricas..."
          className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-black/5 transition-all outline-none"
        />
      </div>

      {/* Title for mobile */}
      <div className="md:hidden">
        <span className="font-display font-bold text-xl">Origin</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Day/Night Time Info */}
        <div className="hidden lg:flex flex-col items-end mr-4">
          <span className="text-sm font-semibold text-slate-800">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Notification Bell with Mock Dropdown */}
        <div className="relative group">
          <button className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          {/* Simple Dropdown - Mock */}
          <div className="absolute right-0 mt-3 w-80 glass-card p-4 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
            <h4 className="font-bold text-sm mb-4">Notificaciones</h4>
            <div className="space-y-4">
              <div className="text-xs p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-700">¡Nuevo Pago Recibido!</p>
                <p className="text-blue-600/70 mt-1">Lanzamiento Master Express ha sido activado.</p>
                <p className="text-[10px] mt-2 text-blue-400">Hace 5 minutos</p>
              </div>
              <div className="text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700">Métrica de Ads Pendiente</p>
                <p className="text-slate-500 mt-1">El Media Buyer aún no ha reportado el gasto de ayer.</p>
                <p className="text-[10px] mt-2 text-slate-400">Hace 2 horas</p>
              </div>
            </div>
            <button className="w-full text-center text-xs font-bold text-slate-400 mt-4 hover:text-black transition-colors">
              Marcar todas como leídas
            </button>
          </div>
        </div>
        
        <button className="md:hidden p-2.5 bg-slate-50 rounded-full">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
