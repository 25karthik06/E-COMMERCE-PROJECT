import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminGetOrders } from '../../api/orderApi';
import { adminGetCustomers } from '../../api/customerApi';
import { adminGetProducts } from '../../api/productApi';
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          adminGetOrders(),
          adminGetCustomers(),
          adminGetProducts()
        ]);

        const orders = ordersRes.data;
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        const sortedOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5);

        const productsList = productsRes.data.content ? productsRes.data.content : productsRes.data;
        const totalProducts = productsRes.data.totalElements !== undefined ? productsRes.data.totalElements : productsList.length;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: customersRes.data.length,
          totalProducts,
          recentOrders: sortedOrders
        });
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="card card-hover p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-ink">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="flex bg-canvas min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">Dashboard Overview</h1>
              <p className="text-muted text-sm mt-1">Welcome back, here's your store summary</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-success bg-green-50 px-4 py-2 rounded-lg border border-green-100">
              <TrendingUp size={16} /> Live
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="text-emerald-600" bg="bg-emerald-100" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="text-blue-600" bg="bg-blue-100" />
                <StatCard title="Customers" value={stats.totalCustomers} icon={Users} color="text-orange-600" bg="bg-orange-100" />
                <StatCard title="Products" value={stats.totalProducts} icon={Package} color="text-amber-600" bg="bg-amber-100" />
              </div>

              <div className="card overflow-hidden">
                <div className="p-5 border-b border-line flex justify-between items-center">
                  <h2 className="text-lg font-bold text-ink">Recent Orders</h2>
                  <button className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-canvas/70">
                        <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Order ID</th>
                        <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Customer</th>
                        <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                        <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {stats.recentOrders.length === 0 ? (
                        <tr><td colSpan="5" className="px-5 py-8 text-center text-muted">No orders found.</td></tr>
                      ) : (
                        stats.recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-canvas/50 transition-colors">
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm font-semibold text-ink">#{order.id}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-ink">{order.user?.name || order.user?.email || `User ${order.user?.id}`}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`badge ${
                                order.status === 'DELIVERED' ? 'badge-success' :
                                order.status === 'CANCELLED' ? 'badge-error' : 'badge-info'
                              }`}>{order.status}</span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-sm font-bold text-ink text-right">₹{order.totalAmount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
