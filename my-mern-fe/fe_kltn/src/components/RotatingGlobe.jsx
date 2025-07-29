import React from 'react';

const RotatingGlobe = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
      <div className="relative w-[600px] h-[600px] globe-3d">
        {/* Main Globe Sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 globe-sphere animate-glow">
          {/* Globe Texture - Dotted Pattern */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {/* Dotted pattern overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 40% 70%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 10% 60%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 90% 40%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 60% 10%, rgba(255,255,255,0.15) 1px, transparent 1px),
                radial-gradient(circle at 30% 90%, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '120px 120px, 140px 140px, 100px 100px, 170px 170px, 110px 110px, 130px 130px, 90px 90px, 150px 150px'
            }}></div>
          </div>
        </div>

        {/* Continent Shapes - More Realistic with 3D effect */}
        <div className="absolute inset-0 rounded-full">
          {/* North America */}
          <div className="absolute top-1/4 left-1/4 w-24 h-14 bg-green-500/70 rounded-full transform rotate-12 continent"></div>
          <div className="absolute top-1/3 left-1/5 w-20 h-10 bg-green-500/70 rounded-full transform -rotate-6 continent"></div>
          
          {/* South America */}
          <div className="absolute top-1/2 left-1/3 w-16 h-24 bg-green-500/70 rounded-full transform rotate-3 continent"></div>
          <div className="absolute top-2/3 left-1/4 w-14 h-20 bg-green-500/70 rounded-full transform -rotate-12 continent"></div>
          
          {/* Europe */}
          <div className="absolute top-1/3 right-1/3 w-16 h-12 bg-green-500/70 rounded-full transform rotate-45 continent"></div>
          <div className="absolute top-2/5 right-1/4 w-12 h-10 bg-green-500/70 rounded-full transform -rotate-30 continent"></div>
          
          {/* Africa */}
          <div className="absolute top-1/2 right-1/4 w-14 h-28 bg-green-500/70 rounded-full transform rotate-15 continent"></div>
          <div className="absolute top-3/4 right-1/3 w-12 h-16 bg-green-500/70 rounded-full transform -rotate-20 continent"></div>
          
          {/* Asia */}
          <div className="absolute top-1/3 right-1/6 w-28 h-18 bg-green-500/70 rounded-full transform rotate-25 continent"></div>
          <div className="absolute top-1/2 right-1/8 w-24 h-14 bg-green-500/70 rounded-full transform -rotate-15 continent"></div>
          
          {/* Australia */}
          <div className="absolute bottom-1/4 right-1/3 w-18 h-12 bg-green-500/70 rounded-full transform rotate-60 continent"></div>
          <div className="absolute bottom-1/3 right-1/4 w-14 h-10 bg-green-500/70 rounded-full transform -rotate-45 continent"></div>
        </div>

        {/* Orbit Rings with 3D effect */}
        <div className="absolute inset-0 rounded-full border border-blue-300/50 animate-pulse"></div>
        <div className="absolute inset-6 rounded-full border border-blue-200/40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-12 rounded-full border border-blue-100/30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-18 rounded-full border border-blue-50/20 animate-pulse" style={{animationDelay: '3s'}}></div>

        {/* Floating Particles with 3D movement */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-particle-float"
              style={{
                left: `${15 + (i * 4) % 70}%`,
                top: `${25 + (i * 6) % 50}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + (i % 4)}s`
              }}
            />
          ))}
        </div>

        {/* Grid Lines with 3D perspective */}
        <div className="absolute inset-0 rounded-full">
          {/* Latitude lines */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`lat-${i}`}
              className="absolute w-full border-t border-blue-200/30"
              style={{ top: `${15 + i * 14}%` }}
            />
          ))}
          
          {/* Longitude lines */}
          {[...Array(10)].map((_, i) => (
            <div
              key={`long-${i}`}
              className="absolute h-full border-l border-blue-200/30"
              style={{ left: `${10 + i * 10}%` }}
            />
          ))}
        </div>

        {/* Atmospheric glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 via-transparent to-cyan-400/20 animate-pulse-slow"></div>

        {/* Satellite orbit */}
        <div className="absolute inset-0 animate-orbit">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RotatingGlobe;