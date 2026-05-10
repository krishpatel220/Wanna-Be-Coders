import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, User, Mail, Phone, MapPin, Lock, Calendar, Hash, Globe } from 'lucide-react';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';
import { getAllCountries, getStatesForCountry, getCitiesForState } from '../data/geography';

const Field = ({ icon: Icon, type = 'text', value, onChange, placeholder, half }) => (
  <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required
        className="input-field text-sm py-3"
      />
    </div>
  </div>
);

const AutocompleteField = ({ icon: Icon, value, onChange, onSelect, placeholder, half, suggestions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (value && isOpen) {
      setFiltered(suggestions.filter(s => s.toLowerCase().startsWith(value.toLowerCase())));
    } else if (!value && isOpen) {
       setFiltered(suggestions);
    }
  }, [value, suggestions, isOpen]);

  return (
    <div className={half ? 'flex-1 min-w-0' : 'w-full'}>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
        <input
          type="text" 
          value={value} 
          onChange={(e) => { onChange(e); setIsOpen(true); }}
          onFocus={() => { 
             setIsOpen(true); 
             if(!value) setFiltered(suggestions);
             else setFiltered(suggestions.filter(s => s.toLowerCase().startsWith(value.toLowerCase()))); 
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder} 
          required
          className="input-field text-sm py-3"
          autoComplete="new-password"
        />
        {isOpen && filtered.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
            {filtered.map(s => (
              <div 
                key={s} 
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] cursor-pointer transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input from losing focus and triggering blur
                  onSelect(s);
                  setIsOpen(false);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function SignupScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', dob: '', mobile: '',
    country: '', state: '', address: '', email: '', password: '', confirmPassword: '',
  });

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  
  // Handlers for autocompletion selections
  const handleCountrySelect = (c) => setForm((p) => ({ ...p, country: c, state: '', address: '' }));
  const handleStateSelect = (s) => setForm((p) => ({ ...p, state: s, address: '' }));
  const handleCitySelect = (c) => setForm((p) => ({ ...p, address: c }));

  const handleSignup = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { alert('Passwords do not match!'); return; }
    setLoading(true);
    
    // Save to localStorage so Profile and Home screens can use it
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      mobile: form.mobile,
      location: `${form.address ? form.address + ', ' : ''}${form.state ? form.state + ', ' : ''}${form.country}`,
      dob: form.dob,
    };
    localStorage.setItem('traveloop_user', JSON.stringify(userData));

    setTimeout(() => navigate('/home'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0077B6] to-[#00B4D8] flex items-center justify-center p-4 lg:p-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <div className="p-6 sm:p-10">
          <div className="flex justify-center mb-6">
            <Logo size="lg" light={false} />
          </div>

          <div className="text-center mb-6">
            <h2 className="font-poppins text-xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-400 text-sm">Join us for unforgettable journeys</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div className="flex gap-3">
              <Field icon={User} value={form.firstName} onChange={update('firstName')} placeholder="First Name" half />
              <Field icon={User} value={form.lastName} onChange={update('lastName')} placeholder="Last Name" half />
            </div>
            
            <Field icon={Mail} value={form.email} onChange={update('email')} type="email" placeholder="Email Address" />
            <Field icon={Phone} value={form.mobile} onChange={update('mobile')} type="tel" placeholder="Phone Number" />
            
            <div className="flex gap-3">
              <Field icon={Calendar} value={form.dob} onChange={update('dob')} type="date" placeholder="Date of Birth" half />
              <Field icon={Hash} value={form.age} onChange={update('age')} type="number" placeholder="Age" half />
            </div>

            {/* Geography Auto-completes */}
            <AutocompleteField 
              icon={Globe} value={form.country} onChange={update('country')} onSelect={handleCountrySelect}
              placeholder="Country" suggestions={getAllCountries()} 
            />
            
            <div className="flex gap-3">
              <AutocompleteField 
                icon={MapPin} value={form.state} onChange={update('state')} onSelect={handleStateSelect}
                placeholder="State" half suggestions={getStatesForCountry(form.country)} 
              />
              <AutocompleteField 
                icon={MapPin} value={form.address} onChange={update('address')} onSelect={handleCitySelect}
                placeholder="City" half suggestions={getCitiesForState(form.country, form.state)} 
              />
            </div>

            <Field icon={Lock} value={form.password} onChange={update('password')} type="password" placeholder="Password" />
            <Field icon={Lock} value={form.confirmPassword} onChange={update('confirmPassword')} type="password" placeholder="Confirm Password" />

            <p className="text-[11px] text-gray-400 text-center px-2 leading-relaxed pt-1">
              By creating an account you agree to our Terms of Service and Privacy Policy
            </p>

            <Button variant="primary" type="submit" className="w-full py-3.5 mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'SIGN UP'}
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-[#0077B6] font-bold hover:underline">Log in</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
