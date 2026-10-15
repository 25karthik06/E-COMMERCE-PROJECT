import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orderApi';
import { ArrowLeft, Package, MapPin, CreditCard, Tag, ChevronRight, ClipboardList, CheckCircle2, Truck, Home, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (error) {
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-canvas">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-canvas flex-col">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/my-orders" className="btn-primary">Back to Orders</Link>
      </div>
    );
  }

  const statusBadge = order.status === 'DELIVERED' ? 'badge-success' :
    order.status === 'CANCELLED' ? 'badge-error' : 'badge-info';

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  const stepIndex = getStepIndex(order.status);
  
  const steps = [
    { title: 'Placed', icon: ClipboardList },
    { title: 'Confirmed', icon: CheckCircle2 },
    { title: 'Shipped', icon: Truck },
    { title: 'Delivered', icon: Home }
  ];

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <nav className="flex items-center gap-1.5 text-sm text-muted mb-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/my-orders" className="hover:text-primary transition-colors">My Orders</Link>
          <ChevronRight size={14} />
          <span className="text-ink font-medium">#{order.id}</span>
        </nav>

        <Link to="/my-orders" className="inline-flex items-center text-muted hover:text-primary mb-5 transition-colors text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Order #{order.id}</h1>
            <p className="text-muted text-sm">Placed on {new Date(order.orderDate).toLocaleString()}</p>
          </div>
          <span className={`badge ${statusBadge} text-sm px-3 py-1`}>{order.status}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            {/* Order Tracking */}
            <div className="card p-5 md:p-8">
              <h2 className="text-lg font-bold text-ink mb-6">Track Order</h2>
              
              {order.status === 'CANCELLED' ? (
                <div className="flex flex-col items-center justify-center py-6 text-error">
                  <XCircle size={48} className="mb-3" />
                  <h3 className="text-xl font-bold">Order Cancelled</h3>
                  <p className="text-sm mt-1 text-muted">This order has been cancelled and will not be delivered.</p>
                </div>
              ) : (
                <div className="relative pt-2 pb-6">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-line rounded-full mx-6 md:mx-10" aria-hidden="true">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= stepIndex;
                      const isActive = idx === stepIndex;
                      const StepIcon = step.icon;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center z-10 w-16 md:w-24">
                          <div 
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
                              isCompleted 
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'bg-white border-2 border-line text-muted'
                            } ${isActive ? 'ring-4 ring-primary-light' : ''}`}
                          >
                            <StepIcon size={20} />
                          </div>
                          <span className={`text-xs md:text-sm font-semibold text-center ${isCompleted ? 'text-ink' : 'text-muted'}`}>
                            {step.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="text-lg font-bold text-ink mb-5">Items</h2>
              <div className="space-y-4">
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg p-2 shrink-0 border border-line flex items-center justify-center">
                      {item.productImageUrl ? (
                        <img src={item.productImageUrl} alt={item.productName} className="max-h-full object-contain" />
                      ) : (
                        <Package className="text-gray-300" size={28} />
                      )}
                    </div>
                    <div className="flex-grow">
                      <Link to={`/products/${item.productId}`} className="hover:text-primary transition-colors">
                        <h4 className="font-semibold text-ink">{item.productName}</h4>
                      </Link>
                      <p className="text-xs text-muted mt-1">Quantity: {item.quantity}</p>
                      <div className="text-sm font-medium text-ink mt-1">₹{item.priceAtPurchase.toFixed(2)} each</div>
                    </div>
                    <div className="text-right font-bold text-ink">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <h2 className="text-base font-bold text-ink mb-4">Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-ink">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1"><Tag size={14} /> Discount ({order.coupon.code})</span>
                    <span>Applied</span>
                  </div>
                )}
                <div className="flex justify-between text-ink border-b border-line pb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="text-success font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <span className="font-bold text-ink">Total</span>
                  <span className="text-xl font-bold text-primary">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Delivery
              </h2>
              <p className="text-ink text-sm leading-relaxed">{order.shippingAddress}</p>
            </div>

            {order.payment && (
              <div className="card p-5">
                <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> Payment
                </h2>
                <div className="text-sm text-ink space-y-1.5">
                  <p><span className="font-semibold text-ink">Method:</span> <span className="text-muted">{order.payment.paymentMethod}</span></p>
                  <p><span className="font-semibold text-ink">Status:</span> <span className="text-muted">{order.payment.paymentStatus}</span></p>
                  {order.payment.transactionId && (
                    <p><span className="font-semibold text-ink">Txn ID:</span> <span className="text-muted">{order.payment.transactionId}</span></p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
