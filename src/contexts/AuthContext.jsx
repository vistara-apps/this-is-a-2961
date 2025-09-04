import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, supabase } from '../services/supabaseService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          const profile = await authService.getUserProfile(currentUser.id)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          try {
            const profile = await authService.getUserProfile(session.user.id)
            setUserProfile(profile)
          } catch (error) {
            console.error('Error getting user profile:', error)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const data = await authService.signUp(email, password)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      const data = await authService.signIn(email, password)
      return data
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await authService.signOut()
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (subscriptionTier) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      await authService.updateSubscription(user.id, subscriptionTier)
      setUserProfile(prev => ({
        ...prev,
        subscription_tier: subscriptionTier
      }))
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const getCreditsRemaining = () => {
    if (!userProfile) return 0
    
    const subscriptionLimits = {
      'Free': 5,
      'Basic': 50,
      'Pro': 200
    }
    
    return subscriptionLimits[userProfile.subscription_tier] || 0
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateSubscription,
    getCreditsRemaining,
    isAuthenticated: !!user,
    subscriptionTier: userProfile?.subscription_tier || 'Free'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
