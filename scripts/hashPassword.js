// Génère un hash bcrypt à partir d'un mot de passe en clair.
// Usage : node scripts/hashPassword.js "MonMotDePasseSuperSecret"
// Copiez le résultat dans ADMIN_PASSWORD_HASH de votre fichier .env

import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("Usage : node scripts/hashPassword.js \"votre_mot_de_passe\"");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAjoutez cette ligne dans votre fichier .env :\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
