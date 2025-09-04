import React, { useState } from 'react'
import { Copy, Download, Share2, Heart, MessageCircle, BarChart3, ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { socialMediaService } from '../services/socialMediaService'

const CreativeCard = ({ variation, index, onPost }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [postResult, setPostResult] = useState(null)
  const [showOptimizationTips, setShowOptimizationTips] = useState(false)

  const handleCopyText = () => {
    navigator.clipboard.writeText(variation.adCopy)
    // You could add a toast notification here
  }

  const handleDownload = () => {
    // In a real app, this would download the image
    const link = document.createElement('a')
    link.href = variation.imageUrl
    link.download = `adspark-creative-${variation.id}.jpg`
    link.click()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: variation.headline,
        text: variation.adCopy,
        url: variation.imageUrl
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(variation.imageUrl)
    }
  }

  const handlePostToSocial = async (platform) => {
    setIsPosting(true)
    setPostResult(null)
    
    try {
      // In a real app, you'd have stored access tokens
      const mockAccessToken = 'mock_token_' + platform
      
      const result = await socialMediaService.postCreative(
        variation,
        platform,
        mockAccessToken
      )
      
      setPostResult({
        success: true,
        platform,
        postUrl: result.postUrl,
        message: `Successfully posted to ${platform}!`
      })
      
      if (onPost) {
        onPost(variation, platform, result)
      }
    } catch (error) {
      setPostResult({
        success: false,
        platform,
        message: error.message || `Failed to post to ${platform}`
      })
    } finally {
      setIsPosting(false)
    }
  }

  const mockStats = {
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 50) + 10,
    shares: Math.floor(Math.random() * 200) + 20,
    ctr: (Math.random() * 5 + 1).toFixed(2) + '%'
  }

  const availablePlatforms = socialMediaService.getAvailablePlatforms().filter(p => p.supported)

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/10 transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-square">
        {variation.imageUrl ? (
          <img 
            src={variation.imageUrl} 
            alt={`Ad variation ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl font-bold mb-2">{index + 1}</div>
              <div className="text-sm opacity-75">AI Generated Creative</div>
            </div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button
              onClick={handleCopyText}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Copy text"
            >
              <Copy size={18} className="text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Download"
            >
              <Download size={18} className="text-white" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
              title="Share"
            >
              <Share2 size={18} className="text-white" />
            </button>
          </div>
        </div>

        {/* Platform badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-accent text-black text-xs font-semibold px-2 py-1 rounded-full">
            {variation.platform}
          </span>
        </div>

        {/* Style badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {variation.style}
          </span>
        </div>

        {/* Performance Score */}
        {variation.performanceScore && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-500/80 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {variation.performanceScore}% Score
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Headline */}
        <h3 className="text-white font-semibold mb-2 line-clamp-2">
          {variation.headline}
        </h3>

        {/* Ad Copy */}
        <p className="text-white/70 text-sm mb-4 line-clamp-3">
          {variation.adCopy}
        </p>

        {/* Optimization Tips Toggle */}
        {variation.optimizationTips && (
          <button
            onClick={() => setShowOptimizationTips(!showOptimizationTips)}
            className="text-accent text-sm hover:text-accent/80 transition-colors mb-3"
          >
            {showOptimizationTips ? 'Hide' : 'Show'} Optimization Tips
          </button>
        )}

        {/* Optimization Tips */}
        {showOptimizationTips && variation.optimizationTips && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
            <h4 className="text-blue-200 font-medium text-sm mb-2">💡 Optimization Tips</h4>
            <ul className="text-blue-100 text-xs space-y-1">
              {variation.optimizationTips.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-400 mr-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-white/60 text-sm">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${isLiked ? 'text-red-400' : ''}`}
            >
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{mockStats.likes}</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{mockStats.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 size={16} />
              <span>{mockStats.shares}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <BarChart3 size={16} />
          </button>
        </div>

        {/* Performance Stats (Expandable) */}
        {showStats && (
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <h4 className="text-white font-medium text-sm mb-2">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-white/60">
                <span className="block">CTR</span>
                <span className="text-accent font-semibold">{mockStats.ctr}</span>
              </div>
              <div className="text-white/60">
                <span className="block">Engagement</span>
                <span className="text-accent font-semibold">{(Math.random() * 10 + 2).toFixed(1)}%</span>
              </div>
              <div className="text-white/60">
                <span className="block">Performance</span>
                <span className="text-accent font-semibold">{variation.performanceScore || 85}%</span>
              </div>
              <div className="text-white/60">
                <span className="block">Platform</span>
                <span className="text-accent font-semibold">{variation.platform}</span>
              </div>
            </div>
          </div>
        )}

        {/* Post Result */}
        {postResult && (
          <div className={`rounded-lg p-3 mb-4 ${postResult.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
            <div className="flex items-center">
              {postResult.success ? (
                <CheckCircle size={16} className="text-green-400 mr-2" />
              ) : (
                <AlertCircle size={16} className="text-red-400 mr-2" />
              )}
              <p className={`text-sm ${postResult.success ? 'text-green-200' : 'text-red-200'}`}>
                {postResult.message}
              </p>
            </div>
            {postResult.success && postResult.postUrl && (
              <a
                href={postResult.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-200 text-sm flex items-center mt-2"
              >
                View Post <ExternalLink size={14} className="ml-1" />
              </a>
            )}
          </div>
        )}

        {/* Action Button */}
        <button 
          onClick={() => setShowPostModal(true)}
          className="w-full bg-accent text-black font-semibold py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Post to Social Media
        </button>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Post to Social Media</h3>
            
            <div className="space-y-3">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePostToSocial(platform.id)}
                  disabled={isPosting}
                  className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{platform.icon}</span>
                    <span className="text-white font-medium">{platform.name}</span>
                  </div>
                  {isPosting ? (
                    <Loader2 className="animate-spin text-white" size={18} />
                  ) : (
                    <ExternalLink className="text-white/60" size={18} />
                  )}
                </button>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPostModal(false)}
                className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreativeCard
