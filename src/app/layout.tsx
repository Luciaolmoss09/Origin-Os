import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/shared/SessionWrapper";
import AppShell from "@/components/shared/AppShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Origin Operaciones | OS de Alto Rendimiento",
  description: "El sistema operativo premium para agencias de alto rendimiento y maestros digitales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">
        <SessionWrapper>
          <div className="flex min-h-screen bg-neutral-50/30 font-sans selection:bg-neutral-900 selection:text-white">
            {/* Metallic gradient background */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100/40 via-white to-blue-50/10 pointer-events-none -z-10" />
            <AppShell>{children}</AppShell>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
