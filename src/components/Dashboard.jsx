import React from 'react'
import { Upload, Zap, TrendingUp, Users } from 'lucide-react'

const Dashboard = ({ setCurrentView }) => {
  const stats = [
    { label: 'Total Creatives', value: '248', icon: Zap, change: '+12%' },
    { label: 'Avg CTR', value: '3.4%', icon: TrendingUp, change: '+0.8%' },
    { label: 'Active Campaigns', value: '12', icon: Users, change: '+3' },
    { label: 'Credits Used', value: '1,205', icon: Upload, change: '350 left' }
  ]

  const recentCreatives = [
    {
      id: 1,
      title: 'Summer Collection Ad',
      platform: 'Instagram',
      performance: 'High',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Tech Product Launch',
      platform: 'TikTok',
      performance: 'Medium',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Fashion Brand Promo',
      platform: 'Instagram',
      performance: 'High',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="glass-card p-6 sm:p-8 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to create winning ads?
            </h1>
            <p className="text-white/70 text-base sm:text-lg">
              Upload a product image and let AI generate multiple high-converting ad variations
            </p>
          </div>
          <button
            onClick={() => setCurrentView('generator')}
            className="bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Start Creating</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="glass-card p-4 sm:p-6 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-6 h-6 text-accent" />
                <span className="text-accent text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Creatives */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
          <h2 className="text-xl font-semibold text-white">Recent Ad Creatives</h2>
          <button className="text-accent hover:text-accent/80 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentCreatives.map((creative) => (
            <div key={creative.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
                <img 
                  src={creative.image} 
                  alt={creative.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-white mb-2">{creative.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">{creative.platform}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  creative.performance === 'High' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {creative.performance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard