import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import reservationRoutes from "./routes/reservations.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PATCH"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);

// Gestionnaire d'erreurs générique (filet de sécurité)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur serveur inattendue." });
});

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur Jezeryshop démarré sur le port ${PORT}`);
  });
});
