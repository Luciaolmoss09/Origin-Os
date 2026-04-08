import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import SettingsClient from "./SettingsClient"
import { prisma } from "@/lib/prisma"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const configs = await prisma.systemConfig.findMany()
  const initialSettings: Record<string, string> = {}
  configs.forEach(c => {
    initialSettings[c.key] = c.value
  })

  // Get system stats
  const clientCount = await prisma.client.count()
  const projectCount = await prisma.project.count()
  const userCount = await prisma.user.count()

  return (
    <div className="p-6 md:p-10">
      <SettingsClient 
        initialSettings={initialSettings} 
        stats={{ clientCount, projectCount, userCount }}
      />
    </div>
  )
}
