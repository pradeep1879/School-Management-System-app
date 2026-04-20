import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './app/queryClient.ts'
import { Toaster } from './components/ui/sonner.tsx'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <QueryClientProvider client={queryClient}>    
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
        <App />
        <Toaster/>
    </ThemeProvider>
   </QueryClientProvider> 
  </StrictMode>,
)
