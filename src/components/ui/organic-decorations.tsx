'use client'

import React from 'react'

/**
 * HeroRibbonBackground
 * Soft flowing organic shapes and thin silk ribbon lines for the Hero section.
 * Positioned strictly in the background (pointer-events-none, z-0).
 */
export function HeroRibbonBackground() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      {/* 1. Large Soft Organic Ambient Blob (Celeste & Lionsmane warmth) */}
      <div 
        className="absolute -top-24 end-[-10%] w-[580px] h-[580px] lg:w-[720px] lg:h-[720px] rounded-full blur-[120px] opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(189,211,206,0.12) 0%, rgba(252,243,227,0.06) 50%, transparent 75%)'
        }}
      />
      
      {/* 2. Secondary Herb Organic Accent (Bottom Start) */}
      <div 
        className="absolute -bottom-20 start-[-8%] w-[420px] h-[420px] rounded-full blur-[100px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(112,140,105,0.14) 0%, rgba(189,211,206,0.09) 60%, transparent 75%)'
        }}
      />

      {/* 3. Warm Marigold Ambient Glow for Luxury Accent */}
      <div 
        className="absolute top-1/3 start-1/3 w-[380px] h-[380px] rounded-full blur-[130px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(244,162,88,0.12) 0%, transparent 70%)'
        }}
      />

      {/* 4. Subtle Thin Line Ribbon Waves & Geometric Luxury Rings */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroRibbonGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BDD3CE" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#F4A258" stopOpacity="0.24" />
            <stop offset="70%" stopColor="#BDD3CE" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FCF3E3" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="heroRibbonGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4A258" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#F4A258" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#BDD3CE" stopOpacity="0.20" />
          </linearGradient>

          <linearGradient id="organicBlobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#025177" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#BDD3CE" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FCF3E3" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Soft Organic Curved Silhouette (Asymmetrical gift contour) */}
        <path
          d="M320,110 C520,60 740,160 920,100 C1100,40 1280,140 1380,260 C1460,360 1410,500 1310,580 C1190,670 980,640 820,610 C650,580 490,670 340,620 C180,570 120,440 150,310 C180,180 220,130 320,110 Z"
          fill="url(#organicBlobGradient)"
        />

        {/* Primary Silk Ribbon Continuous Wave */}
        <path
          d="M-60,190 C240,90 380,360 690,240 C980,130 1150,340 1500,210"
          stroke="url(#heroRibbonGradient1)"
          strokeWidth="1.25"
          fill="none"
        />

        {/* Secondary Ribbon Flourish (Gentle dashed gold harmony) */}
        <path
          d="M-40,230 C260,130 400,400 710,280 C1000,170 1170,380 1520,250"
          stroke="url(#heroRibbonGradient2)"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          fill="none"
        />

        {/* Third Ambient Ribbon Sweep (Bottom framing) */}
        <path
          d="M50,560 C380,480 620,650 960,530 C1250,430 1390,570 1500,520"
          stroke="#BDD3CE"
          strokeWidth="1"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* Minimal Luxury Seal Concentric Arcs (Subtle craft detail) */}
        <circle 
          cx="1160" 
          cy="260" 
          r="140" 
          stroke="#FCF3E3" 
          strokeWidth="1" 
          strokeOpacity="0.08" 
          fill="none" 
        />
        <circle 
          cx="1160" 
          cy="260" 
          r="170" 
          stroke="#F4A258" 
          strokeWidth="1" 
          strokeDasharray="4 6" 
          strokeOpacity="0.16" 
          fill="none" 
        />
        <circle 
          cx="1160" 
          cy="260" 
          r="200" 
          stroke="#BDD3CE" 
          strokeWidth="0.75" 
          strokeOpacity="0.10" 
          fill="none" 
        />
      </svg>
    </div>
  )
}

/**
 * CategoryWavesBackground
 * Subtle organic curves and thin line wave along the category section boundaries.
 */
export function CategoryWavesBackground() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      {/* Soft warm pebble silhouette on outer edge */}
      <div 
        className="absolute top-1/2 -start-16 -translate-y-1/2 w-72 h-72 rounded-[40%_60%_70%_30%] blur-[70px] opacity-40"
        style={{ background: 'rgba(189,211,206,0.15)' }}
      />
      <div 
        className="absolute top-1/3 -end-16 w-80 h-80 rounded-[60%_40%_30%_70%] blur-[80px] opacity-30"
        style={{ background: 'rgba(244,162,88,0.08)' }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Subtle Boundary Ribbon Flow */}
        <path
          d="M0,45 Q360,15 720,40 T1440,25"
          stroke="#BDD3CE"
          strokeWidth="1"
          strokeOpacity="0.10"
          fill="none"
        />
        <path
          d="M0,60 Q380,30 740,55 T1440,40"
          stroke="#013D5A"
          strokeWidth="0.75"
          strokeDasharray="5 7"
          strokeOpacity="0.04"
          fill="none"
        />

        {/* Minimal Corner Flourish */}
        <path
          d="M1360,320 C1400,280 1430,340 1440,310"
          stroke="#F4A258"
          strokeWidth="1"
          strokeOpacity="0.09"
          fill="none"
        />
      </svg>
    </div>
  )
}

/**
 * QuizLuxuryLines
 * Thin gold & celeste elliptical lines and soft organic ambient glow for the Gift Finder section.
 */
export function QuizLuxuryLines() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 rounded-2xl sm:rounded-3xl" 
      aria-hidden="true"
    >
      {/* Subtle Warm Amber Glow Behind Content */}
      <div 
        className="absolute top-1/4 end-1/4 w-80 h-80 rounded-full blur-[100px] opacity-25"
        style={{ background: '#F4A258' }}
      />
      <div 
        className="absolute bottom-10 start-10 w-72 h-72 rounded-full blur-[90px] opacity-20"
        style={{ background: '#BDD3CE' }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elegant Celestial Rings (Symbolizing curation & jewelry precision) */}
        <ellipse
          cx="1020"
          cy="140"
          rx="220"
          ry="80"
          transform="rotate(-20 1020 140)"
          stroke="#F4A258"
          strokeWidth="1"
          strokeOpacity="0.12"
          strokeDasharray="4 6"
          fill="none"
        />
        <ellipse
          cx="1020"
          cy="140"
          rx="260"
          ry="100"
          transform="rotate(-20 1020 140)"
          stroke="#BDD3CE"
          strokeWidth="0.75"
          strokeOpacity="0.08"
          fill="none"
        />

        <ellipse
          cx="150"
          cy="480"
          rx="260"
          ry="90"
          transform="rotate(25 150 480)"
          stroke="#BDD3CE"
          strokeWidth="1"
          strokeOpacity="0.09"
          strokeDasharray="3 5"
          fill="none"
        />

        {/* Minimal Ribbon Loop Corner Accent */}
        <path
          d="M80,80 C120,40 180,60 160,110 C140,160 80,140 110,200"
          stroke="#F4A258"
          strokeWidth="1.2"
          strokeOpacity="0.11"
          fill="none"
        />
        <path
          d="M1080,500 C1120,460 1180,480 1160,530"
          stroke="#BDD3CE"
          strokeWidth="1"
          strokeOpacity="0.10"
          fill="none"
        />
      </svg>
    </div>
  )
}

/**
 * SectionRibbonFlourish
 * Minimalist organic ribbon curve for Testimonials, Personas, or Featured sections.
 */
export function SectionRibbonFlourish({ variant = 'default' }: { variant?: 'default' | 'inverted' }) {
  const isDefault = variant === 'default'
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d={
            isDefault
              ? "M-20,120 C320,40 640,200 980,100 C1220,30 1380,150 1460,90"
              : "M-20,90 C280,180 580,40 920,140 C1240,230 1380,80 1460,120"
          }
          stroke="#013D5A"
          strokeWidth="1"
          strokeOpacity="0.05"
          fill="none"
        />
        <path
          d={
            isDefault
              ? "M-10,145 C330,65 650,225 990,125 C1230,55 1390,175 1470,115"
              : "M-10,115 C290,205 590,65 930,165 C1250,255 1390,105 1470,145"
          }
          stroke="#F4A258"
          strokeWidth="0.8"
          strokeDasharray="4 6"
          strokeOpacity="0.06"
          fill="none"
        />
      </svg>
    </div>
  )
}

/**
 * FooterSilkLines
 * Whisper-thin flowing silk ribbon pattern and organic navy halo tailored for the deep Midnight footer.
 */
export function FooterSilkLines() {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      {/* 1. Deep Organic Accent Nebulas */}
      <div 
        className="absolute top-0 start-1/3 w-96 h-96 rounded-full blur-[120px] opacity-25"
        style={{ background: '#708C69' }}
      />
      <div 
        className="absolute bottom-0 end-1/4 w-80 h-80 rounded-full blur-[100px] opacity-20"
        style={{ background: '#F4A258' }}
      />

      {/* 2. Flowing Continuous Silk Ribbon Vector */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Soft Organic Contours */}
        <path
          d="M-50,110 C280,210 540,40 880,160 C1180,260 1340,70 1500,130"
          stroke="#BDD3CE"
          strokeWidth="1.2"
          strokeOpacity="0.08"
          fill="none"
        />
        <path
          d="M-30,140 C300,240 560,70 900,190 C1200,290 1360,100 1520,160"
          stroke="#F4A258"
          strokeWidth="1"
          strokeDasharray="5 7"
          strokeOpacity="0.09"
          fill="none"
        />

        {/* Subtle geometric luxury star/diamond watermark */}
        <g opacity="0.07" transform="translate(1320, 80)">
          <path
            d="M0,-24 L6,-6 L24,0 L6,6 L0,24 L-6,6 L-24,0 L-6,-6 Z"
            fill="none"
            stroke="#FCF3E3"
            strokeWidth="1.2"
          />
          <circle cx="0" cy="0" r="16" stroke="#FCF3E3" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
        </g>
        
        <g opacity="0.06" transform="translate(100, 380)">
          <path
            d="M0,-18 L4,-4 L18,0 L4,4 L0,18 L-4,4 L-18,0 L-4,-4 Z"
            fill="none"
            stroke="#BDD3CE"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  )
}

/**
 * PackagingFlourish
 * Delicate ribbon knot and geometric outline for royal packaging & guarantee boxes.
 */
export function PackagingFlourish() {
  return (
    <div 
      className="absolute top-0 end-0 w-44 h-44 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Delicate Ribbon Loop Corner Arc */}
        <circle 
          cx="160" 
          cy="0" 
          r="100" 
          stroke="#013D5A" 
          strokeWidth="1" 
          strokeOpacity="0.06" 
          fill="none" 
        />
        <circle 
          cx="160" 
          cy="0" 
          r="125" 
          stroke="#F4A258" 
          strokeWidth="1" 
          strokeDasharray="3 5" 
          strokeOpacity="0.10" 
          fill="none" 
        />
        <path
          d="M110,0 C110,40 140,50 160,50"
          stroke="#BDD3CE"
          strokeWidth="1.2"
          strokeOpacity="0.12"
          fill="none"
        />
      </svg>
    </div>
  )
}

