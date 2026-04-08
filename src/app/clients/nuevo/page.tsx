"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

const LAUNCH_TYPES = [
  { value: "a_definir", label: "A definir (Posterior a Diagnóstico)" },
  { value: "express_15_dias", label: "Express 15 días" },
  { value: "webinar", label: "Webinar" },
  { value: "masterclass", label: "Masterclass" },
  { value: "challenge", label: "Challenge" },
  { value: "dm_launch", label: "DM Launch" },
  { value: "evergreen", label: "Evergreen" },
  { value: "hybrid", label: "Hybrid" },
]

export default function NuevoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    displayName: "",
    brandName: "",
    email: "",
    phone: "",
    instagram: "",
    niche: "",
    launchType: "a_definir",
    startDate: "",
    targetSales: "",
    // Memory fields
    closingTranscription: "",
    caseSummary: "",
    detectedObjections: "",
    agreedConditions: "",
    internalNotes: "",
    internalFolderUrl: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          brandName: form.brandName || null,
          email: form.email || null,
          phone: form.phone || null,
          instagram: form.instagram || null,
          niche: form.niche,
          launchType: form.launchType,
          startDate: form.startDate,
          targetSales: parseInt(form.targetSales) || 0,
          closingTranscription: form.closingTranscription,
          caseSummary: form.caseSummary,
          detectedObjections: form.detectedObjections,
          agreedConditions: form.agreedConditions,
          internalNotes: form.internalNotes,
          internalFolderUrl: form.internalFolderUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error creando el cliente.")
        setLoading(false)
        return
      }

      router.push(`/clients/${data.clientId}`)
    } catch {
      setError("Error inesperado.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex items-center gap-4">
        <Link
          href="/clients"
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-400 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold italic text-slate-900">Nuevo Cliente</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Registra un nuevo cliente y su primer proyecto.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client section */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-5 h-5 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">1</span>
              Datos del cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Nombre del cliente *
                </label>
                <input
                  name="displayName"
                  value={form.displayName}
                  onChange={handleChange}
                  required
                  placeholder="Ej: María García"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Nombre de marca
                </label>
                <input
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  placeholder="Ej: Studio Maria"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Nicho *
                </label>
                <input
                  name="niche"
                  value={form.niche}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Salud & Wellness, Infoproductos, Finanzas..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@cliente.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Teléfono / WhatsApp
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Instagram (IG)
                </label>
                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="@usuario_ig"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Project section */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-5 h-5 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">2</span>
              Proyecto inicial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Tipo de estrategia *
                </label>
                <select
                  name="launchType"
                  value={form.launchType}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none"
                >
                  {LAUNCH_TYPES.map((lt) => (
                    <option key={lt.value} value={lt.value}>
                      {lt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Objetivo de ventas
                </label>
                <input
                  name="targetSales"
                  value={form.targetSales}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Fecha de inicio *
                </label>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  type="date"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Internal Memory section */}
          <div>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-5 h-5 bg-slate-900 text-white rounded-lg flex items-center justify-center text-[9px] font-bold">3</span>
              Carpeta Interna (El Barro)
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Transcripción de llamada de cierre
                </label>
                <textarea
                  name="closingTranscription"
                  value={form.closingTranscription}
                  onChange={(e: any) => setForm({ ...form, closingTranscription: e.target.value })}
                  rows={4}
                  placeholder="Pega aquí la transcripción o notas crudas de la llamada..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Objeciones detectadas
                  </label>
                  <textarea
                    name="detectedObjections"
                    value={form.detectedObjections}
                    onChange={(e: any) => setForm({ ...form, detectedObjections: e.target.value })}
                    rows={3}
                    placeholder="¿Qué le frenaba al inicio?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Acuerdos y Condiciones
                  </label>
                  <textarea
                    name="agreedConditions"
                    value={form.agreedConditions}
                    onChange={(e: any) => setForm({ ...form, agreedConditions: e.target.value })}
                    rows={3}
                    placeholder="Promesas, límites de tiempo, bonos..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Notas de Operaciones
                </label>
                <textarea
                  name="internalNotes"
                  value={form.internalNotes}
                  onChange={(e: any) => setForm({ ...form, internalNotes: e.target.value })}
                  rows={3}
                  placeholder="Cosas que el cliente no ve, pero el equipo sí..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Link a Carpeta Interna (Drive/Notion)
                </label>
                <input
                  name="internalFolderUrl"
                  value={form.internalFolderUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <p className="text-xs font-medium text-rose-600">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
            <Link
              href="/clients"
              className="px-8 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear cliente y proyecto"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
