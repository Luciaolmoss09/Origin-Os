"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Settings, 
  Key, 
  Mail, 
  Shield, 
  Users, 
  Database, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  RefreshCw,
  Globe,
  Bell,
  Lock,
  X
} from "lucide-react"
import { inviteCollaborator } from "@/lib/actions/team"

interface SettingsClientProps {
  initialSettings: Record<string, string>
  stats: {
    clientCount: number
    projectCount: number
    userCount: number
  }
}

export default function SettingsClient({ initialSettings, stats }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("integrations")
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteData, setInviteData] = useState({ email: "", name: "", role: "editor" })
  const [inviting, setInviting] = useState(false)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setError(null)
    setSuccess(null)
    
    try {
      const res = await inviteCollaborator(inviteData)
      if (res.success) {
        setSuccess(`Invitación enviada a ${inviteData.name}`)
        setIsInviteModalOpen(false)
        setInviteData({ email: "", name: "", role: "editor" })
      } else {
        setError(res.error || "Error al invitar")
      }
    } catch (err) {
      setError("Error de red al invitar")
    } finally {
      setInviting(false)
    }
  }

  async function handleSaveSetting(key: string, value: string, category: string = "general") {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value, category }),
      })
      
      const data = await res.json()
      if (data.success) {
        setSettings(prev => ({ ...prev, [key]: value }))
        setSuccess(`Ajuste "${key}" guardado correctamente.`)
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.error || "Error al guardar")
      }
    } catch (err) {
      setError("Error de conexión al guardar")
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: "integrations", label: "Integraciones", icon: Key },
    { id: "profile", label: "Perfil Admin", icon: Shield },
    { id: "team", label: "Equipo", icon: Users },
    { id: "system", label: "Sistema", icon: Database },
  ]

  return (
    <div className="space-y-10 font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 block italic">
            Configuración Maestra
          </span>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
            Ajustes de Sistema
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Control de las API Keys, el equipo y el comportamiento del sistema operativo.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-100 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-blue-500" : ""}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
              />
            )}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm min-h-[500px]">
        {activeTab === "integrations" && (
          <div className="max-w-3xl space-y-12">
            <div>
              <h3 className="text-xl font-display font-bold italic text-slate-900 mb-2">Motor de Inteligencia</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Configura los motores estratégicos y operativos de Origin Agency OS.
              </p>
              
              <div className="space-y-6">
                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-100/50">
                        <Cpu className="w-6 h-6 text-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">OpenAI (Motor Operativo)</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">GPT-4o / Generación de Copy</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${settings.OPENAI_API_KEY ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                      {settings.OPENAI_API_KEY ? "Conectado" : "Pendiente"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">OpenAI API Key</label>
                    <input 
                      type="password" 
                      placeholder="sk-..." 
                      defaultValue={settings.OPENAI_API_KEY || ""}
                      onBlur={(e) => handleSaveSetting("OPENAI_API_KEY", e.target.value, "integrations")}
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-mono text-xs focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10">
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Anthropic Claude API</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Requerido para Diagnóstico</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${settings.ANTHROPIC_API_KEY ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                      {settings.ANTHROPIC_API_KEY ? (
                        <><RefreshCw className="w-3 h-3 animate-spin-slow" /> Conectado</>
                      ) : (
                        <><RefreshCw className="w-3 h-3" /> Sin Configurar</>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">API Key de Anthropic</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <input 
                          type="password" 
                          placeholder="sk-ant-api03-..." 
                          defaultValue={settings.ANTHROPIC_API_KEY || ""}
                          onBlur={(e) => handleSaveSetting("ANTHROPIC_API_KEY", e.target.value, "integrations")}
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-mono text-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-inner"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                          <Lock className="w-3.5 h-3.5 text-slate-200" />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Usa el modelo <span className="text-slate-900 font-bold">claude-3-5-sonnet-20240620</span> para máxima precisión estratégica.</p>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/10">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Resend (Notificaciones Email)</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Activación de Clientes</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${settings.RESEND_API_KEY ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                      {settings.RESEND_API_KEY ? "Activo" : "Inactivo"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Resend API Key</label>
                    <input 
                      type="password" 
                      placeholder="re_..." 
                      defaultValue={settings.RESEND_API_KEY || ""}
                      onBlur={(e) => handleSaveSetting("RESEND_API_KEY", e.target.value, "integrations")}
                      className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl font-mono text-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-12">
            <div>
              <h3 className="text-xl font-display font-bold italic text-slate-900 mb-2">Identidad del Admin</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">Información pública y credenciales de acceso raíz.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre de la Agencia</label>
                  <input 
                    type="text" 
                    placeholder="Origin Operaciones" 
                    defaultValue={settings.AGENCY_NAME || "Origin Operaciones"}
                    onBlur={(e) => handleSaveSetting("AGENCY_NAME", e.target.value, "profile")}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">SLUG Identitario</label>
                  <input 
                    type="email" 
                    placeholder="origin-os" 
                    defaultValue={settings.AGENCY_SLUG || "origin-os"}
                    onBlur={(e) => handleSaveSetting("AGENCY_SLUG", e.target.value, "profile")}
                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-rose-50/30 rounded-3xl border border-rose-100">
              <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Zona de Seguridad
              </h4>
              <p className="text-xs text-rose-600 font-medium mb-6">Cambia tu contraseña maestra de acceso a Origin Agency OS.</p>
              <button className="px-8 py-3 bg-white border border-rose-200 text-rose-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-all">
                Actualizar Contraseña
              </button>
            </div>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold italic text-slate-900">Equipo Origin</h3>
                <p className="text-sm text-slate-500 font-medium">Gestiona los colaboradores y sus permisos dentro del OS.</p>
              </div>
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10"
              >
                <Users className="w-4 h-4" />
                Invitar Colaborador
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Nombre</th>
                    <th className="px-8 py-5 text-center">Rol Maestro</th>
                    <th className="px-8 py-5 text-center">Estado</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="text-sm hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800">Lucía Olmos</p>
                      <p className="text-[10px] text-blue-500 font-medium lowercase italic">luciaolmoss.09@gmail.com</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">
                        Fundador (Admin)
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center justify-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Online
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-bold text-slate-400 uppercase hover:text-slate-900">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-20 text-center border-t border-slate-50">
                <Users className="w-10 h-10 text-slate-100 mx-auto mb-4" />
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Escalabilidad en curso</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-display font-bold italic text-slate-900 mb-8">Estado de la Infraestructura</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Base de Datos (Postgres)</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">NeonDB</span>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold uppercase">Online</div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Clientes</span>
                      <span className="font-bold">{stats.clientCount}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Proyectos</span>
                      <span className="font-bold">{stats.projectCount}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">Accesos Activos</span>
                      <span className="font-bold">{stats.userCount}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Hosting & Compute</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-slate-900">Vercel</span>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold uppercase">Health OK</div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                       <Globe className="w-3.5 h-3.5" /> origin-os.vercel.app
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                       <RefreshCw className="w-3.5 h-3.5" /> CI/CD Active
                     </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
                  <div className="absolute right-0 top-0 p-10 bg-blue-500/20 blur-2xl rounded-full" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 relative z-10">Versión del Sistema</p>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-4xl font-display font-bold italic tracking-tighter">v1.2.0</span>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-[8px] font-bold uppercase tracking-widest">Master</span>
                  </div>
                  <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed relative z-10">
                    Powered by Origin Agency OS Core
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-display font-bold text-slate-900 italic">Invitar Colaborador</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Añade talento estratégico a Origin</p>
              </div>

              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Nombre Completo</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                      placeholder="Ej: Marc Thompson"
                      value={inviteData.name}
                      onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Email Profesional</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm"
                      placeholder="marc@agency.com"
                      value={inviteData.email}
                      onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Rol Asignado</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm appearance-none"
                      value={inviteData.role}
                      onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    >
                      <option value="editor">Editor de Contenido</option>
                      <option value="media_buyer">Media Buyer</option>
                      <option value="setter">Appointment Setter</option>
                      <option value="closer">High Ticket Closer</option>
                      <option value="financial_advisor">Asesor Financiero</option>
                      <option value="admin">Administrador Maestro</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={inviting}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {inviting ? "Enviando..." : "Enviar Invitación Directa"}
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
