'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowRight, Sparkles, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSubmitted(true)
    setIsLoading(false)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

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
            <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition duration-300">
              Blog
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300">
              Have questions? We would love to hear from you. Send us a message!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <Mail className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Email</h3>
              <p className="text-gray-400 text-sm break-all">support@coderefine.com</p>
            </Card>

            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <Phone className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Phone</h3>
              <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            </Card>

            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <MapPin className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Location</h3>
              <p className="text-gray-400 text-sm">San Francisco, CA</p>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:bg-white/15 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:bg-white/15 transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:bg-white/15 transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-white/40 focus:bg-white/15 transition-all min-h-32 resize-none"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-100 font-bold text-base py-6 transition-all duration-300 hover:shadow-2xl hover:shadow-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Sparkles className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. We will get back to you soon!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
