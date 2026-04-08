import { prisma } from "@/lib/prisma"
import AdsCenterClient from "./AdsCenterClient"

export default async function AdsCenterPage() {
  // Fetch all campaigns and their metrics to calculate summaries
  const campaigns = await prisma.adsCampaign.findMany({
    include: {
      metrics: true,
    },
  })

  // Calculate summaries manually for the global view
  const summaries = campaigns.map((campaign) => {
    const stats = campaign.metrics.reduce(
      (acc, m) => {
        acc.totalSpend += m.spend
        acc.totalClicks += m.clicks || 0
        acc.totalLeads += m.leads || 0
        acc.totalRevenue += m.revenue || 0
        return acc
      },
      { totalSpend: 0, totalClicks: 0, totalLeads: 0, totalRevenue: 0 }
    )

    return {
      id: campaign.id,
      name: campaign.name,
      platform: campaign.platform,
      ...stats,
      cpc: stats.totalClicks > 0 ? stats.totalSpend / stats.totalClicks : 0,
      cpl: stats.totalLeads > 0 ? stats.totalSpend / stats.totalLeads : 0,
      roas: stats.totalSpend > 0 ? stats.totalRevenue / stats.totalSpend : 0,
    }
  })

  return <AdsCenterClient summaries={summaries} />
}
