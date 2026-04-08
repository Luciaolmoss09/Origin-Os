import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando limpieza de datos de prueba en Origin...')

  // Orden de borrado para respetar claves foráneas
  const tables = [
    'AdsMetric',
    'AdsCampaign',
    'FinancialEntry',
    'TaxDeadline',
    'Task',
    'Meeting',
    'PaymentProjection',
    'Payment',
    'Invoice',
    'Contract',
    'SalesCall',
    'LeadPipelineEntry',
    'ObjectionPattern',
    'ContentPiece',
    'EditorialCalendarItem',
    'CopyBlock',
    'AssetVersion',
    'CommunitySpace',
    'ProjectModule',
    'PhaseInstance',
    'CustomerDevelopmentSession',
    'CompetitorAnalysis',
    'Offer',
    'Avatar',
    'Narrative',
    'PersonalityProfile',
    'StrategicProfile',
    'InternalCaseMemory',
    'ExternalResource',
    'Project',
    'Client',
    'ActivationLink',
    'WorkspaceAccess'
  ]

  for (const table of tables) {
    try {
      // @ts-ignore - Acceso dinámico a las tablas de Prisma
      await prisma[table.charAt(0).toLowerCase() + table.slice(1)].deleteMany({})
      console.log(`✅ Tabla ${table} limpiada.`)
    } catch (error) {
      console.error(`❌ Error al limpiar ${table}:`, error)
    }
  }

  // Re-activar el acceso del admin a un estado limpio si es necesario
  // En este caso, al borrar WorkspaceAccess, el admin verá su dashboard vacío, que es lo esperado.

  console.log('✨ Origin está ahora 100% limpio y listo para operar.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
