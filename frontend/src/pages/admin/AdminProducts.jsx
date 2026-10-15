import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { Plus, CreditCard as Edit2, Trash2, Package, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../api/uploadApi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '', isActive: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([adminGetProducts(), getCategories()]);
      setProducts(prodRes.data.content ? prodRes.data.content : prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, description: product.description || '', price: product.price,
        stockQuantity: product.stockQuantity, categoryId: product.category?.id || '',
        imageUrl: product.imageUrl || '', isActive: product.isActive
      });
      setImageFile(null);
      setImagePreview(product.imageUrl || null);
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stockQuantity: '', categoryId: categories[0]?.id || '', imageUrl: '', isActive: true });
      setImageFile(null);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        toast.loading('Uploading image...', { id: 'upload' });
        const uploadRes = await uploadImage(imageFile);
        finalImageUrl = uploadRes.data.url;
        toast.dismiss('upload');
      }
      const payload = {
        ...formData, imageUrl: finalImageUrl,
        price: parseFloat(formData.price), stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10)
      };
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
        toast.success('Product updated successfully');
      } else {
        await adminCreateProduct(payload);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminDeleteProduct(id);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">Manage Products</h1>
              <p className="text-muted text-sm mt-1">{products.length} products in catalog</p>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-grow sm:w-64">
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-base !pl-10" />
                <Search className="absolute left-3 top-2.5 text-muted" size={20} />
              </div>
              <button onClick={() => handleOpenModal()} className="btn-primary whitespace-nowrap">
                <Plus size={18} /> Add Product
              </button>
            </div>
          </div>

          <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-canvas/70">
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Stock</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-8"><div className="animate-spin inline-block h-8 w-8 border-b-2 border-primary rounded-full"></div></td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-muted">No products found.</td></tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-canvas flex items-center justify-center overflow-hidden border border-line">
                              {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full object-contain" /> : <Package size={16} className="text-muted" />}
                            </div>
                            <div>
                              <div className="font-semibold text-ink">{product.name}</div>
                              <div className={`text-xs ${product.isActive ? 'text-success' : 'text-error'}`}>{product.isActive ? 'Active' : 'Inactive'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">{product.category?.name}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-ink">₹{product.price.toFixed(2)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`badge ${product.stockQuantity > 10 ? 'badge-success' : product.stockQuantity > 0 ? 'badge-warning' : 'badge-error'}`}>
                            {product.stockQuantity} in stock
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-right">
                          <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-1">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="text-error hover:bg-red-50 p-2 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
            <div className="px-6 py-4 border-b border-line flex justify-between items-center bg-canvas">
              <h2 className="text-lg font-bold text-ink">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-ink transition-colors"><X size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Category</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="input-base">
                    <option value="">Select a category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Price (₹)</label>
                  <input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Stock Quantity</label>
                  <input type="number" min="0" required value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} className="input-base" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Product Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-lg bg-canvas overflow-hidden border border-line shrink-0">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } }} className="input-base p-2" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-base resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-primary rounded" />
                    <span className="text-ink font-semibold text-sm">Product is Active</span>
                  </label>
                </div>
              </div>
              <div className="mt-7 flex justify-end gap-3 pt-5 border-t border-line">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
