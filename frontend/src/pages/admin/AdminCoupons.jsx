import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetCoupons, adminCreateCoupon, adminUpdateCoupon } from '../../api/couponApi';
import { Plus, CreditCard as Edit2, Ticket, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '',
    usageLimit: '', expiryDate: '', isActive: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await adminGetCoupons();
      setCoupons(res.data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || '', usageLimit: coupon.usageLimit || '',
        expiryDate: new Date(coupon.expiryDate).toISOString().slice(0, 16), isActive: coupon.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', usageLimit: '', expiryDate: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData, code: formData.code.toUpperCase(),
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        expiryDate: new Date(formData.expiryDate).toISOString()
      };
      if (editingId) {
        await adminUpdateCoupon(editingId, payload);
        toast.success('Coupon updated successfully');
      } else {
        await adminCreateCoupon(payload);
        toast.success('Coupon created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                <Ticket size={28} className="text-primary" /> Manage Coupons
              </h1>
              <p className="text-muted text-sm mt-1">{coupons.length} coupons</p>
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary"><Plus size={18} /> Add Coupon</button>
          </div>

          <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-canvas/70">
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Code</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Discount</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Min Order</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Usage</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Expiry</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {isLoading ? (
                    <tr><td colSpan="7" className="text-center py-8"><div className="animate-spin inline-block h-8 w-8 border-b-2 border-primary rounded-full"></div></td></tr>
                  ) : coupons.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-8 text-muted">No coupons found.</td></tr>
                  ) : (
                    coupons.map(coupon => {
                      const isExpired = new Date(coupon.expiryDate) < new Date();
                      return (
                        <tr key={coupon.id} className="hover:bg-canvas/50 transition-colors">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className="font-mono font-bold text-primary bg-primary-light px-2.5 py-1 rounded-md">{coupon.code}</span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-ink">
                            {coupon.discountType === 'FLAT' ? '₹' : ''}{coupon.discountValue}{coupon.discountType === 'PERCENTAGE' ? '%' : ''}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">
                            {coupon.minOrderAmount ? `₹${coupon.minOrderAmount.toFixed(2)}` : 'None'}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">
                            {coupon.usedCount} / {coupon.usageLimit || '∞'}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">
                            {new Date(coupon.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`badge ${!coupon.isActive ? 'badge-error' : isExpired ? 'badge-warning' : 'badge-success'}`}>
                              {!coupon.isActive ? 'Inactive' : isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-right">
                            <button onClick={() => handleOpenModal(coupon)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-canvas">
              <h2 className="text-lg font-bold text-ink">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-ink transition-colors"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Coupon Code</label>
                  <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input-base uppercase" placeholder="SUMMER50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Type</label>
                  <select required value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className="input-base">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Value</label>
                  <input type="number" step="0.01" min="0.01" required value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Min Order (₹) Optional</label>
                  <input type="number" step="0.01" min="0" value={formData.minOrderAmount} onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Usage Limit (Optional)</label>
                  <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className="input-base" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input type="datetime-local" required value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="input-base" />
                </div>
                <div className="col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-primary rounded" />
                    <span className="text-ink font-semibold text-sm">Coupon is Active</span>
                  </label>
                </div>
              </div>
              <div className="mt-7 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">{editingId ? 'Save' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
