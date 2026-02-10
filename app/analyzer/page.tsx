'use client'

import React, { useState, useEffect, useTransition, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Upload,
  Sparkles,
  Copy,
  Check,
  LogOut,
  Code,
  Bug,
  Lock,
  Zap,
  ArrowRight,
  ChevronDown,
  Gauge,
  Lightbulb,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ParticleCanvas from '@/components/particle-canvas'
import CodeInsightsPanel from '@/components/code-insights-panel' // Import CodeInsightsPanel
import type { AnalysisResult, Optimization, CodeGenerationResult } from '../app/types'

// Collapsible optimization item with useTransition
function OptimizationItem({
  opt,
  index,
  getSeverityClasses,
  getCategoryIcon,
}: {
  opt: Optimization
  index: number
  getSeverityClasses: (severity: string) => string
  getCategoryIcon: (category: string) => React.ComponentType<{ className?: string }>
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isPending, startTransition] = useTransition()
  const CategoryIcon = getCategoryIcon(opt.category)

  const toggle = useCallback(() => {
    startTransition(() => {
      setIsExpanded((prev) => !prev)
    })
  }, [startTransition])

  return (
    <div
      className="group/item bg-gradient-to-br from-black/70 to-black/50 border border-white/10 rounded-xl hover:border-white/30 hover:from-black/80 transition-all duration-500 animate-fade-in-up overflow-hidden backdrop-blur-xl"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full p-6 flex items-start gap-4 text-left"
        aria-expanded={isExpanded}
      >
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/20 transition-all">
          <CategoryIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold text-white">{opt.issue}</p>
            <div className="flex gap-2 flex-shrink-0 items-center">
              <Badge
                className={`${getSeverityClasses(opt.severity)} text-xs border`}
              >
                {opt.severity}
              </Badge>
              <Badge className="bg-white/10 text-gray-300 border border-white/20 text-xs">
                {opt.category}
              </Badge>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                } ${isPending ? 'opacity-50' : ''}`}
              />
            </div>
          </div>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pl-20 space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="text-white font-semibold">Suggestion:</span>{' '}
            {opt.suggestion}
          </p>
          <p className="text-gray-400">
            <span className="text-gray-300 font-semibold">Why:</span>{' '}
            {opt.explanation}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AnalyzerPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useAuth()

  const [code, setCode] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  // Code Generation State
  const [generationPrompt, setGenerationPrompt] = useState<string>('')
  const [generationResult, setGenerationResult] = useState<CodeGenerationResult | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // useTransition for navigation and analysis
  const [isNavigating, startNavigation] = useTransition()
  const [isAnalyzing, startAnalysis] = useTransition()

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          setCode(text)
        }
        reader.readAsText(file)
      }
    },
    []
  )

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter or upload some code to analyze.')
      return
    }
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)

    startAnalysis(() => {
      ;(async () => {
        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to analyze code')
          }

          const result = await response.json()
          setAnalysisResult(result)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setIsLoading(false)
        }
      })()
    })
  }, [code, startAnalysis])

  const copyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }, [])

  const handleNavigate = useCallback(
    (path: string) => {
      startNavigation(() => {
        router.push(path)
      })
    },
    [router, startNavigation]
  )

  const handleGenerateCode = useCallback(async () => {
    if (!generationPrompt.trim()) {
      setGenerationError('Please enter a prompt to generate code.')
      return
    }
    setIsGenerating(true)
    setGenerationError(null)
    setGenerationResult(null)

    startAnalysis(() => {
      ;(async () => {
        try {
          const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: generationPrompt }),
          })

          if (!response.ok) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to generate code')
          }

          const result = await response.json()
          setGenerationResult(result)
        } catch (err) {
          setGenerationError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setIsGenerating(false)
        }
      })()
    })
  }, [generationPrompt, startAnalysis])

  const getSeverityClasses = useCallback((severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      default:
        return 'bg-green-500/20 text-green-300 border-green-500/50'
    }
  }, [])

  const getCategoryIcon = useCallback((category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return Lock
      case 'performance':
        return Zap
      case 'bug':
        return Bug
      default:
        return Code
    }
  }, [])

  // Loading state
  if (authLoading) {
    return (
      <main className="relative bg-black min-h-screen text-white flex items-center justify-center">
        <ParticleCanvas />
        <div className="text-center relative" style={{ zIndex: 20 }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleCanvas />

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full bg-black/80 backdrop-blur border-b border-gray-800"
        style={{ zIndex: 40 }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold group-hover:animate-glow transition-all">
              CR
            </div>
            <span className="font-bold text-lg tracking-widest">
              CodeRefine
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50">
              <Sparkles className="w-3 h-3 mr-1" />
              Analyzer
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => handleNavigate('/')}
              disabled={isNavigating}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Home
            </Button>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section
        className="pt-28 pb-8 px-4 sm:px-6 lg:px-8 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 animate-slide-left">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50">
              <Code className="w-3 h-3 mr-2" />
              Powered by Google Gemini
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-balance leading-tight tracking-tight animate-slide-left">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Code Analyzer
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 text-balance max-w-2xl mx-auto animate-slide-right font-light leading-relaxed">
            Paste your code below and let AI-powered analysis detect bugs,
            optimize performance, and provide refactored suggestions instantly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section
        className="px-4 sm:px-6 lg:px-8 pb-24 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Code Input Card */}
            <div className="group p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl hover:border-white/40 transition-all duration-500 animate-fade-in-up backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:animate-glow">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Paste or Upload Code
                </h2>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-64 bg-black/80 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 resize-none transition-all duration-300 font-mono text-sm"
              />
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading || !code.trim()}
                  className="flex-1 bg-white text-black hover:bg-gray-100 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Code
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <label className="flex-1 cursor-pointer">
                  <Button
                    asChild
                    className="w-full border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold transition-all duration-300 bg-transparent"
                  >
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.go,.rs,.rb,.php"
                  />
                </label>
              </div>
            </div>

            {/* Code Generation Card */}
            <div className="group p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl hover:border-white/40 transition-all duration-500 animate-fade-in-up backdrop-blur-xl" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:animate-glow">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Generate Code
                </h2>
              </div>
              <textarea
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Describe the code you want to generate (e.g., 'Create a function to validate email addresses')..."
                className="w-full h-64 bg-black/80 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/50 resize-none transition-all duration-300 font-mono text-sm"
              />
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating || !generationPrompt.trim()}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Code
                    <Lightbulb className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* What We Analyze Card */}
            <div className="group p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl hover:border-white/40 transition-all duration-500 animate-fade-in-up backdrop-blur-xl" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:animate-glow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  What We Analyze
                </h2>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Zap,
                    title: 'Performance',
                    desc: 'Inefficiencies and optimization opportunities',
                  },
                  {
                    icon: Lock,
                    title: 'Security',
                    desc: 'Vulnerabilities and security best practices',
                  },
                  {
                    icon: Code,
                    title: 'Readability',
                    desc: 'Code clarity and maintainability',
                  },
                  {
                    icon: Sparkles,
                    title: 'Best Practices',
                    desc: 'Industry standards and patterns',
                  },
                  {
                    icon: Bug,
                    title: 'Bug Risk',
                    desc: 'Potential bugs and issues',
                  },
                ].map((item, idx) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/50 border border-white/10 hover:border-white/30 hover:bg-black/70 transition-all duration-300 animate-float cursor-default"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-br from-red-950/80 to-red-950/60 border border-red-500/30 rounded-xl animate-slide-left backdrop-blur-xl">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          )}
          
          {generationError && (
            <div className="mb-8 p-6 bg-gradient-to-br from-red-950/80 to-red-950/60 border border-red-500/30 rounded-xl animate-slide-left backdrop-blur-xl">
              <p className="text-red-300 font-medium">{generationError}</p>
            </div>
          )}

          {/* Code Generation Results */}
          {generationResult && (
            <div className="space-y-8 mb-12">
              {/* Generated Code Card */}
              <Card className="p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl backdrop-blur-xl hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center animate-glow">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold uppercase tracking-widest text-white">
                        Generated Code
                      </span>
                      <p className="text-sm text-gray-400 mt-1">{generationResult.language}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      copyToClipboard(generationResult.code, -2)
                    }
                    className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                  >
                    {copiedIndex === -2 ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-black/90 border border-white/10 rounded-lg p-6 overflow-x-auto text-sm text-gray-200 font-mono leading-relaxed mb-6">
                  <code>{generationResult.code}</code>
                </pre>
                <div>
                  <p className="text-sm text-gray-400 mb-2 font-semibold">Explanation:</p>
                  <p className="text-gray-200 leading-relaxed">
                    {generationResult.explanation}
                  </p>
                </div>
              </Card>

              {/* Reset Button */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
                  onClick={() => {
                    setGenerationPrompt('')
                    setGenerationResult(null)
                    setGenerationError(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Generate More Code{' '}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {analysisResult && (
            <div className="space-y-8">
              {/* Summary Card */}
              <Card className="p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl backdrop-blur-xl hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-scale-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center animate-glow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold uppercase tracking-widest text-white">
                    Analysis Results
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-black/50 border border-white/10 rounded-lg animate-fade-in-up">
                    <p className="text-sm text-gray-400 mb-1">
                      Language Detected
                    </p>
                    <p className="text-xl font-bold text-white">
                      {analysisResult.language}
                    </p>
                  </div>
                  <div className="p-4 bg-black/50 border border-white/10 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-sm text-gray-400 mb-1">Issues Found</p>
                    <p className="text-xl font-bold text-white">
                      {analysisResult.optimizations.length}
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-black/50 border border-white/10 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <p className="text-sm text-gray-400 mb-2">Summary</p>
                  <p className="text-gray-200 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>
              </Card>

              {/* Complexity Analysis */}
              <Card className="p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl backdrop-blur-xl hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-scale-in" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center animate-glow">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold uppercase tracking-widest text-white">
                    Complexity Analysis
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Time Complexity */}
                  <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-white">Time Complexity</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-300 font-mono mb-3">
                      {analysisResult.complexity.timeComplexity}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {analysisResult.complexity.timeExplanation}
                    </p>
                  </div>

                  {/* Space Complexity */}
                  <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg hover:border-green-500/50 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge className="w-5 h-5 text-green-400" />
                      <h3 className="font-bold text-white">Space Complexity</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-300 font-mono mb-3">
                      {analysisResult.complexity.spaceComplexity}
                    </p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {analysisResult.complexity.spaceExplanation}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Optimizations */}
              <Card className="p-8 bg-gradient-to-br from-black/80 to-black/60 border border-white/15 rounded-xl backdrop-blur-xl hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center animate-glow">
                    <Bug className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold uppercase tracking-widest text-white">
                    {'Issues & Suggestions'}
                  </span>
                </div>
                <div className="space-y-4">
                  {analysisResult.optimizations.map(
                    (opt: Optimization, idx: number) => (
                      <OptimizationItem
                        key={idx}
                        opt={opt}
                        index={idx}
                        getSeverityClasses={getSeverityClasses}
                        getCategoryIcon={getCategoryIcon}
                      />
                    )
                  )}
                </div>
              </Card>

              {/* Refactored Code */}
              <Card className="p-8 bg-black/80 border border-white/15 rounded-xl backdrop-blur-xl hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-scale-in animate-border-glow" style={{ animationDelay: '0.45s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center animate-glow">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest text-white">
                      Refactored Code
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() =>
                      copyToClipboard(analysisResult.refactoredCode, -1)
                    }
                    className="bg-white text-black hover:bg-gray-100 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
                  >
                    {copiedIndex === -1 ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-black/90 border border-white/10 rounded-lg p-6 overflow-x-auto text-sm text-gray-200 font-mono leading-relaxed">
                  <code>{analysisResult.refactoredCode}</code>
                </pre>
              </Card>

              {/* Analyze More CTA */}
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
                  onClick={() => {
                    setCode('')
                    setAnalysisResult(null)
                    setError(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Analyze More Code{' '}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-black/50 text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>
            &copy; 2024 CodeRefine. AI-powered code analysis for developers. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
