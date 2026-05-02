import React from 'react';

const OmIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 64 64" 
    fill="currentColor" 
    className={`text-accent-gold ${props.className || ''}`}
    {...props}
  >
    <path d="M32 2C15.4 2 2 15.4 2 32s13.4 30 30 30 30-13.4 30-30S48.6 2 32 2zm0 56c-14.4 0-26-11.6-26-26S17.6 6 32 6s26 11.6 26 26-11.6 26-26 26z"/>
    <path d="M44 20a12 12 0 0 0-24 0v24a12 12 0 0 0 24 0V20zM32 44a12 12 0 0 1-12-12V20a12 12 0 0 1 24 0v12a12 12 0 0 1-12 12z"/>
  </svg>
);

export default OmIcon;
