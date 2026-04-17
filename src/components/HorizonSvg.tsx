import React from 'react';
import { motion } from 'motion/react';

const HorizonSvg = () => {
  return (
    <div className="horizon-wrapper absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] z-[2] overflow-hidden">
      <svg viewBox="0 0 1200 280" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" className="w-full h-auto block">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-vermilion)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--color-vermilion)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="goldGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Ground base */}
        <rect x="0" y="265" width="1200" height="15" fill="#0A0005" opacity="0.9"/>

        {/* ── SRIRANGAM TEMPLE (Left side) ── */}
        <g opacity="0.82" filter="url(#glow2)">
          {/* Base Platform */}
          <rect x="50" y="240" width="200" height="25" fill="#1A0818"/>
          {/* Main Gopuram Entry Base */}
          <rect x="70" y="180" width="160" height="60" fill="#22091A"/>
          {/* Entry Doorway */}
          <rect x="135" y="195" width="30" height="45" rx="15" ry="0" fill="#0A040D"/>
          {/* Tiers getting progressively narrower */}
          <polygon points="75,180 225,180 210,140 90,140" fill="#2A0A20"/>
          <polygon points="95,140 205,140 195,105 105,105" fill="#3E0F2F"/>
          <polygon points="110,105 190,105 182,75 118,75" fill="#4E153B"/>
          <polygon points="122,75 178,75 172,50 128,50" fill="#5E1D4A"/>
          <polygon points="132,50 168,50 164,30 136,30" fill="#6E2B5D"/>
          {/* Top rectangular kalasha base (Vimana roof) */}
          <rect x="125" y="20" width="50" height="10" rx="4" ry="4" fill="#3E0F2F"/>
          {/* Kalashams (Gold pots) */}
          <circle cx="130" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          <circle cx="138" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          <circle cx="146" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          <circle cx="150" cy="12" r="4" fill="var(--color-gold)" opacity="0.9"/>
          <circle cx="154" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          <circle cx="162" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          <circle cx="170" cy="15" r="3" fill="var(--color-gold)" opacity="0.8"/>
          {/* Mandapams / Small side halls */}
          <rect x="10" y="210" width="60" height="30" fill="#150005"/>
          <rect x="230" y="210" width="60" height="30" fill="#150005"/>
          {/* Glow lights */}
          <circle cx="150" cy="210" r="3" fill="var(--color-gold)" opacity="0.4"/>
          <ellipse cx="150" cy="265" rx="15" ry="3" fill="var(--color-gold)" opacity="0.2"/>
        </g>

        {/* ── VELANKANNI CHURCH (Right side) ── */}
        <g opacity="0.82" filter="url(#glow2)">
          {/* Base Platform */}
          <rect x="910" y="240" width="220" height="25" fill="#060C1A"/>
          {/* Main structure body */}
          <rect x="940" y="160" width="160" height="80" fill="#0A122A"/>
          
          {/* Left Tall Twin Spire */}
          <rect x="945" y="70" width="25" height="90" fill="#0D1A3B"/>
          <polygon points="940,70 980,70 957.5,10" fill="#13234A"/>
          {/* Left Spire Cross */}
          <rect x="956.5" y="2" width="2" height="10" fill="var(--color-gold)" opacity="0.7"/>
          <rect x="953.5" y="5" width="8" height="2" fill="var(--color-gold)" opacity="0.7"/>

          {/* Right Tall Twin Spire */}
          <rect x="1070" y="70" width="25" height="90" fill="#0D1A3B"/>
          <polygon points="1060,70 1100,70 1082.5,10" fill="#13234A"/>
          {/* Right Spire Cross */}
          <rect x="1081.5" y="2" width="2" height="10" fill="var(--color-gold)" opacity="0.7"/>
          <rect x="1078.5" y="5" width="8" height="2" fill="var(--color-gold)" opacity="0.7"/>
          
          {/* Central Gable (Lower roof between the towers) */}
          <polygon points="970,160 1070,160 1020,90" fill="#0A122A"/>
          <polygon points="990,160 1050,160 1020,110" fill="#080E20"/>

          {/* Large Main Cross (Center Top) */}
          <rect x="1018" y="50" width="4" height="40" fill="var(--color-gold)" opacity="0.9"/>
          <rect x="1008" y="65" width="24" height="4" fill="var(--color-gold)" opacity="0.9"/>

          {/* Main Entry Arch */}
          <rect x="1000" y="170" width="40" height="70" rx="20" ry="0" fill="#040810"/>
          <path d="M1000,190 Q1020,165 1040,190" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" opacity="0.4"/>
          <rect x="1018" y="175" width="4" height="65" fill="#0A122A" opacity="0.8"/> {/* door divide */}
          <circle cx="1020" cy="140" r="14" fill="#040810"/>
          <circle cx="1020" cy="140" r="10" fill="none" stroke="#7088C8" strokeWidth="1" opacity="0.5"/>
          <circle cx="1020" cy="140" r="4" fill="#7088C8" opacity="0.3"/>
          <ellipse cx="1020" cy="265" rx="15" ry="3" fill="#7088C8" opacity="0.2"/>
        </g>

        {/* ── COUPLE SILHOUETTE (Center) ── */}
        <g opacity="0.88">
          <ellipse cx="572" cy="222" rx="20" ry="25" fill="#0A040D"/>
          <circle cx="572" cy="188" r="16" fill="#0A040D"/>
          <ellipse cx="628" cy="222" rx="22" ry="28" fill="#0A040D"/>
          <path d="M606,235 Q600,265 590,265 Q610,265 620,265 Q640,265 650,235 Q640,250 628,250 Z" fill="#0A040D"/>
          <circle cx="628" cy="185" r="15" fill="#0A040D"/>
          <path d="M587,220 Q600,228 613,220" fill="none" stroke="var(--color-gold)" strokeWidth="2" opacity="0.55"/>
          <ellipse cx="600" cy="265" rx="50" ry="5" fill="var(--color-gold)" opacity="0.15"/>
        </g>

        {/* Ground gradient overlay */}
        <rect x="0" y="230" width="1200" height="50" fill="url(#skyGrad)"/>
      </svg>
    </div>
  );
};

export default HorizonSvg;
