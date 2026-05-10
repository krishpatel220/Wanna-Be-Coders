import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Heart, DollarSign, Filter } from 'lucide-react';
import { destinations } from '../data/trips';

const CATS = ['All', 'Sightseeing', 'Adventure', 'Beach', 'Food Tour', 'Shopping', 'Nightlife', 'Wellness'];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [liked, setLiked] = useState({});
  const [category, setCategory] = useState('All');

  const filtered = destinations.filter((d) => {
    const matchSearch = !query.trim() ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'All' || d.activities.some((a) => a.category === category);
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"><ArrowLeft size={18} /></button>
          <div className="flex-1">
            <h1 className="font-poppins text-lg font-bold text-gray-900">Explore</h1>
            <p className="text-xs text-gray-400">{destinations.length} destinations worldwide</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Search + Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-700 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all shadow-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  category === c ? 'bg-[#4F46E5] text-white' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer group"
              onClick={() => navigate(`/trip/${d.id}`)}>
              <div className="relative h-44 overflow-hidden">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button onClick={(e) => { e.stopPropagation(); setLiked((p) => ({ ...p, [d.id]: !p[d.id] })); }}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                  <Heart size={16} className={liked[d.id] ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
                </button>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-[#4F46E5] rounded-full px-2.5 py-1">
                    ${d.budgetEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-poppins text-sm font-bold text-gray-900">{d.name}</h3>
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-amber-600">
                    <Star size={11} className="fill-amber-500 text-amber-500" /> {d.rating}
                  </span>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-2"><MapPin size={11} />{d.country}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{d.description}</p>
                <div className="flex flex-wrap gap-1">
                  {d.activities.slice(0, 3).map((a) => (
                    <span key={a.name} className="text-[9px] font-medium bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{a.category}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
