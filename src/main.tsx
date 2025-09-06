import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import { HashRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/themeContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// crear el client
const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>,
)
