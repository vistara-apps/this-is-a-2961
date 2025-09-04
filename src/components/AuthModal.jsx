import React, { useState } from 'react'
import { X, Mail, Lock, User, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState(initialMode) // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }
        await signUp(formData.email, formData.password)
        setError('Check your email for verification link!')
      } else {
        await signIn(formData.email, formData.password)
        onClose()
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full p-6 rounded-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/70">
            {mode === 'signin' 
              ? 'Sign in to continue creating amazing ads' 
              : 'Join AdSpark AI and start creating'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-black font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <p className="text-white/60">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={switchMode}
              className="text-accent hover:text-accent/80 font-medium ml-1"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Features Preview (Sign Up Only) */}
        {mode === 'signup' && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                AI-powered ad variations
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                One-click social media posting
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                Performance optimization tips
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                Campaign testing tools
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal
