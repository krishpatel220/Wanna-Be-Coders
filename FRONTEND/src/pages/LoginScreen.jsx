import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';

import Logo from '../components/common/Logo';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/home'), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center p-4 lg:p-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <Logo size="lg" light={false} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="font-poppins text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" required
                className="input-field"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" required
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right">
              <button type="button" className="text-[#0077B6] text-xs font-semibold hover:underline">Forgot password?</button>
            </div>

            <Button variant="primary" type="submit" className="w-full py-3.5" disabled={loading}>
              {loading ? 'Signing in...' : 'SIGN IN'}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Or login with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center gap-4">
            {[
              { name: 'Google', color: '#DB4437', path: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' },
              { name: 'Facebook', color: '#1877F2', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { name: 'Twitter (X)', color: '#000000', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
            ].map((s, i) => (
              <button key={i} onClick={() => { setLoading(true); setTimeout(() => navigate('/home'), 1200); }} title={s.name}
                className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 hover:-translate-y-0.5 transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill={s.color} d={s.path} /></svg>
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            If you new user then{' '}
            <button onClick={() => navigate('/signup')} className="text-[#0077B6] font-bold hover:underline">Sign Up</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
