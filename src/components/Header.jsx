import React from 'react'
import { Bell, User, CreditCard, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header = ({ user, isAuthenticated, onAuthClick }) => {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="border-b border-white/20 glass-card">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {isAuthenticated ? 'Welcome back!' : 'Welcome to AdSpark AI!'}
          </h2>
          <p className="text-white/60 text-sm">Create amazing ad variations with AI</p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Credits */}
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
            <CreditCard className="w-4 h-4 text-accent" />
            <span className="text-sm text-white">
              {user.creditsRemaining} {isAuthenticated ? 'credits' : 'free credits'}
            </span>
          </div>

          {/* Notifications */}
          {isAuthenticated && (
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-white/70" />
            </button>
          )}

          {/* Auth Button */}
          {!isAuthenticated ? (
            <button 
              onClick={onAuthClick}
              className="flex items-center space-x-2 bg-accent text-black px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:block">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Profile */}
              <button className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
                <User className="w-4 h-4 text-white/70" />
                <span className="hidden sm:block text-sm text-white">{user.subscriptionTier}</span>
              </button>
              
              {/* Sign Out */}
              <button 
                onClick={handleSignOut}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-white/70" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
