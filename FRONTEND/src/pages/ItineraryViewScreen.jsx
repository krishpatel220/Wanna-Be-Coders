import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Clock, Star, DollarSign, Globe,
  Plane, Share2, PenLine, Printer,
} from 'lucide-react';
import Button from '../components/common/Button';

/* Mock itinerary data */
const itinerary = {
  name: 'European Adventure',
  totalDays: 9,
  totalBudget: '₹3,50,000',
  destinations: 3,
  stops: [
    { city: 'Paris', country: 'France', dates: 'Jul 1 – Jul 3', days: [
      { day: 1, label: 'Arrival in Paris', desc: 'Check into hotel near Champs-Élysées, evening walk along Seine', icon: Plane },
      { day: 2, label: 'Eiffel Tower + Louvre', desc: 'Morning visit to Eiffel Tower, afternoon at Louvre Museum', icon: Star },
      { day: 3, label: 'Seine Cruise & Departure', desc: 'Morning cruise, afternoon travel to Rome', icon: Globe },
    ]},
    { city: 'Rome', country: 'Italy', dates: 'Jul 4 – Jul 6', days: [
      { day: 4, label: 'Arrive in Rome', desc: 'Settle in near Trastevere, explore local cuisine', icon: Plane },
      { day: 5, label: 'Colosseum + Vatican', desc: 'Full day heritage tour: Colosseum, Forum, Vatican City', icon: Star },
      { day: 6, label: 'Trevi Fountain & Depart', desc: 'Visit Trevi Fountain, Spanish Steps, train to Barcelona', icon: Globe },
    ]},
    { city: 'Barcelona', country: 'Spain', dates: 'Jul 7 – Jul 9', days: [
      { day: 7, label: 'Arrive in Barcelona', desc: 'Check in, walk along La Rambla, tapas dinner', icon: Plane },
      { day: 8, label: 'Sagrada Familia + Park Güell', desc: 'Gaudí masterpieces tour, beach evening', icon: Star },
      { day: 9, label: 'Final Day & Return', desc: 'Morning at Barceloneta Beach, airport transfer', icon: Globe },
    ]},
  ],
};

const budgetSplit = [
  { label: 'Hotels', amount: '₹1,20,000', pct: 34 },
  { label: 'Flights', amount: '₹95,000', pct: 27 },
  { label: 'Activities', amount: '₹55,000', pct: 16 },
  { label: 'Food', amount: '₹50,000', pct: 14 },
  { label: 'Transport', amount: '₹30,000', pct: 9 },
];

export default function ItineraryViewScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] print:bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-poppins text-lg font-bold text-gray-900">Itinerary Preview</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <Printer size={16} />
            </button>
            <Button variant="primary" onClick={() => navigate('/itinerary-builder')} className="text-xs px-4 py-2.5">
              <PenLine size={14} /> Edit
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-3xl p-6 sm:p-8 text-white mb-8"
        >
          <h2 className="font-poppins text-2xl sm:text-3xl font-bold mb-1">{itinerary.name}</h2>
          <p className="text-white/60 text-sm mb-6">Your complete travel plan</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock size={18} className="mx-auto mb-1 text-white/70" />
              <p className="font-poppins text-xl font-bold">{itinerary.totalDays}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Days</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <MapPin size={18} className="mx-auto mb-1 text-white/70" />
              <p className="font-poppins text-xl font-bold">{itinerary.destinations}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Cities</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <DollarSign size={18} className="mx-auto mb-1 text-white/70" />
              <p className="font-poppins text-lg font-bold">{itinerary.totalBudget}</p>
              <p className="text-[10px] text-white/60 uppercase tracking-wider">Budget</p>
            </div>
          </div>
        </motion.div>

        {/* Route Overview */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {itinerary.stops.map((s, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 shadow-sm">
                <p className="text-xs font-bold text-gray-800">{s.city}</p>
                <p className="text-[10px] text-gray-400">{s.dates}</p>
              </div>
              {i < itinerary.stops.length - 1 && (
                <div className="flex items-center gap-1 text-gray-300">
                  <div className="w-6 h-px bg-gray-200" />
                  <Plane size={12} className="text-[#00B4D8]" />
                  <div className="w-6 h-px bg-gray-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0077B6] via-[#00B4D8] to-[#06d6a0]" />

          {itinerary.stops.map((stop, si) => (
            <div key={si} className="mb-8">
              {/* City Header */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-14 mb-4"
              >
                <div className="absolute left-3 top-1 w-5 h-5 rounded-full bg-[#0077B6] border-4 border-white shadow-md flex items-center justify-center">
                  <MapPin size={8} className="text-white" />
                </div>
                <div>
                  <h3 className="font-poppins text-lg font-bold text-gray-900">{stop.city}, {stop.country}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} /> {stop.dates}</p>
                </div>
              </motion.div>

              {/* Days */}
              {stop.days.map((day, di) => (
                <motion.div
                  key={di}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: di * 0.05 }}
                  className="relative pl-14 mb-3"
                >
                  <div className="absolute left-[18px] top-4 w-2.5 h-2.5 rounded-full bg-[#e0f2fe] border-2 border-[#00B4D8]" />
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] flex items-center justify-center shrink-0">
                        <day.icon size={14} className="text-[#0077B6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-[#0077B6] bg-[#e0f2fe] rounded-md px-2 py-0.5">Day {day.day}</span>
                          <h4 className="text-sm font-semibold text-gray-800 truncate">{day.label}</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{day.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Budget Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mt-4 mb-8"
        >
          <h3 className="font-poppins text-base font-bold text-gray-900 mb-4">Budget Breakdown</h3>
          <div className="space-y-3">
            {budgetSplit.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 shrink-0">{b.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${b.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8]"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-20 text-right shrink-0">{b.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3 pb-8 print:hidden">
          <Button variant="secondary" onClick={() => navigate('/itinerary-builder')} className="flex-1 py-3.5 text-xs">
            <PenLine size={14} /> Edit
          </Button>
          <Button variant="primary" className="flex-1 py-3.5 text-xs">
            <Share2 size={14} /> Share Trip
          </Button>
        </div>
      </main>
    </div>
  );
}
