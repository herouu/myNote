# Capacitor + Vue 3 App

A cross-platform mobile app built with Capacitor and Vue 3.

## 🚀 Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Build Tool
- **Vue Router** - Official Router for Vue.js
- **Pinia** - Intuitive Store for Vue
- **Capacitor** - Cross-platform Native Runtime

## 📦 Installation

Make sure you have Node.js installed (v18 or higher recommended).

```bash
# Install dependencies
npm install
```

## 🔧 Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Development

```bash
# Sync web assets to native platforms
npx capacitor sync

# Open Android project
npx capacitor open android

# Run on iOS (macOS only)
npx capacitor open ios
```

## 📂 Project Structure

```
my-app/
├── src/
│   ├── main.js              # Vue app entry point
│   ├── App.vue              # Root component
│   ├── index.html           # HTML entry point
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── views/
│   │   ├── Home.vue         # Home page
│   │   └── About.vue       # About page
│   ├── stores/
│   │   └── app.js          # Pinia store example
│   ├── components/         # Reusable components
│   ├── css/                # Global styles
│   └── assets/             # Static assets
├── android/                # Android native project
├── dist/                   # Build output
├── capacitor.config.json   # Capacitor configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## ✨ Features

- ✅ Vue 3 Composition API with `<script setup>`
- ✅ Vue Router for page navigation
- ✅ Pinia for state management
- ✅ Capacitor Camera plugin integration
- ✅ PWA support
- ✅ Hot Module Replacement (HMR) with Vite
- ✅ Cross-platform (iOS, Android, Web)

## 📚 Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

