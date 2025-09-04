import React from 'react'
import { Home, Zap, BarChart3, Settings, HelpCircle } from 'lucide-react'

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'generator', icon: Zap, label: 'AI Generator' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' }
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
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent/20 text-accent border border-accent/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 hidden sm:block">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Upgrade Prompt */}
      <div className="hidden sm:block p-4 border-t border-white/20">
        <div className="glass-card p-4 rounded-lg">
          <h3 className="font-semibold text-sm text-white mb-2">Upgrade to Pro</h3>
          <p className="text-white/60 text-xs mb-3">Unlock unlimited generations</p>
          <button className="w-full bg-accent text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar