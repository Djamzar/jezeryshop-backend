import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendReservationNotification(reservation) {
  const { orderNumber, quantity, total, client } = reservation;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px;">
      <h2 style="color:#0e5b3c;">Nouvelle réservation — ${orderNumber}</h2>
      <p><strong>Produit :</strong> RoadSafe Emergency Kit × ${quantity}</p>
      <p><strong>Total à encaisser à la livraison :</strong> ${total} DA</p>
      <hr />
      <p><strong>Client :</strong> ${client.nom}</p>
      <p><strong>Téléphone :</strong> ${client.telephone}</p>
      <p><strong>Wilaya :</strong> ${client.wilaya}</p>
      <p><strong>Adresse :</strong> ${client.adresse}</p>
      ${client.note ? `<p><strong>Note :</strong> ${client.note}</p>` : ""}
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.NOTIFY_EMAIL,
      subject: `Nouvelle réservation Jezeryshop — ${orderNumber}`,
      html,
    });
  } catch (err) {
    // On ne bloque jamais la réservation si l'e-mail échoue :
    // la commande est déjà enregistrée en base, c'est le plus important.
    console.error("Échec de l'envoi de la notification e-mail :", err.message);
  }
}
