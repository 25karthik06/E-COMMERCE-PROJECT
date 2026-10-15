import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { applyCoupon } from '../../api/couponApi';
import { Trash2, ShoppingBag, ArrowRight, Tag, Shield, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    try {
      const res = await applyCoupon(couponCode);
      setAppliedCoupon(res.data);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired coupon');
      setAppliedCoupon(null);
    } finally {
      setIsApplying(false);
    }
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (cartTotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    if (discountAmount > cartTotal) discountAmount = cartTotal;
  }

  const finalTotal = cartTotal - discountAmount;
  const deliveryFee = finalTotal > 100 || finalTotal === 0 ? 0 : 40;
  const totalWithDelivery = finalTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="card p-12 rounded-2xl text-center max-w-md w-full animate-fade-in-up">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-3">Your cart is empty</h2>
          <p className="text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary w-full py-3">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-sm text-muted mb-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-ink font-medium">Cart</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-grow space-y-3">
            <div className="card p-4 hidden md:flex items-center text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
              <div className="flex-grow">Product</div>
              <div className="w-32 text-center">Quantity</div>
              <div className="w-28 text-right">Subtotal</div>
              <div className="w-8"></div>
            </div>
            {cartItems.map((item) => (
              <div key={item.productId} className="card p-4 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                <div className="w-24 h-24 bg-white rounded-lg p-2 shrink-0 flex items-center justify-center border border-line">
                  {item.productImageUrl ? (
                    <img src={item.productImageUrl} alt={item.productName} className="max-h-full object-contain" />
                  ) : (
                    <ShoppingBag className="text-gray-300" size={32} />
                  )}
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <Link to={`/products/${item.productId}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-ink mb-1">{item.productName}</h3>
                  </Link>
                  <p className="text-sm text-muted mb-2">Unit price: ₹{item.price.toFixed(2)}</p>
                  <div className="md:hidden flex items-center justify-between">
                    <div className="flex items-center border border-line rounded-lg bg-white">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 text-ink hover:text-primary transition-colors">−</button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 text-ink hover:text-primary transition-colors">+</button>
                    </div>
                    <div className="font-bold text-ink">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center border border-line rounded-lg bg-white">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 py-1.5 text-ink hover:text-primary transition-colors">−</button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 py-1.5 text-ink hover:text-primary transition-colors">+</button>
                </div>
                <div className="hidden md:block w-28 text-right font-bold text-ink">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-muted hover:text-error hover:bg-red-50 rounded-full transition-colors shrink-0"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="card p-6 sticky top-32">
              <h2 className="text-lg font-bold text-ink mb-5 pb-4 border-b border-line">Order Summary</h2>

              <div className="space-y-3 mb-5 text-sm">
                <div className="flex justify-between text-ink">
                  <span className="text-muted">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-semibold">−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink border-b border-line pb-3">
                  <span className="text-muted">Delivery</span>
                  <span className="font-semibold">{deliveryFee === 0 ? <span className="text-success">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-base font-bold text-ink">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="input-base !pl-9 h-11"
                      disabled={appliedCoupon != null}
                    />
                    <Tag size={16} className="absolute left-3 top-3.5 text-muted" />
                  </div>
                  {appliedCoupon ? (
                    <button
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                      className="btn-secondary h-11 px-4 text-error border-red-200 hover:bg-red-50"
                    >
                      <X size={16} /> Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode.trim()}
                      className="btn-secondary h-11 px-5 disabled:opacity-50"
                    >
                      {isApplying ? '...' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { couponId: appliedCoupon?.id, discountAmount, finalTotal: totalWithDelivery } })}
                className="btn-accent w-full py-3.5 text-base"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted">
                <Shield size={14} className="text-success" /> 100% Secure Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
