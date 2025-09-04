import React, { useState } from 'react'
import { Download, Share, Heart, MessageCircle } from 'lucide-react'

const CreativeCard = ({ variation, index }) => {
  const [isPosting, setIsPosting] = useState(false)

  const handlePost = async (platform) => {
    setIsPosting(true)
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsPosting(false)
    alert(`Posted to ${platform} successfully!`)
  }

  const handleDownload = () => {
    // Create a download link for the image
    const link = document.createElement('a')
    link.href = variation.imageUrl
    link.download = `ad-variation-${index + 1}.jpg`
    link.click()
  }

  return (
    <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300">
      {/* Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        {variation.imageUrl ? (
          <img 
            src={variation.imageUrl} 
            alt={`Ad variation ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-white">
            <div className="text-6xl font-bold mb-2">{index + 1}</div>
            <div className="text-sm opacity-75">AI Generated Creative</div>
          </div>
        )}
      </div>

      {/* Ad Copy */}
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-2">
          {variation.headline || `Creative Variation ${index + 1}`}
        </h3>
        <p className="text-white/70 text-sm line-clamp-3">
          {variation.adCopy || "🚀 Transform your style with our amazing product! Perfect for modern lifestyle. Get yours today and experience the difference. Limited time offer - don't miss out! #StyleGoals #Innovation"}
        </p>
      </div>

      {/* Platform & Style */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
          {variation.platform || 'Instagram'}
        </span>
        <span className="text-xs text-white/60">
          {variation.style || 'Trendy'}
        </span>
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center space-x-4 mb-4 text-white/60">
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4" />
          <span className="text-xs">{Math.floor(Math.random() * 1000) + 100}</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{Math.floor(Math.random() * 50) + 10}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Share className="w-4 h-4" />
          <span className="text-xs">{Math.floor(Math.random() * 25) + 5}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => handlePost(variation.platform || 'Instagram')}
          disabled={isPosting}
          className="w-full bg-accent text-black px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isPosting ? 'Posting...' : `Post to ${variation.platform || 'Instagram'}`}
        </button>
        <button
          onClick={handleDownload}
          className="w-full bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}

export default CreativeCard