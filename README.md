# Jezeryshop — Backend

API Express + MongoDB qui reçoit et stocke les réservations du site
Jezeryshop, envoie une notification e-mail à chaque nouvelle commande,
et expose une route protégée pour consulter/gérer les réservations.

## Installation

```bash
pnpm install
cp .env.example .env
```

Remplissez ensuite `.env` avec vos vraies valeurs (voir ci-dessous).

## Configuration de MongoDB Atlas

1. Créez un cluster gratuit sur https://cloud.mongodb.com
2. Récupérez votre chaîne de connexion (`mongodb+srv://...`)
3. Collez-la dans `MONGODB_URI` du fichier `.env`

## Créer votre mot de passe admin

Ne mettez jamais de mot de passe en clair dans `.env`. Générez un hash :

```bash
pnpm hash-password "VotreMotDePasseSuperSecret"
```

Copiez la ligne `ADMIN_PASSWORD_HASH=...` affichée dans votre `.env`.

## Configuration de l'e-mail (notifications)

Le projet utilise SMTP via `nodemailer`. Gmail SMTP fonctionne pour
tester, mais est peu fiable en production (limites de Google). Pour un
vrai lancement, un service transactionnel comme **Brevo** (ex-Sendinblue,
gratuit jusqu'à 300 e-mails/jour) ou **Mailjet** est recommandé.

Renseignez `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` et
`NOTIFY_EMAIL` (votre adresse, celle qui recevra les alertes) dans `.env`.

## Lancer le serveur

```bash
pnpm dev     # avec rechargement automatique (nodemon)
pnpm start   # en mode production
```

Le serveur écoute par défaut sur http://localhost:4000

## Routes disponibles

| Méthode | Route                          | Accès   | Description                          |
|---------|--------------------------------|---------|---------------------------------------|
| GET     | /api/health                    | Public  | Vérifier que le serveur répond        |
| POST    | /api/reservations               | Public  | Créer une réservation                 |
| GET     | /api/reservations               | Admin   | Lister toutes les réservations        |
| PATCH   | /api/reservations/:id/status    | Admin   | Changer le statut d'une réservation   |
| POST    | /api/auth/login                 | Public  | Connexion admin (retourne un JWT)     |

Pour les routes Admin, ajoutez un en-tête :
`Authorization: Bearer <token reçu au login>`

## Déploiement

Ce backend est un serveur Express classique (pas de fonctions
serverless) : il fonctionne directement sur des plateformes comme
**Railway** ou **Render**, sans adaptation particulière. Pensez à :

- Configurer les mêmes variables d'environnement que dans `.env` sur
  la plateforme d'hébergement
- Mettre à jour `ALLOWED_ORIGIN` avec l'URL réelle de votre site
  déployé sur Vercel (pas `localhost`)
