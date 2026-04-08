"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Rocket, 
  Target, 
  BarChart3, 
  Calendar, 
  ShieldCheck, 
  Settings,
  CircleDollarSign,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils helper exists

import { useSession } from "next-auth/react";
import AISelector from "./AISelector";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin"] },
  { name: "Portal Cliente", href: "/portal", icon: LayoutDashboard, roles: ["client"] },
  { name: "Clientes", href: "/clients", icon: Users, roles: ["admin", "financial_advisor"] },
  { name: "Ruta de Conversión", href: "/projects", icon: Rocket, roles: ["admin", "editor", "media_buyer"] },
  { name: "Calendario", href: "/calendar", icon: Calendar, roles: ["admin", "editor", "setter", "closer", "media_buyer", "client"] },
  { name: "Finanzas", href: "/finanzas", icon: CircleDollarSign, roles: ["admin", "financial_advisor"] },
  { name: "Validaciones", href: "/validations", icon: ShieldCheck, roles: ["admin"] },
  { name: "Ajustes", href: "/settings", icon: Settings, roles: ["admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If there's no session, we don't render navigation or we render an empty one.
  const userRole = session?.user?.role || "client";
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Usuario Origin";

  // Filter navigation by role
  const filteredNav = navigation.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-72 border-r border-slate-100 bg-white/40 backdrop-blur-xl flex flex-col sticky top-0 h-screen z-50">
      {/* Brand Logo */}
      <div className="px-10 py-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/20 rotate-3">
            <span className="text-white font-display font-bold text-xl">O</span>
          </div>
          <div>
            <span className="font-display font-bold text-2xl tracking-tighter block luxury-text">Origin</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 space-y-2 mt-4">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-[11px] font-bold uppercase tracking-widest",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 scale-[1.02]" 
                  : "text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm"
              )}
            >
              <item.icon className={cn(
                "w-4.5 h-4.5",
                isActive ? "text-blue-400" : "text-slate-300 group-hover:text-slate-900"
              )} />
              {item.name}
              {isActive && (
                <motion.div 
                  layoutId="sidebarActive"
                  className="ml-auto w-1 h-4 bg-blue-400 rounded-full" 
                />
              )}
            </Link>
          );
        })}

      </nav>

      <div className="mt-auto">
        <AISelector />
        
        {/* User Mini Profile - Premium */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border border-white shadow-sm flex items-center justify-center text-slate-400 font-bold uppercase">
                {userName.substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 mb-0.5">{userName}</span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{userRole}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
