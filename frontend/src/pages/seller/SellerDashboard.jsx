import React, { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp, Plus, Edit2, Trash2, X } from 'lucide-react';
import { getSellerProducts, createSellerProduct, updateSellerProduct, deleteSellerProduct } from '../../api/sellerApi';
import { getCategories } from '../../api/categoryApi';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    categoryId: '',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getSellerProducts({ page: 0, size: 50 }),
        getCategories()
      ]);
      setProducts(prodRes.data.content || prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        categoryId: parseInt(formData.categoryId),
        isActive: formData.isActive
      };

      if (formData.id) {
        await updateSellerProduct(formData.id, payload);
        toast.success('Product updated');
      } else {
        await createSellerProduct(payload);
        toast.success('Product created');
      }
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteSellerProduct(id);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category.id,
      isActive: product.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      id: null, name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '', isActive: true
    });
  };

  const totalRevenue = products.reduce((acc, p) => acc + (p.price * (Math.floor(Math.random() * 5))), 0); // Mock revenue

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink">Seller Dashboard</h1>
          <p className="text-muted mt-2">Manage your products and view store analytics.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add New Product
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Est. Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary-light' },
          { title: 'My Products', value: products.length, icon: Package, color: 'text-secondary', bg: 'bg-secondary-light' },
          { title: 'Orders', value: '12', icon: ShoppingCart, color: 'text-accent', bg: 'bg-accent/10' },
          { title: 'Store Views', value: '432', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-muted uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black text-ink">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {showForm ? (
        <div className="card p-6 md:p-8 animate-fade-in mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ink">{formData.id ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-muted hover:text-error transition-colors">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Product Name</label>
                <input required type="text" className="input-base" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Category</label>
                <select required className="input-base" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Price (₹)</label>
                <input required type="number" step="0.01" min="0" className="input-base" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Stock Quantity</label>
                <input required type="number" min="0" className="input-base" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-ink mb-2">Image URL</label>
                <input type="url" className="input-base" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-ink mb-2">Description</label>
                <textarea className="input-base min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-max">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="h-5 w-5 text-primary border-line rounded focus:ring-primary" />
              <span className="font-semibold text-ink">Product is Active</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? 'Saving...' : (formData.id ? 'Update Product' : 'Create Product')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-line flex justify-between items-center bg-canvas/50">
            <h2 className="text-xl font-bold text-ink">My Products Listing</h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-muted">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-ink mb-2">No products yet</h3>
              <p>Start adding products to your store to see them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-canvas/50 text-muted text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Stock</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-canvas/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-canvas border border-line flex items-center justify-center overflow-hidden shrink-0">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={20} className="text-muted" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-ink line-clamp-1">{product.name}</p>
                            <span className="text-xs text-muted">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-ink">{product.category?.name}</td>
                      <td className="p-4 font-bold text-ink">₹{product.price?.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${product.stockQuantity > 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                          {product.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${product.isActive ? 'badge-success' : 'badge-warning'}`}>
                          {product.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
