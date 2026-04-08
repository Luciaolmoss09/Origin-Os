import { Resend } from "resend";

async function test() {
  const resend = new Resend("re_QgAQw9nQ_NKLw9XvdpUtkfhDqREeZrhvt");
  console.log("Enviando email de prueba...");

  try {
    const { data, error } = await resend.emails.send({
      from: "Origin OS <onboarding@resend.dev>",
      to: ["businesslucia09@gmail.com"], // We know this is the user's email
      subject: "Test de Integración - Origin OS",
      html: "<p>Hola Lucía, si ves esto significa que la API de Resend está perfectamente conectada al servidor.</p>"
    });

    if (error) {
      console.error("Error de Resend:", error);
    } else {
      console.log("Email enviado con éxito! ID:", data?.id);
    }
  } catch (error) {
    console.error("Error de catch:", error);
  }
}

test();
