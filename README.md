# Planète IA

**Un regard éditorial sur l'intelligence artificielle** - Plateforme éditoriale Next.js pour publier et gérer des articles sur l'IA.

🌐 **Site en production** : [https://www.planèteia.com](https://www.planèteia.com)

---

## 📋 Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [Scripts disponibles](#scripts-disponibles)
- [Sécurité](#sécurité)
- [Monitoring](#monitoring)
- [Contribution](#contribution)

---

## 🛠 Technologies utilisées

- **Framework** : Next.js 16.2.4 (App Router)
- **Runtime** : React 19.2.4
- **Langage** : TypeScript 5
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : NextAuth.js v5
- **Email** : Resend
- **Images** : Cloudinary
- **Styling** : Tailwind CSS 4
- **Validation** : Zod
- **Logging** : Pino
- **Déploiement** : Vercel

---

## ✅ Prérequis

- Node.js 20+
- npm ou pnpm
- MongoDB (local ou Atlas)
- Compte Vercel (pour déploiement)
- Compte Cloudinary (pour images)
- Compte Resend (pour emails)
- Compte Google Cloud (pour OAuth)

---

## 📦 Installation

### 1. Cloner le repository

```bash
git clone <url-du-repo>
cd linfoia
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et le configurer :

```bash
cp .env.example .env.local
```

Voir la section [Configuration](#configuration) pour les détails.

### 4. Initialiser la base de données

```bash
npm run seed
```

Cette commande crée des articles d'exemple dans MongoDB.

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

#### Base de données
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=linfoia
```

#### Authentification (NextAuth.js)
```env
AUTH_SECRET=<généré avec: openssl rand -base64 32>
AUTH_TRUST_HOST=true
AUTH_URL=http://localhost:3000
```

#### Google OAuth
```env
AUTH_GOOGLE_ID=<votre-google-client-id>
AUTH_GOOGLE_SECRET=<votre-google-client-secret>
```

#### Resend (Emails)
```env
RESEND_API_KEY=re_<votre-clé-api>
```

#### Cloudinary (Images)
```env
CLOUDINARY_CLOUD_NAME=<votre-cloud-name>
CLOUDINARY_API_KEY=<votre-api-key>
CLOUDINARY_API_SECRET=<votre-api-secret>
```

#### Google Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Configuration du site
```env
NEXT_PUBLIC_BASE_URL=https://www.planèteia.com
ADMIN_EMAILS=admin@example.com,autre@example.com
```

---

## 🔧 Développement

### Structure du projet

```
linfoia/
├── src/
│   ├── app/                    # App Router (pages & layouts)
│   │   ├── api/               # API Routes
│   │   │   ├── articles/      # CRUD articles
│   │   │   ├── newsletter/    # Inscription newsletter
│   │   │   └── upload/        # Upload images
│   │   ├── admin/             # Interface admin
│   │   ├── article/           # Pages articles
│   │   └── ...
│   ├── components/            # Composants React
│   │   ├── admin/            # Composants admin
│   │   ├── article/          # Composants articles
│   │   ├── category/         # Composants catégories
│   │   └── site/             # Composants globaux
│   ├── lib/                   # Utilitaires & helpers
│   │   ├── validation.ts     # Schémas Zod
│   │   ├── logger.ts         # Logger Pino
│   │   ├── apiErrors.ts      # Gestion d'erreurs
│   │   ├── rateLimit.ts      # Rate limiting
│   │   └── ...
│   └── models/                # Modèles Mongoose
├── public/                    # Assets statiques
├── scripts/                   # Scripts utilitaires
│   └── seed.ts               # Seed database
└── ...
```

### Commandes de développement

```bash
# Développement avec hot-reload
npm run dev

# Build de production
npm run build

# Démarrer en production
npm run start

# Linter
npm run lint

# Seed la base de données
npm run seed
```

---

## 🚀 Déploiement

Le site est automatiquement déployé sur **Vercel** à chaque push sur la branche `main`.

### Configuration Vercel

1. **Connecter le repository GitHub à Vercel**
2. **Configurer les variables d'environnement** dans le dashboard Vercel
3. **Activer les déploiements automatiques**

### Déploiement manuel

```bash
# Via Vercel CLI
npx vercel

# Déploiement en production
npx vercel --prod
```

### Rollback en cas de problème

1. Aller sur le [Vercel Dashboard](https://vercel.com)
2. Sélectionner le projet
3. Onglet "Deployments"
4. Trouver le dernier déploiement fonctionnel
5. Cliquer sur "Promote to Production"

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails.

---

## 🏗 Architecture

### Flux d'authentification

```
User → Google OAuth → NextAuth.js → Session → MongoDB
                                      ↓
                               Role: admin/reader
```

### Flux de publication d'article

```
Admin → /admin/new → Form validation (Zod)
                         ↓
                    POST /api/articles
                         ↓
                    Check auth & role
                         ↓
                    Validate data (Zod)
                         ↓
                    Save to MongoDB
                         ↓
                    Log event (Pino)
```

### Flux newsletter

```
User → Form → POST /api/newsletter
                   ↓
              Rate limiting (3/hour)
                   ↓
              Validate email (Zod)
                   ↓
              Save to MongoDB
                   ↓
              Send confirmation (Resend)
                   ↓
              Log event (Pino)
```

---

## 📡 API Routes

### Articles

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/articles` | Non | Liste tous les articles publiés |
| POST | `/api/articles` | Admin | Créer un article |
| GET | `/api/articles/[slug]` | Non | Récupérer un article |
| PATCH | `/api/articles/[slug]` | Admin | Modifier un article |
| DELETE | `/api/articles/[slug]` | Admin | Supprimer un article |

### Newsletter

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/newsletter` | Non | Inscription à la newsletter (rate limit: 3/hour) |

### Upload

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/upload` | Admin | Upload d'image sur Cloudinary (rate limit: 10/hour) |

### Codes d'erreur API

Toutes les erreurs suivent ce format :

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erreur de validation",
    "details": { ... },
    "timestamp": "2026-06-16T10:30:00.000Z"
  }
}
```

Codes courants :
- `VALIDATION_ERROR` (400) : Données invalides
- `UNAUTHORIZED` (401) : Non authentifié
- `ADMIN_ONLY` (403) : Accès réservé aux admins
- `NOT_FOUND` (404) : Ressource introuvable
- `SLUG_EXISTS` (409) : Slug déjà utilisé
- `RATE_LIMIT_EXCEEDED` (429) : Trop de requêtes
- `INTERNAL_ERROR` (500) : Erreur serveur

---

## 🔐 Sécurité

### Mesures en place

✅ **Headers de sécurité** (configurés dans `next.config.ts`)
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (ajouté par Vercel)

✅ **Rate limiting**
- Newsletter : 3 inscriptions/heure par IP
- Upload : 10 uploads/heure par IP

✅ **Validation des inputs**
- Tous les endpoints utilisent Zod pour valider les données
- Protection contre injection NoSQL
- Sanitization automatique des emails

✅ **Authentification**
- NextAuth.js v5 avec JWT
- Google OAuth
- Magic links par email
- Role-based access control (admin/reader)

✅ **Protection des API**
- Vérification d'authentification sur routes sensibles
- Logs de toutes les tentatives non autorisées

### Recommandations supplémentaires

🔴 **À faire absolument** :
1. Activer les backups automatiques sur MongoDB Atlas
2. Configurer Sentry pour le monitoring d'erreurs
3. Activer Vercel Analytics

---

## 📊 Monitoring

### Logs structurés (Pino)

Les logs sont automatiquement collectés par Vercel. Format :

```json
{
  "level": "info",
  "time": "2026-06-16T10:30:00.000Z",
  "route": "/api/articles",
  "slug": "nouvel-article",
  "userId": "admin@example.com",
  "duration": 145,
  "msg": "Article created"
}
```

### Google Analytics

GA4 est configuré et track automatiquement :
- Pages vues
- Événements de navigation
- Performance (Core Web Vitals)

### Vercel Monitoring

Dans le dashboard Vercel :
- Erreurs en temps réel
- Performance des fonctions
- Trafic et requêtes
- Logs d'exécution

---

## 🧪 Tests

### Tester localement

```bash
# Build de production locale
npm run build
npm run start

# Tester sur http://localhost:3000
```

### Points à tester avant déploiement

- [ ] Page d'accueil charge correctement
- [ ] Articles s'affichent
- [ ] Inscription newsletter fonctionne
- [ ] Login admin fonctionne
- [ ] Création d'article fonctionne
- [ ] Upload d'images fonctionne
- [ ] GA4 enregistre les événements

---

## 📝 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur de développement

# Production
npm run build            # Build de production
npm run start            # Démarrer le serveur de production

# Qualité de code
npm run lint             # Vérifier le code avec ESLint

# Base de données
npm run seed             # Seed la base de données avec des données d'exemple
```

---

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche
git checkout -b feature/nom-de-la-feature

# Faire vos modifications
git add .
git commit -m "feat: description de la feature"

# Pousser sur GitHub
git push origin feature/nom-de-la-feature

# Créer une Pull Request sur GitHub
```

### Conventions de commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Zod Documentation](https://zod.dev/)

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 👥 Contact

Pour toute question ou problème, consultez la [documentation de déploiement](./DEPLOYMENT.md) ou créez une issue sur GitHub.
