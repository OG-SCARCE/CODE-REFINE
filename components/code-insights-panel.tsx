'use client'

import React, { useEffect, useState } from 'react'

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  color: string
}

export default function CodeInsightsPanel() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Generate random floating elements
    const generateElements = () => {
      const colors = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-yellow-500',
        'from-pink-500 to-rose-500',
      ]

      const newElements = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
      setElements(newElements)
    }

    generateElements()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative h-full min-h-96 rounded-xl overflow-hidden">
      {/* Animated background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10" style={{ background: 'transparent' }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating animated particles */}
      <div className="absolute inset-0">
        {elements.map((el) => (
          <div
            key={el.id}
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${el.color} blur-sm`}
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              opacity: el.opacity,
              animation: `float ${el.duration}s ease-in-out ${el.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Animated code symbols */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <div className="text-6xl font-mono text-white animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }}>
          {'{ }'}
        </div>
      </div>

      {/* Interactive gradient orb that follows mouse */}
      <div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-20 pointer-events-none transition-all duration-300"
        style={{
          left: `${(mousePos.x / window.innerWidth) * 100}%`,
          top: `${(mousePos.y / window.innerHeight) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Animated lines connecting random points */}
      <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}>
        <g stroke="url(#lineGradient)" strokeWidth="0.5" opacity="0.3">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {Array.from({ length: 3 }).map((_, i) => (
            <line
              key={i}
              x1={`${20 + i * 30}%`}
              y1="0%"
              x2={`${30 + i * 25}%`}
              y2="100%"
              style={{
                animation: `moveLine ${6 + i * 2}s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
        </g>
      </svg>



      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes moveLine {
          0% {
            stroke-dashoffset: 100;
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}
