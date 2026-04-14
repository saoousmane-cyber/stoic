# 🌟 AURA & LOGOS

<p align="center">
  <img src="/branding/logo.svg" alt="AURA & LOGOS" width="400"/>
</p>

<p align="center">
  <strong>Générateur automatisé de contenu vidéo/audio pour créateurs</strong>
</p>

<p align="center">
  🏛️ Stoïcisme • 🧘 Méditation • 📜 Histoire • 💭 Philosophie • 🧠 Psychologie • ✨ Spiritualité • 📈 Développement personnel • ⚡ Mythologie
</p>

<p align="center">
  <a href="#features">Fonctionnalités</a> •
  <a href="#tech-stack">Stack technique</a> •
  <a href="#installation">Installation</a> •
  <a href="#deployment">Déploiement</a> •
  <a href="#license">Licence</a>
</p>

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)
- [API](#api)
- [Plan de développement](#plan-de-développement)
- [Licence](#licence)

---

## 🎯 Aperçu

**AURA & LOGOS** est un SaaS qui automatise la création de contenu vidéo/audio pour créateurs YouTube, TikTok et podcasters.

### Problème résolu
- ❌ Montage vidéo chronophage
- ❌ Voix off robotique ou coûteuse
- ❌ Scripts SEO difficiles à rédiger
- ❌ Sous-titrage manuel fastidieux

### Solution
- ✅ Génération automatique de scripts optimisés (Claude 3.5 / GPT-4o mini)
- ✅ Voix off HD naturelle (OpenAI TTS)
- ✅ Sous-titres SRT synchronisés phrase par phrase
- ✅ Bundle SEO complet (titre, description, tags, hashtags)
- ✅ Effets sonores tout au long de l'audio
- ✅ Images d'ambiance libres de droits (Pixabay/Pexels)
- ✅ Bundle SEO complet (titre, description, tags, hashtags)
- ✅ Package ZIP prêt à télécharger

---

## ✨ Fonctionnalités

### Plan gratuit "L'Éveil"
| Fonctionnalité | Disponibilité |
|----------------|---------------|
| 1 génération par mois | ✅ |
| 5 minutes max par vidéo | ✅ |
| 8 niches disponibles | ✅ |
| Bundle SEO inclus | ✅ |
| Filigrane sonore | ⚠️ Optionnel |
| Voix HD | ❌ |
| Ducking audio | ❌ |

### Plan Pro (49€/mois)
| Fonctionnalité | Disponibilité |
|----------------|---------------|
| 20 heures de génération/mois | ✅ |
| 60 minutes max par vidéo | ✅ |
| Spupression du filigrane | ✅ |
| Voix HD | ✅ |
| Effets sonores  | ✅ |
| Ducking audio (-6dB) | ✅ |
| Pack images (20/images) | ✅ |
| Assistant de réécriture IA | ✅ |
| Export JSON + VTT | ✅ |
| Support prioritaire | ✅ |

### Langues supportées
- 🇫🇷 Français
- 🇬🇧 English
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇵🇹 Português

---

## 🛠 Stack technique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Animations**: Framer Motion
- **État**: React Hooks + Context

### Backend
- **API Routes**: Next.js API Routes
- **Auth**: NextAuth.js + Google OAuth
- **Base de données**: Supabase (PostgreSQL)
- **Cache**: Upstash Redis
- **File d'attente**: Upstash Redis (rate limiting)

### IA & Services
- **Génération texte**: OpenRouter (Claude 3.5 Sonnet / GPT-4o mini)
- **Synthèse vocale**: OpenAI TTS (HD)
- **Images**: Pixabay API + Pexels API
- **Paiements**: Stripe
- **Emails**: Resend

### Hébergement
- **Platform**: Vercel (Plan Pro en production)
- **CDN**: Vercel Edge Network
- **Régions**: Paris (cdg1)

---

## 🏗 Architecture
┌─────────────────────────────────────────────────────────────┐
│ Client (Next.js) │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Landing │ │Dashboard │ │ Pricing │ │ Blog │ │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│ │ │ │ │ │
│ └─────────────┼─────────────┼─────────────┘ │
│ ▼ ▼ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ NextAuth.js │ │ API Routes│ │
│ └──────┬──────┘ └──────┬──────┘ │
└─────────────────────┼───────────────┼───────────────────────┘
│ │
┌────────────┼───────────────┼────────────┐
▼ ▼ ▼ ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Supabase │ │ Redis │ │ Stripe │ │ OpenRouter│
│ (DB) │ │ (Cache) │ │(Payment) │ │ (LLM) │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
│
▼
┌──────────┐
│ OpenAI │
│ (TTS) │
└──────────┘

---

## 🚀 Installation

### Prérequis
- Node.js >= 18.17.0
- npm >= 9.0.0
- Comptes API (gratuits pour Phase 1):
  - [Supabase](https://supabase.com)
  - [Upstash Redis](https://upstash.com)
  - [OpenRouter](https://openrouter.ai) (1$ offert)
  - [OpenAI](https://platform.openai.com) (5$ minimum)
  - [Pixabay](https://pixabay.com)
  - [Pexels](https://pexels.com)
  - [Resend](https://resend.com)

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/auraandlogos/aura-and-logos.git
cd aura-and-logos