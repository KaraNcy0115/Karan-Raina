import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  setToastMessage: (msg: string) => void;
  setIsToastVisible: (v: boolean) => void;
}

const RSVPModal = ({ isOpen, onClose, setToastMessage, setIsToastVisible }: RSVPModalProps) => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', guests: '1', attendance: 'yes',
    mealPreference: 'Standard', allergies: '', message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
        setToastMessage('RSVP submitted successfully!');
        setIsToastVisible(true);
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', mobile: '', guests: '1', attendance: 'yes', mealPreference: 'Standard', allergies: '', message: '' });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-dark/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="clay-card-gold text-purple-dark w-full max-w-md md:max-w-lg max-h-[90vh] flex flex-col shadow-2xl border-4 border-accent-gold/20"
          >
            <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-bold">RSVP</h2>
                <button onClick={onClose} className="text-purple-light hover:text-purple-deep transition-colors">
                  <XCircle size={28} className="md:w-8 md:h-8" />
                </button>
              </div>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto text-green-600 mb-4" size={64} />
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p>Your response has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                    <input required type="text"
                      className="w-full px-4 py-2 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none transition-all shadow-inner"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Mobile Number</label>
                    <input required type="tel"
                      className="w-full px-4 py-2 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none transition-all shadow-inner"
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">No. of Guests</label>
                      <select
                        className="w-full px-4 py-2 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none transition-all shadow-inner"
                        value={formData.guests}
                        onChange={e => setFormData({ ...formData, guests: e.target.value })}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Attendance</label>
                      <select
                        className="w-full px-4 py-2 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none transition-all shadow-inner"
                        value={formData.attendance}
                        onChange={e => setFormData({ ...formData, attendance: e.target.value })}>
                        <option value="yes">Joyfully Attend</option>
                        <option value="no">Regretfully Decline</option>
                      </select>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-1 text-purple-dark/80">Message (Optional)</label>
                    <textarea rows={3} maxLength={300}
                      className="w-full px-4 py-2 rounded-xl bg-cream-gold border-2 border-accent-light/50 focus:border-accent-gold outline-none transition-all resize-none shadow-inner"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })} />
                    <div className="absolute bottom-2 right-4 text-[10px] font-bold tracking-widest text-purple-light/40">
                      {formData.message.length} / 300
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={status === 'loading'} type="submit"
                    className="w-full clay-button bg-purple-deep text-cream-gold py-3 font-bold hover:bg-purple-light transition-all disabled:opacity-50">
                    {status === 'loading' ? 'Sending...' : 'Submit Response'}
                  </motion.button>
                  {status === 'error' && (
                    <p className="text-red-600 text-center text-sm">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RSVPModal;
