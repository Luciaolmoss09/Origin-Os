import { prisma } from "@/lib/prisma"
import ClientsPageClient from "./ClientsPageClient"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return <ClientsPageClient clients={clients} />
}
