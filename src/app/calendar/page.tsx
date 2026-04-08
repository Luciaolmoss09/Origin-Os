import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import CalendarClient from "./CalendarClient"
import { prisma } from "@/lib/prisma"

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const projects = await prisma.project.findMany({
    where: { status: "activo" },
    select: { id: true, name: true }
  })

  return (
    <div className="p-6 md:p-10">
      <CalendarClient projects={projects} />
    </div>
  )
}
