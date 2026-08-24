import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home,  label: 'Home',    path: '/home' },
  { icon: MapPin, label: 'Map',   path: '/map' },
  { icon: Clock,  label: 'History', path: '/history' },
  { icon: User,   label: 'Profile', path: '/profile' },
];

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    /* Outer wrapper: pins nav to bottom of container */
    <div className="absolute bottom-0 left-0 right-0 pb-4 px-4 pointer-events-none z-40">
      {/* Floating pill container */}
      <nav
        className="pointer-events-auto flex justify-around items-center py-3 px-2 rounded-[28px] relative"
        style={{
          background: 'rgba(17, 25, 35, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(57, 229, 140, 0.03)',
        }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-1.5 py-1 px-4 rounded-[20px] transition-all duration-300 relative',
                'active:scale-95 select-none outline-none',
              )}
            >
              {/* Active indicator bar at the top edge of navigation container */}
              {isActive && (
                <div 
                  className="absolute top-[-13px] w-6 h-[3px] rounded-full"
                  style={{
                    background: '#39E58C',
                    boxShadow: '0 1px 6px rgba(57, 229, 140, 0.6)',
                  }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-all duration-300"
                  style={{ 
                    color: isActive ? '#39E58C' : '#8B95A5',
                    filter: isActive ? 'drop-shadow(0 0 4px rgba(57, 229, 140, 0.2))' : 'none'
                  }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>

              {/* Label */}
              <span
                className="text-[11px] font-medium transition-colors duration-300"
                style={{ color: isActive ? '#39E58C' : '#8B95A5' }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;


