# Guide de Déploiement - Planète IA

Ce document décrit les procédures de déploiement pour le site Planète IA.

---

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Configuration initiale](#configuration-initiale)
- [Déploiement automatique](#déploiement-automatique)
- [Déploiement manuel](#déploiement-manuel)
- [Vérifications post-déploiement](#vérifications-post-déploiement)
- [Rollback](#rollback)
- [Gestion des incidents](#gestion-des-incidents)
- [Maintenance](#maintenance)

---

## ✅ Prérequis

Avant de déployer en production, assurez-vous que :

- [ ] Le code est testé localement (`npm run build` && `npm run start`)
- [ ] Toutes les variables d'environnement sont configurées sur Vercel
- [ ] MongoDB Atlas est configuré avec les backups automatiques
- [ ] Google OAuth est configuré avec les bonnes URLs de callback
- [ ] Cloudinary est configuré et opérationnel
- [ ] Resend est configuré avec un domaine vérifié
- [ ] Google Analytics 4 est configuré

---

## ⚙️ Configuration initiale

### 1. Configuration Vercel

#### a) Connecter le repository

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer le repository GitHub
4. Sélectionner "linfoia"

#### b) Configuration du projet

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### c) Variables d'environnement

Aller dans **Settings > Environment Variables** et ajouter :

**Production**
```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB=linfoia
AUTH_SECRET=<secret-de-production>
AUTH_TRUST_HOST=true
AUTH_URL=https://www.planèteia.com
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
RESEND_API_KEY=re_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_GA_ID=G-Q5JCJQR7J9
NEXT_PUBLIC_BASE_URL=https://www.planèteia.com
ADMIN_EMAILS=admin@example.com
```

**Preview (optionnel)**
- Même configuration mais avec `AUTH_URL` pointant vers l'URL de preview

**Development (optionnel)**
- Configuration locale pour tests

#### d) Domaine personnalisé

1. Aller dans **Settings > Domains**
2. Ajouter `www.planèteia.com`
3. Configurer les DNS selon les instructions Vercel
4. Attendre la propagation DNS (~24h max)

### 2. Configuration MongoDB Atlas

#### a) Activer les backups

1. Aller sur [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sélectionner votre cluster
3. Onglet **Backup**
4. Activer "Cloud Backups"
5. Configuration recommandée :
   - **Fréquence** : Quotidienne à 2h du matin UTC
   - **Rétention** : 7 jours minimum
   - **Snapshot on-demand** : Activé

#### b) Configuration de sécurité

1. **Network Access** : Whitelist `0.0.0.0/0` (Vercel utilise des IPs dynamiques)
2. **Database Access** : Créer un utilisateur avec rôle `readWrite`
3. **Monitoring** : Activer les alertes pour :
   - Utilisation CPU > 80%
   - Connexions > 80%
   - Espace disque > 80%

### 3. Configuration Google OAuth

1. Aller sur [console.cloud.google.com](https://console.cloud.google.com)
2. Sélectionner votre projet
3. **APIs & Services > Credentials**
4. Éditer l'OAuth Client ID
5. Ajouter les URIs de redirection :
   ```
   https://www.planèteia.com/api/auth/callback/google
   https://*.vercel.app/api/auth/callback/google (pour preview)
   ```

### 4. Configuration Resend

1. Aller sur [resend.com](https://resend.com)
2. Vérifier votre domaine d'envoi
3. Configurer les enregistrements DNS (SPF, DKIM, DMARC)
4. Créer une API key et l'ajouter sur Vercel

---

## 🚀 Déploiement automatique

Le déploiement est **automatique** à chaque push sur `main`.

### Workflow

```
Git push sur main
     ↓
Vercel détecte le push
     ↓
Build automatique (npm run build)
     ↓
Tests de build
     ↓
Si succès → Déploiement en production
Si échec → Notification d'erreur
```

### Notifications

Vercel envoie des notifications via :
- Email (configurable)
- Slack (optionnel)
- GitHub Checks

### Commandes Git

```bash
# Vérifier le statut
git status

# Ajouter les fichiers modifiés
git add .

# Créer un commit
git commit -m "feat: description de la feature"

# Pousser vers GitHub
git push origin main

# Le déploiement démarre automatiquement
```

---

## 🔧 Déploiement manuel

### Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

### Via GitHub Actions (optionnel)

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## ✅ Vérifications post-déploiement

### Checklist automatique

Après chaque déploiement, vérifier :

#### 1. Site accessible
```bash
curl -I https://www.planèteia.com
# Doit retourner 200 OK
```

#### 2. Headers de sécurité
```bash
curl -I https://www.planèteia.com | grep -E "(X-Frame-Options|Content-Security-Policy|X-Content-Type-Options)"
```

Attendu :
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'; ...
```

#### 3. Pages essentielles

| Page | URL | Test |
|------|-----|------|
| Accueil | `/` | Affiche slideshow et articles |
| Article | `/article/[slug]` | Contenu article visible |
| Catégorie | `/categorie/actualite` | Liste d'articles |
| Newsletter | `/newsletter` | Formulaire fonctionnel |
| Admin | `/admin` | Redirection vers login |

#### 4. API Endpoints

```bash
# Liste des articles
curl https://www.planèteia.com/api/articles

# Article spécifique
curl https://www.planèteia.com/api/articles/exemple-slug

# Newsletter (doit rate limit après 3 essais)
curl -X POST https://www.planèteia.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

#### 5. Google Analytics

1. Aller sur [analytics.google.com](https://analytics.google.com)
2. Vérifier dans **Real-time** qu'il y a des événements
3. Tester une page et voir l'événement apparaître

#### 6. Logs Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner le projet
3. Onglet **Logs**
4. Vérifier qu'il n'y a pas d'erreurs critiques

---

## 🔄 Rollback

### En cas de problème après déploiement

#### Méthode 1 : Via Vercel Dashboard (Recommandée)

1. Aller sur [vercel.com](https://vercel.com)
2. Sélectionner le projet "linfoia"
3. Onglet **Deployments**
4. Trouver le dernier déploiement **fonctionnel**
5. Cliquer sur les "..." à droite
6. Sélectionner **"Promote to Production"**
7. Confirmer

**Temps de rollback** : ~30 secondes

#### Méthode 2 : Via Git

```bash
# Revenir au commit précédent
git log --oneline -5
git revert <commit-hash>
git push origin main

# Ou reset hard (DANGER)
git reset --hard <commit-hash-fonctionnel>
git push origin main --force
```

**Temps de rollback** : ~2-3 minutes (build inclus)

#### Méthode 3 : Via CLI

```bash
# Lister les déploiements
vercel ls

# Promouvoir un déploiement spécifique
vercel promote <deployment-url>
```

---

## 🚨 Gestion des incidents

### Incident : Site inaccessible (HTTP 500)

**Diagnostic**
1. Vérifier le status Vercel : [vercel-status.com](https://www.vercel-status.com)
2. Vérifier les logs Vercel : Dashboard > Logs
3. Vérifier MongoDB Atlas : [cloud.mongodb.com](https://cloud.mongodb.com)

**Actions**
- Si erreur de build → Rollback au déploiement précédent
- Si erreur MongoDB → Vérifier connexion et whitelist IP
- Si erreur Vercel → Attendre résolution (rare)

### Incident : Newsletter ne fonctionne plus

**Diagnostic**
1. Vérifier Resend : [resend.com/emails](https://resend.com/emails)
2. Vérifier les logs : `/api/newsletter` dans Vercel Logs
3. Vérifier quota Resend

**Actions**
- Si quota dépassé → Upgrader plan Resend
- Si erreur DNS → Revérifier configuration domaine
- Si erreur API → Vérifier `RESEND_API_KEY`

### Incident : Images ne se chargent plus

**Diagnostic**
1. Vérifier Cloudinary : [cloudinary.com](https://cloudinary.com)
2. Vérifier les URLs d'images dans le code
3. Vérifier quota Cloudinary

**Actions**
- Si quota dépassé → Upgrader plan ou nettoyer images
- Si erreur d'authentification → Vérifier credentials
- Si images supprimées → Restaurer depuis backup

### Incident : Login admin ne fonctionne plus

**Diagnostic**
1. Vérifier Google OAuth : [console.cloud.google.com](https://console.cloud.google.com)
2. Vérifier `AUTH_SECRET` sur Vercel
3. Vérifier MongoDB (collection users)

**Actions**
- Si erreur OAuth → Vérifier redirect URIs
- Si session expirée → Régénérer `AUTH_SECRET`
- Si base de données → Vérifier connexion MongoDB

---

## 🔧 Maintenance

### Mise à jour des dépendances

```bash
# Vérifier les mises à jour
npm outdated

# Mettre à jour les dépendances mineures
npm update

# Mettre à jour Next.js
npm install next@latest react@latest react-dom@latest

# Tester localement
npm run build
npm run start

# Si tout fonctionne, commit et push
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push origin main
```

### Backup manuel de la base de données

```bash
# Export manuel via MongoDB Atlas
# Dashboard > Clusters > ... > Command Line Tools > Data Import and Export
mongodump --uri="mongodb+srv://..." --out=./backup-$(date +%Y%m%d)

# Ou utiliser l'interface Atlas :
# Clusters > ... > Export Data
```

### Nettoyage des images Cloudinary

```bash
# Via dashboard Cloudinary
# Media Library > Unused Assets > Delete

# Ou via API (script à créer)
node scripts/cleanup-cloudinary.js
```

### Monitoring régulier

**Quotidien**
- [ ] Vérifier Vercel Logs pour erreurs
- [ ] Vérifier Google Analytics (trafic normal)

**Hebdomadaire**
- [ ] Vérifier MongoDB Atlas (utilisation ressources)
- [ ] Vérifier Cloudinary (quota)
- [ ] Vérifier Resend (quota emails)

**Mensuel**
- [ ] Mettre à jour les dépendances
- [ ] Tester le process de rollback
- [ ] Vérifier les backups MongoDB (restauration test)
- [ ] Audit de sécurité (npm audit)

---

## 📞 Contacts d'urgence

### Support technique

- **Vercel Support** : [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas** : [support.mongodb.com](https://support.mongodb.com)
- **Cloudinary** : [support.cloudinary.com](https://support.cloudinary.com)
- **Resend** : [resend.com/support](https://resend.com/support)

### Status pages

- Vercel : [vercel-status.com](https://www.vercel-status.com)
- MongoDB Atlas : [status.mongodb.com](https://status.mongodb.com)
- Cloudinary : [status.cloudinary.com](https://status.cloudinary.com)
- Google Cloud : [status.cloud.google.com](https://status.cloud.google.com)

---

## 📊 Métriques de déploiement

### SLA Objectifs

- **Disponibilité** : 99.9% (8h de downtime max par an)
- **Temps de build** : < 3 minutes
- **Temps de déploiement** : < 1 minute
- **Temps de rollback** : < 2 minutes

### Indicateurs à surveiller

- Build time (trend)
- Error rate (< 0.1%)
- Response time (< 500ms P95)
- Uptime (99.9%+)

---

## ✅ Checklist de déploiement

Avant chaque déploiement majeur :

- [ ] Code review effectué
- [ ] Tests locaux passent
- [ ] Build local réussi
- [ ] Variables d'env à jour sur Vercel
- [ ] Backup MongoDB récent (< 24h)
- [ ] Documentation à jour
- [ ] Plan de rollback défini
- [ ] Notification équipe prévue

Après chaque déploiement :

- [ ] Site accessible
- [ ] Vérifications post-déploiement OK
- [ ] Aucune erreur dans les logs
- [ ] Google Analytics fonctionne
- [ ] Newsletter testée
- [ ] Login admin testé
- [ ] Équipe notifiée du succès

---

Pour toute question, consultez le [README.md](./README.md) ou créez une issue sur GitHub.
