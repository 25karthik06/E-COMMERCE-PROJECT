import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { getProductReviews, addReview } from '../../api/reviewApi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { ShoppingCart, ArrowLeft, Package, Check, Shield, Truck, X, Star, Zap, RotateCcw, Headphones, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productRes = await getProductById(id);
        setProduct(productRes.data);
        const reviewsRes = await getProductReviews(id);
        setReviews(reviewsRes || []);
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login', { state: { from: location } });
      return;
    }
    await addItem(product.id, quantity);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase');
      navigate('/login', { state: { from: location } });
      return;
    }
    await addItem(product.id, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await addReview(id, reviewForm);
      setReviews([newReview, ...reviews]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-canvas">
        <div className="card p-10 max-w-md w-full">
          <div className="skeleton h-8 w-1/3 mb-4 rounded"></div>
          <div className="skeleton h-12 w-2/3 mb-6 rounded"></div>
          <div className="skeleton h-72 rounded-lg mb-6"></div>
          <div className="skeleton h-10 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inStock = product.stockQuantity > 0;
  const oldPrice = product.price * 1.25;
  const off = Math.round((1 - product.price / oldPrice) * 100);

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-sm text-muted mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-ink font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="card overflow-hidden animate-fade-in-up">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-[45%] bg-white p-8 sm:p-12 flex items-center justify-center border-r border-line relative">
              {off > 0 && (
                <span className="absolute top-5 left-5 badge badge-success text-sm px-3 py-1">{off}% Off</span>
              )}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto max-h-[480px] object-contain hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Package className="w-48 h-48 text-gray-200" />
              )}
            </div>

            {/* Details */}
            <div className="md:w-[55%] p-6 sm:p-8 flex flex-col relative">
              <button 
                onClick={() => toggleWishlist(product)}
                className="absolute top-6 right-6 p-2.5 bg-slate-50 border border-line rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} className={isInWishlist(product.id) ? "text-rose-500" : "text-gray-400"} />
              </button>

              <div className="text-sm text-primary font-bold uppercase tracking-wider mb-2">
                {product.category?.name || 'Category'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3 pr-10">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <span className="rating-pill">4.5 <Star size={11} fill="currentColor" /></span>
                <span className="text-sm text-muted">{reviews.length} reviews</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-line">
                <span className="text-3xl font-bold text-ink">₹{product.price.toFixed(2)}</span>
                {off > 0 && (
                  <>
                    <span className="price-old text-lg">₹{oldPrice.toFixed(0)}</span>
                    <span className="price-off text-base">{off}% off</span>
                  </>
                )}
                {off > 0 && (
                  <span className="badge badge-success ml-auto">Deal of the Day</span>
                )}
              </div>

              <div className="text-gray-600 mb-6 leading-relaxed">
                <h3 className="font-bold text-ink mb-2">Description</h3>
                <p>{product.description || 'No description available for this product.'}</p>
              </div>

              <div className="mb-6">
                {inStock ? (
                  <div className="flex items-center gap-2 text-success font-semibold">
                    <Check size={18} /> In Stock ({product.stockQuantity} available)
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-error font-semibold">
                    <X size={18} /> Out of Stock
                  </div>
                )}
              </div>

              {inStock && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                  <div className="flex items-center border border-line rounded-lg h-12 shrink-0 self-start sm:self-auto bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 h-full text-ink hover:text-primary hover:bg-primary-light transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >−</button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-4 h-full text-ink hover:text-primary hover:bg-primary-light transition-colors rounded-r-lg"
                      disabled={quantity >= product.stockQuantity}
                    >+</button>
                  </div>
                  <div className="flex gap-3 flex-grow">
                    <button
                      onClick={handleAddToCart}
                      className="flex-grow inline-flex justify-center items-center gap-2 bg-white border-2 border-primary text-primary hover:bg-primary-light rounded-lg font-bold h-12 px-6 transition-all duration-200 active:scale-[0.97]"
                    >
                      <ShoppingCart size={20} /> Add to Cart
                    </button>
                    <button onClick={handleBuyNow} className="btn-accent flex-grow h-12 px-6">
                      <Zap size={20} /> Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-auto pt-6 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Shield, label: '1 Year Warranty' },
                  { icon: RotateCcw, label: '7-Day Returns' },
                  { icon: Headphones, label: '24/7 Support' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5 text-ink">
                    <b.icon size={22} className="text-primary" />
                    <span className="text-xs font-medium">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-ink mb-6 pb-4 border-b border-line">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="card p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-ink mb-2">
                    {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={20} className={star <= (reviews.length > 0 ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0) ? "fill-amber-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <div className="text-sm text-muted">{reviews.length} reviews</div>
                </div>
                
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="mt-6 border-t border-line pt-6">
                    <h3 className="font-bold text-ink mb-3 text-sm">Write a Review</h3>
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                            className="focus:outline-none"
                          >
                            <Star size={24} className={star <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <textarea
                        rows="3"
                        placeholder="Share your thoughts about this product..."
                        className="input-base text-sm resize-none"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={submittingReview}
                      className="btn-primary w-full py-2 text-sm"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div className="mt-6 border-t border-line pt-6 text-center">
                    <p className="text-sm text-muted mb-3">Please log in to write a review.</p>
                    <button onClick={() => navigate('/login')} className="btn-secondary w-full py-2 text-sm">
                      Log In
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {reviews.length === 0 ? (
                <div className="card p-8 text-center text-muted">
                  <Star size={48} className="mx-auto mb-4 text-gray-200" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="card p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold">
                          {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-ink text-sm">{review.userName}</h4>
                          <div className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={14} className={star <= review.rating ? "fill-amber-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-ink text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
