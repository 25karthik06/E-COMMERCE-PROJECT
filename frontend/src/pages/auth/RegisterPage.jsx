import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Shield, Truck, Headphones, Eye, EyeOff } from 'lucide-react';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phone: yup.string(),
  address: yup.string(),
});

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const role = 'ROLE_CUSTOMER';
    const result = await registerUser(data.name, data.email, data.password, data.phone, data.address, role);
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-dark to-accent text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="relative z-10 max-w-md">
          <Link to="/" className="text-3xl font-bold mb-8 inline-block">
            Mega<span className="text-white">Mart</span>
          </Link>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Join the MegaMart family today.
          </h1>
          <p className="text-white/90 text-lg mb-10">
            Create your free account and unlock exclusive deals, faster checkout, and order tracking.
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
                  <p className="text-white/80 text-sm">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-canvas">
        <div className="card w-full max-w-md p-8 rounded-2xl animate-fade-in-up my-6">
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-light text-primary mb-4">
              <UserPlus size={28} />
            </div>
            <h1 className="text-2xl font-bold text-ink">Create Account</h1>
            <p className="text-muted mt-1.5 text-sm">Join us to start shopping</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Full Name</label>
              <input type="text" {...register('name')} className={`input-base ${errors.name ? 'border-error' : ''}`} placeholder="John Doe" />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" {...register('email')} className={`input-base ${errors.email ? 'border-error' : ''}`} placeholder="you@example.com" />
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

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Phone (Optional)</label>
              <input type="tel" {...register('phone')} className="input-base" placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">Address (Optional)</label>
              <textarea {...register('address')} className="input-base resize-none" rows="2" placeholder="123 Main St..."></textarea>
            </div>


            <button type="submit" disabled={isSubmitting} className="btn-primary w-full h-12 text-base mt-2">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
