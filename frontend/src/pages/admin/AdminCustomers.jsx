import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetCustomers, adminSwitchUserRole, adminRejectSellerRequest, adminToggleUserStatus } from '../../api/customerApi';
import { Users, Mail, Phone, MapPin, Search, RefreshCw, Shield, Check, X, Power } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestsOnly, setShowRequestsOnly] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await adminGetCustomers();
      setCustomers(res.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSwitchRole = async (id, currentRole) => {
    if (window.confirm(`Are you sure you want to switch this user to a ${currentRole === 'ROLE_SELLER' ? 'Customer' : 'Seller'}?`)) {
      setIsSwitching(id);
      try {
        await adminSwitchUserRole(id);
        toast.success('Role switched successfully');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to switch role');
      } finally {
        setIsSwitching(null);
      }
    }
  };

  const handleRejectRequest = async (id) => {
    if (window.confirm('Are you sure you want to reject this seller request?')) {
      setIsSwitching(id);
      try {
        await adminRejectSellerRequest(id);
        toast.success('Seller request rejected');
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to reject request');
      } finally {
        setIsSwitching(null);
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      setIsSwitching(id);
      try {
        await adminToggleUserStatus(id);
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchCustomers();
      } catch (error) {
        toast.error('Failed to change user status');
      } finally {
        setIsSwitching(null);
      }
    }
  };

  const filteredCustomers = customers.filter(c =>
    ((c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (showRequestsOnly ? c.sellerRequestPending : true)
  );

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                <Users size={28} className="text-primary" /> Registered Users & Sellers
              </h1>
              <p className="text-muted text-sm mt-1">{customers.length} total accounts</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-line">
                <input type="checkbox" checked={showRequestsOnly} onChange={e => setShowRequestsOnly(e.target.checked)} className="h-4 w-4 text-primary rounded border-line" />
                <span className="text-sm font-semibold text-ink">Pending Requests</span>
              </label>
              <div className="relative w-full sm:w-64">
                <input type="text" placeholder="Search by name or Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-base !pl-10" />
                <Search className="absolute left-3 top-2.5 text-muted" size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : filteredCustomers.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted card rounded-2xl">No customers found.</div>
            ) : (
              filteredCustomers.map(customer => (
                <div key={customer.id} className="card card-hover p-5">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-xl shrink-0 uppercase">
                      {customer.name ? customer.name.charAt(0) : customer.email.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-base leading-tight mb-1">{customer.name || 'No Name Provided'}</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-canvas text-muted">ID: #{customer.id}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${customer.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm text-ink">
                      <Mail size={16} className="text-muted" />
                      <a href={`mailto:${customer.email}`} className="hover:text-primary transition-colors line-clamp-1">{customer.email}</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-ink">
                      <Phone size={16} className="text-muted" />
                      <span>{customer.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-ink">
                      <MapPin size={16} className="text-muted shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address || 'No address provided'}</span>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-line flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1 text-xs font-bold text-muted uppercase tracking-wider">
                        <Shield size={14} />
                        {customer.role === 'ROLE_SELLER' ? 'Seller' : 'Customer'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleActive(customer.id, customer.isActive)}
                          disabled={isSwitching === customer.id}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${customer.isActive ? 'border-error/30 text-error hover:bg-error/10' : 'border-success/30 text-success hover:bg-success/10'}`}
                        >
                          <Power size={12} />
                          {customer.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        {!customer.sellerRequestPending && (
                          <button 
                            onClick={() => handleSwitchRole(customer.id, customer.role)}
                            disabled={isSwitching === customer.id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line hover:bg-canvas text-ink flex items-center gap-1.5 transition-colors"
                          >
                            {isSwitching === customer.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                            ) : (
                              <RefreshCw size={12} />
                            )}
                            Make {customer.role === 'ROLE_SELLER' ? 'Customer' : 'Seller'}
                          </button>
                        )}
                      </div>
                    </div>
                    {customer.sellerRequestPending && (
                      <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl flex flex-col gap-3 mt-1">
                        <span className="text-sm font-bold text-warning text-center">Requested to be a Seller</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleSwitchRole(customer.id, customer.role)} disabled={isSwitching === customer.id} className="flex-1 btn-primary py-1.5 text-xs flex justify-center items-center gap-1 !bg-success !text-white !border-success hover:brightness-110">
                            <Check size={14}/> Approve
                          </button>
                          <button onClick={() => handleRejectRequest(customer.id)} disabled={isSwitching === customer.id} className="flex-1 btn-secondary py-1.5 text-xs flex justify-center items-center gap-1 !text-error hover:!bg-error/10">
                            <X size={14}/> Reject
                          </button>
                        </div>
                      </div>
                    )}
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

export default AdminCustomers;
