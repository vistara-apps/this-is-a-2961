import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import CreativeGenerator from './components/CreativeGenerator'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [user, setUser] = useState({
    email: 'demo@adspark.ai',
    subscriptionTier: 'Pro',
    creditsRemaining: 150
  })

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6">
          {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
          {currentView === 'generator' && <CreativeGenerator user={user} />}
        </main>
      </div>
    </div>
  )
}

export default App