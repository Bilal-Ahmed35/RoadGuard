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
    /* Outer wrapper: stays pinned to bottom of the MobileFrame */
    <div className="absolute bottom-0 left-0 right-0 pb-4 px-4 pointer-events-none">
      {/* Floating pill container */}
      <nav
        className="pointer-events-auto flex justify-around items-center py-3 px-2 rounded-[28px]"
        style={{
          background: 'rgba(21, 27, 35, 0.96)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.4)',
        }}
      >
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-1 py-1.5 px-5 rounded-[20px] transition-all duration-300',
                'active:scale-95',
              )}
              style={
                isActive
                  ? { background: 'rgba(33,217,120,0.1)' }
                  : {}
              }
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-colors duration-300"
                  style={{ color: isActive ? '#21D978' : '#8B95A5' }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {/* Subtle glow dot under active icon */}
                {isActive && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#21D978', boxShadow: '0 0 6px #21D978' }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="text-[10px] font-medium transition-colors duration-300"
                style={{ color: isActive ? '#21D978' : '#8B95A5' }}
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

