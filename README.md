# 🔮 StoryWeaver — AI Branching Narrative Engine & RPG Studio

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-purple?logo=vercel)](https://storyweaver-toadbigode.vercel.app)
[![React 18](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Procedural_Sound-emerald)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

> **StoryWeaver** is an interactive narrative platform and RPG game engine that blends AI-assisted branching storytelling, procedural dice mechanics, character vitality stats, and world lore management in a dark arcane cyberpunk aesthetic.

---

## ✨ Key Features

1. **🎲 Interactive Choose-Your-Own-Adventure Player**:
   - Dynamic decision trees with conditional DC (Difficulty Class) stat checks.
   - Procedural Web Audio API sound generator (3D D20 dice roll clatter, success chimes, failure alerts, and page turn acoustics).
   - Real-time Player Character HUD tracking HP, Energy/Mana, Sanity, Inventory, and Attributes.

2. **✍️ Story Studio & Branch Editor**:
   - Write and configure complex multi-branch storylines, choices, consequences, and skill thresholds.
   - Built-in AI Co-Writer to generate plot twists, high-octane action sequences, character dialogues, and sensory descriptions.
   - JSON export and import for community story modules.

3. **🗺️ Visual Branching Graph**:
   - Visual topological overview of story nodes, act progression, and victory/defeat endings.

4. **📜 World Lore Codex & Character Sheet**:
   - Deep worldbuilding repository with faction summaries, artifacts, historical lore, and tagging.

5. **⚡ Full-Stack Capabilities**:
   - Client-side responsive web application built with React 18 & TypeScript.
   - Optional Python FastAPI backend in `backend/` for server-side AI integration and collaborative websockets.

---

## 🚀 Live Demo

Experience StoryWeaver directly in your browser:
👉 **[https://storyweaver-toadbigode.vercel.app](https://storyweaver-toadbigode.vercel.app)**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Vite.
- **Audio Engine**: Web Audio API (procedural synthesis without external MP3 files).
- **Backend**: Python 3.11+, FastAPI, WebSockets, SQLAlchemy (available in `backend/`).
- **Deployment**: Vercel.

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/davinascimento2/storyweaver.git

# Navigate to project root
cd storyweaver

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

---

## 👤 Author

Developed by **[Davi Nascimento](https://github.com/davinascimento2)**
Portfolio: [career-command-center-toadbigode.vercel.app](https://career-command-center-toadbigode.vercel.app)