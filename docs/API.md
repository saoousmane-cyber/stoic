# API Documentation - AURA & LOGOS

## Base URL
Development: http://localhost:3000/api
Production: https://api.auraandlogos.com


## Authentication

Toutes les routes API (sauf mention contraire) nécessitent une session authentifiée via NextAuth.js.

### Headers requis
```http
Cookie: next-auth.session-token=xxx

Endpoints
1. Génération de contenu
POST /api/generate
Génère un contenu complet (script, voix, sous-titres, images, ZIP)

Body:

json
{
  "topic": "Les 4 vertus stoïciennes",
  "niche": "stoicism",
  "language": "fr",
  "duration": 10,
  "includeSoundEffects": true,
  "soundEffectIntensity": "moderate"
}
Paramètres:

Champ	Type	Requis	Description
topic	string	✅	Sujet de la vidéo
niche	string	✅	Niche (stoicism, meditation, history, etc.)
language	string	✅	Code langue (fr, en, es, de, it, pt)
duration	number	✅	Durée en minutes (1-60)
includeSoundEffects	boolean	❌	Inclure les effets sonores
soundEffectIntensity	string	❌	light, moderate, rich
Réponse:

json
{
  "success": true,
  "generationId": "gen_1234567890",
  "downloadUrl": "/api/download/temp?token=xxx",
  "metadata": {
    "title": "Les 4 vertus stoïciennes expliquées",
    "description": "...",
    "tags": ["stoïcisme", "philosophie", "vertus"],
    "seoScore": 85
  },
  "stats": {
    "wordCount": 1500,
    "audioDuration": 600,
    "imagesFound": 5,
    "estimatedCost": 0.05
  }
}
GET /api/generation/status/[id]
Récupère le statut d'une génération

Paramètres URL:

id - ID de la génération

Réponse:

json
{
  "id": "gen_1234567890",
  "status": "completed",
  "topic": "Les 4 vertus stoïciennes",
  "niche": "stoicism",
  "language": "fr",
  "duration": 10,
  "createdAt": "2024-01-15T10:00:00Z",
  "completedAt": "2024-01-15T10:05:00Z",
  "audioUrl": "https://...",
  "srtUrl": "https://...",
  "zipUrl": "https://..."
}
DELETE /api/generation/cancel/[id]
Annule une génération en cours

Réponse:

json
{
  "success": true,
  "message": "Génération annulée avec succès"
}
GET /api/generation/download/[id]
Télécharge le contenu généré

Query params:

format - zip, audio, srt, vtt, json (défaut: zip)

Réponse: Fichier binaire

2. Utilisateur & Quota
GET /api/user/profile
Récupère le profil utilisateur

Réponse:

json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "Jean Dupont",
  "plan": "pro",
  "quotaUsed": 450,
  "quotaLimit": 1200,
  "createdAt": "2024-01-01T00:00:00Z"
}
PUT /api/user/profile
Met à jour le profil utilisateur

Body:

json
{
  "name": "Jean Dupont",
  "preferences": {
    "language": "fr",
    "notifications": true
  }
}
DELETE /api/user/profile
Supprime le compte utilisateur

GET /api/user/quota
Récupère les quotas utilisateur

Réponse:

json
{
  "plan": "pro",
  "used": 450,
  "limit": 1200,
  "remaining": 750,
  "resetDate": "2024-02-01T00:00:00Z"
}
GET /api/user/history
Récupère l'historique des générations

Query params:

limit - Nombre d'éléments (défaut: 50)

offset - Pagination

status - Filtrer par statut

niche - Filtrer par niche

Réponse:

json
{
  "generations": [...],
  "total": 42,
  "limit": 50,
  "offset": 0
}
GET /api/user/bonus
Récupère les bonus utilisateur

Réponse:

json
{
  "hasBonus": true,
  "remainingMinutes": 85,
  "totalMinutes": 120,
  "expiresAt": "2024-01-22T00:00:00Z"
}
3. Paiements & Abonnement
POST /api/payment/create-checkout
Crée une session de paiement Stripe

Body:

json
{
  "successUrl": "https://auraandlogos.com/payment/success",
  "cancelUrl": "https://auraandlogos.com/pricing"
}
Réponse:

json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_xxx"
}
GET /api/payment/subscription
Récupère les détails de l'abonnement

Réponse:

json
{
  "plan": "pro",
  "status": "active",
  "currentPeriodEnd": "2024-02-15T00:00:00Z",
  "cancelAtPeriodEnd": false
}
DELETE /api/payment/subscription
Annule l'abonnement

POST /api/payment/create-portal
Crée une session du portail client Stripe

Body:

json
{
  "returnUrl": "https://auraandlogos.com/dashboard/billing"
}
Réponse:

json
{
  "url": "https://billing.stripe.com/..."
}
GET /api/payment/invoices
Récupère l'historique des factures

Réponse:

json
{
  "invoices": [
    {
      "id": "in_xxx",
      "amount": 49,
      "currency": "eur",
      "status": "paid",
      "created": "2024-01-15T00:00:00Z",
      "pdfUrl": "https://..."
    }
  ]
}
4. Assistant IA
POST /api/assistant/rewrite
Réécrit un texte (réservé Pro)

Body:

json
{
  "text": "Texte à réécrire...",
  "action": "improve",
  "language": "fr"
}
Actions disponibles:

improve - Améliorer la qualité

shorten - Raccourcir

lengthen - Développer

simplify - Simplifier

formal - Ton formel

casual - Ton décontracté

Réponse:

json
{
  "success": true,
  "originalText": "...",
  "rewrittenText": "...",
  "action": "improve"
}
5. Essai gratuit (2h offertes)
GET /api/trial/prepaid-status
Récupère le statut de l'essai

Réponse:

json
{
  "isActive": true,
  "remainingMinutes": 85,
  "remainingDays": 5,
  "endsAt": "2024-01-22T00:00:00Z",
  "canRefund": true
}
POST /api/trial/refund
Demande un remboursement (pendant l'essai)

Réponse:

json
{
  "success": true,
  "message": "Remboursement effectué avec succès"
}
6. Images
GET /api/images/search
Recherche des images libres de droits

Query params:

q - Terme de recherche

niche - Niche pour suggestions

page - Numéro de page

limit - Éléments par page (max 50)

Réponse:

json
{
  "success": true,
  "images": [
    {
      "id": "pixabay-123",
      "url": "https://...",
      "previewUrl": "https://...",
      "author": "username",
      "source": "pixabay"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
7. Blog
GET /api/blog/search
Recherche des articles de blog

Query params:

q - Terme de recherche

category - Filtre par catégorie

page - Numéro de page

limit - Éléments par page

Réponse:

json
{
  "success": true,
  "results": [
    {
      "slug": "article-slug",
      "title": "Titre de l'article",
      "excerpt": "Extrait...",
      "author": "Jean Dupont",
      "date": "2024-01-15",
      "readTime": 5,
      "category": "Tutoriel"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
8. Newsletter
POST /api/newsletter/subscribe
Inscription à la newsletter

Body:

json
{
  "email": "user@example.com",
  "name": "Jean Dupont"
}
Réponse:

json
{
  "success": true,
  "message": "Inscription réussie ! Vérifiez votre email pour confirmer."
}
9. Santé & Monitoring
GET /api/health
Vérifie l'état des services

Réponse:

json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "uptime": 86400,
  "version": "1.0.0",
  "environment": "production",
  "latency": 45,
  "checks": {
    "database": { "status": "up", "latency": 15 },
    "stripe": { "status": "up", "latency": 120 },
    "openrouter": { "status": "up", "latency": 85 },
    "openai": { "status": "up", "latency": 95 },
    "email": { "status": "up", "latency": 60 }
  }
}
10. SEO
GET /api/sitemap
Génère le sitemap.xml

Réponse: XML

xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://auraandlogos.com/</loc>
    <lastmod>2024-01-15T00:00:00Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
GET /api/robots
Génère le robots.txt

Réponse: Texte

text
User-agent: *
Allow: /
Allow: /pricing
Allow: /blog
Disallow: /api/
Disallow: /dashboard/
Sitemap: https://auraandlogos.com/sitemap.xml
Codes d'erreur
Code	Description
200	Succès
400	Requête invalide
401	Non authentifié
403	Accès non autorisé (plan requis)
404	Ressource non trouvée
429	Trop de requêtes (rate limit)
500	Erreur serveur
Rate Limiting
Endpoint	Limite	Fenêtre
/api/generate	10 requêtes	1 heure
/api/assistant/*	50 requêtes	1 heure
/api/auth/*	5 requêtes	1 minute
Autres endpoints	100 requêtes	1 minute
Webhooks
Stripe Webhook
text
POST /api/payment/webhook
Événements gérés:

checkout.session.completed

customer.subscription.created

customer.subscription.updated

customer.subscription.deleted

invoice.paid

invoice.payment_failed

Resend Webhook
text
POST /api/email/webhook
Événements gérés:

email.delivered

email.bounced

email.opened

email.clicked

