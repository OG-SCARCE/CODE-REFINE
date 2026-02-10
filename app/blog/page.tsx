'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, BookOpen, Calendar, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import Link from 'next/link'

export default function BlogPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
      targetOpacity: number
    }

    const particles: Particle[] = []

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        targetOpacity: Math.random() * 0.6 + 0.1,
      })
    }

    let animationId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.opacity += (p.targetOpacity - p.opacity) * 0.05

        if (Math.random() < 0.001) {
          p.targetOpacity = Math.random() * 0.6 + 0.1
        }

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        particles.forEach((p2) => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 200) {
            const opacity = (1 - dist / 200) * 0.15
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const blogPosts = [
    {
      id: 1,
      title: '10 Common Security Vulnerabilities in Python Code',
      excerpt: 'Discover the most critical security issues found in Python applications and how CodeRefine can help you identify them automatically.',
      author: 'Sarah Chen',
      date: 'January 15, 2024',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Performance Optimization Techniques for JavaScript',
      excerpt: 'Learn proven strategies to optimize your JavaScript code performance and reduce memory usage with real-world examples.',
      author: 'David Martinez',
      date: 'January 10, 2024',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'Best Practices for Code Quality in Large Teams',
      excerpt: 'How to maintain consistent code quality across your organization using automated analysis and code review processes.',
      author: 'Emily Rodriguez',
      date: 'January 5, 2024',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'TypeScript vs JavaScript: Which Should You Choose?',
      excerpt: 'A comprehensive comparison of TypeScript and JavaScript, discussing when to use each and their impact on code quality.',
      author: 'James Wilson',
      date: 'December 28, 2023',
      readTime: '8 min read',
    },
    {
      id: 5,
      title: 'AI-Powered Code Analysis: The Future of Development',
      excerpt: 'How machine learning and AI are transforming code analysis and helping developers write better code faster.',
      author: 'Lisa Park',
      date: 'December 20, 2023',
      readTime: '6 min read',
    },
    {
      id: 6,
      title: 'Refactoring Strategies for Legacy Code',
      excerpt: 'Practical approaches to safely refactor and modernize legacy codebases without breaking existing functionality.',
      author: 'Michael Johnson',
      date: 'December 15, 2023',
      readTime: '9 min read',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-auto">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur border-b border-gray-800" style={{ zIndex: 40 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold group-hover:animate-glow transition-all">
              CR
            </div>
            <span className="font-bold text-lg tracking-widest">CodeRefine</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition duration-300">
              Home
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-white text-sm transition duration-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition duration-300">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              onClick={() => router.push('/')}
            >
              Back Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative w-full py-20 px-4" style={{ zIndex: 20, marginTop: '80px' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <h1 className="text-5xl font-black text-white">Our Blog</h1>
            </div>
            <p className="text-xl text-gray-300">
              Tips, tricks, and insights on code quality, security, and best practices
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 hover:from-white/8 hover:to-white/4 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg leading-snug group-hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-500 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="w-full mt-4 text-cyan-400 hover:text-cyan-300 hover:bg-white/10 text-sm font-semibold transition-all"
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            ))}
          </div>

          {/* Back Link */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition duration-300 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
