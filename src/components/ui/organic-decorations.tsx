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
      {/* 1. Upper Header & Hero Right Canopy Ambient Glow (Extends behind Logo & Navigation) */}
      <div 
        className="absolute -top-36 start-[-6%] w-[520px] h-[520px] lg:w-[680px] lg:h-[680px] rounded-full blur-[130px] opacity-75"
        style={{
          background: 'radial-gradient(circle, rgba(2,81,119,0.38) 0%, rgba(189,211,206,0.10) 55%, transparent 75%)'
        }}
      />

      {/* 2. Large Soft Organic Ambient Blob (Top-Left behind Search, Actions & Showcase) */}
      <div 
        className="absolute -top-28 end-[-8%] w-[580px] h-[580px] lg:w-[760px] lg:h-[760px] rounded-full blur-[135px] opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(189,211,206,0.13) 0%, rgba(252,243,227,0.06) 50%, transparent 75%)'
        }}
      />
      
      {/* 3. Secondary Herb & Celeste Organic Accent (Bottom Start) */}
      <div 
        className="absolute -bottom-24 start-[-8%] w-[460px] h-[460px] rounded-full blur-[110px] opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(112,140,105,0.14) 0%, rgba(189,211,206,0.09) 60%, transparent 75%)'
        }}
      />

      {/* 4. Warm Marigold Ambient Glow for Luxury Accent */}
      <div 
        className="absolute top-[22%] start-[32%] w-[420px] h-[420px] rounded-full blur-[140px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(244,162,88,0.12) 0%, transparent 70%)'
        }}
      />

      {/* 5. Continuous Thin Line Ribbon Waves & Oversized Organic Forms Spanning Header + Hero */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 820"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroHeaderCanopyWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FCF3E3" stopOpacity="0.03" />
            <stop offset="30%" stopColor="#BDD3CE" stopOpacity="0.14" />
            <stop offset="68%" stopColor="#F4A258" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#BDD3CE" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="heroRibbonGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BDD3CE" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#F4A258" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#BDD3CE" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FCF3E3" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="heroRibbonGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4A258" stopOpacity="0.24" />
            <stop offset="50%" stopColor="#F4A258" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#BDD3CE" stopOpacity="0.18" />
          </linearGradient>

          <linearGradient id="organicBlobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#025177" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#BDD3CE" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#FCF3E3" stopOpacity="0.02" />
          </linearGradient>

          <radialGradient id="topNavOrbGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#025177" stopOpacity="0.24" />
            <stop offset="70%" stopColor="#013D5A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#01283B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Oversized Soft Organic Circle Spanning Header into Hero Right */}
        <circle
          cx="1180"
          cy="110"
          r="340"
          fill="url(#topNavOrbGradient)"
        />

        {/* Oversized Soft Organic Circle Spanning Header into Hero Left */}
        <circle
          cx="240"
          cy="160"
          r="290"
          fill="url(#topNavOrbGradient)"
        />

        {/* Soft Organic Curved Silhouette (Bridging Header y=40 down to Hero y=660) */}
        <path
          d="M280,55 C520,15 760,125 960,65 C1140,15 1310,110 1395,245 C1465,360 1415,530 1310,625 C1185,720 975,685 810,650 C635,615 475,710 320,655 C160,600 105,455 140,305 C175,155 180,75 280,55 Z"
          fill="url(#organicBlobGradient)"
        />

        {/* Upper Canopy Flowing Silk Line (Flows directly behind Header & Nav Links) */}
        <path
          d="M-40,78 C260,22 520,148 840,74 C1120,12 1310,118 1480,64"
          stroke="url(#heroHeaderCanopyWave)"
          strokeWidth="1.15"
          fill="none"
        />

        {/* Delicate Dashed Companion Line in Upper Header Zone */}
        <path
          d="M-20,112 C280,54 540,178 860,106 C1140,44 1320,148 1490,96"
          stroke="#F4A258"
          strokeWidth="0.9"
          strokeDasharray="4 8"
          strokeOpacity="0.14"
          fill="none"
        />

        {/* Primary Silk Ribbon Continuous Wave */}
        <path
          d="M-60,240 C240,130 380,410 690,285 C980,170 1150,385 1500,250"
          stroke="url(#heroRibbonGradient1)"
          strokeWidth="1.25"
          fill="none"
        />

        {/* Secondary Ribbon Flourish (Gentle dashed gold harmony) */}
        <path
          d="M-40,280 C260,170 400,450 710,325 C1000,210 1170,425 1520,290"
          stroke="url(#heroRibbonGradient2)"
          strokeWidth="1.15"
          strokeDasharray="6 8"
          fill="none"
        />

        {/* Third Ambient Ribbon Sweep (Bottom framing) */}
        <path
          d="M50,640 C380,555 620,725 960,605 C1250,505 1390,645 1500,595"
          stroke="#BDD3CE"
          strokeWidth="1"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* Upper-Right Subtle Concentric Luxury Rings (Bridging Header & Hero) */}
        <circle 
          cx="1210" 
          cy="195" 
          r="155" 
          stroke="#FCF3E3" 
          strokeWidth="0.9" 
          strokeOpacity="0.07" 
          fill="none" 
        />
        <circle 
          cx="1210" 
          cy="195" 
          r="190" 
          stroke="#F4A258" 
          strokeWidth="1" 
          strokeDasharray="4 7" 
          strokeOpacity="0.15" 
          fill="none" 
        />
        <circle 
          cx="1210" 
          cy="195" 
          r="225" 
          stroke="#BDD3CE" 
          strokeWidth="0.75" 
          strokeOpacity="0.09" 
          fill="none" 
        />

        {/* Upper-Left Subtle Geometric Arc Behind Showcase & Header Actions */}
        <circle 
          cx="210" 
          cy="145" 
          r="145" 
          stroke="#BDD3CE" 
          strokeWidth="0.8" 
          strokeOpacity="0.07" 
          fill="none" 
        />
        <circle 
          cx="210" 
          cy="145" 
          r="180" 
          stroke="#F4A258" 
          strokeWidth="0.85" 
          strokeDasharray="3 6" 
          strokeOpacity="0.11" 
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

