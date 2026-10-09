import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// BrowserRouter, not HashRouter: real paths mean /services is a URL the server
// and search engines both see, and an unknown path like /anything actually
// reaches the router and renders the 404 page. With a hash router the server
// only ever sees "/", so every bogus path silently rendered the home page.
//
// `basename` follows Vite's base so the app still works when it is deployed
// under a sub-path rather than the domain root.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
