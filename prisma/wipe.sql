-- Limpieza profunda de datos operativos respetando la integridad referencial
-- El uso de CASCADE asegura que se borren los hijos de Proyectos y Clientes

-- Desactivar triggers temporalmente para evitar problemas de recursividad si fuera necesario
-- (En Neon/Postgres TRUNCATE CASCADE es suficiente)

TRUNCATE TABLE 
    "AdsMetric",
    "AdsCampaign",
    "FinancialEntry",
    "TaxDeadline",
    "Task",
    "Meeting",
    "PaymentProjection",
    "Payment",
    "Invoice",
    "Contract",
    "SalesCall",
    "LeadPipelineEntry",
    "ObjectionPattern",
    "ContentPiece",
    "EditorialCalendarItem",
    "CopyBlock",
    "AssetVersion",
    "CommunitySpace",
    "ProjectModule",
    "PhaseInstance",
    "CustomerDevelopmentSession",
    "CompetitorAnalysis",
    "Offer",
    "Avatar",
    "Narrative",
    "PersonalityProfile",
    "StrategicProfile",
    "InternalCaseMemory",
    "ExternalResource",
    "Project",
    "Client",
    "ActivationLink",
    "WorkspaceAccess"
CASCADE;

-- Nota: No tocamos la tabla "User" para mantener el acceso del administrador.
