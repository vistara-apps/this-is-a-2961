import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
})

export const generateAdVariations = async (imageUrl, platforms) => {
  try {
    // Generate ad copy variations for each platform
    const variations = []
    
    for (let i = 0; i < 5; i++) {
      const platform = platforms[i % platforms.length]
      
      // Generate ad copy using AI
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are an expert social media ad copywriter. Create engaging, conversion-focused ad copy for ${platform}. Keep it concise and include relevant emojis.`
          },
          {
            role: "user",
            content: `Create compelling ad copy for a product image. The copy should be optimized for ${platform} and focus on driving conversions. Include a strong call-to-action.`
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })

      const adCopy = completion.choices[0]?.message?.content || `Amazing product perfect for your lifestyle! Get yours today and experience the difference. Limited time offer available. #${platform} #trending`

      // Generate creative variations
      const styles = ['Trendy', 'Elegant', 'Bold', 'Minimalist', 'Vibrant']
      const headlines = [
        'Transform Your Style Today',
        'Limited Time Exclusive Offer',
        'The Perfect Addition to Your Life',
        'Trending Now - Don\'t Miss Out',
        'Upgrade Your Experience'
      ]

      variations.push({
        id: `variation-${i}`,
        imageUrl: imageUrl, // In a real app, this would be an AI-generated variation
        adCopy: adCopy,
        headline: headlines[i],
        platform: platform,
        style: styles[i],
        createdAt: new Date().toISOString()
      })
    }

    return variations
  } catch (error) {
    console.error('Error generating ad variations:', error)
    
    // Return mock data if API fails
    return [
      {
        id: 'variation-1',
        imageUrl: imageUrl,
        adCopy: '🚀 Transform your style with our amazing product! Perfect for modern lifestyle. Get yours today and experience the difference. Limited time offer - don\'t miss out! #StyleGoals #Innovation',
        headline: 'Transform Your Style Today',
        platform: platforms[0] || 'Instagram',
        style: 'Trendy',
        createdAt: new Date().toISOString()
      },
      {
        id: 'variation-2',
        imageUrl: imageUrl,
        adCopy: '✨ Elevate your everyday with premium quality that speaks for itself. Join thousands of satisfied customers who made the switch. Exclusive deal ends soon! #Premium #Quality',
        headline: 'Limited Time Exclusive Offer',
        platform: platforms[0] || 'Instagram',
        style: 'Elegant',
        createdAt: new Date().toISOString()
      },
      {
        id: 'variation-3',
        imageUrl: imageUrl,
        adCopy: '🔥 BREAKING: The product everyone\'s talking about is finally here! Don\'t let this opportunity slip away. Order now and join the revolution! #Trending #MustHave',
        headline: 'The Perfect Addition to Your Life',
        platform: platforms[0] || 'Instagram',
        style: 'Bold',
        createdAt: new Date().toISOString()
      },
      {
        id: 'variation-4',
        imageUrl: imageUrl,
        adCopy: 'Simple. Effective. Essential. Everything you need, nothing you don\'t. Experience minimalist perfection. Available for a limited time only. #Minimalist #Essential',
        headline: 'Trending Now - Don\'t Miss Out',
        platform: platforms[0] || 'Instagram',
        style: 'Minimalist',
        createdAt: new Date().toISOString()
      },
      {
        id: 'variation-5',
        imageUrl: imageUrl,
        adCopy: '🌈 Bring color to your world with our vibrant collection! Stand out from the crowd and express your unique personality. Shop the collection now! #Vibrant #Express',
        headline: 'Upgrade Your Experience',
        platform: platforms[0] || 'Instagram',
        style: 'Vibrant',
        createdAt: new Date().toISOString()
      }
    ]
  }
}