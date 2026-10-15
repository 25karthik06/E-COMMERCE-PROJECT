import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/orderApi';
import { ShoppingCart, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'PENDING', label: 'Pending', badge: 'badge-warning' },
  { value: 'CONFIRMED', label: 'Confirmed', badge: 'badge-info' },
  { value: 'SHIPPED', label: 'Shipped', badge: 'badge-info' },
  { value: 'DELIVERED', label: 'Delivered', badge: 'badge-success' },
  { value: 'CANCELLED', label: 'Cancelled', badge: 'badge-error' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminGetOrders();
      setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminUpdateOrderStatus(id, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadge = (status) => statusOptions.find(s => s.value === status)?.badge || 'badge-info';

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2">
                <ShoppingCart size={28} className="text-primary" /> Manage Orders
              </h1>
              <p className="text-muted text-sm mt-1">{orders.length} total orders</p>
            </div>
            <div className="relative w-full sm:w-72">
              <input type="text" placeholder="Search by ID or Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-base !pl-10" />
              <Search className="absolute left-3 top-2.5 text-muted" size={20} />
            </div>
          </div>

          <div className="card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-canvas/70">
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Order Info</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Items</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Total</th>
                    <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {isLoading ? (
                    <tr><td colSpan="5" className="text-center py-8"><div className="animate-spin inline-block h-8 w-8 border-b-2 border-primary rounded-full"></div></td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-muted">No orders found.</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-bold text-ink">#{order.id}</div>
                          <div className="text-xs text-muted">{new Date(order.orderDate).toLocaleString()}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="font-semibold text-ink">{order.user?.name || 'Unknown'}</div>
                          <div className="text-xs text-muted">{order.user?.email}</div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">
                          {order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0} items
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-ink">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className={`badge ${getBadge(order.status)}`}>{order.status}</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="text-sm border-line rounded-md focus:ring-primary focus:border-primary px-2 py-1 bg-white border outline-none"
                            >
                              {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          </div>
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
    </div>
  );
};

export default AdminOrders;
