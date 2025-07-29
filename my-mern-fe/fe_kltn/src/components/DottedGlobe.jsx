import React from 'react';
import eagleImage from '../assets/eagle.webp';

const DottedGlobe = () => {
  return (
    <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center opacity-80 pointer-events-none">
      <div className="relative w-[450px] h-[450px] animate-spin-slow">
        {/* Real Eagle Image */}
        <img 
          src={eagleImage} 
          alt="Rotating Eagle" 
          className="w-full h-full object-contain"
          style={{
            filter: 'brightness(1.1) contrast(1.3) saturate(1.2)',
            transform: 'scale(1.3)',
            mixBlendMode: 'multiply'
          }}
        />
      </div>
    </div>
  );
};

export default DottedGlobe;