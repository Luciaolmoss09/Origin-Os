"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  Sparkles, 
  Save, 
  ArrowLeft, 
  FileText, 
  Target, 
  Lightbulb,
  CheckCircle2,
  Loader2,
  Zap
} from "lucide-react"

export default function DiagnosisPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [memory, setMemory] = useState<any>(null)
  
  const [form, setForm] = useState({
    thesisSummary: "",
    mechanismSummary: "",
    launchAngle: "",
    clientDescription: "",
    viabilityDiagnosis: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [memRes, diagRes] = await Promise.all([
          fetch(`/api/admin/projects/${id}/memory`), // We'll need this endpoint or include it in the project fetch
          fetch(`/api/admin/projects/${id}/diagnosis`)
        ])
        
        const memData = await memRes.json()
        const diagData = await diagRes.json()
        
        setMemory(memData)
        if (diagData.id) {
          setForm({
            thesisSummary: diagData.thesisSummary || "",
            mechanismSummary: diagData.mechanismSummary || "",
            launchAngle: diagData.launchAngle || "",
            clientDescription: diagData.clientDescription || "",
            viabilityDiagnosis: diagData.viabilityDiagnosis || "",
          })
        }
      } catch (err) {
        console.error("Error fetching diagnosis data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  // Need a quick endpoint to get memory by project ID
  // I'll assume we can use /api/admin/projects/[id] and extract it or create a specific one.

  async function handleSuggest() {
    setSuggesting(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}/diagnosis/suggest`, { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        setForm({
          thesisSummary: data.thesisSummary || form.thesisSummary,
          mechanismSummary: data.mechanismSummary || form.mechanismSummary,
          launchAngle: data.launchAngle || form.launchAngle,
          clientDescription: data.clientDescription || form.clientDescription,
          viabilityDiagnosis: data.viabilityDiagnosis || form.viabilityDiagnosis,
        })
      }
    } catch (err) {
      console.error("AI Suggestion failed:", err)
    } finally {
      setSuggesting(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}/diagnosis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        alert("Diagnóstico guardado con éxito.")
        router.back()
      }
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100"
          >
            <ArrowLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold italic text-slate-900">
              Diagnóstico Estratégico (Fase 2)
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Transformando "El Barro" en Estrategia V1.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSuggest}
            disabled={suggesting}
            className="flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
          >
            {suggesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Sugerir con Claude
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Estrategia
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: THE MUD (Internal Memory) */}
        <div className="bg-slate-50 p-12 border-r border-slate-100 overflow-y-auto max-h-[calc(100vh-100px)]">
          <div className="max-w-xl mx-auto space-y-12">
            <div className="flex items-center gap-3 text-slate-400">
              <FileText className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Carpeta Interna (El Barro)</h2>
            </div>

            <div className="space-y-10">
              <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4">Transcripción de Cierre</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap italic bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                  {memory?.closingTranscription || "No hay transcripción registrada."}
                </p>
              </section>

              <div className="grid grid-cols-1 gap-6">
                <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Objeciones Detectadas</h3>
                  <p className="text-sm text-slate-800 font-medium">
                    {memory?.detectedObjections || "Sin objeciones registradas."}
                  </p>
                </section>
                <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Acuerdos y Notas</h3>
                  <p className="text-sm text-slate-800 font-medium">
                    {memory?.agreedConditions || "Sin acuerdos registrados."}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Right: THE STRATEGY (Strategic Profile) */}
        <div className="bg-white p-12 overflow-y-auto max-h-[calc(100vh-100px)]">
          <div className="max-w-xl mx-auto space-y-12">
            <div className="flex items-center gap-3 text-slate-900">
              <Brain className="w-5 h-5" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Estrategia Origin V1</h2>
            </div>

            <div className="space-y-8">
              {/* Thesis */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Target className="w-3 h-3 text-blue-500" /> Tesis de Marketing
                </label>
                <textarea
                  value={form.thesisSummary}
                  onChange={(e) => setForm({ ...form, thesisSummary: e.target.value })}
                  placeholder="¿Cuál es la tesis central de este cambio estratégico?"
                  rows={4}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                />
              </div>

              {/* Mechanism */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Zap className="w-3 h-3 text-blue-500" /> El Mecanismo Único
                </label>
                <textarea
                  value={form.mechanismSummary}
                  onChange={(e) => setForm({ ...form, mechanismSummary: e.target.value })}
                  placeholder="Describe el vehículo o mecanismo único de la oferta."
                  rows={3}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                />
              </div>

              {/* Angle */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Lightbulb className="w-3 h-3 text-blue-500" /> Ángulo de Lanzamiento
                </label>
                <input
                  value={form.launchAngle}
                  onChange={(e) => setForm({ ...form, launchAngle: e.target.value })}
                  placeholder="Ej: La Libertad del Fundador, El Fin de los Leads Fríos..."
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                />
              </div>

              {/* Avatar */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Descripción del Avatar</label>
                <textarea
                  value={form.clientDescription}
                  onChange={(e) => setForm({ ...form, clientDescription: e.target.value })}
                  placeholder="Perfil psicológico detectado en el barro..."
                  rows={3}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
