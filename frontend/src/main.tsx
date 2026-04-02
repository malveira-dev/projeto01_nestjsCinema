import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-right"
      toastOptions={{
        style: {
          background: '#27272a',
          color: '#f4f4f5',
          border: '1px solid #3f3f46',
        },
      }}
    />
  </StrictMode>,
)
