import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFrameProps {
  children: React.ReactNode;
  className?: string;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children, className }) => {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6 select-none relative overflow-hidden bg-[#05080B]"
    >
      {/* ─────────────────────────────────────────────────────────────
          AMBIENT EMERALD-GREEN BACKGROUND GLOW (BEHIND PHONE)
          Layered atmospheric glows matching reference visual target
          ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* 1. Large overarching atmospheric ambient bloom */}
        <div 
          className="absolute w-[500px] h-[700px] sm:w-[700px] sm:h-[950px] md:w-[850px] md:h-[1100px] rounded-full opacity-[0.18] sm:opacity-[0.22] blur-[120px] sm:blur-[160px]"
          style={{
            background: 'radial-gradient(ellipse at center, #39E58C 0%, #22C55E 35%, #05080B 75%)',
          }}
        />

        {/* 2. Stronger Left Flank Glow (creates side halo visible on left edge) */}
        <div 
          className="absolute -translate-x-[160px] sm:-translate-x-[220px] md:-translate-x-[250px] w-[260px] sm:w-[360px] md:w-[420px] h-[550px] sm:h-[750px] rounded-full opacity-[0.16] sm:opacity-[0.22] blur-[80px] sm:blur-[110px]"
          style={{
            background: 'radial-gradient(ellipse at center, #39E58C 0%, #22C55E 40%, transparent 70%)',
          }}
        />

        {/* 3. Stronger Right Flank Glow (creates side halo visible on right edge) */}
        <div 
          className="absolute translate-x-[160px] sm:translate-x-[220px] md:translate-x-[250px] w-[260px] sm:w-[360px] md:w-[420px] h-[550px] sm:h-[750px] rounded-full opacity-[0.16] sm:opacity-[0.22] blur-[80px] sm:blur-[110px]"
          style={{
            background: 'radial-gradient(ellipse at center, #39E58C 0%, #22C55E 40%, transparent 70%)',
          }}
        />

        {/* 4. Lower-left and lower-right accent highlights */}
        <div 
          className="absolute -translate-x-[140px] sm:-translate-x-[200px] translate-y-[180px] sm:translate-y-[240px] w-[220px] sm:w-[300px] h-[300px] sm:h-[400px] rounded-full opacity-[0.14] sm:opacity-[0.18] blur-[70px] sm:blur-[90px]"
          style={{
            background: 'radial-gradient(circle, #65F2B0 0%, #39E58C 50%, transparent 70%)',
          }}
        />
        <div 
          className="absolute translate-x-[140px] sm:translate-x-[200px] translate-y-[180px] sm:translate-y-[240px] w-[220px] sm:w-[300px] h-[300px] sm:h-[400px] rounded-full opacity-[0.14] sm:opacity-[0.18] blur-[70px] sm:blur-[90px]"
          style={{
            background: 'radial-gradient(circle, #65F2B0 0%, #39E58C 50%, transparent 70%)',
          }}
        />

        {/* 5. Top subtle ambient rim glow */}
        <div 
          className="absolute -translate-y-[280px] sm:-translate-y-[380px] w-[300px] sm:w-[450px] h-[200px] sm:h-[280px] rounded-full opacity-[0.10] sm:opacity-[0.14] blur-[80px] sm:blur-[100px]"
          style={{
            background: 'radial-gradient(ellipse at center, #39E58C 0%, #22C55E 50%, transparent 75%)',
          }}
        />
      </div>

      {/* Main app container */}
      <div 
        className={cn(
          "relative z-10 w-full h-screen sm:h-[860px] sm:max-w-[410px] bg-[#0B1016] sm:rounded-[48px] overflow-hidden",
          "sm:border-[8px] sm:border-[#1E2530] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_50px_rgba(57,229,140,0.08)]",
          className
        )}
      >
        {/* Notch - only visible on larger screens (mockup mode) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1E2530] rounded-b-2xl z-50" />
        
        {/* Screen content */}
        <div className="relative h-full overflow-hidden">
          {children}
        </div>

        {/* Home indicator - only visible on larger screens (mockup mode) */}
        <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/15 rounded-full" />
      </div>
    </div>
  );
};

export default MobileFrame;
