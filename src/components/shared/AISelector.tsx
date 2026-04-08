"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Zap, Cpu } from "lucide-react"

export default function AISelector() {
  const [activeBrain, setActiveBrain] = useState<"anthropic" | "openai" | "dual">("dual")

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith("ai_provider="))
      ?.split("=")[1] as any

    if (saved) setActiveBrain(saved)
  }, [])

  const handleSelect = (choice: "anthropic" | "openai" | "dual") => {
    setActiveBrain(choice)
    document.cookie = `ai_provider=${choice}; path=/; max-age=31536000` // 1 year
    // Force a small notification or visual cue
  }

  const brains = [
    { id: "dual", name: "Dual", icon: Cpu, color: "text-slate-400" },
    { id: "anthropic", name: "Claude", icon: Brain, color: "text-blue-500" },
    { id: "openai", name: "GPT-4o", icon: Zap, color: "text-emerald-500" },
  ]

  return (
    <div className="px-6 py-4 mx-4 mb-4 bg-slate-50/50 rounded-[2rem] border border-slate-100">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">Cerebro Operativo</p>
      <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-xl shadow-sm border border-slate-100">
        {brains.map((brain) => {
          const Icon = brain.icon
          const isActive = activeBrain === brain.id
          return (
            <button
              key={brain.id}
              onClick={() => handleSelect(brain.id as any)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                isActive ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 mb-1 ${isActive ? "text-white" : brain.color}`} />
              <span className={`text-[8px] font-bold uppercase tracking-tighter ${isActive ? "text-white" : "text-slate-500"}`}>
                {brain.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeBrain"
                  className="absolute inset-0 bg-slate-900 rounded-lg -z-10"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
