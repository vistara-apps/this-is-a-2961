import axios from 'axios'
import { socialPostService } from './supabaseService'

// Instagram API Integration
export const instagramService = {
  // Get Instagram authorization URL
  getAuthUrl() {
    const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/instagram/callback`
    const scope = 'user_profile,user_media'
    
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
  },

  // Exchange code for access token
  async getAccessToken(code) {
    try {
      const response = await axios.post('/api/instagram/token', {
        code,
        redirect_uri: `${window.location.origin}/auth/instagram/callback`
      })
      
      return response.data.access_token
    } catch (error) {
      console.error('Error getting Instagram access token:', error)
      throw error
    }
  },

  // Post image to Instagram
  async postToInstagram(accessToken, imageUrl, caption) {
    try {
      // Step 1: Create media container
      const containerResponse = await axios.post('/api/instagram/media', {
        access_token: accessToken,
        image_url: imageUrl,
        caption: caption
      })
      
      const containerId = containerResponse.data.id
      
      // Step 2: Publish the media
      const publishResponse = await axios.post('/api/instagram/publish', {
        access_token: accessToken,
        creation_id: containerId
      })
      
      return {
        success: true,
        postId: publishResponse.data.id,
        postUrl: `https://www.instagram.com/p/${publishResponse.data.id}/`
      }
    } catch (error) {
      console.error('Error posting to Instagram:', error)
      throw error
    }
  },

  // Get user's Instagram profile
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get('/api/instagram/me', {
        params: { access_token: accessToken }
      })
      
      return response.data
    } catch (error) {
      console.error('Error getting Instagram profile:', error)
      throw error
    }
  }
}

// TikTok API Integration
export const tiktokService = {
  // Get TikTok authorization URL
  getAuthUrl() {
    const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
    const redirectUri = `${window.location.origin}/auth/tiktok/callback`
    const scope = 'user.info.basic,video.upload'
    
    return `https://www.tiktok.com/auth/authorize/?client_key=${clientKey}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`
  },

  // Exchange code for access token
  async getAccessToken(code) {
    try {
      const response = await axios.post('/api/tiktok/token', {
        code,
        redirect_uri: `${window.location.origin}/auth/tiktok/callback`
      })
      
      return response.data.access_token
    } catch (error) {
      console.error('Error getting TikTok access token:', error)
      throw error
    }
  },

  // Upload video to TikTok
  async postToTikTok(accessToken, videoUrl, caption) {
    try {
      // Step 1: Initialize upload
      const initResponse = await axios.post('/api/tiktok/upload/init', {
        access_token: accessToken
      })
      
      const uploadUrl = initResponse.data.upload_url
      
      // Step 2: Upload video file
      const uploadResponse = await axios.post(uploadUrl, {
        video_url: videoUrl
      })
      
      // Step 3: Publish the video
      const publishResponse = await axios.post('/api/tiktok/publish', {
        access_token: accessToken,
        video_id: uploadResponse.data.video_id,
        text: caption,
        privacy_level: 'SELF_ONLY' // For testing
      })
      
      return {
        success: true,
        postId: publishResponse.data.share_id,
        postUrl: `https://www.tiktok.com/@user/video/${publishResponse.data.share_id}`
      }
    } catch (error) {
      console.error('Error posting to TikTok:', error)
      throw error
    }
  },

  // Get user's TikTok profile
  async getUserProfile(accessToken) {
    try {
      const response = await axios.get('/api/tiktok/user/info', {
        params: { access_token: accessToken }
      })
      
      return response.data.data.user
    } catch (error) {
      console.error('Error getting TikTok profile:', error)
      throw error
    }
  }
}

// Main Social Media Service
export const socialMediaService = {
  // Get available platforms
  getAvailablePlatforms() {
    return [
      {
        id: 'instagram',
        name: 'Instagram',
        icon: '📷',
        color: '#E4405F',
        supported: true
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        icon: '🎵',
        color: '#000000',
        supported: true
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        color: '#1877F2',
        supported: false // Future implementation
      },
      {
        id: 'twitter',
        name: 'Twitter/X',
        icon: '🐦',
        color: '#1DA1F2',
        supported: false // Future implementation
      }
    ]
  },

  // Connect to a social media platform
  async connectPlatform(platform) {
    switch (platform) {
      case 'instagram':
        window.location.href = instagramService.getAuthUrl()
        break
      case 'tiktok':
        window.location.href = tiktokService.getAuthUrl()
        break
      default:
        throw new Error(`Platform ${platform} not supported yet`)
    }
  },

  // Post creative to platform
  async postCreative(creative, platform, accessToken) {
    try {
      let result
      
      switch (platform) {
        case 'instagram':
          result = await instagramService.postToInstagram(
            accessToken,
            creative.imageUrl,
            `${creative.headline}\n\n${creative.adCopy}`
          )
          break
        case 'tiktok':
          // For TikTok, we'd need to convert image to video
          // This is a simplified implementation
          result = await tiktokService.postToTikTok(
            accessToken,
            creative.imageUrl, // Would need video conversion
            `${creative.headline}\n\n${creative.adCopy}`
          )
          break
        default:
          throw new Error(`Platform ${platform} not supported`)
      }

      // Save post record to database
      if (result.success && creative.id) {
        await socialPostService.savePost(
          creative.id,
          platform,
          result.postUrl,
          'posted'
        )
      }

      return result
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error)
      
      // Save failed post record
      if (creative.id) {
        await socialPostService.savePost(
          creative.id,
          platform,
          null,
          'failed'
        )
      }
      
      throw error
    }
  },

  // Get user's connected accounts
  async getConnectedAccounts(userId) {
    // This would typically be stored in the database
    // For now, return mock data
    return [
      {
        platform: 'instagram',
        username: '@demo_account',
        connected: true,
        profilePicture: 'https://via.placeholder.com/40'
      }
    ]
  },

  // Disconnect platform
  async disconnectPlatform(platform, userId) {
    // Remove stored access tokens and account info
    // This would be implemented based on your auth storage strategy
    console.log(`Disconnecting ${platform} for user ${userId}`)
  },

  // Get posting analytics
  async getPostingAnalytics(userId) {
    try {
      const posts = await socialPostService.getUserPosts(userId)
      
      const analytics = {
        totalPosts: posts.length,
        successfulPosts: posts.filter(p => p.post_status === 'posted').length,
        failedPosts: posts.filter(p => p.post_status === 'failed').length,
        platformBreakdown: {}
      }
      
      // Calculate platform breakdown
      posts.forEach(post => {
        if (!analytics.platformBreakdown[post.platform]) {
          analytics.platformBreakdown[post.platform] = 0
        }
        analytics.platformBreakdown[post.platform]++
      })
      
      return analytics
    } catch (error) {
      console.error('Error getting posting analytics:', error)
      return {
        totalPosts: 0,
        successfulPosts: 0,
        failedPosts: 0,
        platformBreakdown: {}
      }
    }
  }
}

// Mock API endpoints for development
// In production, these would be actual backend endpoints
export const mockApiEndpoints = {
  '/api/instagram/token': async (data) => {
    // Mock Instagram token exchange
    return { access_token: 'mock_instagram_token_' + Date.now() }
  },
  
  '/api/instagram/media': async (data) => {
    // Mock Instagram media container creation
    return { id: 'mock_container_' + Date.now() }
  },
  
  '/api/instagram/publish': async (data) => {
    // Mock Instagram media publishing
    return { id: 'mock_post_' + Date.now() }
  },
  
  '/api/tiktok/token': async (data) => {
    // Mock TikTok token exchange
    return { access_token: 'mock_tiktok_token_' + Date.now() }
  },
  
  '/api/tiktok/upload/init': async (data) => {
    // Mock TikTok upload initialization
    return { upload_url: 'https://mock-upload-url.com' }
  },
  
  '/api/tiktok/publish': async (data) => {
    // Mock TikTok video publishing
    return { share_id: 'mock_share_' + Date.now() }
  }
}

// Development mode interceptor
if (import.meta.env.DEV) {
  // Intercept axios requests for development
  axios.interceptors.request.use(async (config) => {
    const mockEndpoint = mockApiEndpoints[config.url]
    if (mockEndpoint) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockResponse = await mockEndpoint(config.data)
      
      // Return mock response
      return Promise.reject({
        response: {
          data: mockResponse,
          status: 200
        },
        config,
        isAxiosError: true,
        mockResponse: true
      })
    }
    return config
  })
  
  // Handle mock responses
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.mockResponse) {
        return Promise.resolve(error.response)
      }
      return Promise.reject(error)
    }
  )
}
