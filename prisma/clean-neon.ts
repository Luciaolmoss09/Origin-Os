import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function clean() {
  const sql = neon(process.env.DATABASE_URL!);
  
  console.log('🧹 Limpiando base de datos Neon...');

  try {
    await sql`
      TRUNCATE TABLE 
        "AdsMetric", "AdsCampaign", "FinancialEntry", "TaxDeadline",
        "Task", "Meeting", "PaymentProjection", "Payment", "Invoice",
        "Contract", "SalesCall", "LeadPipelineEntry", "ObjectionPattern",
        "ContentPiece", "EditorialCalendarItem", "CopyBlock", "AssetVersion",
        "CommunitySpace", "ProjectModule", "PhaseInstance",
        "CustomerDevelopmentSession", "CompetitorAnalysis", "Offer",
        "Avatar", "Narrative", "PersonalityProfile", "StrategicProfile",
        "InternalCaseMemory", "ExternalResource", "Project", "Client",
        "ActivationLink", "WorkspaceAccess"
      CASCADE;
    `;
    console.log('✨ Éxito: Base de datos limpia.');
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

clean();
