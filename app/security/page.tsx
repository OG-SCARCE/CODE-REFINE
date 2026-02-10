'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Lock, CheckCircle, AlertCircle, Key } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import Link from 'next/link'

export default function SecurityPage() {
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
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-300">
              Privacy
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
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-cyan-400" />
              <h1 className="text-5xl font-black text-white">Security</h1>
            </div>
            <p className="text-gray-400">Learn how we protect your data and maintain the highest security standards</p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">End-to-End Encryption</h3>
              <p className="text-gray-400 text-sm">All data is encrypted in transit and at rest using industry-standard TLS 1.3 and AES-256 encryption.</p>
            </Card>

            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <Key className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-bold text-white mb-2">API Key Management</h3>
              <p className="text-gray-400 text-sm">Secure API key handling with rotation support and fine-grained access control.</p>
            </Card>

            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <AlertCircle className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Regular Security Audits</h3>
              <p className="text-gray-400 text-sm">We conduct regular third-party security audits and penetration testing.</p>
            </Card>

            <Card className="p-6 bg-black/30 border border-white/20 backdrop-blur-md hover:border-white/40 transition-all duration-300">
              <Lock className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">SOC 2 Compliance</h3>
              <p className="text-gray-400 text-sm">CodeRefine is SOC 2 Type II certified, demonstrating our commitment to security.</p>
            </Card>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">Infrastructure Security</h2>
              <p className="text-gray-300 leading-relaxed">
                Our infrastructure is hosted on secure, enterprise-grade cloud providers with DDoS protection, firewalls, and intrusion detection systems. All servers are regularly patched and updated with the latest security fixes.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">Data Privacy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We take data privacy seriously. Your code analysis data is stored securely and never shared with third parties. We comply with GDPR, CCPA, and other major data protection regulations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You maintain full ownership and control of your data. You can request data deletion or export at any time.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication & Authorization</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement multi-factor authentication (MFA), single sign-on (SSO) support, and role-based access control (RBAC) for enterprise accounts.
              </p>
              <p className="text-gray-300 leading-relaxed">
                All authentication tokens expire after a configurable period, and sessions can be managed from your account dashboard.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">Incident Response</h2>
              <p className="text-gray-300 leading-relaxed">
                We have a comprehensive incident response plan with a dedicated security team available 24/7. In the event of a security incident, we will notify affected users promptly and work to mitigate the impact.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">Reporting Security Issues</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you discover a security vulnerability, please report it to us at security@coderefine.com. We take all security reports seriously and will work with you to resolve issues responsibly.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We ask that you do not publicly disclose the vulnerability until we have had time to address it.
              </p>
            </Card>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
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
