import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bell, Search, Plus, Map, Compass, Bookmark, TrendingUp,
  MapPin, Star, Heart, Clock, ChevronRight, Phone, Mail, LogOut,
  PenLine, Globe, DollarSign, Plane, X, Route, ClipboardList,
  StickyNote, User,
} from 'lucide-react';
import { topTrips, latestTrips, destinations } from '../data/trips';

/* ===== Animated Counter Hook ===== */
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

import Logo from '../components/common/Logo';
import AIChatbot from '../components/chat/AIChatbot';

/* ===== Mock user ===== */
const defaultUser = { firstName: 'Henish', lastName: 'Patel', email: 'henish@example.com', mobile: '+91 98765 43210' };

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('traveloop_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likedTrips, setLikedTrips] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const totalTrips = useCounter(12);
  const budgetSpent = useCounter(18450);
  const distanceTravelled = useCounter(34000);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % topTrips.length), 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleLike = (id) => setLikedTrips((p) => ({ ...p, [id]: !p[id] }));
  const handleLogout = () => { setProfileOpen(false); navigate('/login'); };
  const firstLetter = user.firstName?.charAt(0)?.toUpperCase() || 'U';
  const saveProfile = () => { 
    setUser(editForm); 
    setEditMode(false); 
    localStorage.setItem('traveloop_user', JSON.stringify(editForm));
  };

  const allSearchableTrips = [...topTrips, ...latestTrips];
  const filteredTrips = searchQuery.trim()
    ? allSearchableTrips.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.activities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())))
    : [];

  /* Stats */
  const stats = [
    { label: 'Total Trips', value: totalTrips, icon: Plane, color: '#4F46E5', suffix: '' },
    { label: 'Budget Spent', value: budgetSpent, icon: DollarSign, color: '#06d6a0', suffix: '', prefix: '$' },
    { label: 'Distance', value: distanceTravelled, icon: Globe, color: '#F59E0B', suffix: ' km', format: true },
  ];

  /* Quick Nav */
  const quickNav = [
    { label: 'Create Trip', icon: Plus, route: '/create-trip', color: 'bg-[#4F46E5]' },
    { label: 'My Trips', icon: Map, route: '/my-trips', color: 'bg-[#00B4D8]' },
    { label: 'Itinerary', icon: Route, route: '/itinerary-builder', color: 'bg-[#8b5cf6]' },
    { label: 'Budget', icon: DollarSign, route: '/budget', color: 'bg-[#06d6a0]' },
    { label: 'Explore', icon: Compass, route: '/explore', color: 'bg-[#F59E0B]' },
    { label: 'Packing', icon: ClipboardList, route: '/packing', color: 'bg-[#ef4444]' },
    { label: 'Journal', icon: StickyNote, route: '/journal', color: 'bg-[#0ea5e9]' },
    { label: 'Saved', icon: Bookmark, route: '/saved', color: 'bg-[#d97706]' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ==================== HEADER ==================== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Profile */}
          <div className="relative shrink-0" ref={profileRef}>
            <button onClick={() => { setProfileOpen((p) => !p); setEditMode(false); }}
              className="w-10 h-10 rounded-full bg-[#4F46E5] text-white font-poppins font-bold text-sm flex items-center justify-center hover:bg-[#4338CA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:ring-offset-2">
              {firstLetter}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.15 }}
                  className="absolute left-0 top-14 w-80 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
                  <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] p-5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-bold font-poppins text-white">{firstLetter}</div>
                      <button onClick={() => setEditMode(!editMode)} className="text-white/70 hover:text-white transition-colors"><PenLine size={16} /></button>
                    </div>
                    <p className="font-poppins font-semibold text-white text-base mt-3">{user.firstName} {user.lastName}</p>
                    <p className="text-white/60 text-xs mt-0.5">{user.email}</p>
                  </div>
                  {editMode ? (
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="input-field text-xs py-2.5 pl-3" placeholder="First Name" />
                        <input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="input-field text-xs py-2.5 pl-3" placeholder="Last Name" />
                      </div>
                      <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-field text-xs py-2.5 pl-3" placeholder="Email" />
                      <input value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} className="input-field text-xs py-2.5 pl-3" placeholder="Phone" />
                      <div className="flex gap-2 pt-1">
                        <button onClick={saveProfile} className="flex-1 bg-[#4F46E5] text-white text-xs font-semibold rounded-full py-2.5 hover:bg-[#4338CA] transition-colors">Save</button>
                        <button onClick={() => { setEditMode(false); setEditForm(user); }} className="flex-1 border border-gray-200 text-gray-500 text-xs font-semibold rounded-full py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-1">
                      <div className="flex items-center gap-3 text-gray-500 text-sm py-2 px-2"><Phone size={15} className="text-gray-400" /><span>{user.mobile}</span></div>
                      <div className="flex items-center gap-3 text-gray-500 text-sm py-2 px-2"><Mail size={15} className="text-gray-400" /><span>{user.email}</span></div>
                      <hr className="border-gray-100 my-2" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-500 text-sm font-medium py-2.5 px-2 rounded-xl hover:bg-red-50 transition-colors"><LogOut size={15} /> Log Out</button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logo */}
          <div className="flex items-center shrink-0 cursor-pointer" onClick={() => navigate('/home')}>
            <Logo size="md" light={false} />
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)}
                placeholder="Search cities, activities..."
                className="w-full bg-gray-50 border border-gray-100 rounded-full py-2.5 pl-11 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all" />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>
              )}
            </div>
            <AnimatePresence>
              {searchOpen && searchQuery.trim() && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map((t) => (
                      <button key={t.id} onClick={() => { navigate(`/trip/${t.id}`); setSearchOpen(false); setSearchQuery(''); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                        <img src={t.image} alt={t.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{t.title}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} />{t.location}</p>
                        </div>
                        <span className="ml-auto text-xs font-semibold text-[#4F46E5] shrink-0">{t.price}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">No results for &quot;{searchQuery}&quot;</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"><User size={18} /></button>
          <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0">
            <div className="relative">
              <Bell size={18} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </div>
          </button>
        </div>
      </header>

      {/* ==================== MAIN ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* Quick Nav */}
        <section className="mt-6 mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickNav.map((item) => (
              <motion.button key={item.label} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(item.route)}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white`}><item.icon size={18} /></div>
                <span className="font-poppins text-sm font-semibold text-gray-800">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Animated Stats */}
        <section className="mb-8">
          <h2 className="font-poppins text-lg font-bold text-gray-900 mb-4">Dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden relative">
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: s.color }} />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '15' }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <TrendingUp size={16} className="text-green-400" />
                </div>
                <p className="font-poppins text-3xl font-bold text-gray-900">
                  {s.prefix || ''}{s.format ? s.value.toLocaleString() : s.value}{s.suffix}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Top Destinations Carousel */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-poppins text-lg font-bold text-gray-900">Top Destinations</h2>
              <p className="text-gray-400 text-xs mt-0.5">Handpicked experiences for you</p>
            </div>
            <div className="flex gap-1.5">
              {topTrips.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-[#4F46E5] w-6' : 'bg-gray-200 w-2'}`} />
              ))}
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] cursor-pointer" onClick={() => navigate(`/trip/${topTrips[currentSlide].id}`)}>
                <img src={topTrips[currentSlide].image} alt={topTrips[currentSlide].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full px-3 py-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" /> {topTrips[currentSlide].rating}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full px-3 py-1">
                      <Clock size={12} /> {topTrips[currentSlide].duration}
                    </span>
                  </div>
                  <h3 className="font-poppins text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">{topTrips[currentSlide].title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-sm flex items-center gap-1"><MapPin size={14} />{topTrips[currentSlide].location}</p>
                    <span className="font-poppins text-lg sm:text-xl font-bold text-white">{topTrips[currentSlide].price}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Latest Trips Grid */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-poppins text-lg font-bold text-gray-900">Latest Trips</h2>
              <p className="text-gray-400 text-xs mt-0.5">Explore fresh new adventures</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestTrips.map((trip, i) => (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                <div className="relative h-44 lg:h-48 cursor-pointer group overflow-hidden" onClick={() => navigate(`/trip/${trip.id}`)}>
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(trip.id); }}
                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform">
                    <Heart size={16} className={likedTrips[trip.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                  </button>
                  <div className="absolute top-3 right-3 bg-[#4F46E5] text-white text-xs font-semibold rounded-full px-3 py-1.5">{trip.price}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-poppins text-sm font-bold text-gray-900 leading-snug">{trip.title}</h3>
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5">
                      <Star size={11} className="fill-amber-500 text-amber-500" /> {trip.rating}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mb-2"><MapPin size={12} />{trip.location}</p>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">{trip.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-xs flex items-center gap-1"><Clock size={11} />{trip.duration}</span>
                    <button onClick={() => navigate(`/trip/${trip.id}`)} className="text-[#4F46E5] text-xs font-semibold hover:underline inline-flex items-center gap-0.5">
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating AI Chatbot */}
      <AIChatbot userName={user.firstName} />
    </div>
  );
}
