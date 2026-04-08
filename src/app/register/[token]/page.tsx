import RegisterForm from "./RegisterForm"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ token: string }>
}

export default async function RegisterPage({ params }: Props) {
  const { token } = await params

  const activationLink = await prisma.activationLink.findUnique({
    where: { token },
    include: { client: true },
  })

  if (!activationLink) {
    notFound()
  }

  if (activationLink.linkStatus === "registered") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-900 italic mb-4">
            Ya estás registrado/a
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            Esta invitación ya fue utilizada. Accede con tus credenciales.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-xl transition-all"
          >
            Ir al acceso
          </a>
        </div>
      </div>
    )
  }

  if (
    activationLink.expiresAt &&
    new Date() > activationLink.expiresAt
  ) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="font-display font-bold text-3xl text-slate-900 italic mb-4">
            Invitación expirada
          </h1>
          <p className="text-slate-500 font-medium">
            Este enlace ha expirado. Contacta con tu agente de Origin para obtener un nuevo acceso.
          </p>
        </div>
      </div>
    )
  }

  return (
    <RegisterForm
      token={token}
      defaultEmail={activationLink.email ?? ""}
      defaultName={activationLink.name ?? ""}
      clientName={activationLink.client?.displayName ?? "Origin"}
    />
  )
}
