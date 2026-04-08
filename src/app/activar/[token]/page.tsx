"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function ActivatePage() {
  const { token } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/activate?token=${token}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "Este enlace es inválido o ha expirado.")
        } else {
          setName(data.name || "")
        }
      } catch {
        setError("Error de conexión.")
      } finally {
        setVerifying(false)
        setLoading(false)
      }
    }
    verifyToken()
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name,
          password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al activar la cuenta.")
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    } catch {
      setError("Error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden">
        {/* Aesthetic background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-950/20">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 italic">
            Bienvenido a Origin
          </h1>
          <p className="text-slate-500 mb-10 font-medium">
            Estás a un paso de activar tu Suite Privada. Define tu acceso ahora.
          </p>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-lg font-bold text-slate-900">¡Cuenta Activada!</p>
              <p className="text-sm text-slate-500">
                Redirigiendo al portal...
              </p>
            </motion.div>
          ) : error ? (
            <div className="space-y-6">
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <p className="text-sm font-medium text-rose-700">{error}</p>
              </div>
              <button 
                onClick={() => router.push("/")}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest"
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Confirma tu nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-display"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {loading ? "Activando..." : "Activar mi Suite"}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
        Powered by Origin Agency OS
      </p>
    </div>
  )
}
