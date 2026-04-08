export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { activateClientProject } from "@/lib/actions/onboarding";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2024-06-20" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return new NextResponse("Webhook Secret Missing", { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract data from session metadata or customer details
      const email = session.customer_details?.email;
      const name = session.customer_details?.name;
      const projectName = session.metadata?.projectName || "Nuevo Proyecto";

      if (email && name) {
        console.log(`PAGO RECIBIDO: Activando proyecto para ${email}`);
        await activateClientProject({
          email,
          name,
          projectName,
          launchType: "express_15_dias", // Default or from metadata
        });
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
