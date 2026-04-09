import { BrowserRouter } from 'react-router-dom'
import Layout from '../layout/layout/Layout'
import './App.css'
import Auth from '../auth/auth/Auth'

function App() {
  return (  
    <>
      <BrowserRouter>
        <Auth>
          <Layout />
        </Auth>
      </BrowserRouter>
    </>
  )
}

export default App
