/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Music,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Church,
  Flame,
  Mail,
  Phone,
  Info,
  Share2,
  Volume2,
  VolumeX,
  Flower,
  ChevronRight,
  Sparkles,
  Star,
  Lock,
  Trash2,
  Settings,
  Plus,
  UploadCloud,
  Instagram,
  FileText
} from 'lucide-react';

import HorizonSvg from './components/HorizonSvg';
import FaithDivider from './components/FaithDivider';
import AtmosphericParticles from './components/AtmosphericParticles';
import OmIcon from './components/OmIcon';
import CursorSparkleTrail from './components/ui/CursorSparkleTrail';
import AdminModal from './components/admin/AdminModal';
import MusicToggle from './components/ui/MusicToggle';
import ScrollToTop from './components/ui/ScrollToTop';
import SuccessToast from './components/ui/SuccessToast';
import { CountdownTimer } from './components/ui/CountdownTimer';
import RSVPModal from './components/modals/RSVPModal';
import LightboxModal from './components/modals/LightboxModal';


// --- Wave Section Divider ---
const WaveDivider = ({ flip = false, fromColor = '#FDF9FF', toColor = '#2D1126' }: { flip?: boolean; fromColor?: string; toColor?: string }) => (
  <div className={`wave-divider ${flip ? 'rotate-180' : ''}`} style={{ backgroundColor: toColor }}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill={fromColor}
        opacity=".8"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        fill={fromColor}
        opacity=".5"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        fill={fromColor}
      />
    </svg>
  </div>
);

// --- Magical Dust Animation Component ---
const MagicalDustAnimation = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; duration: string; size: string; type: 'sparkle' | 'star' | 'dust' | 'heart' }[]>([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${12 + Math.random() * 18}s`,
      size: `${8 + Math.random() * 18}px`,
      type: (i % 4 === 0 ? 'sparkle' : (i % 4 === 1 ? 'star' : (i % 4 === 2 ? 'heart' : 'dust'))) as 'sparkle' | 'star' | 'dust' | 'heart'
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
      {particles.map((p) => {
        if (p.type === 'dust') {
          return <div key={p.id} className="dust-particle" style={{ left: p.left, top: `${Math.random() * 100}%`, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration }} />;
        }
        return (
          <motion.div
            key={p.id}
            initial={{ y: -100, opacity: 0, rotate: 0 }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.7, 0.7, 0],
              rotate: [0, p.type === 'heart' ? 720 : 360],
              x: p.type === 'heart' ? [0, 30, -20, 10, 0] : undefined
            }}
            transition={{
              duration: parseFloat(p.duration),
              repeat: Infinity,
              delay: parseFloat(p.delay),
              ease: "linear"
            }}
            className="absolute"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              color: p.type === 'heart' ? 'rgba(212, 169, 100,0.3)' : '#D4AF37',
              filter: `drop-shadow(0 0 ${p.type === 'heart' ? '8' : '5'}px rgba(212, 169, 100,0.6))`
            }}
          >
            {p.type === 'sparkle' ? <Sparkles size={parseFloat(p.size)} /> :
              p.type === 'heart' ? <Heart fill="currentColor" size={parseFloat(p.size)} /> :
                <Star fill="#D4AF37" size={parseFloat(p.size)} />}
          </motion.div>
        );
      })}
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [songUrl, setSongUrl] = useState('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [guestMessages, setGuestMessages] = useState<{ name: string; message: string; timestamp: string }[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [groomImage, setGroomImage] = useState('https://picsum.photos/seed/groom/400/400');
  const [brideImage, setBrideImage] = useState('https://picsum.photos/seed/bride/400/400');
  const [groomName, setGroomName] = useState('KARAN');
  const [brideName, setBrideName] = useState('NANCY');
  const [weddingDate, setWeddingDate] = useState('2026-06-07T06:00:00');
  const [weddingVenue, setWeddingVenue] = useState('KRISHNAGIRI');
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Fetch settings from cloud
        const settingsResponse = await fetch('/api/settings');
        if (settingsResponse.ok) {
          const settings = await settingsResponse.json();
          if (settings.songUrl) setSongUrl(settings.songUrl);
          if (settings.groomImage) setGroomImage(settings.groomImage);
          if (settings.brideImage) setBrideImage(settings.brideImage);
          if (settings.groomName) setGroomName(settings.groomName);
          if (settings.brideName) setBrideName(settings.brideName);
          if (settings.weddingDate) setWeddingDate(settings.weddingDate);
          if (settings.weddingVenue) setWeddingVenue(settings.weddingVenue);
          if (settings.coverImage) setCoverImage(settings.coverImage);
          if (settings.galleryImages && settings.galleryImages.length > 0) {
            setGalleryImages(settings.galleryImages);
          } else {
            setGalleryImages([
              'https://picsum.photos/seed/wedding-1/800/800',
              'https://picsum.photos/seed/wedding-2/800/800',
              'https://picsum.photos/seed/wedding-3/800/800',
              'https://picsum.photos/seed/wedding-4/800/800',
              'https://picsum.photos/seed/wedding-5/800/800',
              'https://picsum.photos/seed/wedding-6/800/800',
              'https://picsum.photos/seed/wedding-7/800/800',
              'https://picsum.photos/seed/wedding-8/800/800'
            ]);
          }
          if (settings.documentUrls && settings.documentUrls.length > 0) {
            setDocumentUrls(settings.documentUrls);
          }
        }
      } catch (e) {
        console.error('Failed to fetch cloud settings, falling back to defaults');
        setGalleryImages([
          'https://picsum.photos/seed/wedding-1/800/800',
          'https://picsum.photos/seed/wedding-2/800/800',
          'https://picsum.photos/seed/wedding-3/800/800',
          'https://picsum.photos/seed/wedding-4/800/800',
          'https://picsum.photos/seed/wedding-5/800/800',
          'https://picsum.photos/seed/wedding-6/800/800',
          'https://picsum.photos/seed/wedding-7/800/800',
          'https://picsum.photos/seed/wedding-8/800/800'
        ]);
      }

      fetchGuestMessages();

      // Set initial audio volume
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
      }
    };

    loadSavedData();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const fetchGuestMessages = async () => {
    try {
      const response = await fetch('/api/guestbook');
      if (response.ok) {
        const messages = await response.json();
        setGuestMessages(messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleGuestBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, message: guestMessage }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setGuestMessages(prev => [newMessage, ...prev]);
        setGuestName('');
        setGuestMessage('');
        setToastMessage('Message posted! Thank you for your blessings.');
        setIsToastVisible(true);
      }
    } catch (error) {
      setToastMessage('Failed to post message. Please try again.');
      setIsToastVisible(true);
    }
  };
  const playBells = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Karan & Nancy Wedding Invitation',
      text: 'Join us in celebrating the sacred union of Karan & Nancy!',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Invitation link copied to clipboard!');
    }
  };

  const handleOpenInvitation = () => {
    setIsInvitationOpened(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }

    // Trigger red and gold confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const colors = ['#ff0000', '#ffd700'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springX = useSpring(cardX, { stiffness: 100, damping: 30 });
  const springY = useSpring(cardY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardX.set(x * 20);
    cardY.set(y * -20);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <div className="min-h-screen bg-purple-dark font-sans selection:bg-accent-gold selection:text-purple-dark overflow-x-hidden">
      <AnimatePresence>
        {!isInvitationOpened && (
          <motion.div
            key="invitation-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-purple-dark flex flex-col items-center justify-center p-4 overflow-hidden"
          >
            {/* Aurora Animated Background */}
            <div className="absolute inset-0 bg-aurora"></div>
            {coverImage && (
              <div 
                className="absolute inset-0 z-0 opacity-30" 
                style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
            )}
            {/* Mesh overlay */}
            <div className="absolute inset-0 mesh-bg"></div>
            {/* Elegant Atmospheric Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-gold/15 via-transparent to-transparent"></div>
            {/* Decorative corner ornaments */}
            <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-accent-gold/20 rounded-tl-xl"></div>
            <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-accent-gold/20 rounded-tr-xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-accent-gold/20 rounded-bl-xl"></div>
            <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-accent-gold/20 rounded-br-xl"></div>
            {/* Floating orbs */}
            <motion.div
              animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0], scale: [1, 1.3, 0.9, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-gold/8 rounded-full blur-[100px]"
            ></motion.div>
            <motion.div
              animate={{ x: [0, -80, 60, 0], y: [0, 60, -70, 0], scale: [1, 0.8, 1.2, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-light/15 rounded-full blur-[120px]"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="text-center relative z-10 flex flex-col items-center"
            >
              <div className="mb-16 relative incline-block">
                {/* Glowing Wax Seal Container */}
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212, 169, 100,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenInvitation}
                  className="wax-seal w-48 h-48 md:w-64 md:h-64 flex flex-col items-center justify-center p-4 cursor-pointer z-20 mx-auto"
                >
                  <div className="w-full h-full border-2 border-dashed border-white/40 rounded-full flex flex-col items-center justify-center">
                    <h1 className="text-5xl md:text-7xl font-display text-white mb-2 drop-shadow-md">{groomName[0]} & {brideName[0]}</h1>
                    <p className="text-white/80 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">Open</p>
                  </div>
                </motion.div>

                {/* Circular Calligraphy Text (Simulated) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 -m-12 border border-accent-gold/20 rounded-full flex items-center justify-center z-10 pointer-events-none"
                >
                  <Sparkles className="absolute -top-4 text-accent-gold/50 animate-pulse" size={32} />
                  <Sparkles className="absolute -bottom-4 text-accent-gold/50 animate-pulse" size={32} />
                </motion.div>
              </div>

              <h2 className="text-2xl md:text-3xl font-display mb-6 tracking-[0.3em] uppercase text-gradient-gold">
                You're Invited
              </h2>

              <p className="mt-8 text-cream-gold/40 text-xs font-sans tracking-[0.3em] uppercase animate-pulse px-4 text-center">
                Tap the seal to open our invitation
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} loop src={songUrl} />
      <CursorSparkleTrail />
      <AtmosphericParticles />
      <ScrollToTop />
      <SuccessToast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
      <MusicToggle isPlaying={isPlaying} onToggle={toggleMusic} />

      <LightboxModal
        isOpen={!!activeLightboxImage}
        imageSrc={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />

      {/* Navigation Bar */}
      <AnimatePresence>
        {isInvitationOpened && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-[80] bg-purple-dark/80 backdrop-blur-md border-b border-accent-gold/10 px-4 sm:px-6 py-3 sm:py-4"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
              <div className="font-display text-accent-gold text-lg md:text-xl tracking-widest hidden md:block">{groomName[0]} & {brideName[0]}</div>
              <div className="flex gap-4 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-cream-gold/60 w-full md:w-auto overflow-x-auto no-scrollbar justify-start sm:justify-center md:justify-end pb-1 md:pb-0 whitespace-nowrap px-1">
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#hero" className="transition-colors shrink-0">Home</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#story" className="transition-colors shrink-0">Story</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#gallery" className="transition-colors shrink-0">Gallery</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#invitation" className="transition-colors shrink-0">Invite</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#events" className="transition-colors shrink-0">Events</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#blessings" className="transition-colors shrink-0">Blessings</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#rsvp" className="transition-colors shrink-0">RSVP</motion.a>
                <motion.a whileHover={{ scale: 1.1, color: "var(--color-accent-gold)" }} href="#contact" className="transition-colors shrink-0">Contact</motion.a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        setToastMessage={setToastMessage}
        setIsToastVisible={setIsToastVisible}
      />
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        songUrl={songUrl}
        setSongUrl={setSongUrl}
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
        setToastMessage={setToastMessage}
        setIsToastVisible={setIsToastVisible}
        guestMessages={guestMessages}
        setGuestMessages={setGuestMessages}
        groomImage={groomImage}
        setGroomImage={setGroomImage}
        brideImage={brideImage}
        setBrideImage={setBrideImage}
        documentUrls={documentUrls}
        setDocumentUrls={setDocumentUrls}
        groomName={groomName}
        setGroomName={setGroomName}
        brideName={brideName}
        setBrideName={setBrideName}
        weddingDate={weddingDate}
        setWeddingDate={setWeddingDate}
        weddingVenue={weddingVenue}
        setWeddingVenue={setWeddingVenue}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
      />

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative w-full h-screen min-h-[850px] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Layers */}
        <div className="hero-sky"></div>
        <div className="star-field"></div>

        {/* 3D Spinning Ring Ornament — back layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] opacity-20">
          <div
            style={{
              width: '700px', height: '700px',
              border: '1px solid rgba(212, 169, 100,0.6)',
              borderRadius: '50%',
              animation: 'spin3d-ring 18s linear infinite',
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] opacity-10">
          <div
            style={{
              width: '500px', height: '500px',
              border: '1px solid rgba(212, 169, 100,0.8)',
              borderRadius: '50%',
              animation: 'spin3d-ring 10s linear infinite reverse',
            }}
          />
        </div>

        {/* Content Layer */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center mt-20 md:mt-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-6 md:mb-10 w-full flex flex-col items-center gap-3 px-4"
          >
            {/* Top decorative line */}
            <div className="h-[0.5px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <h3 className="text-gold-pale tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.35em] uppercase text-[10px] sm:text-xs md:text-sm lg:text-base font-display font-bold text-shimmer text-center px-2 py-1 leading-relaxed">
              With the Blessings of our Families
            </h3>
            {/* Bottom decorative line */}
            <div className="h-[0.5px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-12 depth-card"
          >
            <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-display text-white leading-tight drop-shadow-[0_0_40px_rgba(212, 169, 100,0.5)]">
              <span className="block mb-2" style={{ textShadow: '0 0 60px rgba(212, 169, 100,0.3), 0 4px 20px rgba(0,0,0,0.8)' }}>YOU ARE</span>
              <span className="block italic font-serif text-gold-lt tracking-widest translate-y-[-10px]" style={{ textShadow: '0 0 40px rgba(229, 197, 145,0.6)' }}>INVITED</span>
            </h1>
          </motion.div>

          {/* Names Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="flex flex-col items-center gap-2 mb-12"
          >
            {/* Profile pictures restored */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2px] bg-gradient-to-tr from-gold to-burgundy shadow-[0_0_20px_rgba(212, 169, 100,0.3)] float-up-slow">
                <img src={groomImage} alt="Karan" className="w-full h-full object-cover rounded-full border-4 border-night" />
              </div>
              <Heart className="text-gold-lt animate-pulse opacity-80" size={24} />
               <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full p-[2px] bg-gradient-to-tr from-gold to-burgundy shadow-[0_0_20px_rgba(212, 169, 100,0.3)] float-up">
                <img src={brideImage} alt="Nancy" className="w-full h-full object-cover rounded-full border-4 border-night" />
              </div>
            </div>

            <div className="h-[0.5px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            <p className="text-ivory-dk font-tamil text-xl md:text-2xl mt-4 opacity-80">கரண் மற்றும் நான்சி</p>
            <p className="text-gold-lt font-display text-2xl md:text-4xl tracking-[0.15em] mb-4">{groomName} & {brideName}</p>
            <div className="h-[0.5px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3 bg-burgundy/40 backdrop-blur-sm border border-gold/30 rounded-full float-up">
              <Calendar size={18} className="text-gold" />
              <span className="text-ivory font-display tracking-widest text-lg">{new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
            </div>
            <CountdownTimer targetDate={weddingDate} />
          </motion.div>
        </motion.div>

        {/* The Horizon Svg */}
        <HorizonSvg />

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2 cursor-pointer opacity-60"
          onClick={() => document.getElementById('blessing')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent"></div>
        </motion.div>
      </section>

      <FaithDivider />

      {/* 2. BLESSING SECTION */}
      <section id="blessing" className="relative py-24 bg-deep overflow-hidden">
        <div className="star-field opacity-30"></div>
        <div className="brocade-bg opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Hindu Quote */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-maroon-dk/40 backdrop-blur-md rounded-2xl border border-gold/10 shadow-2xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20 glow-sm">
                  <OmIcon className="w-10 h-10" />
                </div>
              </div>
              <p className="font-tamil text-xl text-ivory/90 leading-relaxed mb-6">
                மங்களம் பொருந்திய இந்த திருமண நாளில் இறைவன் ஆசி பொழியட்டும்
              </p>
              <div className="h-[1px] w-12 bg-gold/30 mx-auto"></div>
            </motion.div>

            {/* Christian Quote */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center p-8 bg-navy/40 backdrop-blur-md rounded-2xl border border-gold/10 shadow-2xl"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20 glow-sm">
                  <Church size={32} />
                </div>
              </div>
              <blockquote className="italic font-serif text-xl text-ivory/90 leading-relaxed mb-4">
                "Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres."
              </blockquote>
              <cite className="text-gold-pale text-xs tracking-widest uppercase">— 1 Corinthians 13:4,7</cite>
              <div className="h-[1px] w-12 bg-gold/30 mx-auto mt-6"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section id="story" className="bg-night text-ivory py-40 px-4 relative overflow-hidden">
        <div className="star-field opacity-20"></div>
        <div className="brocade-bg opacity-10"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          >
            <p className="text-gold tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold mb-4">Our Story</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl mb-12 font-display text-white italic">
              Two Faiths, One Heart
            </h2>

            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-16"></div>

            <p className="text-ivory-dk font-serif text-xl md:text-2xl italic leading-relaxed mb-12 max-w-2xl mx-auto drop-shadow-sm">
              "Where you go I will go, and where you stay I will stay."
            </p>

            <div className="space-y-8 text-ivory/80 font-body text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-4">
              <p>
                Born into different traditions — one shaped by the incense of temple mornings and the warmth of Deepavali lamps,
                the other by the hymns of Sunday gatherings and the quiet of candlelit prayers —
                Karan and Nancy found in each other not a contradiction, but a completion.
              </p>
              <p>
                Their love is not a bridge between two worlds. It is the discovery that those worlds were always,
                at their deepest, pointing toward the same light.
              </p>
            </div>

            <div className="mt-16 flex justify-center text-gold/40">
              <Heart size={32} fill="currentColor" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2.1 GALLERY SECTION */}
      <section id="gallery" className="bg-deep py-40 px-4 overflow-hidden relative">
        <div className="star-field opacity-10"></div>
        <div className="brocade-bg opacity-5"></div>

        {/* Decorative Background */}
        <div className="absolute inset-0 mesh-bg pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-gold via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-24"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="w-20 h-[1px] bg-accent-gold/40 mx-auto mb-6"
            ></motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-cream-dark mb-6">
              <motion.span
                initial={{ opacity: 0, rotateX: 90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block gradient-title"
              >Moments of Love</motion.span>
            </h2>
            <p className="text-accent-gold tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold">A glimpse into our journey</p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="w-20 h-[1px] bg-accent-gold/40 mx-auto mt-6"
            ></motion.div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: (index % 4) * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: index % 2 === 0 ? 8 : -8,
                  rotateX: -5,
                  zIndex: 20,
                  transition: { duration: 0.4 }
                }}
                onClick={() => setActiveLightboxImage(src)}
                className={`relative aspect-square rounded-2xl overflow-hidden shadow-2xl group cursor-zoom-in perspective-1000 preserve-3d ${(index + 1) % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
              >
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-900 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-dark/90 via-purple-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* 3D Light Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                {/* Gold corner accents on hover */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent-gold/0 group-hover:border-accent-gold/60 transition-all duration-500 rounded-tl"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-accent-gold/0 group-hover:border-accent-gold/60 transition-all duration-500 rounded-tr"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-accent-gold/0 group-hover:border-accent-gold/60 transition-all duration-500 rounded-bl"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-accent-gold/0 group-hover:border-accent-gold/60 transition-all duration-500 rounded-br"></div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-cream-gold font-display text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    <Sparkles size={12} className="inline mr-2" />Memory #{index + 1}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 INVITATION CARD SECTION */}
      <section
        id="invitation"
        className="py-40 px-4 flex justify-center items-center relative overflow-hidden bg-night"
      >
        <div className="star-field"></div>
        <div className="brocade-bg opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative max-w-2xl w-full p-8 md:p-16 rounded-[40px] border border-gold/20 overflow-hidden bg-maroon-dk/40 backdrop-blur-xl shadow-2xl"
        >
          {/* Inner Ornate Border */}
          <div className="absolute inset-4 rounded-[32px] border border-gold/10 pointer-events-none"></div>
          <div className="absolute inset-6 rounded-[28px] border border-gold/5 pointer-events-none"></div>

          <div className="relative z-10 text-center">
            {/* Crest */}
            <div className="mb-12 flex flex-col items-center">
              <div className="w-24 h-24 border border-gold/30 rounded-full flex items-center justify-center mb-4">
                <span className="font-display text-4xl text-gold-lt tracking-widest translate-x-[2px]">KN</span>
              </div>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            </div>

            <h3 className="text-gold-pale tracking-[0.4em] uppercase text-xs font-bold mb-8">
              Wedding Invitation
            </h3>

            <p className="font-serif text-xl md:text-3xl italic text-ivory mb-12 leading-relaxed">
              With joyful hearts, we invite you to celebrate the beginning of our journey together as we exchange our vows.
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex flex-col items-center">
                <p className="text-gold-lt font-display text-4xl md:text-6xl tracking-widest leading-none">{groomName}</p>
                <div className="flex items-center gap-4 my-2">
                  <div className="h-[1px] w-12 bg-gold/20"></div>
                  <Heart size={16} fill="var(--color-gold)" className="opacity-60" />
                  <div className="h-[1px] w-12 bg-gold/20"></div>
                </div>
                <p className="text-gold-lt font-display text-4xl md:text-6xl tracking-widest leading-none">{brideName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-16">
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                <p className="text-gold tracking-widest text-[10px] font-bold uppercase mb-2">The Date</p>
                <p className="text-white font-display text-lg">{new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
              </div>
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                <p className="text-gold tracking-widest text-[10px] font-bold uppercase mb-2">Location</p>
                <p className="text-white font-display text-lg">{weddingVenue}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="px-12 py-4 bg-gold text-night font-bold tracking-widest uppercase rounded-full shadow-lg transition-transform"
            >
              Share Love <Share2 size={18} className="inline ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </section>


      {/* 3. WEDDING EVENTS */}
      <section id="events" className="py-24 md:py-40 px-4 bg-night relative overflow-hidden min-h-screen">
        <div className="star-field opacity-30"></div>
        <div className="brocade-bg opacity-10"></div>

        {/* Floating stars decoration */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gold pointer-events-none"
            style={{
              left: `${[8, 15, 25, 35, 60, 70, 80, 88, 92, 20, 50, 75][i]}%`,
              top: `${[10, 25, 15, 60, 8, 70, 20, 45, 80, 85, 90, 55][i]}%`,
              fontSize: `${[16, 12, 20, 14, 18, 10, 22, 16, 12, 18, 14, 10][i]}px`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ✦
          </motion.div>
        ))}

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white italic mb-4">
              Wedding Events
            </h2>
            <p className="text-gold tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold">
              Click on each event to view details
            </p>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 opacity-50"></div>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Central vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/40 to-transparent -translate-x-1/2"></div>

            <div className="flex flex-col gap-24 md:gap-32">
              {[
                {
                  id: 1,
                  title: "Holy Muhurtham",
                  date: "June 7, 2026",
                  time: "06:00 AM Onwards",
                  venue: "Arulmigu Sri Ponmalai Srinivasa Perumal Temple",
                  address: "near Sri Kattu Veera Anjaneyar Temple, Devasamudiram, Krishnagiri",
                  emoji: "🔥",
                  iconEl: <Flame size={22} />,
                  quote: '"Traditions that bind us to our roots and rituals that celebrate eternal love."',
                  directions: "https://maps.app.goo.gl/xTARmcsFSqamATdC9",
                  side: "right",
                },
                {
                  id: 2,
                  title: "Holy Matrimony",
                  date: "June 7, 2026",
                  time: "09:30 AM Onwards",
                  venue: "Our Lady of Fatima Shrine",
                  address: "Krishnagiri",
                  emoji: "🕊️",
                  iconEl: <Church size={22} />,
                  quote: '"A sacred union blessed by the divine, where two souls become one in faith."',
                  directions: "https://maps.app.goo.gl/RibXynCFDWEhEFsp9",
                  side: "left",
                },
                {
                  id: 3,
                  title: "Grand Reception",
                  date: "June 7, 2026",
                  time: "11:30 AM Onwards",
                  venue: "Sri Subramani Mahal",
                  address: "Old Pet, Opp. to Old Bus Stand, Krishnagiri",
                  emoji: "🥂",
                  iconEl: <Music size={22} />,
                  quote: '"Where music fills the air, hearts overflow with love, and every moment becomes a memory worth keeping forever."',
                  directions: "https://maps.app.goo.gl/bpsCkFpABeLP3z1j7",
                  side: "right",
                },
              ].map((event, idx) => {
                const isLeft = event.side === 'left';
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="relative flex flex-col md:flex-row items-center gap-8 md:gap-0"
                  >
                    {/* ── EVENT DETAILS ── */}
                    <div className={`w-full md:w-[42%] ${isLeft ? 'md:order-3 md:pl-16 text-center md:text-left' : 'md:order-1 md:pr-16 text-center md:text-right'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className={`text-2xl sm:text-3xl md:text-4xl font-display text-gold-lt italic mb-4 leading-tight`}>
                          {event.title}
                        </h3>
                        <div className={`flex flex-col md:flex-row gap-2 mb-4 justify-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                          <div className="flex items-center justify-center gap-2 text-ivory/70 text-sm">
                            <Calendar size={13} className="text-gold/60 shrink-0" />
                            <span>{event.date}</span>
                          </div>
                          <div className="hidden md:block text-gold/40">•</div>
                          <div className="flex items-center justify-center gap-2 text-ivory/70 text-sm">
                            <Clock size={13} className="text-gold/60 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <p className="text-gold font-display text-sm tracking-widest uppercase mb-1">{event.venue}</p>
                        <p className="text-ivory/40 text-xs tracking-wider">{event.address}</p>
                      </motion.div>
                    </div>

                    {/* ── CENTRAL TIMELINE NODE ── */}
                    <div className="md:order-2 flex flex-col items-center z-10 shrink-0">
                      <motion.a
                        href={event.directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, boxShadow: '0 0 30px rgba(212, 169, 100,0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full border-2 border-gold/50 bg-night flex items-center justify-center text-gold shadow-[0_0_20px_rgba(212, 169, 100,0.2)] cursor-pointer transition-all"
                        title="Get Directions"
                      >
                        {event.iconEl}
                      </motion.a>
                    </div>

                    {/* ── QUOTE CARD ── */}
                    <div className={`w-full md:w-[42%] ${isLeft ? 'md:order-1 md:pr-16' : 'md:order-3 md:pl-16'}`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -4 }}
                        transition={{ duration: 0.3 }}
                        className="p-6 md:p-8 rounded-3xl bg-maroon-dk/40 backdrop-blur-md border border-gold/10 hover:border-gold/20 transition-all shadow-xl card-3d holo-card text-center md:text-left"
                      >
                        <div className="text-3xl mb-4 flex justify-center md:justify-start">{event.emoji}</div>
                        <p className="text-ivory/80 font-serif italic text-base md:text-lg leading-relaxed mb-4">
                          {event.quote}
                        </p>
                        <motion.a
                          href={event.directions}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-center md:justify-start gap-1 text-gold text-xs tracking-[0.2em] uppercase font-bold hover:text-gold-lt transition-colors"
                        >
                          View Details <span className="text-base">›</span>
                        </motion.a>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLESSINGS & MAP */}
      <section id="blessings" className="bg-night py-32 px-4 relative overflow-hidden">
        <div className="star-field opacity-10"></div>
        <div className="brocade-bg opacity-10"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl mb-16 font-display font-bold text-white italic">
              Blessings From
            </h2>

            <div className="space-y-16">
              <div>
                <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-4 font-bold">Groom's Parents</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-display text-gold-lt leading-relaxed">Mr. Venkatesan &<br />Mrs. Sharmila</p>
              </div>

              <div>
                <p className="text-gold tracking-[0.4em] uppercase text-[10px] mb-4 font-bold">Bride's Parents</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-display text-gold-lt leading-relaxed">Mr. George Vincent & <br /> Mrs. Kumudha</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-full h-[400px] md:h-[500px] bg-gray-900 rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
              <iframe
                src="https://maps.google.com/maps?q=Sri+Subramani+Mahal,Old+Pet,Krishnagiri,Tamil+Nadu&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 rounded-full blur-[60px]"></div>
          </motion.div>
        </div>
      </section>


      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-24 md:py-40 px-4 bg-deep relative overflow-hidden">
        <div className="star-field opacity-20"></div>
        <div className="brocade-bg opacity-10"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold mb-4">Reach Out</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white italic mb-4">Contact Us</h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto opacity-50"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">

            {/* Groom Side */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl bg-maroon-dk/40 backdrop-blur-md border border-gold/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-lg">🌸</span>
                </div>
                <div>
                  <p className="text-gold tracking-[0.3em] uppercase text-[10px] font-bold">Groom's Side</p>
                  <div className="h-[1px] w-20 bg-gold/30 mt-1"></div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Karan", phone: "7904336561" },
                  { name: "Venkatesan", phone: "8148715933" },
                  { name: "Sharmila", phone: "8438554439" },
                  { name: "Sharmila (Alt)", phone: "9629159685" },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-night/50 border border-gold/10 hover:border-gold/30 transition-all group"
                  >
                    <div>
                      <p className="text-ivory font-display tracking-wider text-base">{c.name}</p>
                      <p className="text-gold/70 text-sm font-mono mt-0.5">{c.phone}</p>
                    </div>
                    <motion.a
                      href={`tel:${c.phone}`}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-night transition-all shadow-md"
                      title={`Call ${c.name}`}
                    >
                      <Phone size={16} />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bride Side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 rounded-3xl bg-navy/40 backdrop-blur-md border border-gold/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-lg">✝️</span>
                </div>
                <div>
                  <p className="text-gold tracking-[0.3em] uppercase text-[10px] font-bold">Bride's Side</p>
                  <div className="h-[1px] w-20 bg-gold/30 mt-1"></div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "George", phone: "6380110681" },
                  { name: "Kumudha", phone: "9047612102" },
                  { name: "Michael Raj", phone: "8807638118" },
                  { name: "Abinesh Mariyan", phone: "9384580482" },
                ].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-night/50 border border-gold/10 hover:border-gold/30 transition-all group"
                  >
                    <div>
                      <p className="text-ivory font-display tracking-wider text-base">{c.name}</p>
                      <p className="text-gold/70 text-sm font-mono mt-0.5">{c.phone}</p>
                    </div>
                    <motion.a
                      href={`tel:${c.phone}`}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-night transition-all shadow-md"
                      title={`Call ${c.name}`}
                    >
                      <Phone size={16} />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* 6. RSVP CTA */}
      <section id="rsvp" className="bg-night text-ivory py-40 px-4 text-center relative overflow-hidden">
        <div className="star-field opacity-30"></div>
        <div className="brocade-bg opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="flex justify-center mb-12">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold border border-gold/20 glow-sm">
              <Heart size={32} fill="currentColor" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl mb-8 font-display font-bold text-white italic">
            Will You Join Us?
          </h2>

          <p className="text-ivory/60 text-lg md:text-2xl mb-16 max-w-xl mx-auto font-serif italic">
            "Your presence would mean the world to us. Please let us know if you can attend."
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRSVPOpen(true)}
            className="px-16 py-6 bg-gold text-night font-bold tracking-[0.2em] text-xl rounded-full shadow-[0_0_30px_rgba(212, 169, 100,0.3)] hover:shadow-[0_0_50px_rgba(212, 169, 100,0.5)] transition-all uppercase"
          >
            RSVP NOW
          </motion.button>
        </motion.div>

        {/* Guest Book Section */}
        <div className="max-w-4xl mx-auto mt-48 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-5xl font-display font-bold text-white mb-4 italic">Blessings</h3>
            <div className="w-24 h-[1px] bg-gold/30 mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-navy/30 border border-gold/10 backdrop-blur-md mb-16"
          >
            <form onSubmit={handleGuestBookSubmit} className="space-y-6">
              <input
                required
                type="text"
                placeholder="Your Name"
                className="w-full bg-night/50 border border-gold/20 rounded-2xl px-8 py-4 text-ivory outline-none focus:border-gold/50 transition-all"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
              <textarea
                required
                maxLength={500}
                placeholder="Leave a heartfelt message..."
                className="w-full bg-night/50 border border-gold/20 rounded-2xl px-8 py-4 text-ivory outline-none focus:border-gold/50 transition-all resize-none"
                rows={4}
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-10 py-4 bg-gold/10 text-gold border border-gold/20 rounded-full font-bold uppercase tracking-widest hover:bg-gold/20 transition-all"
              >
                Post Blessing
              </motion.button>
            </form>
          </motion.div>

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {(showAllMessages ? guestMessages : guestMessages.slice(0, 3)).map((msg, i) => (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-8 rounded-[2rem] bg-maroon-dk/20 border border-gold/5 backdrop-blur-sm"
                >
                  <p className="text-ivory/80 font-serif italic text-lg mb-4">"{msg.message}"</p>
                  <p className="text-gold-pale font-display tracking-widest uppercase text-sm">— {msg.name}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {guestMessages.length > 3 && (
              <button
                onClick={() => setShowAllMessages(!showAllMessages)}
                className="w-full py-4 text-gold/40 hover:text-gold transition-colors font-display tracking-[0.3em] uppercase text-xs"
              >
                {showAllMessages ? "Show Less" : `Show All Messages (${guestMessages.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-48 pt-12 border-t border-gold/10">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-gold/20"></div>
              <span className="font-display text-2xl text-gold-lt tracking-widest">{groomName[0]} & {brideName[0]}</span>
              <div className="h-[1px] w-12 bg-gold/20"></div>
            </div>
            <p className="text-ivory/30 text-[10px] uppercase tracking-[0.5em]">{new Date(weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {weddingVenue}</p>
            <div className="flex gap-8 mb-4">
              <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
              <a href="#" onClick={() => setIsAdminOpen(true)} className="opacity-40 hover:opacity-100 transition-opacity"><Lock size={20} /></a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
