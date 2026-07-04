# Wanderlust

Wanderlust is a modern travel and destination guide website built with Vite, React, TypeScript, and Tailwind CSS. It offers a polished, responsive experience for discovering travel inspiration, saving favorite trips, and switching seamlessly between light and dark themes.

## 🌍 Project Overview

This project was designed as a multi-page travel experience with a clean component-based architecture, interactive destination cards, a modal preview experience, and persistent user preferences via browser LocalStorage.

It includes:
- A Home page with featured destinations and a welcoming hero section
- A Destinations page with search and quick view interactions
- A Saved Trips page showing bookmarked travel ideas
- Dual-language support for English and Georgian
- A fully responsive layout for mobile, tablet, and desktop

## ✅ Features Implemented

### Core Requirements
- [x] 3+ distinct pages: Home, Destinations, and Saved Trips powered by React Router
- [x] 100% functional components using modern React hooks
- [x] Custom hooks for local persistence and API fetching
- [x] Axios-powered API integration with loading and error handling states
- [x] Browser LocalStorage persistence for bookmarks, language preference, and theme preference
- [x] Fully responsive mobile-first UI optimized for Chrome DevTools viewports
- [x] Fluid animations and interactive modal windows for destination previews

### Bonus Features
- [x] Fully typed with TypeScript for safer and cleaner development
- [x] Dynamic dark/light mode switcher
- [x] Multi-language UI support for English (EN) and Georgian (KA)

## 🧱 Project Architecture

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Modal.tsx
│   └── ...
├── context/
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   └── useFetch.ts
├── pages/
│   ├── Home.tsx
│   ├── Destinations.tsx
│   └── SavedTrips.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🛠️ Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Wanderlust
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

## 📦 Available Scripts

```bash
npm run dev     # Start the Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build locally
```

## ✨ Notes

This project follows a professional clean-code structure with separated concerns for UI, state management, services, and data persistence. It was built to be easy to extend with more destinations, richer animations, or additional languages in the future.
