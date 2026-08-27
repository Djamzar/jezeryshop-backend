import rateLimit from "express-rate-limit";

// Limite les réservations : évite le spam de fausses commandes.
export const reservationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Trop de tentatives. Réessayez dans quelques minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite les tentatives de connexion admin : anti force-brute.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives de connexion. Réessayez plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});
