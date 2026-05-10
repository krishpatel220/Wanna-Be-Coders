import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star, Heart, Clock, Bookmark } from 'lucide-react';
import { topTrips, latestTrips } from '../data/trips';

export default function SavedScreen() {
  const navigate = useNavigate();
  // Mock: first 4 trips are "saved"
  const savedTrips = [...topTrips.slice(0, 2), ...latestTrips.slice(0, 2)];
  const [removed, setRemoved] = useState({});

  const displayedTrips = savedTrips.filter((t) => !removed[t.id]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-poppins text-lg font-bold text-gray-900">Saved Trips</h1>
          <span className="text-xs text-gray-400 ml-auto"><Bookmark size={12} className="inline mr-1" />{displayedTrips.length} saved</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {displayedTrips.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">No saved trips yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayedTrips.map((trip, i) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"
              >
                <div className="relative h-44 cursor-pointer group overflow-hidden" onClick={() => navigate(`/trip/${trip.id}`)}>
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={(e) => { e.stopPropagation(); setRemoved((p) => ({ ...p, [trip.id]: true })); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-poppins text-sm font-bold text-gray-900">{trip.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={11} />{trip.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-[#0077B6]">{trip.price}</span>
                    <span className="text-xs text-gray-300 flex items-center gap-1"><Clock size={11} />{trip.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
