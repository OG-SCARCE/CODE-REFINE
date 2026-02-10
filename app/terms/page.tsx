'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import Link from 'next/link'

export default function TermsPage() {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-cyan-400" />
              <h1 className="text-5xl font-black text-white">Terms of Service</h1>
            </div>
            <p className="text-gray-400">Last updated: January 2024</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using CodeRefine, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on CodeRefine for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on CodeRefine</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
              </ul>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                The materials on CodeRefine are provided "as is". CodeRefine makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">4. Limitations</h2>
              <p className="text-gray-300 leading-relaxed">
                In no event shall CodeRefine or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CodeRefine.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">5. Accuracy of Materials</h2>
              <p className="text-gray-300 leading-relaxed">
                The materials appearing on CodeRefine could include technical, typographical, or photographic errors. CodeRefine does not warrant that any of the materials on its website are accurate, complete, or current. CodeRefine may make changes to the materials on this website at any time without notice.
              </p>
            </Card>

            <Card className="p-8 bg-black/30 border border-white/20 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-4">6. Modifications</h2>
              <p className="text-gray-300 leading-relaxed">
                CodeRefine may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
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
