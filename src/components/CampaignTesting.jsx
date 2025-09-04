import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Target, Clock, DollarSign, Users, Eye, MousePointer } from 'lucide-react'
import { generateTestingStrategy } from '../services/aiService'

const CampaignTesting = ({ variations, onStartTest }) => {
  const [testingStrategy, setTestingStrategy] = useState(null)
  const [isLoadingStrategy, setIsLoadingStrategy] = useState(false)
  const [activeTests, setActiveTests] = useState([])
  const [selectedVariations, setSelectedVariations] = useState([])

  useEffect(() => {
    if (variations && variations.length > 0) {
      loadTestingStrategy()
    }
  }, [variations])

  const loadTestingStrategy = async () => {
    setIsLoadingStrategy(true)
    try {
      const strategy = await generateTestingStrategy(variations)
      setTestingStrategy(strategy)
    } catch (error) {
      console.error('Error loading testing strategy:', error)
    } finally {
      setIsLoadingStrategy(false)
    }
  }

  const handleVariationSelect = (variationId) => {
    setSelectedVariations(prev => 
      prev.includes(variationId) 
        ? prev.filter(id => id !== variationId)
        : [...prev, variationId]
    )
  }

  const startABTest = () => {
    if (selectedVariations.length < 2) {
      alert('Please select at least 2 variations to test')
      return
    }

    const newTest = {
      id: `test-${Date.now()}`,
      name: `A/B Test ${activeTests.length + 1}`,
      variations: selectedVariations,
      status: 'running',
      startDate: new Date(),
      budget: 100,
      duration: 7,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0
      }
    }

    setActiveTests(prev => [...prev, newTest])
    setSelectedVariations([])
    
    if (onStartTest) {
      onStartTest(newTest)
    }

    // Simulate test progress
    simulateTestProgress(newTest.id)
  }

  const simulateTestProgress = (testId) => {
    const interval = setInterval(() => {
      setActiveTests(prev => prev.map(test => {
        if (test.id === testId && test.status === 'running') {
          const newImpressions = test.metrics.impressions + Math.floor(Math.random() * 100) + 50
          const newClicks = test.metrics.clicks + Math.floor(Math.random() * 10) + 2
          const newConversions = test.metrics.conversions + Math.floor(Math.random() * 3)
          const newSpend = test.metrics.spend + Math.random() * 10 + 5

          return {
            ...test,
            metrics: {
              impressions: newImpressions,
              clicks: newClicks,
              conversions: newConversions,
              spend: Math.round(newSpend * 100) / 100
            }
          }
        }
        return test
      }))
    }, 3000)

    // Stop simulation after 30 seconds (for demo)
    setTimeout(() => {
      clearInterval(interval)
      setActiveTests(prev => prev.map(test => 
        test.id === testId ? { ...test, status: 'completed' } : test
      ))
    }, 30000)
  }

  const getTestMetrics = (test) => {
    const ctr = test.metrics.impressions > 0 ? (test.metrics.clicks / test.metrics.impressions * 100).toFixed(2) : '0.00'
    const conversionRate = test.metrics.clicks > 0 ? (test.metrics.conversions / test.metrics.clicks * 100).toFixed(2) : '0.00'
    const cpc = test.metrics.clicks > 0 ? (test.metrics.spend / test.metrics.clicks).toFixed(2) : '0.00'
    const cpa = test.metrics.conversions > 0 ? (test.metrics.spend / test.metrics.conversions).toFixed(2) : '0.00'

    return { ctr, conversionRate, cpc, cpa }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Campaign Testing & Optimization
        </h1>
        <p className="text-white/70">
          Set up A/B tests to identify your best-performing ad variations
        </p>
      </div>

      {/* Testing Strategy */}
      {testingStrategy && (
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            AI-Recommended Testing Strategy
          </h2>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <p className="text-blue-100 text-sm leading-relaxed">
              {testingStrategy.aiRecommendations}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase 1 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Phase 1: Discovery</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white">{testingStrategy.testingFramework.phase1.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Budget:</span>
                  <span className="text-white">{testingStrategy.testingFramework.phase1.budget}</span>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  {testingStrategy.testingFramework.phase1.focus}
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Phase 2: Scale</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-white">{testingStrategy.testingFramework.phase2.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Budget:</span>
                  <span className="text-white">{testingStrategy.testingFramework.phase2.budget}</span>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  {testingStrategy.testingFramework.phase2.focus}
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mt-4">
            <h3 className="text-white font-medium mb-3">Success Metrics to Track</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {testingStrategy.successMetrics.map((metric, index) => (
                <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                  <span className="text-green-200 text-xs">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Variation Selection */}
      <div className="glass-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-white mb-4">
          Select Variations to Test
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {variations.map((variation) => (
            <div
              key={variation.id}
              className={`relative bg-white/5 rounded-lg p-4 cursor-pointer transition-all ${
                selectedVariations.includes(variation.id)
                  ? 'ring-2 ring-accent bg-accent/10'
                  : 'hover:bg-white/10'
              }`}
              onClick={() => handleVariationSelect(variation.id)}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={variation.imageUrl}
                  alt={variation.headline}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-medium text-sm mb-1">{variation.headline}</h3>
              <p className="text-white/60 text-xs line-clamp-2">{variation.adCopy}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {variation.platform}
                </span>
                {variation.performanceScore && (
                  <span className="text-xs text-green-400">
                    {variation.performanceScore}% Score
                  </span>
                )}
              </div>
              
              {selectedVariations.includes(variation.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={startABTest}
          disabled={selectedVariations.length < 2}
          className="bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start A/B Test ({selectedVariations.length} variations selected)
        </button>
      </div>

      {/* Active Tests */}
      {activeTests.length > 0 && (
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="mr-2" size={20} />
            Active Tests
          </h2>

          <div className="space-y-4">
            {activeTests.map((test) => {
              const metrics = getTestMetrics(test)
              return (
                <div key={test.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">{test.name}</h3>
                      <p className="text-white/60 text-sm">
                        {test.variations.length} variations • Started {test.startDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.status === 'running' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {test.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye size={16} className="text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">Impressions</span>
                      </div>
                      <div className="text-white font-semibold">{test.metrics.impressions.toLocaleString()}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MousePointer size={16} className="text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">CTR</span>
                      </div>
                      <div className="text-accent font-semibold">{metrics.ctr}%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp size={16} className="text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">Conv. Rate</span>
                      </div>
                      <div className="text-green-400 font-semibold">{metrics.conversionRate}%</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <DollarSign size={16} className="text-white/60 mr-1" />
                        <span className="text-white/60 text-xs">Spend</span>
                      </div>
                      <div className="text-white font-semibold">${metrics.cpc}</div>
                    </div>
                  </div>

                  {test.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-200 text-sm">
                        🎉 Test completed! Best performing variation achieved {metrics.ctr}% CTR with {metrics.conversionRate}% conversion rate.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Optimization Tips */}
      {testingStrategy && (
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">
            Optimization Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testingStrategy.optimizationTips.map((tip, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <p className="text-white/80 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CampaignTesting
