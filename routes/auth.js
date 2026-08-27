import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// POST /api/auth/login — connexion admin (limité anti force-brute)
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail et mot de passe requis." });
  }

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || "");
  if (!match) {
    return res.status(401).json({ error: "Identifiants incorrects." });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export default router;
