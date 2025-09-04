import React from 'react'
import { Bell, User, CreditCard } from 'lucide-react'

const Header = ({ user }) => {
  return (
    <header className="border-b border-white/20 glass-card">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Welcome back!</h2>
          <p className="text-white/60 text-sm">Create amazing ad variations with AI</p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Credits */}
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
            <CreditCard className="w-4 h-4 text-accent" />
            <span className="text-sm text-white">{user.creditsRemaining} credits</span>
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-white/70" />
          </button>

          {/* Profile */}
          <button className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
            <User className="w-4 h-4 text-white/70" />
            <span className="hidden sm:block text-sm text-white">{user.subscriptionTier}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header