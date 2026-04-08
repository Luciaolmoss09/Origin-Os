"use strict";

import { prisma } from "@/lib/prisma";

/**
 * ADS Engine: Manages marketing performance across platforms.
 */
export async function registerAdsMetric(data: {
  campaignId: string;
  date: Date;
  spend: number;
  impressions?: number;
  clicks?: number;
  leads?: number;
  sales?: number;
  revenue?: number;
}) {
  try {
    const metric = await prisma.adsMetric.create({
      data,
    });

    return { success: true, metricId: metric.id };
  } catch (error) {
    console.error("Ads Metric Error:", error);
    return { success: false, error: "Failed to register ADS metric" };
  }
}

/**
 * Get Campaign Performance Summary
 */
export async function getCampaignSummary(projectId: string) {
  try {
    const campaigns = await prisma.adsCampaign.findMany({
      where: { projectId },
      include: { metrics: true },
    });

    const summary = campaigns.map((campaign) => {
      const stats = campaign.metrics.reduce(
        (acc, m) => {
          acc.totalSpend += m.spend;
          acc.totalClicks += m.clicks || 0;
          acc.totalLeads += m.leads || 0;
          acc.totalRevenue += m.revenue || 0;
          return acc;
        },
        { totalSpend: 0, totalClicks: 0, totalLeads: 0, totalRevenue: 0 }
      );

      return {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        ...stats,
        cpc: stats.totalClicks > 0 ? stats.totalSpend / stats.totalClicks : 0,
        cpl: stats.totalLeads > 0 ? stats.totalSpend / stats.totalLeads : 0,
        roas: stats.totalSpend > 0 ? stats.totalRevenue / stats.totalSpend : 0,
      };
    });

    return { success: true, summary };
  } catch (error) {
    console.error("Campaign Summary Error:", error);
    return { success: false, error: "Failed to get campaign summary" };
  }
}
