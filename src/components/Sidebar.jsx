import React from 'react'
import { Home, Zap, BarChart3, Settings, HelpCircle, TestTube, Lock } from 'lucide-react'

const Sidebar = ({ currentView, setCurrentView, isAuthenticated }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', requiresAuth: false },
    { id: 'generator', icon: Zap, label: 'AI Generator', requiresAuth: false },
    { id: 'testing', icon: TestTube, label: 'A/B Testing', requiresAuth: true },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', requiresAuth: true },
    { id: 'settings', icon: Settings, label: 'Settings', requiresAuth: true },
    { id: 'help', icon: HelpCircle, label: 'Help', requiresAuth: false }
  ]

  return (
    <div className="w-16 sm:w-64 glass-card border-r border-white/20 flex flex-col">
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-white/20">
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold gradient-text">AdSpark AI</h1>
          <p className="text-white/60 text-sm mt-1">AI Ad Generator</p>
        </div>
        <div className="sm:hidden flex justify-center">
          <Zap className="w-6 h-6 text-accent" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 sm:p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            const isLocked = item.requiresAuth && !isAuthenticated
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  disabled={isLocked}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                    isActive 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : isLocked
                      ? 'text-white/40 cursor-not-allowed'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 hidden sm:block">{item.label}</span>
                  {isLocked && (
                    <Lock className="w-4 h-4 ml-auto hidden sm:block text-white/40" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Auth Status / Upgrade Prompt */}
      <div className="hidden sm:block p-4 border-t border-white/20">
        {!isAuthenticated ? (
          <div className="glass-card p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-white mb-2">🔒 Sign Up to Unlock</h3>
            <p className="text-white/60 text-xs mb-3">A/B Testing, Analytics & More</p>
            <div className="text-white/50 text-xs space-y-1 mb-3">
              <div>• Unlimited generations</div>
              <div>• Social media posting</div>
              <div>• Performance tracking</div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-white mb-2">✅ Authenticated</h3>
            <p className="text-white/60 text-xs mb-3">All features unlocked</p>
            <button className="w-full bg-accent text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
