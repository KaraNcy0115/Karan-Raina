import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicToggle = ({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onToggle}
    className="fixed bottom-8 left-8 z-[90] clay-button-gold p-4 shadow-2xl hover:bg-accent-light transition-all group"
    title={isPlaying ? 'Pause Music' : 'Play Music'}
  >
    {isPlaying ? (
      <Volume2 size={24} className="animate-pulse group-hover:scale-110 transition-transform" />
    ) : (
      <VolumeX size={24} className="group-hover:scale-110 transition-transform" />
    )}
  </motion.button>
);

export default MusicToggle;
