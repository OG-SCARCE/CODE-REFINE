'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Code, Bug, Maximize as ZapOptimize, Lock, ChevronDown, Check, Star, Users, TrendingUp, Zap, BarChart3 } from 'lucide-react'
import { useState, useTransition, useOptimistic, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import ParticleCanvas from '@/components/particle-canvas'
import { NavBar } from '@/components/navbar'
import StackedCard from '@/components/stacked-card' // Import StackedCard component

// Scroll Reveal Animation Component
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const descriptions: Record<string, string> = {
    'Bug Detection': 'Automatically identify logical errors, null pointer exceptions, infinite loops, and other runtime issues that could cause your application to crash or behave unexpectedly.',
    'Security Review': 'Scan for SQL injection vulnerabilities, XSS attacks, hardcoded credentials, insecure API usage, and other security threats that could compromise your application.',
    'Performance': 'Detect memory leaks, inefficient algorithms, redundant computations, and resource-heavy operations. Get recommendations to optimize runtime and reduce computational overhead.',
    'Code Quality': 'Improve readability with better naming conventions, reduce cyclomatic complexity, enhance maintainability, and ensure your codebase follows established coding standards.',
    'Best Practices': 'Leverage industry-standard design patterns, SOLID principles, and modern development techniques. Learn from proven solutions used by leading tech companies.',
    'Refactoring': 'Receive improved, cleaner code examples with explanations for each change. See how to simplify logic, eliminate redundancy, and enhance code organization.',
  }

  const benefits: Record<string, string[]> = {
    'Bug Detection': ['Null Checks', 'Logic Flow', 'Type Safety', 'Runtime Safety'],
    'Security Review': ['Injection Prevention', 'XSS Protection', 'Auth Checks', 'Data Encryption'],
    'Performance': ['Memory Optimization', 'Algorithm Analysis', 'Load Times', 'Resource Usage'],
    'Code Quality': ['Readability', 'Complexity Score', 'Documentation', 'Standards'],
    'Best Practices': ['Design Patterns', 'SOLID Principles', 'Architecture', 'Scalability'],
    'Refactoring': ['Code Simplification', 'DRY Principle', 'Reusability', 'Maintainability'],
  }

  return (
    <div
      ref={ref}
      className={`group relative p-6 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-xl hover:border-white/40 hover:from-white/8 hover:to-white/4 cursor-pointer transition-all duration-300 h-full ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
            <feature.icon className="w-6 h-6 text-cyan-400 transition-colors duration-300" />
          </div>
          <h3 className="font-bold text-white text-lg transition-colors duration-300">
            {feature.name}
          </h3>
        </div>

        {/* Default Description */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mb-6'
          }`}
        >
          <p className="text-gray-500 text-sm">{feature.desc}</p>
        </div>

        {/* Hover Full Description */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? 'opacity-100 mb-4' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          <p className="text-gray-300 text-sm leading-relaxed">
            {descriptions[feature.name] || feature.desc}
          </p>
        </div>

        {/* Visual Separator Line */}
        <div
          className={`h-px bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 my-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Benefits Grid - Always visible, expands on hover */}
        <div className={`grid grid-cols-2 gap-2 mt-auto transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        }`}>
          {(benefits[feature.name] || []).map((benefit, idx) => (
            <div
              key={benefit}
              className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 group/benefit"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 group-hover/benefit:scale-150 transition-transform" />
              <span className="text-xs text-gray-400 group-hover/benefit:text-gray-200 transition-colors">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// FAQ data
const faqData = [
  {
    q: 'What makes CodeRefine different?',
    a: 'CodeRefine uses Google Gemini AI to provide comprehensive code analysis with structured feedback on bugs, security, performance, and best practices -- all in seconds. Get actionable refactored code suggestions, not just lint warnings.',
  },
  {
    q: 'What programming languages are supported?',
    a: 'CodeRefine supports all major programming languages including JavaScript, Python, Java, C++, Go, Rust, PHP, C#, TypeScript, and many more. Just paste your code and let AI analyze it.',
  },
  {
    q: 'How long does analysis take?',
    a: 'Most code analyses complete in under 200ms. You get real-time feedback on security vulnerabilities, performance issues, bugs, and optimization suggestions immediately after submission.',
  },
  {
    q: 'Is my code private and secure?',
    a: 'Yes. CodeRefine does not store your code after analysis unless explicitly saved. All data is processed securely, and we comply with major privacy standards. Enterprise plans include dedicated servers.',
  },
]

const features = [
  { name: 'Bug Detection', icon: Bug, desc: 'Find hidden bugs before they reach production.' },
  { name: 'Security Review', icon: Lock, desc: 'Scan for vulnerabilities and attack vectors.' },
  { name: 'Performance', icon: ZapOptimize, desc: 'Optimize bottlenecks and resource usage.' },
  { name: 'Code Quality', icon: Code, desc: 'Improve readability and maintainability.' },
  { name: 'Best Practices', icon: Sparkles, desc: 'Follow industry patterns and standards.' },
  { name: 'Refactoring', icon: ArrowRight, desc: 'Get clean, refactored code suggestions.' },
]

// FAQ Item with useTransition for smooth toggling
function FAQItem({ item, index }: { item: typeof faqData[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const toggle = useCallback(() => {
    startTransition(() => {
      setIsOpen((prev) => !prev)
    })
  }, [startTransition])

  return (
    <div
      className={`group bg-gradient-to-br from-white/5 to-white/2 border rounded-xl hover:from-white/8 hover:to-white/4 transition-all duration-500 cursor-pointer animate-fade-in-up overflow-hidden ${
        isOpen ? 'border-white/40' : 'border-white/20 hover:border-white/40'
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full p-6 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-bold text-lg text-white group-hover:text-gray-200 transition-colors pr-4">
          {item.q}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 group-hover:text-white transition-all duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          } ${isPending ? 'opacity-50' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 pb-6 text-gray-400 leading-relaxed">{item.a}</p>
      </div>
    </div>
  )
}

// Pricing card with useOptimistic for instant feedback
function PricingCard({
  title,
  price,
  subtitle,
  features: featureList,
  recommended,
  buttonText,
}: {
  title: string
  price: string
  subtitle: string
  features: string[]
  recommended?: boolean
  buttonText: string
}) {
  const [optimisticSelected, addOptimistic] = useOptimistic(false, (_state, newVal: boolean) => newVal)

  const handleClick = () => {
    addOptimistic(true)
    // Simulating a server response delay
    setTimeout(() => addOptimistic(false), 1200)
  }

  return (
    <Card
      className={`p-8 backdrop-blur-md flex flex-col transition-all duration-500 animate-scale-in ${
        recommended
          ? 'bg-black/40 border-2 border-white/40 hover:border-white/60 shadow-2xl shadow-white/10 relative group'
          : 'bg-black/30 border border-white/20 hover:border-white/40'
      }`}
    >
      {recommended && (
        <Badge className="absolute -top-4 left-6 bg-white text-black font-black">
          RECOMMENDED
        </Badge>
      )}
      <h3 className={`text-2xl font-black mb-2 text-white ${recommended ? 'mt-2' : ''}`}>
        {title}
      </h3>
      <p className={`${price === 'Custom' ? 'text-3xl' : 'text-4xl'} font-black mb-1 text-white`}>
        {price}
      </p>
      <p className={`${recommended ? 'text-gray-300' : 'text-gray-400'} mb-8 text-sm`}>
        {subtitle}
      </p>
      <Button
        onClick={handleClick}
        className={`w-full mb-6 font-bold transition-all ${
          recommended
            ? 'bg-white text-black hover:bg-gray-100 hover:scale-105'
            : price === 'Custom'
              ? 'border-white/40 text-white hover:bg-white/10 bg-transparent border'
              : 'bg-white text-black hover:bg-gray-100'
        } ${optimisticSelected ? 'scale-95 opacity-80' : ''}`}
      >
        {optimisticSelected ? 'Processing...' : buttonText}
      </Button>
      <ul
        className={`space-y-3 text-sm flex-1 ${
          recommended ? 'text-gray-300' : 'text-gray-400'
        }`}
      >
        {featureList.map((f) => (
          <li key={f} className="flex items-center gap-2 hover:text-white transition-colors">
            <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [isNavigating, startNavigation] = useTransition()

  const handleNavigate = useCallback((path: string) => {
    startNavigation(() => {
      router.push(path)
    })
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleCanvas />

      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 20 }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 animate-slide-left">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50">
              <Code className="w-3 h-3 mr-2" />
              Powered by Google Gemini
            </Badge>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black mb-8 text-balance leading-tight tracking-tight animate-slide-left">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Intelligent Code Review
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 text-balance max-w-3xl mx-auto animate-slide-right font-light leading-relaxed">
            Paste your code and let AI-powered analysis detect bugs, optimize
            performance, identify security vulnerabilities, and provide refactored
            suggestions instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-right">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
              onClick={() => handleNavigate(user ? '/analyzer' : '/signup')}
              disabled={isNavigating}
            >
              {isNavigating ? 'Loading...' : 'Analyze Code'}{' '}
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
            >
              Learn More <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Fast', icon: Zap },
              { name: 'Accurate', icon: BarChart3 },
              { name: 'Actionable', icon: TrendingUp },
            ].map((item, idx) => (
              <div
                key={item.name}
                className="animate-float p-8 bg-gradient-to-br from-white/3 to-white/1 border border-white/10 rounded-lg hover:border-white/20 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <item.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                <p className="font-bold text-white text-lg">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section
        className="py-16 px-4 border-y border-gray-800 relative overflow-hidden bg-black/70"
        style={{ zIndex: 20 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50">
              <Users className="w-3 h-3 mr-2" />
              Community
            </Badge>
            <h2 className="text-3xl font-black mb-2 text-white">
              Trusted by Developers Everywhere
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Join thousands of developers who use CodeRefine to improve their code quality daily
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { stat: '50K+', label: 'Active Users' },
              { stat: '1M+', label: 'Code Reviews' },
              { stat: '99.9%', label: 'Uptime' },
              { stat: '200ms', label: 'Avg Response' },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="p-4 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-lg hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-500 text-center group animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <p className="text-2xl font-black text-cyan-400 mb-1">{item.stat}</p>
                <p className="text-gray-400 text-xs group-hover:text-white transition-colors">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-white/5 via-white/2 to-white/5 border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              Developer Segments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Startups', icon: TrendingUp },
                { name: 'Enterprise', icon: BarChart3 },
                { name: 'Tech Teams', icon: Users },
                { name: 'Open Source', icon: Code },
              ].map((segment) => (
                <div
                  key={segment.name}
                  className="p-3 bg-black/30 border border-white/20 rounded-lg flex flex-col items-center justify-center text-center hover:bg-black/50 hover:border-white/40 transition-all duration-300 cursor-pointer group animate-fade-in-up"
                >
                  <segment.icon className="w-6 h-6 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-300 text-sm font-semibold group-hover:text-white transition-colors">
                    {segment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why CodeRefine */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16 text-balance tracking-tight">
            Why Choose <span className="text-white">CodeRefine?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-xl hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-500 cursor-pointer animate-fade-in-up">
              <div className="mb-4 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:animate-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                AI-Powered Insights
              </h3>
              <p className="text-gray-400 mb-6">
                Leverage Google Gemini for comprehensive code analysis.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Instant bug detection</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Security vulnerability scanning</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Performance optimization tips</span>
                </div>
              </div>
            </div>

              <div className="group p-8 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-xl hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-500 cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:animate-glow">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Actionable Output
              </h3>
              <p className="text-gray-400 mb-6">
                Get refactored code with detailed improvement suggestions.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Refactored code examples</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Best practices guidance</span>
                </div>
                <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Detailed issue explanations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 text-center bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-12 rounded-xl border border-white/20 animate-border-glow">
            {[
              { stat: '10K+', label: 'Code Reviews' },
              { stat: '99%', label: 'Accuracy' },
              { stat: '200ms', label: 'Avg Response' },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="animate-float"
                style={{ animationDelay: `${idx * 0.3}s` }}
              >
                <p className="text-3xl font-black text-white mb-2">
                  {item.stat}
                </p>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-black/70 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-6 text-balance">
            Complete Analysis Suite
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            Every aspect of your code examined.
          </p>

          <div className="relative mb-12">
            <div className="md:flex md:flex-col md:max-w-2xl md:mx-auto gap-6">
              {features.map((feature, idx) => (
                <FeatureCard
                  key={feature.name}
                  feature={feature}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Quick Start Card */}
          <Card className="p-8 bg-black/30 border border-white/20 text-white backdrop-blur-md hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 animate-border-glow">
            <div className="flex items-center gap-3 mb-4 animate-pulse-slow">
              <ZapOptimize className="w-6 h-6 text-white" />
              <span className="text-lg font-bold uppercase tracking-widest">
                Start Analyzing
              </span>
            </div>
            <h3 className="text-3xl font-black mb-4">
              Get Code Insights in Seconds
            </h3>
            <p className="mt-4 mb-6 text-gray-300 leading-relaxed">
              Paste your code, click analyze, and receive detailed feedback
              including bug detection, security vulnerabilities, performance
              optimization suggestions, and refactored code examples.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              onClick={() => handleNavigate(user ? '/analyzer' : '/signup')}
              disabled={isNavigating}
            >
              Start Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50">
              <Sparkles className="w-3 h-3 mr-2" />
              See it in Action
            </Badge>
            <h2 className="text-5xl font-black mb-6 text-balance">
              Real-Time Code Analysis
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Watch how CodeRefine analyzes your code and provides instant, actionable feedback across all dimensions of code quality.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Code Example */}
            <div className="group p-8 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-xl hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-500 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-bold text-gray-300">Sample Code</span>
              </div>
              <div className="bg-black/50 rounded-lg p-4 border border-white/10 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400">
                  <div><span className="text-pink-400">function</span> <span className="text-cyan-300">calculateSum</span>(arr) {'{'}</div>
                  <div className="ml-4"><span className="text-gray-500">// Bug: missing null check</span></div>
                  <div className="ml-4"><span className="text-orange-400">let</span> sum = <span className="text-yellow-400">0</span>;</div>
                  <div className="ml-4"><span className="text-pink-400">for</span> (<span className="text-orange-400">let</span> i = <span className="text-yellow-400">0</span>; i &lt; arr.<span className="text-cyan-300">length</span>; i++) {'{'}</div>
                  <div className="ml-8">sum += arr[i];</div>
                  <div className="ml-4">{'}'}</div>
                  <div className="ml-4"><span className="text-pink-400">return</span> sum;</div>
                  <div>{'}'}</div>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl hover:border-red-500/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Bug Detected</h4>
                    <p className="text-gray-300 text-sm">Potential null reference exception when arr is undefined</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl hover:border-yellow-500/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <ZapOptimize className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Performance</h4>
                    <p className="text-gray-300 text-sm">Consider using Array.reduce() for O(n) performance improvement</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white mb-1">Best Practice</h4>
                    <p className="text-gray-300 text-sm">Add input validation and handle edge cases gracefully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        className="py-24 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent via-white/5 to-transparent"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { stat: '2.5M+', label: 'Lines Analyzed', icon: BarChart3 },
              { stat: '98%', label: 'Issue Detection Accuracy', icon: Check },
              { stat: '< 200ms', label: 'Average Response Time', icon: Zap },
              { stat: '40+', label: 'Supported Languages', icon: Code },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="group p-6 bg-gradient-to-br from-white/5 to-white/2 border border-white/20 rounded-xl hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-500 text-center animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-black text-white mb-2">{item.stat}</p>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-24 px-4 sm:px-6 lg:px-8 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-6 text-balance">
            Simple Pricing
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            Analyze unlimited code. Pay only for premium features.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Developer"
              price="Free"
              subtitle="Get started with code analysis."
              buttonText="Get started"
              features={[
                '50 analyses/month',
                'Basic analysis',
                'Community support',
                'All languages',
              ]}
            />
            <PricingCard
              title="Professional"
              price="$20"
              subtitle="/ month"
              buttonText="Get started"
              recommended
              features={[
                'Unlimited analyses',
                'Advanced insights',
                'Priority support',
                'API access',
              ]}
            />
            <PricingCard
              title="Team"
              price="Custom"
              subtitle="For teams and enterprises."
              buttonText="Contact Sales"
              features={[
                'Custom analysis limits',
                'Dedicated support',
                '24/7 assistance',
                'Custom integration',
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="docs"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-black/70 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-6 text-balance">
            Got Questions?
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">
            We have answers.
          </p>

          <div className="space-y-4">
            {faqData.map((item, idx) => (
              <FAQItem key={item.q} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 relative text-center"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black mb-8 text-balance">
            Ready to Improve Your Code?
          </h2>
          <p className="text-xl text-gray-400 mb-12 text-balance">
            Get AI-powered code analysis with detailed insights, security
            checks, performance recommendations, and refactored code in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 hover:scale-105"
              onClick={() => handleNavigate(user ? '/analyzer' : '/signup')}
              disabled={isNavigating}
            >
              Start Analyzing <Sparkles className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-base px-8 py-6 rounded-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
            >
              View Examples <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-black/50 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative"
        style={{ zIndex: 20 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold group-hover:animate-glow">
                CR
              </div>
              <span className="font-black tracking-widest">CodeRefine</span>
            </div>
            <p className="text-gray-500 text-sm">AI-Powered Code Review</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; 2024 CodeRefine. AI-powered code analysis for developers. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
