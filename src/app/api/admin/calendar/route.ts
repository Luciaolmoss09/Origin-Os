import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const monthStr = searchParams.get("month") || new Date().toISOString().split("T")[0]
    const baseDate = new Date(monthStr)
    
    const start = startOfMonth(baseDate)
    const end = endOfMonth(baseDate)

    // Fetch Meetings
    const meetings = await prisma.meeting.findMany({
      where: {
        scheduledAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        project: {
          include: {
            client: true
          }
        }
      }
    })

    // Fetch Tasks with due dates
    const tasks = await prisma.task.findMany({
      where: {
        dueDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        project: {
          include: {
            client: true
          }
        }
      }
    })

    // Fetch Phase Starts
    const phases = await prisma.phaseInstance.findMany({
      where: {
        startedAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        project: {
          include: {
            client: true
          }
        }
      }
    })

    return NextResponse.json({
      meetings,
      tasks,
      phases
    })
  } catch (error) {
    console.error("Calendar GET Error:", error)
    return NextResponse.json({ error: "Error al obtener eventos del calendario" }, { status: 500 })
  }
}
