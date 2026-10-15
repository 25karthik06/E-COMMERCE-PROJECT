import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../api/orderApi';
import { Package, ChevronRight, Clock, CircleCheck as CheckCircle, Truck, Circle as XCircle, ChevronRight as Chevron } from 'lucide-react';
import toast from 'react-hot-toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        const sortedOrders = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING': return { icon: Clock, color: 'text-warning', bg: 'bg-amber-100', badge: 'badge-warning' };
      case 'CONFIRMED': return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', badge: 'badge-info' };
      case 'SHIPPED': return { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-100', badge: 'badge-info' };
      case 'DELIVERED': return { icon: CheckCircle, color: 'text-success', bg: 'bg-green-100', badge: 'badge-success' };
      case 'CANCELLED': return { icon: XCircle, color: 'text-error', bg: 'bg-red-100', badge: 'badge-error' };
      default: return { icon: Package, color: 'text-muted', bg: 'bg-gray-100', badge: 'badge-info' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-canvas">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-1.5 text-sm text-muted mb-5">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Chevron size={14} />
          <span className="text-ink font-medium">My Orders</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="card p-12 rounded-2xl text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-ink mb-2">No orders yet</h2>
            <p className="text-muted mb-6">Looks like you haven't made any purchases.</p>
            <Link to="/products" className="btn-primary inline-block">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4 stagger">
            {orders.map(order => {
              const { icon: StatusIcon, color: statusColor, bg: statusBg, badge } = getStatusConfig(order.status);
              return (
                <div key={order.id} className="card card-hover p-5 flex flex-col md:flex-row items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${statusBg} ${statusColor}`}>
                    <StatusIcon size={26} />
                  </div>
                  <div className="flex-grow text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                      <h3 className="text-base font-bold text-ink">Order #{order.id}</h3>
                      <span className="text-xs text-muted">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <span className={`badge ${badge}`}>{order.status}</span>
                      <span className="text-sm font-semibold text-ink">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start -space-x-2 overflow-hidden">
                      {order.orderItems.slice(0, 5).map((item, index) => (
                        <div key={index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-canvas flex items-center justify-center overflow-hidden">
                          {item.productImageUrl ? (
                            <img src={item.productImageUrl} alt={item.productName} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={14} className="text-muted" />
                          )}
                        </div>
                      ))}
                      {order.orderItems.length > 5 && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-canvas flex items-center justify-center text-xs font-medium text-muted">
                          +{order.orderItems.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/my-orders/${order.id}`}
                    className="shrink-0 w-full md:w-auto mt-3 md:mt-0 flex justify-center items-center px-4 py-2 border border-line rounded-lg text-sm font-semibold text-ink hover:bg-primary-light hover:text-primary hover:border-primary transition-all"
                  >
                    View Details <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
