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

        {/* Notification Bell */}
        <div className="relative group">
          <button className="p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all relative">
            <Bell className="w-5 h-5 text-slate-600" />
            {/* El punto rojo solo se mostrará cuando haya notificaciones reales en el futuro */}
          </button>
          
          {/* Dropdown - Empty State */}
          <div className="absolute right-0 mt-3 w-80 glass-card p-4 shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
            <h4 className="font-bold text-sm mb-4">Notificaciones</h4>
            <div className="space-y-4">
              <div className="metallic-card p-6 flex flex-col items-center justify-center text-center">
                 <Bell className="w-6 h-6 text-slate-300 mb-2" />
                 <p className="text-xs font-bold text-slate-400">Todo al día</p>
                 <p className="text-[10px] text-slate-400 mt-1">No hay alertas operativas nuevas.</p>
              </div>
            </div>
            <button className="w-full text-center text-xs font-bold text-slate-400 mt-4 hover:text-black transition-colors">
              Ir a ajustes de notificaciones
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
