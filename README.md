# TripLedger 🌌

**A sophisticated expense management dashboard for travelers who value clarity and design.**

[![Status: In-Progress](https://img.shields.io/badge/status-in--progress-f59e0b?style=flat-square)](https://github.com/KanhaiyaBagul/TripLedger)
[![Framework: Next.js](https://img.shields.io/badge/framework-Next.js%2014-7c3aed?style=flat-square)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/database-Supabase-10b981?style=flat-square)](https://supabase.com/)

---

[Live Demo](https://tripledger.vercel.app) | [Repository](https://github.com/KanhaiyaBagul/TripLedger)

![TripLedger Dashboard Screenshot](https://via.placeholder.com/1200x600/0f172a/f8fafc?text=TripLedger+Dark+Glassmorphism+UI)

## 🔭 The Vision

TripLedger isn't just another expense tracker. It’s built for travelers who want a premium, high-contrast experience that feels both trustworthy and modern. Inspired by the "night-mode productivity" aesthetic, it leverages **Dark Glassmorphism** to keep data-dense dashboards breathable, elegant, and focused.

## 🚀 Key Highlights

- **Automated Settlement Engine**: Solves the "who-owes-who" headache by calculating the most efficient path to zero balances with one click.
- **Real-Time Synergy**: Optimistic updates powered by **Zustand** and **Supabase Realtime** ensure a silk-smooth feel even on unreliable travel Wi-Fi.
- **Micro-Interactions**: Fluid, high-performance transitions using **Framer Motion** that prioritize user focus and tactile feedback.
- **Secure Authentication**: Robust session management and user isolation via **Supabase Auth**.

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Custom Dark Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand (with Persist)

### Backend & Infrastructure
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL via Supabase
- **Validation**: Zod (Schema-driven forms)
- **Deployment**: Vercel

## ⚙️ Development Setup

To run this project locally, ensure you have Node.js and npm installed.

```bash
# 1. Clone the repository
git clone https://github.com/KanhaiyaBagul/TripLedger.git

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env.local file with:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 4. Start the development server
npm run dev
```

## 📈 Status & Roadmap
- [x] Core Authentication & UI Core
- [x] Trip & Expense Management
- [/] **In-Progress**: Settlement Engine optimization
- [ ] Mobile App (PWA) development
- [ ] AI-powered receipt scanning

---
*Created with focus by [Kanhaiya Bagul](https://github.com/KanhaiyaBagul).*
