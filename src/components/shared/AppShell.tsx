"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/shared/Sidebar"
import TopBar from "@/components/shared/TopBar"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  if (isAuthPage) {
    return <main className="flex-1 flex flex-col">{children}</main>
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-16 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </>
  )
}
