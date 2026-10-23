import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LegalDocumentModalHost } from './pages/legal/LegalPages.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <LegalDocumentModalHost />
  </StrictMode>,
)
