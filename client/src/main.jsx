import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router';
import { AuthProvider } from './context/authContext.jsx';
import { StockProvider } from './context/stockContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <StockProvider>
    <App />
    </StockProvider>
  </AuthProvider> 
  </BrowserRouter>,
)