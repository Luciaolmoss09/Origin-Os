"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  AlertCircle,
  Download,
  Plus,
  FileText,
  Calendar,
  X,
  Target,
  ExternalLink,
} from "lucide-react"
import type { FinancialEntry, TaxDeadline } from "@prisma/client"
import { registerFinancialEntry } from "@/lib/actions/finances"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FinancesCenterClientProps {
  entries: FinancialEntry[]
  deadlines: TaxDeadline[]
  projects: { id: string; name: string }[]
  summary: {
    totalIncome: number
    totalExpenses: number
    totalIvaIncome: number
    totalIvaExpenses: number
    totalIrpfWithheld: number
    netIva: number
    estimatedProfit: number
  }
}

export default function FinancesCenterClient({
  entries,
  deadlines,
  projects,
  summary,
}: FinancesCenterClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "ingreso" as "ingreso" | "gasto",
    concept: "",
    baseAmount: 0,
    ivaPercentage: 21,
    irpfPercentage: 15,
    category: "General",
    attachmentUrl: "",
    projectId: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await registerFinancialEntry({
        ...formData,
        baseAmount: Number(formData.baseAmount),
      })
      if (res.success) {
        setIsModalOpen(false)
        setFormData({
          type: "ingreso",
          concept: "",
          ivaPercentage: 21,
          irpfPercentage: 15,
          category: "General",
          attachmentUrl: "",
          projectId: "",
          baseAmount: 0,
        })
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  const stats = [
    {
      name: "Ingresos (Total)",
      value: `€${summary.totalIncome.toLocaleString("es-ES")}`,
      change: "+",
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      name: "Gastos (Total)",
      value: `€${summary.totalExpenses.toLocaleString("es-ES")}`,
      change: "-",
      icon: TrendingDown,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      name: "IVA a Pagar",
      value: `€${summary.netIva.toLocaleString("es-ES")}`,
      change: "Neto",
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      name: "Beneficio Neto",
      value: `€${summary.estimatedProfit.toLocaleString("es-ES")}`,
      change: "ROAS",
      icon: CircleDollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            Centro Financiero
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Control de IRPF, IVA y salud financiera de la agencia.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-slate-100 px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Trimestre
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all shadow-slate-900/10 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Añadir Movimiento
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-4 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-[9px] font-bold ${stat.bgColor} ${stat.color} px-3 py-1.5 rounded-full border border-current/10 uppercase tracking-widest`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
              {stat.name}
            </p>
            <p className="text-2xl font-display font-bold text-slate-900 italic tracking-tight">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-900 italic">Movimientos Recientes</h2>
            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">
              Ver todos →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-slate-50/30">
                  <th className="px-10 py-5">Concepto</th>
                  <th className="px-10 py-5">Fecha</th>
                  <th className="px-10 py-5 text-center">IVA</th>
                  <th className="px-10 py-5 text-center">Base</th>
                  <th className="px-10 py-5 text-center">Vínculo</th>
                  <th className="px-10 py-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin movimientos registrados</p>
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, i) => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${entry.type === "ingreso" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"}`} />
                          <div className="flex flex-col">
                             <span className="font-bold text-slate-800">{entry.concept}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{entry.category || "General"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-sm text-slate-400 font-medium">
                        {new Date(entry.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      </td>
                      <td className="px-10 py-6 text-center text-xs text-slate-500 font-bold">
                        {entry.ivaPercentage}%
                      </td>
                      <td className="px-10 py-6 text-center text-xs font-bold text-slate-500">
                        €{entry.baseAmount.toLocaleString("es-ES")}
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {entry.attachmentUrl ? (
                            <a 
                              href={entry.attachmentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              title="Ver Factura/Documento"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <div className="w-8 h-8 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-slate-300" title="Sin adjunto">
                               <Receipt className="w-3.5 h-3.5 opacity-20" />
                            </div>
                          )}
                          {entry.projectId && (
                            <div className="p-2 bg-slate-900 text-white rounded-lg" title="Vinculado a Proyecto">
                               <Target className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={`px-10 py-6 text-right font-bold italic text-slate-900`}>
                        {entry.type === "ingreso" ? "+" : "-"}€{entry.totalAmount.toLocaleString("es-ES")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Deadlines & Alerts */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 bg-blue-500/10 blur-3xl rounded-full" />
            <h3 className="font-display font-bold text-2xl italic mb-6 relative z-10">Cierre de Trimestre</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 relative z-10 leading-relaxed">
              Recuerda subir todas las facturas antes del próximo hito fiscal.
            </p>
            {deadlines.length > 0 ? (
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-6 relative z-10 group hover:bg-white/10 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex flex-col items-center justify-center font-display shadow-inner">
                  <span className="text-[10px] font-bold text-white/40 uppercase mb-0.5">Días</span>
                  <span className="text-2xl font-bold leading-none">
                    {Math.max(0, Math.ceil((new Date(deadlines[0].dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">Próxima Alerta</span>
                  <span className="text-sm font-bold italic">{deadlines[0].title}</span>
                </div>
              </div>
            ) : (
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center relative z-10">
                   <p className="text-xs font-bold text-white/40 uppercase">Sin cierres próximos</p>
                </div>
            )}
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-orange-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-[10px] uppercase tracking-widest">Alerta de Gestoría</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 italic">
              Se han detectado facturas sin archivo adjunto. El sistema no podrá validar el IVA sin el documento oficial.
            </p>
            <button className="w-full py-3.5 bg-white border border-orange-100 text-orange-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all">
              Gestionar facturas →
            </button>
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-slate-900 italic">Nuevo Movimiento</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Registra un ingreso o gasto estratégico</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "ingreso" })}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      formData.type === "ingreso" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "gasto" })}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      formData.type === "gasto" 
                        ? "bg-white text-rose-600 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Gasto
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                      Concepto
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                      placeholder="Ej: Fee mensual cliente X"
                      value={formData.concept}
                      onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Base Imponible (€)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                        placeholder="0.00"
                        value={formData.baseAmount || ""}
                        onChange={(e) => setFormData({ ...formData, baseAmount: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Categoría
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm appearance-none"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="General">General</option>
                        <option value="Servicios/Fee">Servicios/Fee</option>
                        <option value="Software/SaaS">Software/SaaS</option>
                        <option value="Ads/Marketing">Ads/Marketing</option>
                        <option value="Colaboradores">Colaboradores</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Proyecto Relacionado
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm appearance-none"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      >
                        <option value="">Gasto General / No vinculado</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">
                        Enlace Factura (Drive/S3)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm pl-12"
                          placeholder="https://..."
                          value={formData.attachmentUrl}
                          onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                        />
                        <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                        IVA (%)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none text-xs"
                        value={formData.ivaPercentage}
                        onChange={(e) => setFormData({ ...formData, ivaPercentage: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                        IRPF (%)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none text-xs"
                        value={formData.irpfPercentage}
                        onChange={(e) => setFormData({ ...formData, irpfPercentage: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Movimiento"}
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
