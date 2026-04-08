import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DashboardClient from "./DashboardClient"
import { startOfMonth, endOfMonth } from "date-fns"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  // Real active projects
  const dbProjects = await prisma.project.findMany({
    where: { status: "activo" },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Calculate actual revenue from FinancialEntries (real accounting)
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const monthEntries = await prisma.financialEntry.findMany({
    where: {
      type: "ingreso",
      date: {
        gte: monthStart,
        lte: monthEnd
      }
    }
  })
  
  const monthRevenue = monthEntries.reduce((acc, e) => acc + e.totalAmount, 0)
  
  // Pending validations count
  const pendingValidationsCount = await prisma.strategicProfile.count({
    where: { strategyStatus: "en_revision" }
  })

  // Overdue tasks count
  const overdueTasksCount = await prisma.task.count({
    where: {
      status: { not: "completada" },
      dueDate: { lt: now }
    }
  })

  // Mapping projects to props
  const activeProjects = dbProjects.map(p => ({
    id: p.id,
    name: p.name,
    clientName: p.client?.displayName || "Desconocido",
    currentPhase: p.currentPhase,
    actualSales: p.actualSales,
    targetSales: p.targetSales
  }));

  // Pending validations details
  const validationRes = await prisma.strategicProfile.findMany({
    where: { strategyStatus: "en_revision" },
    include: { project: { include: { client: true } } },
    take: 3
  });
  
  const validationItems = validationRes.map(v => ({
    title: "Validación Estratégica",
    desc: `${v.project.client.displayName}: ${v.launchAngle?.substring(0, 30) || "Tesis en revisión"}`,
    color: "bg-blue-500"
  }));

  const stats = [
    { name: "Ingresos Mes", value: `€${monthRevenue.toLocaleString()}`, change: "+Activo", color: "text-emerald-500" },
    { name: "Proyectos Activos", value: dbProjects.length.toString(), change: "En curso", color: "text-purple-500" },
    { name: "Validaciones", value: pendingValidationsCount.toString(), change: "Pendientes", color: "text-blue-500" },
    { name: "Amenazas", value: overdueTasksCount.toString(), change: "Tareas retrasadas", color: "text-rose-500" },
  ];

  return (
    <div className="p-6 md:p-10">
      <DashboardClient 
         userName={session?.user?.name || "CEO"}
         stats={stats}
         activeProjects={activeProjects}
         pendingValidations={validationItems}
      />
    </div>
  )
}
