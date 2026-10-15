import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../api/userApi';
import { User, Mail, MapPin, Phone, Shield, Edit2, Save, X, ArrowUpRight } from 'lucide-react';
import { requestSellerRole } from '../../api/customerApi';
import toast from 'react-hot-toast';
import WalletPage from './WalletPage';

const ProfilePage = () => {
  const { user, login } = useAuth(); // we need a way to update the user context, assuming login or similar can refresh it, but we can just update local storage directly for now if needed. 
  // Wait, AuthContext has setUser, but it's not exported. Let's just reload the page or update localStorage
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile(formData);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUser = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success('Profile updated successfully!');
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setIsSaving(false);
    }
  };

  const handleRequestSeller = async () => {
    try {
      await requestSellerRole();
      toast.success('Request sent successfully!');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUser = { ...storedUser, sellerRequestPending: true };
      localStorage.setItem('user', JSON.stringify(newUser));
      window.location.reload();
    } catch (error) {
      toast.error('Failed to send request');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-canvas py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">My Profile</h1>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-line rounded-lg text-sm font-medium text-ink hover:text-primary transition-colors"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
        
        <div className="card p-6 md:p-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="w-32 h-32 bg-primary-light text-primary rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-md">
              <span className="text-5xl font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            
            <div className="flex-grow text-center md:text-left w-full">
              <h2 className="text-2xl font-bold text-ink mb-1">{user.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted mb-6">
                <Shield size={16} className="text-primary" />
                <span className="text-sm font-medium uppercase tracking-wider">{user.role.replace('ROLE_', '')}</span>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-base" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} className="input-base min-h-[100px]" />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
                      <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="btn-secondary flex items-center gap-2">
                      <X size={18} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-canvas p-2 rounded-lg text-muted">
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Email</div>
                      <div className="text-ink font-medium">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-canvas p-2 rounded-lg text-muted">
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Phone</div>
                      <div className="text-ink font-medium">{user.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:col-span-2 mt-2">
                    <div className="bg-canvas p-2 rounded-lg text-muted">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">Address</div>
                      <div className="text-ink font-medium">{user.address || 'Not provided'}</div>
                    </div>
                  </div>

                  {user.role === 'ROLE_CUSTOMER' && (
                    <div className="sm:col-span-2 mt-6 p-5 bg-gradient-to-r from-primary/5 to-indigo-500/5 rounded-xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-ink mb-1">Want to sell products?</h4>
                        <p className="text-sm text-muted">Upgrade to a Seller account and start your own store.</p>
                      </div>
                      {user.sellerRequestPending ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-warning/10 text-warning whitespace-nowrap">
                          Pending Admin Approval
                        </span>
                      ) : (
                        <button onClick={handleRequestSeller} className="btn-primary whitespace-nowrap flex items-center gap-2">
                          Request Upgrade <ArrowUpRight size={18} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Wallet Section */}
        <div className="mt-8">
          <WalletPage />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
