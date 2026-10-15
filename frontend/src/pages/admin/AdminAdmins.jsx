import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetAdmins } from '../../api/customerApi';
import { Users, Mail, Phone, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await adminGetAdmins();
        setAdmins(res.data);
      } catch (error) {
        toast.error('Failed to load admins');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(a =>
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                <Users size={28} className="text-primary" /> Registered Admins
              </h1>
              <p className="text-muted text-sm mt-1">{admins.length} admins</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input type="text" placeholder="Search by name or Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-base !pl-10" />
              <Search className="absolute left-3 top-2.5 text-muted" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : filteredAdmins.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted card rounded-2xl">No admins found.</div>
            ) : (
              filteredAdmins.map(admin => (
                <div key={admin.id} className="card card-hover p-5">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-xl shrink-0 uppercase">
                      {admin.name ? admin.name.charAt(0) : admin.email.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-base leading-tight mb-1">{admin.name || 'No Name Provided'}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-canvas text-muted">ID: #{admin.id}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm text-ink">
                      <Mail size={16} className="text-muted" />
                      <a href={`mailto:${admin.email}`} className="hover:text-primary transition-colors line-clamp-1">{admin.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-ink">
                      <Phone size={16} className="text-muted" />
                      <span>{admin.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-ink">
                      <MapPin size={16} className="text-muted shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{admin.address || 'No address provided'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAdmins;
