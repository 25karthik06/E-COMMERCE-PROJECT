import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkout } from '../../api/orderApi';
import { ArrowLeft, CreditCard, CheckCircle, Shield, Wallet, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  houseNo: yup.string().required('House number is required'),
  street: yup.string().required('Street is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  pincode: yup.string().required('Pincode is required'),
  paymentMethod: yup.string().required('Payment method is required'),
});

const paymentOptions = [
  { value: 'Credit Card', label: 'Credit / Debit Card', icon: CreditCard },
  { value: 'WALLET', label: 'MegaMart Wallet', icon: Wallet },
  { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const { couponId, discountAmount, finalTotal } = location.state || {
    couponId: null,
    discountAmount: 0,
    finalTotal: cartTotal
  };

  const getInitialAddress = () => {
    const defaultAddr = { houseNo: '', street: '', city: '', state: '', country: '', pincode: '' };
    if (!user?.address) return defaultAddr;
    try {
      const parts = user.address.split(' - ');
      if (parts.length !== 2) return defaultAddr;
      const pincode = parts[1].trim();
      const addrParts = parts[0].split(',').map(s => s.trim());
      if (addrParts.length < 5) return defaultAddr;
      return { houseNo: addrParts[0], street: addrParts[1], city: addrParts[2], state: addrParts[3], country: addrParts[4], pincode };
    } catch {
      return defaultAddr;
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { ...getInitialAddress(), paymentMethod: 'Credit Card' }
  });

  const onSubmit = async (data) => {
    try {
      const fullAddress = `${data.houseNo}, ${data.street}, ${data.city}, ${data.state}, ${data.country} - ${data.pincode}`;
      const payload = { couponId, shippingAddress: fullAddress, paymentMethod: data.paymentMethod };
      const res = await checkout(payload);
      setOrderId(res.data.id);
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="card p-12 rounded-2xl text-center max-w-lg w-full animate-scale-in">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">Order Confirmed!</h1>
          <p className="text-muted mb-8">
            Thank you for your purchase. Your order <span className="font-bold text-primary">#{orderId}</span> has been placed successfully.
          </p>
          <div className="space-y-3">
            <Link to={`/my-orders/${orderId}`} className="btn-primary w-full py-3">View Order Details</Link>
            <Link to="/" className="btn-secondary w-full py-3">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/cart" className="inline-flex items-center text-muted hover:text-primary mb-5 transition-colors text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-grow">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Shipping */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-ink mb-5 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                  Shipping Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Full Name</label>
                      <input type="text" value={user?.name || ''} disabled className="input-base bg-gray-50 text-muted" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={user?.email || ''} disabled className="input-base bg-gray-50 text-muted" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">House No. / Building</label>
                      <input type="text" {...register('houseNo')} className={`input-base ${errors.houseNo ? 'border-error' : ''}`} placeholder="e.g. Flat 101, A Block" />
                      {errors.houseNo && <p className="mt-1 text-xs text-error">{errors.houseNo.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Street / Area</label>
                      <input type="text" {...register('street')} className={`input-base ${errors.street ? 'border-error' : ''}`} placeholder="e.g. Main Street" />
                      {errors.street && <p className="mt-1 text-xs text-error">{errors.street.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">City</label>
                      <input type="text" {...register('city')} className={`input-base ${errors.city ? 'border-error' : ''}`} placeholder="e.g. Mumbai" />
                      {errors.city && <p className="mt-1 text-xs text-error">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">State</label>
                      <input type="text" {...register('state')} className={`input-base ${errors.state ? 'border-error' : ''}`} placeholder="e.g. Maharashtra" />
                      {errors.state && <p className="mt-1 text-xs text-error">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Country</label>
                      <input type="text" {...register('country')} className={`input-base ${errors.country ? 'border-error' : ''}`} placeholder="e.g. India" />
                      {errors.country && <p className="mt-1 text-xs text-error">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Pincode</label>
                      <input type="text" {...register('pincode')} className={`input-base ${errors.pincode ? 'border-error' : ''}`} placeholder="e.g. 400001" />
                      {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-ink mb-5 flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentOptions.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label key={method.value} className="flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary-light/30">
                        <input type="radio" value={method.value} {...register('paymentMethod')} className="text-primary focus:ring-primary h-4 w-4" />
                        <Icon size={20} className="ml-3 text-muted" />
                        <span className="ml-3 font-semibold text-ink">{method.label}</span>
                      </label>
                    );
                  })}
                  {errors.paymentMethod && <p className="mt-1 text-xs text-error">{errors.paymentMethod.message}</p>}
                </div>
              </div>
            </form>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="card p-6 sticky top-32">
              <h2 className="text-lg font-bold text-ink mb-5 pb-4 border-b border-line">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-14 h-14 bg-white rounded-lg p-1 shrink-0 border border-line flex items-center justify-center">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} alt={item.productName} className="max-h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded"></div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-semibold text-ink line-clamp-1">{item.productName}</h4>
                      <div className="flex justify-between text-xs mt-1 text-muted">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-ink">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-line text-sm">
                <div className="flex justify-between text-ink">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink border-b border-line pb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="text-base font-bold text-ink">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" form="checkout-form" disabled={isSubmitting} className="btn-accent w-full py-3.5 text-base mt-6">
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  `Pay ₹${finalTotal.toFixed(2)}`
                )}
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

export default CheckoutPage;
