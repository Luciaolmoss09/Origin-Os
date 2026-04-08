import { auditProjectWithMethodology } from "@/lib/ai/brain";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";

export default async function DiagnosisPage({
  params
}: {
  params: { id: string }
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { client: true }
  });

  if (!project) return <div>Proyecto no encontrado</div>;

  // Run the Brain Audit
  const auditRes = await auditProjectWithMethodology(params.id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link href={`/projects/${params.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al Proyecto
      </Link>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold italic tracking-tight">Origin Brain</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Auditoría RAG v1.0 • Claude 3.5 Sonnet</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl p-8 relative z-10">
          {auditRes.success ? (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
              {auditRes.analysis || ""}
            </pre>
          ) : (
            <div className="text-rose-400 font-bold">
              Error durante la auditoría: {auditRes.error}
            </div>
          )}
        </div>
        
        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-8 text-center relative z-10">
          Este informe ha sido generado cruzando el estado de la base de datos con tus documentos de Google Drive.
        </p>
      </div>
    </div>
  );
}
