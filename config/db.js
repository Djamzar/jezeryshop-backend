import mongoose from "mongoose";

export async function connectDB() {
  // Corrige les erreurs ECONNREFUSED liées à la résolution DNS
  // spécifique à certains réseaux (nécessaire notamment en Algérie).
  const { setServers } = await import("node:dns/promises");
  setServers(["8.8.8.8", "8.8.4.4"]);

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Échec de connexion MongoDB :", err.message);
    process.exit(1);
  }
}
