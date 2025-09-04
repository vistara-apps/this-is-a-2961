import React from 'react'

const SocialPlatformSelector = ({ selectedPlatforms, onSelectionChange, disabled }) => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', color: 'from-black to-red-500' },
    { id: 'facebook', name: 'Facebook', color: 'from-blue-600 to-blue-800' },
    { id: 'twitter', name: 'Twitter', color: 'from-blue-400 to-blue-600' }
  ]

  const togglePlatform = (platformId) => {
    if (disabled) return
    
    if (selectedPlatforms.includes(platformId)) {
      onSelectionChange(selectedPlatforms.filter(p => p !== platformId))
    } else {
      onSelectionChange([...selectedPlatforms, platformId])
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-white/70 text-sm mb-4">
        Choose platforms to optimize your ads for:
      </p>
      
      {platforms.map((platform) => {
        const isSelected = selectedPlatforms.includes(platform.id)
        
        return (
          <label
            key={platform.id}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : isSelected 
                  ? 'bg-white/10 border border-accent/50' 
                  : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => togglePlatform(platform.id)}
              disabled={disabled}
              className="sr-only"
            />
            
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">
                {platform.name.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1">
              <span className="text-white font-medium">{platform.name}</span>
            </div>
            
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected 
                ? 'bg-accent border-accent' 
                : 'border-white/30'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default SocialPlatformSelector