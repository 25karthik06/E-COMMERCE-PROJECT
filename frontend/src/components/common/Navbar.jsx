import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingCart, LogOut, User, Package, LogIn, Search, Menu, X, ChevronDown, Home, LayoutDashboard, Wallet, Heart } from 'lucide-react';
import { getCategories } from '../../api/categoryApi';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin, isSeller } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q !== null) {
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/products`);
    }
    setMobileOpen(false);
  };

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Main bar */}
      <div className="bg-primary/95 backdrop-blur-md text-white shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3 sm:gap-6">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-white p-1 -ml-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">
                Mega<span className="text-accent group-hover:text-white transition-colors">Mart</span>
              </span>
              <span className="hidden sm:block text-[10px] italic text-white/80 ml-1 mt-3 -ml-2">Explore Plus</span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden sm:flex">
              <div className="flex w-full bg-white rounded-md overflow-hidden shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="flex-grow px-4 py-2 text-sm text-ink outline-none placeholder-muted bg-transparent"
                />
                <button type="submit" className="px-4 text-primary hover:bg-slate-50 transition-colors" aria-label="Search">
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-3 sm:gap-5 ml-auto">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link to="/admin/dashboard" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  ) : isSeller ? (
                    <Link to="/seller/dashboard" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
                      <LayoutDashboard size={18} /> Store Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/profile" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
                        <Wallet size={18} /> Wallet
                      </Link>
                      <Link to="/my-orders" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
                        <Package size={18} /> Orders
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors">
                    <LogIn size={18} /> <span className="hidden sm:inline">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center text-sm font-semibold bg-white text-primary px-4 py-1.5 rounded-md hover:bg-primary-light transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {!isAdmin && !isSeller && location.pathname !== '/login' && location.pathname !== '/register' && (
                <>
                  {isAuthenticated && (
                    <Link to="/wishlist" className="relative flex items-center gap-1.5 text-sm font-semibold hover:text-accent transition-colors mr-2 sm:mr-4">
                      <Heart size={22} />
                      <span className="hidden sm:inline">Wishlist</span>
                      {wishlistItems?.length > 0 && (
                        <span className="absolute -top-2 left-3 sm:left-4 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-primary bg-accent rounded-full ring-2 ring-primary">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/cart" className="relative flex items-center gap-1.5 text-sm font-semibold hover:text-accent transition-colors">
                    <ShoppingCart size={22} />
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 left-3 sm:left-4 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-primary bg-accent rounded-full ring-2 ring-primary">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <>
                  <Link to="/profile" className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors mr-2">
                    <User size={18} /> <span className="hidden lg:inline">{user?.name?.split(' ')[0] || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm font-semibold hover:text-accent transition-colors"
                  >
                    <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile search */}
          {mobileOpen && (
            <form onSubmit={handleSearch} className="pb-3 sm:hidden animate-slide-down">
              <div className="flex w-full bg-white rounded-md overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-grow px-4 py-2 text-sm text-ink outline-none placeholder-muted"
                />
                <button type="submit" className="px-4 text-primary"><Search size={20} /></button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Category bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-line hidden lg:block shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center h-11 text-sm font-medium text-ink overflow-x-auto whitespace-nowrap hide-scrollbar">
            <Link to="/" className="flex items-center gap-1.5 px-3 py-2 hover:text-primary transition-colors flex-shrink-0">
              <Home size={14} /> Home
            </Link>
            <Link to="/products" className="px-3 py-2 hover:text-primary transition-colors flex items-center gap-1 flex-shrink-0">
              All Products <ChevronDown size={12} />
            </Link>
            {categories.slice(0, 7).map(category => (
              <Link 
                key={category.id} 
                to={`/products?category=${encodeURIComponent(category.name)}`} 
                className="px-3 py-2 text-muted hover:text-primary transition-colors cursor-pointer flex-shrink-0"
              >
                {category.name}
              </Link>
            ))}
            <span className="ml-auto pl-6 pr-3 py-2 text-muted text-xs flex-shrink-0">Free shipping on orders over ₹100</span>
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-line animate-slide-down">
          <nav className="flex flex-col p-3 text-sm font-medium">
            <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">All Products</Link>
            {isAuthenticated && !isAdmin && !isSeller && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">Wallet</Link>
                <Link to="/my-orders" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">My Orders</Link>
              </>
            )}
            {isAuthenticated && isSeller && (
              <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">Store Dashboard</Link>
            )}
            {isAuthenticated && (
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">My Profile</Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">Admin Dashboard</Link>
            )}
            {!isAuthenticated && (
              <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-md hover:bg-primary-light hover:text-primary transition-colors">Sign Up</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
