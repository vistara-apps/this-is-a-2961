import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

// Performance-driven creative elements database
const performanceElements = {
  instagram: {
    highPerformingWords: ['exclusive', 'limited', 'trending', 'viral', 'must-have', 'game-changer', 'breakthrough'],
    effectiveEmojis: ['🔥', '✨', '💎', '🚀', '⚡', '💯', '🌟'],
    callToActions: ['Shop now', 'Get yours', 'Don\'t miss out', 'Limited time', 'Swipe up', 'Link in bio'],
    bestPractices: {
      captionLength: '125-150 characters',
      hashtagCount: '5-10 hashtags',
      postingTimes: ['11am-1pm', '7pm-9pm'],
      visualElements: ['bright colors', 'clear product focus', 'lifestyle context']
    }
  },
  tiktok: {
    highPerformingWords: ['viral', 'trending', 'hack', 'secret', 'obsessed', 'game-changer', 'mind-blown'],
    effectiveEmojis: ['🤯', '🔥', '💯', '✨', '🚀', '👀', '💎'],
    callToActions: ['Try this', 'You need this', 'Mind = blown', 'This changed everything', 'Don\'t scroll'],
    bestPractices: {
      captionLength: '100-150 characters',
      hashtagCount: '3-5 hashtags',
      postingTimes: ['6am-10am', '7pm-9pm'],
      visualElements: ['dynamic movement', 'quick cuts', 'trending sounds', 'text overlays']
    }
  },
  facebook: {
    highPerformingWords: ['discover', 'learn', 'save', 'family', 'community', 'trusted', 'proven'],
    effectiveEmojis: ['👍', '❤️', '🎯', '✅', '🏆', '💪', '🌟'],
    callToActions: ['Learn more', 'Shop now', 'Get started', 'Join us', 'Discover more'],
    bestPractices: {
      captionLength: '40-80 characters',
      hashtagCount: '1-3 hashtags',
      postingTimes: ['1pm-3pm', '8pm-9pm'],
      visualElements: ['clear messaging', 'social proof', 'lifestyle imagery']
    }
  }
}

// AI-powered performance optimization
export const generatePerformanceOptimizedCopy = async (platform, productContext, style) => {
  const platformData = performanceElements[platform] || performanceElements.instagram
  
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are an expert ${platform} ad copywriter with deep knowledge of platform-specific performance metrics. 
          
          Use these high-performing elements for ${platform}:
          - Words: ${platformData.highPerformingWords.join(', ')}
          - Emojis: ${platformData.effectiveEmojis.join(' ')}
          - CTAs: ${platformData.callToActions.join(', ')}
          - Best practices: ${JSON.stringify(platformData.bestPractices)}
          
          Create ${style.toLowerCase()} copy that incorporates proven performance elements while maintaining authenticity.`
        },
        {
          role: "user",
          content: `Create compelling ${platform} ad copy for: ${productContext}. 
          Style: ${style}
          Include performance-optimized elements and a strong CTA.
          Keep within optimal character limits for ${platform}.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    return completion.choices[0]?.message?.content || generateFallbackCopy(platform, style)
  } catch (error) {
    console.error('Error generating optimized copy:', error)
    return generateFallbackCopy(platform, style)
  }
}

// Generate creative suggestions based on performance data
export const generateCreativeSuggestions = async (imageUrl, platforms) => {
  const suggestions = []
  
  for (const platform of platforms) {
    const platformData = performanceElements[platform] || performanceElements.instagram
    
    suggestions.push({
      platform,
      visualSuggestions: platformData.bestPractices.visualElements,
      textSuggestions: {
        highPerformingWords: platformData.highPerformingWords.slice(0, 3),
        recommendedEmojis: platformData.effectiveEmojis.slice(0, 3),
        effectiveCTAs: platformData.callToActions.slice(0, 2)
      },
      timingSuggestions: platformData.bestPractices.postingTimes,
      engagementTips: [
        `Use ${platformData.bestPractices.hashtagCount} for optimal reach`,
        `Keep captions around ${platformData.bestPractices.captionLength}`,
        `Post during peak times: ${platformData.bestPractices.postingTimes.join(' or ')}`
      ]
    })
  }
  
  return suggestions
}

// Enhanced ad variation generation with performance optimization
export const generateAdVariations = async (imageUrl, platforms, productContext = '') => {
  try {
    const variations = []
    const creativeSuggestions = await generateCreativeSuggestions(imageUrl, platforms)
    
    const styles = ['Trendy', 'Elegant', 'Bold', 'Minimalist', 'Vibrant']
    const headlines = [
      'Transform Your Style Today',
      'Limited Time Exclusive Offer', 
      'The Perfect Addition to Your Life',
      'Trending Now - Don\'t Miss Out',
      'Upgrade Your Experience'
    ]
    
    for (let i = 0; i < 5; i++) {
      const platform = platforms[i % platforms.length]
      const style = styles[i]
      
      // Generate performance-optimized ad copy
      const adCopy = await generatePerformanceOptimizedCopy(platform, productContext, style)
      
      // Get platform-specific suggestions
      const platformSuggestions = creativeSuggestions.find(s => s.platform === platform)
      
      variations.push({
        id: `variation-${i + 1}`,
        imageUrl: imageUrl,
        adCopy: adCopy,
        headline: headlines[i],
        platform: platform,
        style: style,
        createdAt: new Date().toISOString(),
        performanceScore: Math.floor(Math.random() * 30) + 70, // Mock performance score 70-100
        suggestions: platformSuggestions,
        optimizationTips: [
          `This ${style.toLowerCase()} style performs well on ${platform}`,
          `Consider posting during ${platformSuggestions?.timingSuggestions?.[0] || 'peak hours'}`,
          `Use trending hashtags for better reach`
        ]
      })
    }

    return variations
  } catch (error) {
    console.error('Error generating ad variations:', error)
    
    // Return enhanced fallback data with performance insights
    return generateFallbackVariations(imageUrl, platforms)
  }
}

// Generate fallback copy when AI fails
const generateFallbackCopy = (platform, style) => {
  const platformData = performanceElements[platform] || performanceElements.instagram
  const randomWord = platformData.highPerformingWords[Math.floor(Math.random() * platformData.highPerformingWords.length)]
  const randomEmoji = platformData.effectiveEmojis[Math.floor(Math.random() * platformData.effectiveEmojis.length)]
  const randomCTA = platformData.callToActions[Math.floor(Math.random() * platformData.callToActions.length)]
  
  return `${randomEmoji} ${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)} product perfect for your lifestyle! ${randomCTA} and experience the difference. #${platform} #trending`
}

// Generate fallback variations with performance data
const generateFallbackVariations = (imageUrl, platforms) => {
  const styles = ['Trendy', 'Elegant', 'Bold', 'Minimalist', 'Vibrant']
  const headlines = [
    'Transform Your Style Today',
    'Limited Time Exclusive Offer',
    'The Perfect Addition to Your Life', 
    'Trending Now - Don\'t Miss Out',
    'Upgrade Your Experience'
  ]
  
  const fallbackCopies = [
    '🚀 Transform your style with our amazing product! Perfect for modern lifestyle. Get yours today and experience the difference. Limited time offer - don\'t miss out! #StyleGoals #Innovation',
    '✨ Elevate your everyday with premium quality that speaks for itself. Join thousands of satisfied customers who made the switch. Exclusive deal ends soon! #Premium #Quality',
    '🔥 BREAKING: The product everyone\'s talking about is finally here! Don\'t let this opportunity slip away. Order now and join the revolution! #Trending #MustHave',
    'Simple. Effective. Essential. Everything you need, nothing you don\'t. Experience minimalist perfection. Available for a limited time only. #Minimalist #Essential',
    '🌈 Bring color to your world with our vibrant collection! Stand out from the crowd and express your unique personality. Shop the collection now! #Vibrant #Express'
  ]
  
  return fallbackCopies.map((copy, i) => ({
    id: `variation-${i + 1}`,
    imageUrl: imageUrl,
    adCopy: copy,
    headline: headlines[i],
    platform: platforms[i % platforms.length] || 'instagram',
    style: styles[i],
    createdAt: new Date().toISOString(),
    performanceScore: Math.floor(Math.random() * 30) + 70,
    suggestions: {
      platform: platforms[i % platforms.length] || 'instagram',
      visualSuggestions: ['bright colors', 'clear product focus', 'lifestyle context'],
      textSuggestions: {
        highPerformingWords: ['exclusive', 'limited', 'trending'],
        recommendedEmojis: ['🔥', '✨', '💎'],
        effectiveCTAs: ['Shop now', 'Get yours']
      },
      timingSuggestions: ['11am-1pm', '7pm-9pm'],
      engagementTips: [
        'Use 5-10 hashtags for optimal reach',
        'Keep captions around 125-150 characters',
        'Post during peak times: 11am-1pm or 7pm-9pm'
      ]
    },
    optimizationTips: [
      `This ${styles[i].toLowerCase()} style performs well on ${platforms[i % platforms.length] || 'instagram'}`,
      'Consider posting during peak hours',
      'Use trending hashtags for better reach'
    ]
  }))
}

// Campaign testing and optimization suggestions
export const generateTestingStrategy = async (variations) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: "You are an expert in social media advertising and A/B testing. Provide strategic recommendations for testing ad variations to maximize performance."
        },
        {
          role: "user", 
          content: `I have ${variations.length} ad variations with different styles: ${variations.map(v => v.style).join(', ')}. 
          Platforms: ${[...new Set(variations.map(v => v.platform))].join(', ')}.
          Suggest an optimal testing strategy including budget allocation, testing duration, and success metrics.`
        }
      ],
      max_tokens: 300,
      temperature: 0.6
    })

    const aiStrategy = completion.choices[0]?.message?.content

    return {
      aiRecommendations: aiStrategy,
      testingFramework: {
        phase1: {
          duration: '3-5 days',
          budget: '30% of total budget',
          focus: 'Test all variations with equal budget split',
          metrics: ['CTR', 'Engagement Rate', 'Cost per Click']
        },
        phase2: {
          duration: '5-7 days', 
          budget: '70% of total budget',
          focus: 'Scale top 2-3 performing variations',
          metrics: ['Conversion Rate', 'ROAS', 'Cost per Acquisition']
        }
      },
      successMetrics: [
        'Click-through Rate (CTR) > 2%',
        'Engagement Rate > 5%',
        'Cost per Click < $0.50',
        'Return on Ad Spend (ROAS) > 3:1'
      ],
      optimizationTips: [
        'Test during different time slots to find optimal posting times',
        'Monitor audience demographics and adjust targeting',
        'A/B test different call-to-action phrases',
        'Track which visual styles perform best for your audience'
      ]
    }
  } catch (error) {
    console.error('Error generating testing strategy:', error)
    return {
      aiRecommendations: 'Test variations systematically to identify top performers, then scale successful creatives.',
      testingFramework: {
        phase1: {
          duration: '3-5 days',
          budget: '30% of total budget', 
          focus: 'Test all variations with equal budget split',
          metrics: ['CTR', 'Engagement Rate', 'Cost per Click']
        },
        phase2: {
          duration: '5-7 days',
          budget: '70% of total budget',
          focus: 'Scale top 2-3 performing variations', 
          metrics: ['Conversion Rate', 'ROAS', 'Cost per Acquisition']
        }
      },
      successMetrics: [
        'Click-through Rate (CTR) > 2%',
        'Engagement Rate > 5%', 
        'Cost per Click < $0.50',
        'Return on Ad Spend (ROAS) > 3:1'
      ],
      optimizationTips: [
        'Test during different time slots to find optimal posting times',
        'Monitor audience demographics and adjust targeting',
        'A/B test different call-to-action phrases',
        'Track which visual styles perform best for your audience'
      ]
    }
  }
}
