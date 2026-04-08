"use strict";

import { prisma } from "@/lib/prisma";
import { FinancialType } from "@prisma/client";

/**
 * Finance Engine: Handles calculations of IRPF and IVA for Spanish tax compliance.
 */
export async function calculateTaxProjections(projectId?: string) {
  try {
    const entries = await prisma.financialEntry.findMany({
      where: projectId ? { projectId } : {},
    });

    const summary = entries.reduce(
      (acc, entry) => {
        if (entry.type === "ingreso" as FinancialType) {
          acc.totalIncome += entry.baseAmount;
          acc.totalIvaIncome += entry.ivaAmount;
          acc.totalIrpfWithheld += entry.irpfAmount;
        } else {
          acc.totalExpenses += entry.baseAmount;
          acc.totalIvaExpenses += entry.ivaAmount;
        }
        return acc;
      },
      {
        totalIncome: 0,
        totalExpenses: 0,
        totalIvaIncome: 0,
        totalIvaExpenses: 0,
        totalIrpfWithheld: 0,
      }
    );

    // IVA a pagar = IVA Cobrado - IVA Pagado
    const netIva = summary.totalIvaIncome - summary.totalIvaExpenses;

    return {
      success: true,
      data: {
        ...summary,
        netIva,
        estimatedProfit: summary.totalIncome - summary.totalExpenses,
        taxReady: true,
      },
    };
  } catch (error) {
    console.error("Finance Engine Error:", error);
    return { success: false, error: "Failed to calculate tax projections" };
  }
}

/**
 * Register a new financial entry (Income/Expense)
 */
export async function registerFinancialEntry(data: {
  type: FinancialType;
  concept: string;
  baseAmount: number;
  ivaPercentage?: number;
  irpfPercentage?: number;
  projectId?: string;
  category?: string;
  attachmentUrl?: string;
}) {
  try {
    const ivaPerc = data.ivaPercentage ?? 21;
    const irpfPerc = data.irpfPercentage ?? 15;

    const ivaAmount = (data.baseAmount * ivaPerc) / 100;
    const irpfAmount = data.type === "ingreso" ? (data.baseAmount * irpfPerc) / 100 : 0;
    const totalAmount = data.baseAmount + ivaAmount - irpfAmount;

    const entry = await prisma.financialEntry.create({
      data: {
        ...data,
        ivaPercentage: ivaPerc,
        ivaAmount,
        irpfPercentage: irpfPerc,
        irpfAmount,
        totalAmount,
      },
    });

    return { success: true, entryId: entry.id };
  } catch (error) {
    console.error("Register Entry Error:", error);
    return { success: false, error: "Failed to register financial entry" };
  }
}
