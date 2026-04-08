"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Check, X, FileText, ExternalLink, Loader2, Clock } from "lucide-react"
import { processValidation } from "@/lib/actions/validations"

interface ValidationItem {
  id: string
  type: string
  title: string
  project: string
  category: string
  model: string
  date: any
}

interface ValidationsClientProps {
  initialValidations: ValidationItem[]
}

export default function ValidationsClient({ initialValidations }: ValidationsClientProps) {
  const [validations, setValidations] = useState(initialValidations)
  const [processing, setProcessing] = useState<string | null>(null)

  async function handleAction(id: string, model: string, decision: "approve" | "reject") {
    setProcessing(id)
    const res = await processValidation(id, model, decision)
    if (res.success) {
      setValidations((prev) => prev.filter((v) => v.id !== id))
    }
    setProcessing(null)
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 italic">
          Inbox de <span className="text-slate-300">Validaciones</span>
        </h1>
        <p className="mt-2 text-slate-500 text-lg font-medium">
          Revisa y aprueba los entregables críticos de ejecución.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {validations.length > 0 ? (
            validations.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 group"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-blue-400 transition-all">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">{item.project}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 italic">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium italic">
                      Revisión técnica de {item.category} requerida para avanzar.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {processing === item.id ? (
                    <div className="px-10 py-3 flex items-center gap-2 text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Procesando</span>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleAction(item.id, item.model, "reject")}
                        className="p-4 border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleAction(item.id, item.model, "approve")}
                        className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-slate-900/20 active:scale-[0.98] transition-all"
                      >
                        <Check className="w-4 h-4 text-blue-400" />
                        Aprobar Entregable
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/20 shadow-inner">
               <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 relative">
                  <ShieldCheck className="w-10 h-10 text-emerald-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg rotate-12">
                     <Check className="w-3 h-3 text-white" />
                  </div>
               </div>
               <h3 className="text-2xl font-display font-bold italic mb-4">Todo Validado</h3>
               <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed italic">
                 No hay entregables pendientes de revisión estratégica en este momento. La ejecución sigue su curso oficial.
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-slate-50/50 p-10 border border-slate-100/50 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Protocolo de Calidad Origin</h4>
            <p className="text-sm text-slate-400 italic font-medium max-w-sm">La aprobación de los entregables activa automáticamente la siguiente fase en el portal del cliente.</p>
         </div>
         <div className="flex gap-6">
            <div className="text-center">
               <span className="block text-3xl font-display font-bold italic text-slate-900">100%</span>
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Aprobación</span>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div className="text-center">
               <span className="block text-3xl font-display font-bold italic text-slate-900">0</span>
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Pendientes</span>
            </div>
         </div>
      </div>
    </div>
  )
}
