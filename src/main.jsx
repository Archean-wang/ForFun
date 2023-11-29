import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Snake from './games/snake/index.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <App />
  },
  {
    path: '/snake',
    element: <Snake />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
