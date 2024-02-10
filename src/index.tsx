import React from 'react'
import ReactDOM from 'react-dom/client'
import PathFinderSandbox from './PathFinderSandbox'
import './global.styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="h-screen">
      <PathFinderSandbox />
    </div>
  </React.StrictMode>
)
