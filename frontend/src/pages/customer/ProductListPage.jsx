import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProducts } from '../../api/productApi';
import { getCategories } from '../../api/categoryApi';
import { ShoppingBag, Search, Package, ListFilter as Filter, X, Star, ChevronDown, SlidersHorizontal, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addItem(productId, 1);
    navigate('/cart');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(prodRes.data.content ? prodRes.data.content : prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    const categoryName = searchParams.get('category');
    if (categoryName && categories.length > 0) {
      const cat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
      if (cat) {
        setSelectedCategory(cat.id.toString());
      }
    } else if (!categoryName) {
      setSelectedCategory('');
    }
  }, [searchParams, categories]);

  const filteredProducts = products.filter(product => {
    if (searchTerm && !product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory && product.category?.id?.toString() !== selectedCategory) return false;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 to ₹2,000', value: '500-2000' },
    { label: '₹2,000 to ₹10,000', value: '2000-10000' },
    { label: 'Over ₹10,000', value: '10000-' }
  ];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
            <input type="radio" name="category" checked={selectedCategory === ''} onChange={() => setSelectedCategory('')} className="text-primary focus:ring-primary h-4 w-4" />
            <span className="text-sm text-ink">All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              <input type="radio" name="category" checked={selectedCategory === cat.id.toString()} onChange={() => setSelectedCategory(cat.id.toString())} className="text-primary focus:ring-primary h-4 w-4" />
              <span className="text-sm text-ink">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-line">
        <h3 className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.value} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
              <input type="radio" name="price" checked={priceRange === range.value} onChange={() => setPriceRange(range.value)} className="text-primary focus:ring-primary h-4 w-4" />
              <span className="text-sm text-ink">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">All Products</h1>
            <p className="text-muted text-sm mt-0.5">
              {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} of ${products.length} results`}
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-base !pl-10"
              />
              <Search className="absolute left-3 top-2.5 text-muted" size={20} />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base pr-9 appearance-none cursor-pointer"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-muted pointer-events-none" size={16} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary md:hidden px-3">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`w-full md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="card p-5 sticky top-32">
              <div className="flex justify-between items-center mb-5 md:hidden">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="text-muted"><X size={20} /></button>
              </div>
              <FilterPanel />
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceRange(''); }}
                className="btn-ghost w-full mt-6 text-sm"
              >
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card p-4">
                    <div className="skeleton h-40 rounded-lg mb-4"></div>
                    <div className="skeleton h-3 w-1/3 mb-2 rounded"></div>
                    <div className="skeleton h-4 w-3/4 mb-3 rounded"></div>
                    <div className="skeleton h-6 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
                {filteredProducts.map(product => {
                  const oldPrice = product.price * 1.25;
                  const off = Math.round((1 - product.price / oldPrice) * 100);
                  return (
                    <div key={product.id} className="card card-hover overflow-hidden group flex flex-col">
                      <Link to={`/products/${product.id}`} className="relative h-44 bg-white p-4 flex items-center justify-center overflow-hidden shrink-0">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Package className="w-16 h-16 text-gray-200" />
                        )}
                        {off > 0 && <span className="absolute top-2 left-2 badge badge-success">{off}% Off</span>}
                      </Link>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                      >
                        <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={isInWishlist(product.id) ? "text-rose-500" : "text-gray-400"} />
                      </button>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="text-[11px] text-primary font-semibold uppercase tracking-wider mb-1">
                          {product.category?.name || 'Category'}
                        </div>
                        <Link to={`/products/${product.id}`} className="flex-grow">
                          <h3 className="font-semibold text-ink text-sm mb-2 hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="rating-pill">4.5 <Star size={10} fill="currentColor" /></span>
                          <span className="text-xs text-muted">(1,234)</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-bold text-ink">₹{product.price.toFixed(2)}</span>
                          <span className="price-old">₹{oldPrice.toFixed(0)}</span>
                          <span className="price-off">{off}% off</span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="btn-primary w-full py-2.5 text-sm"
                        >
                          <ShoppingBag size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 card">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">No products found</h3>
                <p className="text-muted">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceRange(''); }}
                  className="btn-ghost mt-6"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
