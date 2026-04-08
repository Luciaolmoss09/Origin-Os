"use client"

import { motion } from "framer-motion"
import {
  BarChart3,
  MousePointer2,
  Target,
  DollarSign,
  TrendingUp,
  Filter,
} from "lucide-react"

interface CampaignSummary {
  id: string
  name: string
  platform: string
  totalSpend: number
  totalClicks: number
  totalLeads: number
  totalRevenue: number
  cpc: number
  cpl: number
  roas: number
}

export default function AdsCenterClient({
  summaries,
}: {
  summaries: CampaignSummary[]
}) {
  const globalStats = summaries.reduce(
    (acc, s) => {
      acc.spend += s.totalSpend
      acc.leads += s.totalLeads
      acc.revenue += s.totalRevenue
      acc.clicks += s.totalClicks
      return acc
    },
    { spend: 0, leads: 0, revenue: 0, clicks: 0 }
  )

  const globalCpc = globalStats.clicks > 0 ? globalStats.spend / globalStats.clicks : 0
  const globalRoas = globalStats.spend > 0 ? globalStats.revenue / globalStats.spend : 0

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            ADS Center
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Inteligencia de tráfico y ROI en tiempo real.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-100 px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Filter className="w-4 h-4" />
          Filtrar Fecha
        </button>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Gasto Total",
            value: `€${globalStats.spend.toLocaleString("es-ES")}`,
            icon: DollarSign,
            color: "bg-slate-900 text-white",
          },
          {
            label: "Leads Totales",
            value: globalStats.leads.toString(),
            icon: Target,
            color: "bg-blue-500 text-white",
          },
          {
            label: "CPC Medio",
            value: `€${globalCpc.toFixed(2)}`,
            icon: MousePointer2,
            color: "bg-emerald-500 text-white",
          },
          {
            label: "ROAS Global",
            value: `x${globalRoas.toFixed(1)}`,
            icon: TrendingUp,
            color: "bg-orange-500 text-white",
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-100 p-8 rounded-[2rem] flex items-center gap-6 shadow-sm"
          >
            <div className={`p-4 rounded-2xl ${m.color} shadow-lg shadow-current/10`}>
              <m.icon className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                {m.label}
              </span>
              <span className="text-2xl font-display font-bold text-slate-900 italic">
                {m.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campaigns Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden"
      >
        <div className="p-10 border-b border-slate-50 flex items-center justify-between text-slate-100">
           <h2 className="text-xl font-display font-bold text-slate-900 italic">Resumen de Campañas</h2>
           <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest">
             {summaries.length} Campañas Detectadas
           </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                <th className="px-10 py-5">Campaña</th>
                <th className="px-10 py-5">Plataforma</th>
                <th className="px-10 py-5 text-center">Gasto</th>
                <th className="px-10 py-5 text-center">Leads</th>
                <th className="px-10 py-5 text-center">CPL</th>
                <th className="px-10 py-5 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-20 text-center">
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin datos de campañas disponibles</p>
                  </td>
                </tr>
              ) : (
                summaries.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group">
                    <td className="px-10 py-6 font-bold text-slate-900">{c.name}</td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                        {c.platform}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center font-bold text-slate-500">
                      €{c.totalSpend.toLocaleString("es-ES")}
                    </td>
                    <td className="px-10 py-6 text-center font-bold text-slate-900">
                      {c.totalLeads}
                    </td>
                    <td className="px-10 py-6 text-center font-bold text-slate-500">
                      €{c.cpl.toFixed(2)}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                        x{c.roas.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Grid of Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-2 border-dashed border-slate-100 p-12 h-64 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
          <BarChart3 className="w-10 h-10 mb-4 animate-pulse" />
          <p className="font-bold text-[10px] uppercase tracking-widest">Evolución de ROAS</p>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Sincronizando con Meta API...</p>
        </div>
        <div className="bg-white border-2 border-dashed border-slate-100 p-12 h-64 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
          <TrendingUp className="w-10 h-10 mb-4 animate-pulse" />
          <p className="font-bold text-[10px] uppercase tracking-widest">Distribución por Plataforma</p>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Cargando inteligencia de tráfico...</p>
        </div>
      </div>
    </div>
  )
}
