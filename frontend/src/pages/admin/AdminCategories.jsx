import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api/categoryApi';
import { Plus, CreditCard as Edit2, Trash2, Tags, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({ name: category.name, description: category.description || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminUpdateCategory(editingId, formData);
        toast.success('Category updated successfully');
      } else {
        await adminCreateCategory(formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (It will fail if products are attached)')) {
      try {
        await adminDeleteCategory(id);
        toast.success('Category deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete category. Ensure no products are attached.');
      }
    }
  };

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">Manage Categories</h1>
              <p className="text-muted text-sm mt-1">{categories.length} categories</p>
            </div>
            <button onClick={() => handleOpenModal()} className="btn-primary"><Plus size={18} /> Add Category</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted card rounded-2xl">No categories found.</div>
            ) : (
              categories.map(category => (
                <div key={category.id} className="card card-hover p-5 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                      <Tags size={22} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(category)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(category.id)} className="w-8 h-8 rounded-lg bg-red-50 text-error flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-1.5">{category.name}</h3>
                  <p className="text-muted text-sm line-clamp-2">{category.description || 'No description provided.'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-scale-in">
            <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-canvas">
              <h2 className="text-lg font-bold text-ink">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-ink transition-colors"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-base resize-none"></textarea>
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

export default AdminCategories;
