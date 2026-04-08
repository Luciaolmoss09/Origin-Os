"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Link2,
  X,
  Copy,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import type { Client, Project } from "@prisma/client"

type ClientWithProject = Client & { projects: Project[] }

interface Props {
  clients: ClientWithProject[]
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  activo: { label: "Activo", color: "bg-emerald-50 text-emerald-600" },
  en_pausa: { label: "En Pausa", color: "bg-amber-50 text-amber-600" },
  completado: { label: "Completado", color: "bg-blue-50 text-blue-600" },
  cancelado: { label: "Cancelado", color: "bg-slate-50 text-slate-400" },
}

const PHASE_LABELS: Record<string, string> = {
  fase_1: "Fase 1",
  fase_2: "Fase 2",
  fase_3: "Fase 3",
  fase_4: "Fase 4",
  fase_5: "Fase 5",
  fase_6: "Fase 6",
  fase_7: "Fase 7",
  fase_8: "Fase 8",
}

export default function ClientsPageClient({ clients }: Props) {
  const [search, setSearch] = useState("")
  const [activateClientId, setActivateClientId] = useState<string | null>(null)
  const [activateEmail, setActivateEmail] = useState("")
  const [activateName, setActivateName] = useState("")
  const [registrationUrl, setRegistrationUrl] = useState("")
  const [activateLoading, setActivateLoading] = useState(false)
  const [activateError, setActivateError] = useState("")
  const [copied, setCopied] = useState(false)

  const filtered = clients.filter(
    (c) =>
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase()) ||
      (c.brandName ?? "").toLowerCase().includes(search.toLowerCase())
  )

  async function handleGenerateAccess(e: React.FormEvent) {
    e.preventDefault()
    if (!activateClientId) return
    
    // Find the first project ID for this client
    const client = clients.find(c => c.id === activateClientId)
    const projectId = client?.projects[0]?.id

    if (!projectId) {
      setActivateError("El cliente no tiene un proyecto activo.")
      return
    }

    setActivateLoading(true)
    setActivateError("")
    setRegistrationUrl("")

    try {
      const res = await fetch("/api/admin/activation-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: activateClientId,
          projectId: projectId,
          email: activateEmail,
          name: activateName,
          roleAssigned: "client"
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setActivateError(data.error || "Error generando el enlace de activación.")
      } else {
        setRegistrationUrl(data.url)
      }
    } catch {
      setActivateError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setActivateLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(registrationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function closeModal() {
    setActivateClientId(null)
    setActivateEmail("")
    setActivateName("")
    setRegistrationUrl("")
    setActivateError("")
    setCopied(false)
  }

  return (
    <div className="space-y-10 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            Mis Clientes
          </h1>
          <p className="mt-2 text-slate-500 text-lg font-medium">
            Gestión de la base de clientes y nichos estratégicos.
          </p>
        </div>
        <Link
          href="/clients/nuevo"
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, marca o nicho..."
          className="w-full bg-white border border-slate-100 rounded-3xl py-4 pl-14 pr-6 text-sm outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
        />
      </div>

      {/* Clients grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
            {search ? "Sin resultados" : "Sin clientes aún"}
          </p>
          {!search && (
            <Link
              href="/clients/nuevo"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:gap-4 transition-all uppercase tracking-widest"
            >
              Añadir primer cliente <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((client, i) => {
            const project = client.projects[0]
            const statusInfo = STATUS_LABELS[client.status] ?? STATUS_LABELS.activo
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-display font-bold text-white text-2xl shadow-xl shadow-slate-900/10 group-hover:rotate-3 transition-transform">
                    {client.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>

                {/* Info */}
                <Link href={`/clients/${client.id}`}>
                  <h3 className="text-xl font-display font-bold text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                    {client.displayName}
                  </h3>
                  {client.brandName && (
                    <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1 italic">
                      {client.brandName}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 font-medium mt-1">{client.niche}</p>
                </Link>

                {/* Project info */}
                {project && (
                  <div className="mt-6 pt-6 border-t border-slate-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Proyecto actual
                    </span>
                    <p className="text-xs font-bold text-slate-900">{project.name}</p>
                    <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">
                      {PHASE_LABELS[project.currentPhase] ?? project.currentPhase}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-8 flex items-center gap-3">
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    Ver detalle
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setActivateClientId(client.id)}
                    className="p-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl transition-all"
                    title="Generar acceso cliente"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Generate Access Modal */}
      <AnimatePresence>
        {activateClientId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-bold text-2xl italic text-slate-900">
                  Generar Acceso
                </h2>
                <button
                  onClick={closeModal}
                  className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {!registrationUrl ? (
                <form onSubmit={handleGenerateAccess} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Nombre del cliente
                    </label>
                    <input
                      type="text"
                      value={activateName}
                      onChange={(e) => setActivateName(e.target.value)}
                      required
                      placeholder="Nombre completo"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Email del cliente
                    </label>
                    <input
                      type="email"
                      value={activateEmail}
                      onChange={(e) => setActivateEmail(e.target.value)}
                      required
                      placeholder="cliente@email.com"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                    />
                  </div>

                  {activateError && (
                    <p className="text-xs text-rose-600 font-medium">{activateError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={activateLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {activateLoading ? "Generando..." : "Generar enlace de acceso"}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-medium text-emerald-700">
                      Enlace generado. Válido por 48h.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      URL de registro
                    </label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-xs font-mono text-slate-600 flex-1 truncate">
                        {registrationUrl}
                      </p>
                      <button
                        onClick={handleCopy}
                        className="shrink-0 p-2 hover:bg-white rounded-xl transition-colors"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    Comparte este enlace con tu cliente para que cree su acceso al portal.
                  </p>

                  <button
                    onClick={closeModal}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-xl transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
