import React, { useState } from 'react'
import ImageUploader from './ImageUploader'
import CreativeCard from './CreativeCard'
import SocialPlatformSelector from './SocialPlatformSelector'
import { generateAdVariations } from '../services/aiService'

const CreativeGenerator = ({ user }) => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState(['instagram'])
  const [adVariations, setAdVariations] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

  const handleImageUpload = (imageFile, imageUrl) => {
    setUploadedImage({ file: imageFile, url: imageUrl })
    setGenerationComplete(false)
    setAdVariations([])
  }

  const handleGenerateVariations = async () => {
    if (!uploadedImage) return

    setIsGenerating(true)
    try {
      const variations = await generateAdVariations(uploadedImage.url, selectedPlatforms)
      setAdVariations(variations)
      setGenerationComplete(true)
    } catch (error) {
      console.error('Error generating variations:', error)
      alert('Failed to generate variations. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          AI Creative Generator
        </h1>
        <p className="text-white/70">
          Upload your product image and generate multiple ad variations optimized for social media
        </p>
      </div>

      {/* Generation Process */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Upload */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-lg font-semibold text-white">Upload Image</h2>
          </div>
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>

        {/* Step 2: Select Platforms */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              uploadedImage ? 'bg-accent text-black' : 'bg-white/20 text-white/50'
            }`}>
              2
            </div>
            <h2 className="text-lg font-semibold text-white">Select Platforms</h2>
          </div>
          <SocialPlatformSelector 
            selectedPlatforms={selectedPlatforms}
            onSelectionChange={setSelectedPlatforms}
            disabled={!uploadedImage}
          />
        </div>

        {/* Step 3: Generate */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              uploadedImage ? 'bg-accent text-black' : 'bg-white/20 text-white/50'
            }`}>
              3
            </div>
            <h2 className="text-lg font-semibold text-white">Generate</h2>
          </div>
          <button
            onClick={handleGenerateVariations}
            disabled={!uploadedImage || isGenerating}
            className="w-full bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Variations'}
          </button>
          <p className="text-white/60 text-sm mt-2">
            Credits remaining: {user.creditsRemaining}
          </p>
        </div>
      </div>

      {/* Generated Variations */}
      {(isGenerating || adVariations.length > 0) && (
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Generated Ad Variations
          </h2>
          
          {isGenerating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                  <div className="aspect-square bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adVariations.map((variation, index) => (
                <CreativeCard 
                  key={index} 
                  variation={variation} 
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreativeGenerator