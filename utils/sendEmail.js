// Envoi via l'API HTTP de Brevo (HTTPS, port 443) plutôt que via SMTP
// classique. De nombreux hébergeurs (Railway, Render, Heroku...) bloquent
// les connexions SMTP sortantes par mesure anti-spam ; l'API HTTP contourne
// ce blocage puisqu'elle passe par le même protocole qu'un site web normal.

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
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Jezeryshop", email: process.env.FROM_EMAIL_ADDRESS },
        to: [{ email: process.env.NOTIFY_EMAIL }],
        subject: `Nouvelle réservation Jezeryshop — ${orderNumber}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Brevo API a répondu ${res.status} : ${body}`);
    }
  } catch (err) {
    console.error("Échec de l'envoi de la notification e-mail :", err.message);
  }
}