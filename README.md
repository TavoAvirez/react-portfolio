# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# React Portfolio

A collection of **React projects and practice demos** showcasing different concepts, components, and integrations.  
This repository serves both as a **learning journey** and a **portfolio** to highlight my skills in React development.

---

## 📂 Projects Included
- **Counter Demo** → basic state management with hooks.  
- **Todo List** → controlled components, lists, and CRUD basics.  
- **Clock Demo** → working with side effects and intervals.  
- **Pokédex** → API integration, pagination, and dynamic UI.  
- **Dynamic JSON Form** → schema-driven form rendering with validation.  
- **Theme Switcher** → context API usage and custom hooks for theming.  
- **Rick & Morty Explorer** → data fetching with TanStack Query, pagination, and prefetching.  

*(More projects will be added as I continue practicing and learning.)*

---

## 🛠️ Tech Stack
- **React 18+** with TypeScript  
- **React Router** for SPA navigation  
- **TanStack Query (React Query)** for data fetching & caching  
- **Bootstrap 5** for styling  
- **Vite** as the build tool  

---

## 🚀 Getting Started
Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-username>/react-portfolio.git
cd react-portfolio
npm install
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🎯 Goals
- Build reusable components and patterns.  
- Explore real-world libraries like TanStack Query, React Hook Form, etc.  
- Document learning progress through small, focused demos.  
- Showcase React skills for interviews and portfolio purposes.  

---

## 📌 Notes
This repository is a **work in progress**. New features and projects will be added over time as part of continuous learning and experimentation.