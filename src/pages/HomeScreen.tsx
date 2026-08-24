import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import {
  Bell, Navigation, MapPin, ChevronDown,
  ChevronRight, Shield, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/* ── Custom SVGs for Service Icons to match the reference exactly ── */
const TowTruckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0B1016]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h9l3 4h4a2 2 0 0 1 2 2v4h-3" />
    <circle cx="7.5" cy="18.5" r="2.5" />
    <circle cx="16.5" cy="18.5" r="2.5" />
    <path d="M13 6v5" />
    <path d="M9 10h8" />
  </svg>
);

const MotorcycleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0B1016]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="2.5" />
    <circle cx="18.5" cy="17.5" r="2.5" />
    <path d="M5.5 17.5L10 9h6.5l2 3h4" />
    <path d="M12 17.5V11" />
    <path d="M8 12h8" />
  </svg>
);

const BatteryIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0B1016]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="12" rx="2" ry="2" />
    <path d="M6 7V4h3v3" />
    <path d="M15 7V4h3v3" />
    <path d="M6 13h4" />
    <path d="M8 11v4" />
    <path d="M14 13h4" />
  </svg>
);

const FuelIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0B1016]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    <path d="M17 9h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4" />
    <circle cx="10" cy="9" r="2" />
    <path d="M6 14h8" />
    <path d="M6 18h8" />
  </svg>
);

const services = [
  { 
    id: 'car-repair',
    icon: TowTruckIcon,      
    title: 'Car Repair',     
    subtitle: 'Tow & Fix',   
    image: '/tow_truck.jpg' 
  },
  { 
    id: 'bike-service',
    icon: MotorcycleIcon,     
    title: 'Bike Service',   
    subtitle: 'Quick Help',  
    image: '/motorcycle.jpg' 
  },
  { 
    id: 'battery',
    icon: BatteryIcon,  
    title: 'Battery',        
    subtitle: 'Jump Start',  
    image: '/car_battery.jpg' 
  },
  { 
    id: 'fuel-delivery',
    icon: FuelIcon,     
    title: 'Fuel Delivery',  
    subtitle: 'Emergency',   
    image: '/fuel_nozzle.jpg' 
  },
];

/* ─────────────────── Premium Service Card ──────────────────────────── */
const PremiumServiceCard: React.FC<{
  service: typeof services[0];
  onClick: () => void;
  delay?: number;
}> = ({ service, onClick, delay = 0 }) => {
  const Icon = service.icon;
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}s`, background: '#111923' }}
      className={cn(
        'relative flex flex-col p-5 rounded-[24px] text-left overflow-hidden h-[165px]',
        'border border-white/[0.08] animate-slide-up',
        'active:scale-[0.96] transition-all duration-150 group',
      )}
    >
      {/* Top row: icon container + chevron circle */}
      <div className="flex items-start justify-between mb-4 relative z-10 w-full">
        {/* Rounded-square icon container with emerald glow */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#39E58C] shadow-[0_0_12px_rgba(57,229,140,0.3)]"
        >
          <Icon />
        </div>

        {/* Small circular arrow button */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center bg-[#17212C] border border-white/[0.05] transition-all duration-300 group-hover:bg-[#39E58C]"
        >
          <ChevronRight className="w-4 h-4 text-[#F5F7FA] transition-colors duration-300 group-hover:text-[#0B1016]" />
        </div>
      </div>

      {/* Labels */}
      <div className="mt-auto relative z-10">
        <h3 className="text-[16px] font-semibold leading-tight mb-0.5 text-[#F5F7FA]">
          {service.title}
        </h3>
        <p className="text-[13px] text-[#8B95A5]">{service.subtitle}</p>
      </div>

      {/* Realistic Service Image as Background Illustration */}
      <img
        src={service.image}
        alt={service.title}
        className="absolute bottom-0 right-0 w-[110px] h-[95px] object-contain mix-blend-screen opacity-[0.25] pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  );
};

/* ─────────────────── Main HomeScreen ──────────────────────────────── */
const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedService, pickupLocation, setPickupLocation } = useBooking();
  const [userName, setUserName] = useState('');

  /* ── Unchanged: fetch profile ── */
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.full_name) {
          setUserName(data.full_name);
        } else {
          setUserName(user.email?.split('@')[0] || '');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  return (
    <MobileFrame>
      {/* ── App Viewport Container ── */}
      <div className="h-full flex flex-col overflow-hidden bg-[#0B1016]">
        <StatusBar />

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">

          {/* ① HEADER ──────────────────────────────────────────── */}
          <div className="px-5 pt-2 pb-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-up">
                <p className="text-[13px] font-medium leading-tight mb-0.5 text-[#8B95A5]">
                  {getGreeting()}
                </p>
                <h1 className="text-[24px] font-bold leading-tight tracking-tight text-[#F5F7FA]">
                  {userName || 'User'}
                </h1>
              </div>

              {/* Translucent notification button with red 2 badge */}
              <button
                onClick={() => navigate('/profile/notifications')}
                className="relative w-11 h-11 rounded-full flex items-center justify-center animate-slide-up active:scale-95 transition-transform"
                style={{
                  background: 'rgba(17, 25, 35, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  animationDelay: '0.05s',
                }}
              >
                <Bell className="w-5 h-5 text-[#F5F7FA]" strokeWidth={1.8} />
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_8px_rgba(255,49,88,0.5)]"
                  style={{ background: '#FF3158' }}
                >
                  2
                </span>
              </button>
            </div>
          </div>

          {/* ② LOCATION SECTION ──────────────────────────────── */}
          <div
            className="mx-5 mb-5 flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            {/* Location pill */}
            <div
              className="flex-1 flex items-center gap-2.5 px-4.5 py-3 rounded-[30px]"
              style={{
                background: '#111923',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0 text-[#39E58C]" strokeWidth={2.5} />
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium p-0 text-[#F5F7FA] placeholder:text-[#8B95A5]"
                placeholder="Enter your location"
              />
              <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#8B95A5]" />
            </div>

            {/* Navigation button with emerald glow */}
            <button
              onClick={() => navigate('/map')}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
              style={{
                background: '#39E58C',
                boxShadow: '0 0 20px rgba(57, 229, 140, 0.4)',
              }}
            >
              <Navigation className="w-5 h-5 text-[#0B1016] fill-current" />
            </button>
          </div>

          {/* ③ EMERGENCY / SOS CARD ──────────────────────────── */}
          <div className="mx-5 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div
              className="relative flex items-center gap-4 pl-4.5 pr-14 py-4.5 rounded-[24px] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #32131D 0%, #1A0A0F 100%)',
                border: '1px solid rgba(255, 49, 88, 0.35)',
                boxShadow: '0 0 30px rgba(255, 49, 88, 0.12)',
              }}
            >
              {/* Glowing siren illustration */}
              <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <img 
                  src="/emergency_siren.jpg" 
                  alt="Emergency Siren"
                  className="w-14 h-14 object-contain mix-blend-screen opacity-[0.9] drop-shadow-[0_0_12px_rgba(255,49,88,0.6)]" 
                />
              </div>

              {/* Info text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold leading-tight text-[#F5F7FA]">
                  Emergency?
                </h3>
                <p className="text-[13px] mt-0.5 text-[#8B95A5]">
                  Get immediate help within{' '}
                  <span className="font-bold text-[#FF3158]">5 mins</span>
                </p>
              </div>

              {/* SOS button */}
              <button
                onClick={() => navigate('/map')}
                className="px-5.5 py-2.5 rounded-full font-bold text-white text-[13px] active:scale-95 transition-transform rg-sos-pulse flex-shrink-0"
                style={{
                  background: '#FF3158',
                  boxShadow: '0 0 16px rgba(255, 49, 88, 0.4)',
                }}
              >
                SOS
              </button>

              {/* Red chevrons matching reference mockup layout */}
              <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-between py-5.5 pointer-events-none opacity-80">
                <ChevronRight className="w-4 h-4 text-[#FF3158]" strokeWidth={2.5} />
                <ChevronRight className="w-4 h-4 text-[#FF3158]" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* ④ SERVICES SECTION ──────────────────────────────── */}
          <div className="px-5 mb-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] font-bold text-[#F5F7FA]">
                How can we help?
              </h2>
              <button
                className="flex items-center gap-0.5 text-[14px] font-semibold text-[#39E58C]"
              >
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-2 gap-3.5">
              {services.map((service, index) => (
                <PremiumServiceCard
                  key={service.title}
                  service={service}
                  delay={0.22 + index * 0.05}
                  onClick={() => {
                    setSelectedService(service.title);
                    navigate('/map');
                  }}
                />
              ))}
            </div>
          </div>

          {/* ⑤ TRUST / SUPPORT BANNER ───────────────────────── */}
          <div className="mx-5 mb-5 animate-slide-up" style={{ animationDelay: '0.45s' }}>
            <div
              className="flex items-center gap-4 px-4.5 py-4.5 rounded-[24px] overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #0F2018 0%, #060D0A 100%)',
                border: '1px solid rgba(57, 229, 140, 0.2)',
                boxShadow: '0 0 20px rgba(57, 229, 140, 0.06)',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#39E58C]/10 border border-[#39E58C]/20"
              >
                <Shield className="w-6 h-6 text-[#39E58C]" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0 pr-12">
                <h3 className="text-[15px] font-semibold leading-tight text-[#F5F7FA]">
                  We've got your back!
                </h3>
                <p className="text-[13px] mt-0.5 text-[#8B95A5]">
                  Trusted support, anytime, anywhere.
                </p>
              </div>

              {/* Realistic flatbed tow truck illustration */}
              <img 
                src="/flatbed_tow_truck.jpg" 
                alt="Support illustration" 
                className="absolute right-0 bottom-0 h-16 w-auto object-contain mix-blend-screen opacity-[0.35] pointer-events-none select-none"
              />
            </div>
          </div>

          {/* ⑥ RECENT ACTIVITY ──────────────────────────────── */}
          <div className="px-5 mb-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-[17px] font-bold mb-3 text-[#F5F7FA]">
              Recent Activity
            </h2>
            <div
              className="flex items-center gap-4 p-4 rounded-[18px]"
              style={{
                background: '#111923',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#39E58C]/10"
              >
                <BatteryIcon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold leading-tight text-[#F5F7FA]">
                  Battery Jump Start
                </h3>
                <p className="text-[11px] mt-0.5 text-[#8B95A5]">
                  Dec 28, 2025 · Completed
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-bold text-[#F5F7FA]">Rs. 1,500</p>
                <p className="text-[11px] font-semibold mt-0.5 text-[#39E58C]">Paid</p>
              </div>
            </div>
          </div>

        </div>{/* end scrollable */}

        {/* ⑦ BOTTOM NAVIGATION */}
        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default HomeScreen;

