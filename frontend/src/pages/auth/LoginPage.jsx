import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, ShoppingBag, Shield, Truck, Headphones, Eye, EyeOff } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      const from = location.state?.from?.pathname || (result.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="relative z-10 max-w-md">
          <Link to="/" className="text-3xl font-bold mb-8 inline-block">
            Mega<span className="text-accent">Mart</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to the future of shopping.
          </h1>
          <p className="text-white/80 text-lg mb-10">
            Sign in to access your cart, orders, and exclusive member deals.
          </p>
          <div className="space-y-5">
            {[
              { icon: Truck, title: 'Free, Fast Delivery', sub: 'On orders over ₹100' },
              { icon: Shield, title: 'Secure Payments', sub: 'Bank-grade encryption' },
              { icon: Headphones, title: '24/7 Support', sub: 'Always here to help' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="text-white/70 text-sm">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-canvas">
        <div className="card w-full max-w-md p-8 rounded-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-4">
              <LogIn size={28} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Welcome Back</h1>
            <p className="text-muted mt-1.5 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                {...register('email')}
                className={`input-base ${errors.email ? 'border-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className={`input-base pr-10 ${errors.password ? 'border-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full h-12 text-base">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-semibold">
              Sign up
            </Link>
          </div>

          <div className="lg:hidden mt-8 pt-6 border-t border-line flex items-center justify-center gap-2 text-xs text-muted">
            <ShoppingBag size={14} className="text-primary" /> Shop premium products at MegaMart
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
