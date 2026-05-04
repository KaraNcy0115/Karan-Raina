import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
}

const LightboxModal = ({ isOpen, imageSrc, onClose }: LightboxModalProps) => (
  <AnimatePresence>
    {isOpen && imageSrc && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-purple-dark/95 backdrop-blur-xl p-4 md:p-8 cursor-zoom-out"
      >
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={onClose}
            className="text-cream-gold hover:text-accent-gold transition-colors bg-purple-deep/50 p-2 rounded-full backdrop-blur-sm"
          >
            <XCircle size={36} />
          </button>
        </div>
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          src={imageSrc}
          alt="Enlarged gallery view"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border border-accent-gold/20"
          onClick={e => e.stopPropagation()}
        />
      </motion.div>
    )}
  </AnimatePresence>
);

export default LightboxModal;
