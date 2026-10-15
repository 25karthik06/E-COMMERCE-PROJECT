import React, { useState, useEffect } from 'react';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../../api/bannerApi';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GRADIENT_OPTIONS = [
  { label: 'Blue to Indigo', value: 'from-blue-600 to-indigo-700' },
  { label: 'Orange to Amber', value: 'from-orange-500 to-amber-600' },
  { label: 'Purple to Pink', value: 'from-purple-500 to-pink-500' },
  { label: 'Emerald to Teal', value: 'from-emerald-500 to-teal-600' },
  { label: 'Rose to Red', value: 'from-rose-500 to-red-600' },
  { label: 'Cyan to Blue', value: 'from-cyan-500 to-blue-600' },
];

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    tag: '',
    title: '',
    subtitle: '',
    color: GRADIENT_OPTIONS[0].value,
    active: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await getAllBanners();
      setBanners(res.data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id);
        toast.success('Banner deleted');
        fetchBanners();
      } catch (error) {
        toast.error('Failed to delete banner');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateBanner(formData.id, formData);
        toast.success('Banner updated');
      } else {
        await createBanner(formData);
        toast.success('Banner created');
      }
      setShowForm(false);
      setFormData({ id: null, tag: '', title: '', subtitle: '', color: GRADIENT_OPTIONS[0].value, active: true });
      fetchBanners();
    } catch (error) {
      toast.error('Failed to save banner');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1">Manage Banners</h1>
          <p className="text-muted text-sm">Control homepage promotional banners</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={18} /> Add Banner
          </button>
        )}
      </div>

      {showForm && (
        <div className="card p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{formData.id ? 'Edit Banner' : 'Create Banner'}</h2>
            <button onClick={() => { setShowForm(false); setFormData({ id: null, tag: '', title: '', subtitle: '', color: GRADIENT_OPTIONS[0].value, active: true }); }} className="text-muted"><X size={20}/></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Badge Tag (e.g. New Arrivals)</label>
                <input required type="text" className="input-base" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Gradient Theme</label>
                <select className="input-base" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                  {GRADIENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Main Title</label>
              <input required type="text" className="input-base" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subtitle</label>
              <input type="text" className="input-base" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="h-4 w-4" />
              <span className="font-semibold text-sm">Active on Homepage</span>
            </label>
            <div className="pt-4 border-t border-line flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Banner</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="skeleton h-64 rounded-xl w-full"></div>
      ) : banners.length === 0 ? (
        <div className="card p-12 text-center text-muted">No banners found. Create one to display on the homepage.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${banner.active ? 'badge-success' : 'badge-warning'}`}>
                    {banner.active ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(banner)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 size={16}/></button>
                  </div>
                </div>
                {/* Preview Banner */}
                <div className={`bg-gradient-to-br ${banner.color} rounded-xl p-5 text-white shadow-md relative overflow-hidden`}>
                  <span className="inline-block bg-white/20 text-[10px] font-bold px-2 py-1 rounded mb-2 uppercase tracking-wide">{banner.tag}</span>
                  <h3 className="text-xl font-bold mb-1 leading-tight">{banner.title}</h3>
                  <p className="text-white/80 text-sm">{banner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
