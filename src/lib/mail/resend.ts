import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

/**
 * Origin Email Engine: Sends transactional emails for onboarding and notifications.
 */
export async function sendWelcomeEmail(to: string, clientName: string, activationLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Origin OS <onboarding@origin-os.com>", // Requiere dominio configurado en Resend
      to: [to],
      subject: "Bienvenida a Origin - Configura tu acceso",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #333;">¡Hola ${clientName}!</h1>
          <p style="font-size: 16px; color: #555;">
            Es un placer darte la bienvenida a **Origin**. Tu proyecto de lanzamiento ya ha sido activado y estamos listos para empezar.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${activationLink}" style="background-color: #000; color: #fff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Configurar mi Acceso
            </a>
          </div>
          <p style="font-size: 14px; color: #888;">
            Este link es personal e intransferible. Si tienes dudas, responde a este correo.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            Origin Agency OS - Digital Launch Mastery
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Mail Service Error:", error);
    return { success: false, error };
  }
}

/**
 * Notify Lucía of new payments/events
 */
export async function notifyAdmin(subject: string, message: string) {
  try {
    await resend.emails.send({
      from: "Origin OS <system@origin-os.com>",
      to: ["lucia@origin-os.com"], // Cambiar por el email real de Lucía
      subject: `[Origin Alert] ${subject}`,
      html: `<p>${message}</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Admin Notification Error:", error);
    return { success: false };
  }
}
