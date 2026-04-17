import React from 'react';

const FaithDivider = () => {
  return (
    <div className="faith-divider relative h-[90px] bg-deep flex items-center justify-center overflow-hidden">
      <div className="faith-divider-inner flex items-center gap-6 relative z-[2]">
        <div className="faith-divider-line h-[0.5px] w-[min(140px,20vw)] bg-gradient-to-r from-transparent to-[rgba(212,169,100,0.5)]"></div>
        <div className="faith-divider-symbols flex items-center gap-4 text-[1.4rem]">
          <span className="faith-sym opacity-[0.65] drop-shadow-[0_0_8px_rgba(212,169,100,0.4)]">🪔</span>
          <span className="faith-sym font-tamil text-[0.9rem] text-gold opacity-60">ஓம்</span>
          <span className="faith-sym text-[1rem] text-gold opacity-[0.55]">✦</span>
          <span className="faith-sym font-display text-[0.7rem] tracking-[0.15em] text-gold opacity-[0.55]">ICHTHYS</span>
          <span className="faith-sym opacity-[0.65] drop-shadow-[0_0_8px_rgba(212,169,100,0.4)]">✝️</span>
        </div>
        <div className="faith-divider-line rev h-[0.5px] w-[min(140px,20vw)] bg-gradient-to-r from-[rgba(212,169,100,0.5)] to-transparent"></div>
      </div>
    </div>
  );
};

export default FaithDivider;
