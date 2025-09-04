import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import CreativeGenerator from './components/CreativeGenerator'
import CampaignTesting from './components/CampaignTesting'
import AuthModal from './components/AuthModal'

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [generatedVariations, setGeneratedVariations] = useState([])
  
  const { user, userProfile, isAuthenticated, getCreditsRemaining } = useAuth()

  // Demo user for non-authenticated state
  const demoUser = {
    email: 'demo@adspark.ai',
    subscriptionTier: 'Free',
    creditsRemaining: 5
  }

  const currentUser = isAuthenticated ? {
    email: user?.email || '',
    subscriptionTier: userProfile?.subscription_tier || 'Free',
    creditsRemaining: getCreditsRemaining()
  } : demoUser

  const handleAuthRequired = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleVariationsGenerated = (variations) => {
    setGeneratedVariations(variations)
  }

  const handleViewChange = (view) => {
    // Some views require authentication
    if (['testing', 'analytics'].includes(view) && !handleAuthRequired()) {
      return
    }
    setCurrentView(view)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleViewChange}
        isAuthenticated={isAuthenticated}
      />
      <div className="flex-1 flex flex-col">
        <Header 
          user={currentUser} 
          isAuthenticated={isAuthenticated}
          onAuthClick={() => setShowAuthModal(true)}
        />
        <main className="flex-1 p-4 sm:p-6">
          {currentView === 'dashboard' && (
            <Dashboard 
              setCurrentView={handleViewChange}
              isAuthenticated={isAuthenticated}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          )}
          {currentView === 'generator' && (
            <CreativeGenerator 
              user={currentUser}
              isAuthenticated={isAuthenticated}
              onAuthRequired={() => setShowAuthModal(true)}
              onVariationsGenerated={handleVariationsGenerated}
            />
          )}
          {currentView === 'testing' && (
            <CampaignTesting 
              variations={generatedVariations}
              onStartTest={(test) => console.log('Started test:', test)}
            />
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
