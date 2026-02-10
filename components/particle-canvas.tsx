'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  targetOpacity: number
  // Thread trail points
  trail: { x: number; y: number }[]
}

interface FloatingThread {
  points: { x: number; y: number }[]
  speed: number
  amplitude: number
  phase: number
  opacity: number
  length: number
  baseY: number
  direction: number
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        targetOpacity: Math.random() * 0.6 + 0.1,
        trail: [],
      })
    }

    // Create flowing thread curves
    const threads: FloatingThread[] = []
    for (let i = 0; i < 12; i++) {
      const length = Math.random() * 300 + 200
      const baseY = Math.random() * canvas.height
      const direction = Math.random() > 0.5 ? 1 : -1
      const startX = direction > 0 ? -length : canvas.width + length
      const points: { x: number; y: number }[] = []
      const segments = 40
      for (let j = 0; j <= segments; j++) {
        points.push({
          x: startX + (j / segments) * length * direction,
          y: baseY,
        })
      }
      threads.push({
        points,
        speed: Math.random() * 0.8 + 0.3,
        amplitude: Math.random() * 40 + 15,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.12 + 0.03,
        length,
        baseY,
        direction,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.008
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw flowing threads
      for (const thread of threads) {
        const segments = thread.points.length
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${thread.opacity})`
        ctx.lineWidth = 0.8

        for (let j = 0; j < segments; j++) {
          const p = thread.points[j]
          // Move thread forward
          p.x += thread.speed * thread.direction
          // Sinusoidal wave motion
          const waveOffset = Math.sin(time * 2 + thread.phase + j * 0.15) * thread.amplitude
          const secondaryWave = Math.cos(time * 1.3 + thread.phase + j * 0.08) * (thread.amplitude * 0.3)
          p.y = thread.baseY + waveOffset + secondaryWave

          if (j === 0) {
            ctx.moveTo(p.x, p.y)
          } else {
            const prev = thread.points[j - 1]
            const cpx = (prev.x + p.x) / 2
            const cpy = (prev.y + p.y) / 2
            ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy)
          }
        }
        ctx.stroke()

        // Reset thread when it goes off screen
        const head = thread.points[thread.points.length - 1]
        const tail = thread.points[0]
        if (thread.direction > 0 && tail.x > canvas.width + 50) {
          const startX = -thread.length
          thread.baseY = Math.random() * canvas.height
          thread.phase = Math.random() * Math.PI * 2
          for (let j = 0; j < segments; j++) {
            thread.points[j].x = startX + (j / (segments - 1)) * thread.length
            thread.points[j].y = thread.baseY
          }
        } else if (thread.direction < 0 && head.x < -50) {
          const startX = canvas.width + thread.length
          thread.baseY = Math.random() * canvas.height
          thread.phase = Math.random() * Math.PI * 2
          for (let j = 0; j < segments; j++) {
            thread.points[j].x = startX - (j / (segments - 1)) * thread.length
            thread.points[j].y = thread.baseY
          }
        }
      }

      // Draw particles and connection lines
      for (const p of particles) {
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

        // Store trail for small particle tails
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 5) p.trail.shift()

        // Draw trail
        if (p.trail.length > 1) {
          for (let t = 0; t < p.trail.length - 1; t++) {
            const trailOpacity = (t / p.trail.length) * p.opacity * 0.3
            ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`
            ctx.lineWidth = p.radius * 0.5
            ctx.beginPath()
            ctx.moveTo(p.trail[t].x, p.trail[t].y)
            ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y)
            ctx.stroke()
          }
        }

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Connection lines (threads between close particles)
        for (const p2 of particles) {
          if (p === p2) continue
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.12
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.4
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)

            // Curved connection line for thread feel
            const midX = (p.x + p2.x) / 2 + Math.sin(time + p.x * 0.01) * 8
            const midY = (p.y + p2.y) / 2 + Math.cos(time + p.y * 0.01) * 8
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', setSize)
    return () => {
      window.removeEventListener('resize', setSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
