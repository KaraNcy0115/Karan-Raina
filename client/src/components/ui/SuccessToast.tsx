import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const SuccessToast = ({ message, isVisible, onClose }: SuccessToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[100] clay-card-gold px-8 py-4 flex items-center gap-3 border border-accent-gold/30"
        >
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-purple-dark font-bold font-display">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
