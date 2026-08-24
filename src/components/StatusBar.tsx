import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

const StatusBar: React.FC = () => {
  const time = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="flex justify-between items-center px-6 pt-9 pb-2 text-[#F5F7FA] select-none pointer-events-none z-50 relative">
      <span className="text-[13px] font-semibold tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <Signal className="w-4 h-4" strokeWidth={2.2} />
        <Wifi className="w-4 h-4" strokeWidth={2.2} />
        <Battery className="w-[18px] h-[18px]" strokeWidth={2.2} />
      </div>
    </div>
  );
};

export default StatusBar;

