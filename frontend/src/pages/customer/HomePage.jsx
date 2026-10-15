import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { getProducts } from '../../api/productApi';
import { getActiveBanners } from '../../api/bannerApi';
import { ArrowRight, Star, ShoppingBag, Shield, Truck, Headphones, Tag, Zap, ChevronRight, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

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
    const fetchFeatured = async () => {
      try {
        const [productRes, bannerRes] = await Promise.allSettled([
          getProducts(),
          getActiveBanners(),
        ]);

        if (productRes.status === 'fulfilled') {
          const data = productRes.value.data;
          const products = data.content ? data.content : data;
          const q = searchParams.get('q');
          const filtered = q
            ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
            : products;
          setFeaturedProducts(filtered.slice(0, 8));
        } else {
          toast.error('Failed to load products');
        }

        if (bannerRes.status === 'fulfilled') {
          setBanners(bannerRes.value.data);
        }
      } catch (error) {
        toast.error('Failed to load homepage data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, [searchParams]);

  // Removed hardcoded banners

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel-like banner */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
              <Zap size={14} className="text-accent" /> New Collection 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-5 max-w-xl">
              Everything You Need, <span className="text-accent">Available Today.</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-lg">
              Discover premium products, everyday essentials, and exclusive deals. Your one-stop shop.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-accent text-base px-7 py-3">
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg px-6 py-3 border border-white/20 transition-all duration-200">
                Explore Catalog
              </Link>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in-up">
            {banners.map((b, i) => (
              <Link to="/products" key={i} className={`block bg-gradient-to-br ${b.color} rounded-2xl p-6 text-white shadow-xl hover:scale-[1.03] transition-transform duration-300 ${i === 0 ? 'translate-y-4' : ''}`}>
                <span className="inline-block bg-white/20 text-xs font-bold px-2 py-1 rounded mb-3">{b.tag}</span>
                <h3 className="text-2xl font-bold mb-1">{b.title}</h3>
                <p className="text-white/80 text-sm">{b.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders over ₹100' },
              { icon: Shield, title: 'Secure Payment', sub: '100% protected' },
              { icon: Headphones, title: '24/7 Support', sub: 'Dedicated assistance' },
              { icon: Tag, title: 'Best Deals', sub: 'Unbeatable prices' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-light transition-colors">
                <div className="w-11 h-11 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-sm">{f.title}</h3>
                  <p className="text-xs text-muted">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 bg-canvas flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Featured Products</h2>
              <p className="text-muted text-sm">Our most popular products</p>
            </div>
            <Link to="/products" className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1 text-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

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
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
              {featuredProducts.map(product => {
                const oldPrice = product.price * 1.25;
                const off = Math.round((1 - product.price / oldPrice) * 100);
                return (
                  <div key={product.id} className="card card-hover overflow-hidden group flex flex-col">
                    <Link to={`/products/${product.id}`} className="relative h-44 bg-white p-4 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ShoppingBag className="w-16 h-16 text-gray-200" />
                      )}
                      {off > 0 && (
                        <span className="absolute top-2 left-2 badge badge-success">{off}% Off</span>
                      )}
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
                        <span className="text-xs text-muted">(2,341)</span>
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
            <div className="text-center py-16 bg-white rounded-2xl border border-line">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">No products found</h3>
              <p className="text-muted">Check back later for new arrivals.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
