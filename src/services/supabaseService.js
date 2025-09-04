import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// User Management
export const authService = {
  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email)
    }
    
    return data
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Create user profile
  async createUserProfile(userId, email) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          user_id: userId,
          email: email,
          subscription_tier: 'Free',
          created_at: new Date().toISOString()
        }
      ])
    
    if (error) throw error
    return data
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Update user subscription
  async updateSubscription(userId, subscriptionTier) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_tier: subscriptionTier })
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}

// Product Image Management
export const imageService = {
  // Upload product image
  async uploadImage(file, userId) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)
    
    if (error) throw error
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
    
    // Save image record to database
    const imageRecord = await this.saveImageRecord(userId, publicUrl, fileName)
    
    return { ...imageRecord, url: publicUrl }
  },

  // Save image record to database
  async saveImageRecord(userId, imageUrl, fileName) {
    const { data, error } = await supabase
      .from('product_images')
      .insert([
        {
          user_id: userId,
          image_url: imageUrl,
          file_name: fileName,
          upload_date: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get user images
  async getUserImages(userId) {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Ad Creative Management
export const creativeService = {
  // Save generated ad creative
  async saveCreative(imageId, creative) {
    const { data, error } = await supabase
      .from('ad_creatives')
      .insert([
        {
          image_id: imageId,
          generated_image_url: creative.imageUrl,
          ad_copy: creative.adCopy,
          headline: creative.headline,
          style: creative.style,
          platform_target: creative.platform,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get creatives for an image
  async getCreativesForImage(imageId) {
    const { data, error } = await supabase
      .from('ad_creatives')
      .select('*')
      .eq('image_id', imageId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get user's all creatives
  async getUserCreatives(userId) {
    const { data, error } = await supabase
      .from('ad_creatives')
      .select(`
        *,
        product_images (
          user_id,
          image_url
        )
      `)
      .eq('product_images.user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Social Media Post Management
export const socialPostService = {
  // Save social media post record
  async savePost(creativeId, platform, postUrl, postStatus = 'posted') {
    const { data, error } = await supabase
      .from('social_posts')
      .insert([
        {
          creative_id: creativeId,
          platform: platform,
          post_url: postUrl,
          post_status: postStatus,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get posts for a creative
  async getPostsForCreative(creativeId) {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('creative_id', creativeId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get user's all posts
  async getUserPosts(userId) {
    const { data, error } = await supabase
      .from('social_posts')
      .select(`
        *,
        ad_creatives (
          *,
          product_images (
            user_id
          )
        )
      `)
      .eq('ad_creatives.product_images.user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Update post status
  async updatePostStatus(postId, status) {
    const { data, error } = await supabase
      .from('social_posts')
      .update({ post_status: status })
      .eq('post_id', postId)
    
    if (error) throw error
    return data
  }
}

// Database initialization (for development)
export const initializeDatabase = async () => {
  // This would typically be done via Supabase migrations
  // Including here for reference of the database schema
  
  const tables = {
    users: `
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscription_tier VARCHAR(50) DEFAULT 'Free',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `,
    product_images: `
      CREATE TABLE IF NOT EXISTS product_images (
        image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        file_name TEXT,
        upload_date TIMESTAMP DEFAULT NOW()
      );
    `,
    ad_creatives: `
      CREATE TABLE IF NOT EXISTS ad_creatives (
        creative_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        image_id UUID REFERENCES product_images(image_id) ON DELETE CASCADE,
        generated_image_url TEXT,
        ad_copy TEXT NOT NULL,
        headline TEXT,
        style VARCHAR(100),
        platform_target VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `,
    social_posts: `
      CREATE TABLE IF NOT EXISTS social_posts (
        post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creative_id UUID REFERENCES ad_creatives(creative_id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        post_url TEXT,
        post_status VARCHAR(50) DEFAULT 'posted',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `
  }
  
  console.log('Database schema reference:', tables)
}
