import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileFrame from '@/components/MobileFrame';
import StatusBar from '@/components/StatusBar';
import { ArrowLeft, User, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
  member_status: string;
}

const PersonalDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    member_status: 'Gold',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        const savedDob = localStorage.getItem(`dob_${user.id}`) || '';
        const savedAddress = localStorage.getItem(`address_${user.id}`) || '';
        const savedMemberStatus = localStorage.getItem(`member_status_${user.id}`) || 'Gold';

        setFormData({
          full_name: data?.full_name || '',
          phone: data?.phone || '',
          date_of_birth: savedDob,
          address: savedAddress,
          member_status: savedMemberStatus,
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save local details to localStorage to bypass database schema limitations
      localStorage.setItem(`dob_${user.id}`, formData.date_of_birth);
      localStorage.setItem(`address_${user.id}`, formData.address);
      localStorage.setItem(`member_status_${user.id}`, formData.member_status);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <MobileFrame>
      <div className="h-full bg-background flex flex-col">
        <StatusBar />

        {/* Header */}
        <div className="px-6 pt-4 pb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-xl bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Personal Details</h1>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {/* Profile Photo */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-4 animate-slide-up">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl gradient-charcoal flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-elevated">
                  <Camera className="w-4 h-4 text-secondary-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">Upload Photo</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow"
                placeholder="+92 300 1234567"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow resize-none"
                placeholder="Enter your address"
              />
            </div>

            {/* Member Status */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Member Status
              </label>
              <select
                value={formData.member_status}
                onChange={(e) => setFormData({ ...formData, member_status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow"
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full mt-6 py-4 rounded-2xl gradient-emerald text-white font-semibold shadow-elevated hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </MobileFrame>
  );
};

export default PersonalDetailsScreen;
