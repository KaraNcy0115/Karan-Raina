import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cross } from 'lucide-react'; // using generic icons, replace with appropriate SVGs if needed

interface ElegantPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ElegantPaperModal: React.FC<ElegantPaperModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-lg w-full mx-4 bg-paper texture p-6 md:p-8 rounded-xl shadow-2xl border border-accent-gold/30 max-h-[90vh] overflow-y-auto no-scrollbar"
            initial={{ scale: 0.8, y: -50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-accent-gold hover:text-accent-light transition-colors"
            >
              <Cross size={24} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElegantPaperModal;
