# Chatbot
- UI: app/components/ChatWidget.tsx (floating button, posts to /api/chat)
- API: app/api/chat/route.ts (Node runtime for dev; switch to Edge later)
- Model: Groq "llama-3.1-8b-instant" (fallback: "llama-3.1-70b-versatile")
- System prompt (generic, no hardcoded sectors):
  "You are the assistant for the Heartland Community Network Data Library.
   The site is organized into multiple data sectors, each with a dashboard.
   Be concise, don’t invent numbers; if asked for stats, point to dashboards."
- Future: RAG-lite (inject KPI facts from JSON/DB before calling model)
