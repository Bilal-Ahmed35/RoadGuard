import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import {
  Car, Bike, Battery, Fuel,
  Bell, Navigation, MapPin, ChevronDown,
  ChevronRight, AlertTriangle, Shield, ArrowRight, Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/* ─────────────────── Service definitions (logic unchanged) ─────────── */
const services = [
  { icon: Car,      title: 'Car Repair',     subtitle: 'Tow & Fix',   illustration: '🚗' },
  { icon: Bike,     title: 'Bike Service',   subtitle: 'Quick Help',  illustration: '🏍️' },
  { icon: Battery,  title: 'Battery',        subtitle: 'Jump Start',  illustration: '🔋' },
  { icon: Fuel,     title: 'Fuel Delivery',  subtitle: 'Emergency',   illustration: '⛽' },
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
      style={{ animationDelay: `${delay}s`, background: '#151B23' }}
      className={cn(
        'relative flex flex-col p-4 rounded-[22px] text-left overflow-hidden',
        'border border-white/[0.07] animate-slide-up',
        'active:scale-[0.96] transition-transform duration-150',
      )}
    >
      {/* Top row: icon + arrow */}
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(33,217,120,0.1)' }}
        >
          <Icon className="w-5 h-5" style={{ color: '#21D978' }} strokeWidth={1.8} />
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <ArrowRight className="w-3.5 h-3.5" style={{ color: '#8B95A5' }} />
        </div>
      </div>

      {/* Labels */}
      <h3 className="text-[15px] font-semibold leading-tight mb-0.5" style={{ color: '#F5F7FA' }}>
        {service.title}
      </h3>
      <p className="text-[12px]" style={{ color: '#8B95A5' }}>{service.subtitle}</p>

      {/* Subtle background illustration */}
      <span
        className="absolute bottom-2 right-3 text-[44px] select-none pointer-events-none"
        style={{ opacity: 0.1 }}
        aria-hidden="true"
      >
        {service.illustration}
      </span>
    </button>
  );
};

/* ─────────────────── Main HomeScreen ──────────────────────────────── */
const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedService, pickupLocation, setPickupLocation } = useBooking();
  const [userName, setUserName] = useState('');

  /* ── Unchanged: fetch profile from Supabase ── */
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
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    };
    fetchProfile();
  }, [user]);

  /* ── Unchanged: time-based greeting ── */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  return (
    <MobileFrame>
      {/* ── Root: forced dark background ──────────────────────────── */}
      <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0D1117' }}>
        <StatusBar />

        {/* ── Scrollable content ─────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>

          {/* ① HEADER ──────────────────────────────────────────── */}
          <div className="px-5 pt-2 pb-4">
            <div className="flex items-center justify-between">
              <div className="animate-slide-up">
                <p className="text-[13px] font-medium leading-tight mb-0.5" style={{ color: '#8B95A5' }}>
                  {getGreeting()}
                </p>
                <h1 className="text-[22px] font-bold leading-tight tracking-tight" style={{ color: '#F5F7FA' }}>
                  {userName || 'Welcome Back'}
                </h1>
              </div>

              {/* Notification button — navigates to /profile/notifications (unchanged) */}
              <button
                onClick={() => navigate('/profile/notifications')}
                className="relative w-11 h-11 rounded-full flex items-center justify-center animate-slide-up active:scale-95 transition-transform"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  animationDelay: '0.05s',
                }}
              >
                <Bell className="w-5 h-5" style={{ color: '#F5F7FA' }} strokeWidth={1.8} />
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
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
            {/* Location pill — pickupLocation state (unchanged) */}
            <div
              className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
              style={{
                background: '#151B23',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#21D978' }} strokeWidth={2} />
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium p-0 placeholder:text-[#8B95A5]"
                style={{ color: '#F5F7FA' }}
                placeholder="Enter your location"
              />
              <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: '#8B95A5' }} />
            </div>

            {/* Navigation button — navigates to /map (unchanged) */}
            <button
              onClick={() => navigate('/map')}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
              style={{
                background: '#21D978',
                boxShadow: '0 0 22px rgba(33,217,120,0.4)',
              }}
            >
              <Navigation className="w-5 h-5 text-white fill-current" />
            </button>
          </div>

          {/* ③ EMERGENCY / SOS CARD ──────────────────────────── */}
          <div className="mx-5 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div
              className="relative flex items-center gap-4 px-4 py-4 rounded-[20px]"
              style={{
                background: '#35141F',
                border: '1px solid rgba(255,49,88,0.3)',
                boxShadow: '0 0 30px rgba(255,49,88,0.1)',
              }}
            >
              {/* Siren icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,49,88,0.15)' }}
              >
                <AlertTriangle className="w-6 h-6" style={{ color: '#FF3158' }} strokeWidth={2} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold leading-tight" style={{ color: '#F5F7FA' }}>
                  Emergency?
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#8B95A5' }}>
                  Get immediate help within{' '}
                  <span className="font-bold" style={{ color: '#FF3158' }}>5 mins</span>
                </p>
              </div>

              {/* SOS button — navigates to /map (unchanged) */}
              <button
                onClick={() => navigate('/map')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white text-[13px] flex-shrink-0 active:scale-95 transition-transform rg-sos-pulse"
                style={{
                  background: '#FF3158',
                  boxShadow: '0 0 18px rgba(255,49,88,0.5)',
                }}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                SOS
              </button>
            </div>
          </div>

          {/* ④ SERVICES SECTION ──────────────────────────────── */}
          <div className="px-5 mb-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold" style={{ color: '#F5F7FA' }}>
                How can we help?
              </h2>
              <button
                className="flex items-center gap-0.5 text-[12px] font-semibold"
                style={{ color: '#21D978' }}
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2-column grid — setSelectedService + navigate('/map') unchanged */}
            <div className="grid grid-cols-2 gap-3">
              {services.map((service, index) => (
                <PremiumServiceCard
                  key={service.title}
                  service={service}
                  delay={0.22 + index * 0.06}
                  onClick={() => {
                    setSelectedService(service.title);
                    navigate('/map');
                  }}
                />
              ))}
            </div>
          </div>

          {/* ⑤ TRUST / SUPPORT BANNER ───────────────────────── */}
          <div className="mx-5 mb-5 animate-slide-up" style={{ animationDelay: '0.48s' }}>
            <div
              className="flex items-center gap-4 px-4 py-4 rounded-[20px]"
              style={{
                background: '#0F2018',
                border: '1px solid rgba(33,217,120,0.18)',
                boxShadow: '0 0 20px rgba(33,217,120,0.06)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(33,217,120,0.12)' }}
              >
                <Shield className="w-5 h-5" style={{ color: '#21D978' }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[14px] font-semibold leading-tight" style={{ color: '#F5F7FA' }}>
                  We've got your back!
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#8B95A5' }}>
                  Trusted support, anytime, anywhere.
                </p>
              </div>
              <span
                className="text-[38px] select-none pointer-events-none flex-shrink-0"
                style={{ opacity: 0.15 }}
                aria-hidden="true"
              >
                🚚
              </span>
            </div>
          </div>

          {/* ⑥ RECENT ACTIVITY (unchanged data, updated style) ── */}
          <div className="px-5 mb-2 animate-slide-up" style={{ animationDelay: '0.54s' }}>
            <h2 className="text-[17px] font-bold mb-3" style={{ color: '#F5F7FA' }}>
              Recent Activity
            </h2>
            <div
              className="flex items-center gap-4 p-4 rounded-[18px]"
              style={{
                background: '#151B23',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(33,217,120,0.1)' }}
              >
                <Battery className="w-5 h-5" style={{ color: '#21D978' }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold leading-tight" style={{ color: '#F5F7FA' }}>
                  Battery Jump Start
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#8B95A5' }}>
                  Dec 28, 2025 · Completed
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[13px] font-bold" style={{ color: '#F5F7FA' }}>Rs. 1,500</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: '#21D978' }}>Paid</p>
              </div>
            </div>
          </div>

        </div>{/* end scrollable */}

        {/* ⑦ BOTTOM NAVIGATION (existing component, unchanged) */}
        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default HomeScreen;
