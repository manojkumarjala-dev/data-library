# Architecture
- Frontend: Next.js (App Router), Tailwind, Framer Motion
- Pages: app/page.tsx (home), app/sector-1..4/page.tsx (dashboards)
- Shared: app/components/DashboardEmbed.tsx, LastUpdated.tsx, ChatWidget.tsx
- API: app/api/contact/route.ts (Resend), app/api/chat/route.ts (Groq)
- Data placeholders: public/status.json, public/workforce_kpis.json
- Deploy: Vercel; env vars set in Vercel → Settings → Environment
