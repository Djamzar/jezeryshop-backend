import { Router } from "express";
import { body, validationResult } from "express-validator";
import { Reservation } from "../models/Reservation.js";
import { requireAuth } from "../middleware/auth.js";
import { reservationLimiter } from "../middleware/rateLimiter.js";
import { sendReservationNotification } from "../utils/sendEmail.js";

const router = Router();

const KIT_PRICE = 5000;

// POST /api/reservations — créer une réservation (public, limité)
router.post(
  "/",
  reservationLimiter,
  [
    body("quantity").isInt({ min: 1, max: 20 }).withMessage("Quantité invalide."),
    body("client.nom").trim().notEmpty().withMessage("Le nom est requis."),
    body("client.telephone")
      .matches(/^0[5-7][0-9]{8}$/)
      .withMessage("Numéro de téléphone invalide."),
    body("client.wilaya").trim().notEmpty().withMessage("La wilaya est requise."),
    body("client.adresse").trim().notEmpty().withMessage("L'adresse est requise."),
    body("client.note").optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { quantity, client } = req.body;
      const total = quantity * KIT_PRICE;
      const orderNumber = `JZ-${Date.now().toString().slice(-6)}`;

      const reservation = await Reservation.create({
        orderNumber,
        quantity,
        unitPrice: KIT_PRICE,
        total,
        client,
      });

      // On répond au client tout de suite, sans attendre l'e-mail.
      res.status(201).json({
        orderNumber: reservation.orderNumber,
        total: reservation.total,
        quantity: reservation.quantity,
      });

      sendReservationNotification(reservation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de l'enregistrement de la réservation." });
    }
  }
);

// GET /api/reservations — lister les réservations (admin uniquement)
router.get("/", requireAuth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});

// PATCH /api/reservations/:id/status — changer le statut (admin uniquement)
router.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const allowed = ["en_attente", "confirmee", "livree", "annulee"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Statut invalide." });
  }

  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ error: "Réservation introuvable." });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

export default router;
