import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Hotel, Utensils, Car, Ticket, TrendingDown, TrendingUp } from 'lucide-react';

const budget = {
  total: 350000, spent: 245000, remaining: 105000,
  categories: [
    { label: 'Hotels', icon: Hotel, amount: 120000, color: '#0077B6', pct: 49 },
    { label: 'Food', icon: Utensils, amount: 50000, color: '#06d6a0', pct: 20 },
    { label: 'Transport', icon: Car, amount: 30000, color: '#f59e0b', pct: 12 },
    { label: 'Activities', icon: Ticket, amount: 45000, color: '#8b5cf6', pct: 18 },
  ],
  perCity: [
    { city: 'Paris', total: 95000, color: '#0077B6' },
    { city: 'Rome', total: 85000, color: '#00B4D8' },
    { city: 'Barcelona', total: 65000, color: '#06d6a0' },
  ],
};

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function BudgetScreen() {
  const navigate = useNavigate();
  const spentPct = Math.round((budget.spent / budget.total) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-poppins text-lg font-bold text-gray-900">Budget & Costs</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Budget', val: fmt(budget.total), icon: DollarSign, color: '#0077B6', trend: null },
            { label: 'Spent', val: fmt(budget.spent), icon: TrendingDown, color: '#ef4444', trend: `${spentPct}%` },
            { label: 'Remaining', val: fmt(budget.remaining), icon: TrendingUp, color: '#06d6a0', trend: `${100 - spentPct}%` },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: c.color + '15' }}>
                <c.icon size={17} style={{ color: c.color }} />
              </div>
              <p className="font-poppins text-lg sm:text-xl font-bold text-gray-900">{c.val}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-gray-400">{c.label}</span>
                {c.trend && <span className="text-[10px] font-bold ml-auto" style={{ color: c.color }}>{c.trend}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-poppins text-base font-bold text-gray-900 mb-5">Spending Breakdown</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* CSS Donut */}
            <div className="relative w-40 h-40 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  return budget.categories.map((cat, i) => {
                    const dash = cat.pct;
                    const gap = 100 - dash;
                    const el = (
                      <circle key={i} cx="18" cy="18" r="15.9" fill="none" strokeWidth="3.5"
                        stroke={cat.color} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
                        className="transition-all duration-700" />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-poppins text-lg font-bold text-gray-900">{spentPct}%</span>
                <span className="text-[10px] text-gray-400">Spent</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3 w-full">
              {budget.categories.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: cat.color + '15' }}>
                    <cat.icon size={14} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                      <span className="text-xs font-bold text-gray-900">{fmt(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cat.pct}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                        className="h-full rounded-full" style={{ backgroundColor: cat.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cost per City */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-poppins text-base font-bold text-gray-900 mb-4">Cost per Destination</h3>
          <div className="space-y-4">
            {budget.perCity.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-800">{c.city}</span>
                  <span className="text-sm font-bold" style={{ color: c.color }}>{fmt(c.total)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((c.total / budget.total) * 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    className="h-full rounded-full" style={{ backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
