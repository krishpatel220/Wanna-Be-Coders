import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, MapPin, Calendar,
  Clock, FileText, Eye, Send, GripVertical,
} from 'lucide-react';
import Button from '../components/common/Button';

const EMPTY_STOP = { city: '', country: '', startDate: '', endDate: '', activities: [''], notes: '' };

export default function ItineraryBuilderScreen() {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState('European Adventure');
  const [stops, setStops] = useState([
    { city: 'Paris', country: 'France', startDate: '2026-07-01', endDate: '2026-07-03', activities: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise'], notes: 'Book skip-the-line tickets' },
    { city: 'Rome', country: 'Italy', startDate: '2026-07-04', endDate: '2026-07-06', activities: ['Colosseum', 'Vatican City', 'Trevi Fountain'], notes: 'Try authentic pasta near Trastevere' },
    { city: 'Barcelona', country: 'Spain', startDate: '2026-07-07', endDate: '2026-07-09', activities: ['Sagrada Familia', 'Park Güell', 'La Rambla Walk'], notes: '' },
  ]);

  const addStop = () => setStops((p) => [...p, { ...EMPTY_STOP, activities: [''] }]);
  const removeStop = (i) => setStops((p) => p.filter((_, idx) => idx !== i));

  const updateStop = (i, field, val) => {
    setStops((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const moveStop = (i, dir) => {
    const next = i + dir;
    if (next < 0 || next >= stops.length) return;
    setStops((p) => {
      const arr = [...p];
      [arr[i], arr[next]] = [arr[next], arr[i]];
      return arr;
    });
  };

  const addActivity = (si) => {
    setStops((p) => p.map((s, i) => (i === si ? { ...s, activities: [...s.activities, ''] } : s)));
  };
  const removeActivity = (si, ai) => {
    setStops((p) => p.map((s, i) => (i === si ? { ...s, activities: s.activities.filter((_, j) => j !== ai) } : s)));
  };
  const updateActivity = (si, ai, val) => {
    setStops((p) => p.map((s, i) => (i === si ? { ...s, activities: s.activities.map((a, j) => (j === ai ? val : a)) } : s)));
  };

  // Generate day-wise plan
  const getDays = (stop) => {
    if (!stop.startDate || !stop.endDate) return [];
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const totalDays = stops.reduce((sum, s) => sum + Math.max(getDays(s).length, 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-poppins text-lg font-bold text-gray-900">Itinerary Builder</h1>
              <p className="text-xs text-gray-400">{stops.length} stops · {totalDays} days</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => navigate('/itinerary-view')} className="text-xs px-5 py-2.5">
            <Eye size={14} /> Preview
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Trip Name */}
        <div className="mb-8">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Trip Name</label>
          <input value={tripName} onChange={(e) => setTripName(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-lg font-poppins font-bold text-gray-900 outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/10 transition-all" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#0077B6] via-[#00B4D8] to-[#06d6a0] hidden sm:block" />

          <AnimatePresence>
            {stops.map((stop, si) => (
              <motion.div
                key={si}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: si * 0.05 }}
                className="relative mb-6 sm:pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full bg-[#0077B6] border-4 border-white shadow-md z-10 hidden sm:flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{si + 1}</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                  {/* Stop Header */}
                  <div className="bg-gradient-to-r from-[#f0f9ff] to-white p-4 flex items-center gap-3 border-b border-gray-50">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveStop(si, -1)} disabled={si === 0}
                        className="text-gray-300 hover:text-[#0077B6] disabled:opacity-30 transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => moveStop(si, 1)} disabled={si === stops.length - 1}
                        className="text-gray-300 hover:text-[#0077B6] disabled:opacity-30 transition-colors"><ChevronDown size={14} /></button>
                    </div>
                    <GripVertical size={16} className="text-gray-300" />
                    <span className="text-xs font-bold text-[#0077B6] bg-[#e0f2fe] rounded-full px-2.5 py-0.5">Stop {si + 1}</span>
                    <span className="text-sm font-poppins font-bold text-gray-800 flex-1 truncate">
                      {stop.city || 'New Stop'}{stop.country ? `, ${stop.country}` : ''}
                    </span>
                    {stops.length > 1 && (
                      <button onClick={() => removeStop(si)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* Stop Body */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={stop.city} onChange={(e) => updateStop(si, 'city', e.target.value)}
                          placeholder="City" className="input-field text-xs py-2.5" />
                      </div>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={stop.country} onChange={(e) => updateStop(si, 'country', e.target.value)}
                          placeholder="Country" className="input-field text-xs py-2.5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" value={stop.startDate} onChange={(e) => updateStop(si, 'startDate', e.target.value)}
                          className="input-field text-xs py-2.5" />
                      </div>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="date" value={stop.endDate} onChange={(e) => updateStop(si, 'endDate', e.target.value)}
                          className="input-field text-xs py-2.5" />
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Activities</span>
                        <button onClick={() => addActivity(si)} className="text-[#0077B6] text-[10px] font-semibold flex items-center gap-0.5 hover:underline">
                          <Plus size={11} /> Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stop.activities.map((a, ai) => (
                          <div key={ai} className="flex items-center gap-1 bg-[#f0f9ff] rounded-full pl-3 pr-1.5 py-1.5">
                            <input value={a} onChange={(e) => updateActivity(si, ai, e.target.value)}
                              placeholder="Activity" className="bg-transparent text-xs text-gray-700 outline-none w-24 min-w-0" />
                            {stop.activities.length > 1 && (
                              <button onClick={() => removeActivity(si, ai)} className="text-gray-300 hover:text-red-400 transition-colors">
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="relative">
                      <FileText size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <textarea value={stop.notes} onChange={(e) => updateStop(si, 'notes', e.target.value)}
                        placeholder="Notes & reminders..." rows={2}
                        className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-700 outline-none focus:border-[#0077B6] transition-all resize-none" />
                    </div>

                    {/* Day-wise Plan */}
                    {getDays(stop).length > 0 && (
                      <div className="bg-[#fafbfc] rounded-xl p-3 border border-gray-50">
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Day-wise Plan</span>
                        <div className="space-y-1.5">
                          {getDays(stop).map((day, di) => (
                            <div key={di} className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-[#0077B6] bg-[#e0f2fe] rounded-md px-2 py-0.5 w-14 text-center shrink-0">
                                Day {di + 1}
                              </span>
                              <span className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              <span className="text-xs text-gray-400 ml-auto">
                                {di === 0 ? `Arrive in ${stop.city}` : di === getDays(stop).length - 1 ? 'Departure' : stop.activities[di - 1] || 'Free day'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Route connector */}
                {si < stops.length - 1 && (
                  <div className="flex items-center justify-center py-2 sm:ml-[-2.5rem]">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Send size={12} className="text-[#00B4D8] rotate-90" />
                      <span>Travel to next stop</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Stop */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={addStop}
          className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-5 flex items-center justify-center gap-2 text-gray-400 hover:border-[#0077B6] hover:text-[#0077B6] transition-colors mt-4"
        >
          <Plus size={18} /> Add Stop
        </motion.button>

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-8 pb-8">
          <Button variant="secondary" onClick={() => navigate('/home')} className="flex-1 py-3.5 text-xs">
            Save Draft
          </Button>
          <Button variant="primary" onClick={() => navigate('/itinerary-view')} className="flex-1 py-3.5 text-xs">
            <Eye size={14} /> Preview Itinerary
          </Button>
        </div>
      </main>
    </div>
  );
}
