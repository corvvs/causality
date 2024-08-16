import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import { ThemeObserver } from './components/holders/ThemeObserver.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <ThemeObserver />
    <Analytics />
  </React.StrictMode>,
)
