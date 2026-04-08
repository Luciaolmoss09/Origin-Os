import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { activateClientProject } from "@/lib/actions/onboarding";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("⚠️ Error de firma del Webhook:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    console.log("💰 ¡Pago Completado Recibido!", session.id);

    // Retrieve metadata we passed when creating the checkout session
    const clientEmail = session.customer_details?.email;
    const clientName = session.customer_details?.name || "Client";
    const projectName = session.metadata?.projectName || "Lanzamiento Digital";
    const clientId = session.metadata?.clientId; // Optional

    if (clientEmail) {
      // Disparar toda la automatización de Origin
      await activateClientProject({
        email: clientEmail,
        name: clientName,
        projectName: projectName,
        launchType: "Premium",
        clientId: clientId
      });
      console.log("🚀 Motor de Origin activado exitosamente para:", clientEmail);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
