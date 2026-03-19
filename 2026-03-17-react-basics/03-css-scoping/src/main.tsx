import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>hello this is my CSS scoping example</h1>
    <p>i am a green paragraph</p>
    <App />
  </StrictMode>,
)
