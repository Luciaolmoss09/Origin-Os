"use server";

import { stripe } from "../stripe";

export async function createCheckoutSession(payload: {
  projectName: string;
  clientEmail: string;
  priceAmount: number; // en centavos (ej: 300000 para 3000€)
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Lanzamiento Origin: ${payload.projectName}`,
              description: "Pago seguro protegido por Origin OS.",
            },
            unit_amount: payload.priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/projects?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/projects?canceled=true`,
      customer_email: payload.clientEmail,
      metadata: {
        projectName: payload.projectName,
      },
    });

    return { success: true, url: session.url };
  } catch (error: any) {
    console.error("Error creando Stripe Session:", error);
    return { success: false, error: error.message };
  }
}
