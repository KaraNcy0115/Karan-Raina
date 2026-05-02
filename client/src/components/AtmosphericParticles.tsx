import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

const AtmosphericParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);
  const particleList = useRef<any[]>([]);

  const particleTypes = [
    { sym: '✦', size: '1rem', color: 'rgba(212, 169, 100, 0.8)' },
    { sym: '✨', size: '0.9rem', color: 'rgba(229, 197, 145, 0.9)' },
    { sym: '·', size: '1.5rem', color: 'rgba(212, 169, 100, 0.5)' },
    { sym: '✧', size: '0.8rem', color: 'rgba(253, 246, 236, 0.7)' },
    { sym: '∘', size: '1.2rem', color: 'rgba(212, 169, 100, 0.4)' },
  ];

  useEffect(() => {
    const initialParticles = [];
    for (let i = 0; i < 25; i++) {
      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      const x = Math.random() * 100;
      const startTop = -8 - Math.random() * 8;
      
      initialParticles.push({
        id: i,
        sym: type.sym,
        size: type.size,
        color: type.color || '',
        x,
        startTop,
        phase: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.12,
        sway: 15 + Math.random() * 20,
        yOffset: Math.random() * 100,
      });
    }
    setParticles(initialParticles);
    particleList.current = initialParticles;
  }, []);

  return (
    <div id="particle-layer" className="fixed inset-0 h-screen pointer-events-none z-[50] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, 0.75, 0.75, 0],
            x: [
              `${p.x}%`,
              `${p.x + Math.sin(p.phase) * p.sway * 0.4}%`,
              `${p.x + Math.sin(p.phase + 1) * p.sway * 0.4}%`,
              `${p.x}%`
            ]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
          style={{
            left: `${p.x}%`,
            top: `${p.startTop}%`,
            fontSize: p.size,
            color: p.color,
            filter: 'drop-shadow(0 1px 6px rgba(212, 169, 100, 0.4))',
            willChange: 'transform, opacity'
          }}
        >
          {p.sym}
        </motion.div>
      ))}
    </div>
  );
};

export default AtmosphericParticles;
