import { prisma } from "@/lib/prisma"
import { calculateTaxProjections } from "@/lib/actions/finances"
import FinancesCenterClient from "./FinancesCenterClient"

export default async function FinancesPage() {
  // Fetch entries, deadlines and projects
  const [entries, deadlines, projects] = await Promise.all([
    prisma.financialEntry.findMany({
      orderBy: { date: "desc" },
      take: 20,
    }),
    prisma.taxDeadline.findMany({
      where: { isCompleted: false },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.project.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  // Calculate global summary
  const projectionRes = await calculateTaxProjections()
  const summary = projectionRes.success 
    ? projectionRes.data 
    : {
        totalIncome: 0,
        totalExpenses: 0,
        totalIvaIncome: 0,
        totalIvaExpenses: 0,
        totalIrpfWithheld: 0,
        netIva: 0,
        estimatedProfit: 0,
      }

  return (
    <FinancesCenterClient 
      entries={entries as any} 
      deadlines={deadlines as any} 
      summary={summary as any} 
      projects={projects as any}
    />
  )
}
