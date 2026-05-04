import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

const CursorSparkleTrail = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const idRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isMobile = 'ontouchstart' in window;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) return;
      lastPos.current = { x: e.clientX, y: e.clientY };

      const newSparkle = {
        id: idRef.current++,
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        size: 4 + Math.random() * 8
      };
      setSparkles(prev => [...prev.slice(-8), newSparkle]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 1, scale: 1, x: s.x, y: s.y }}
          animate={{ opacity: 0, scale: 0, y: s.y - 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="cursor-sparkle"
          style={{ width: s.size, height: s.size, left: 0, top: 0, position: 'fixed' }}
        />
      ))}
    </>
  );
};

export default CursorSparkleTrail;
