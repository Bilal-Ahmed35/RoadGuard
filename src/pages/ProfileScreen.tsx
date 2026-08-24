import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import StatusBar from '@/components/StatusBar';
import BottomNav from '@/components/BottomNav';
import {
  User, CreditCard, Bell, Shield, HelpCircle,
  LogOut, ChevronRight, Settings, Car, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Personal Details', path: '/profile/details' },
      { icon: Car, label: 'My Vehicles', path: '/profile/vehicles' },
      { icon: CreditCard, label: 'Payment Methods', path: '/profile/payment' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Bell, label: 'Notifications', path: '/profile/notifications' },
      { icon: Shield, label: 'Privacy & Security', path: '/profile/privacy' },
      { icon: Settings, label: 'App Settings', path: '/profile/settings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', path: '/support' },
      { icon: FileText, label: 'Terms & Policies', path: '/terms' },
    ],
  },
];

interface Profile {
  full_name: string | null;
  phone: string | null;
  member_status: string | null;
}

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({ total: 0, spent: 0 });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        const savedMemberStatus = localStorage.getItem(`member_status_${user.id}`) || 'Gold';

        if (data) {
          setProfile({
            full_name: data.full_name,
            phone: data.phone,
            member_status: savedMemberStatus,
          });
        }
      }
    };

    const fetchBookingStats = async () => {
      if (user) {
        const { data } = await supabase
          .from('bookings')
          .select('price')
          .eq('user_id', user.id);

        if (data) {
          const totalSpent = data.reduce((sum, b) => sum + (b.price || 0), 0);
          setStats({ total: data.length, spent: totalSpent });
        }
      }
    };

    fetchProfile();
    fetchBookingStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';

  return (
    <MobileFrame>
      <div className="h-full bg-background flex flex-col">
        <StatusBar />

        {/* Header */}
        <div className="px-6 pt-4 pb-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-32">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl p-5 shadow-card mb-6 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-charcoal flex-shrink-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oneeb"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{displayEmail}</p>
              </div>
              <button
                onClick={() => navigate('/profile/details')}
                className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Services</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">Rs. 9.3K</p>
                <p className="text-xs text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-secondary">{profile?.member_status || 'Gold'}</p>
                <p className="text-xs text-muted-foreground">Member</p>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className="mb-6 animate-slide-up"
              style={{ animationDelay: `${(sectionIndex + 1) * 0.1}s` }}
            >
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors",
                        index !== section.items.length - 1 && "border-b border-border"
                      )}
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="flex-1 text-left font-medium text-foreground">
                        {item.label}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-crimson/20 text-crimson hover:bg-crimson/10 transition-colors animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>

        <BottomNav />
      </div>
    </MobileFrame>
  );
};

export default ProfileScreen;
