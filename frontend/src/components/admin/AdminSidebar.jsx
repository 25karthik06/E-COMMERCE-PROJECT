import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Ticket,
  Users,
  Menu,
  X,
  LogOut,
  Image,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Admins', path: '/admin/admins', icon: Users },
    { name: 'Banners', path: '/admin/banners', icon: Image },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-5">
        <h2 className="text-[11px] font-bold text-muted uppercase tracking-wider mb-3">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-ink hover:bg-primary-light hover:text-primary'
                }`}
              >
                <Icon size={19} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-5 border-t border-line">
        <button onClick={handleLogout} className="flex items-center w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg text-error hover:bg-red-50 transition-colors">
          <LogOut size={19} className="mr-3" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-20 left-4 z-40 bg-primary text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Admin menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white border-r border-line animate-slide-down" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-line min-h-[calc(100vh-4rem)] flex-shrink-0 hidden md:block">
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
