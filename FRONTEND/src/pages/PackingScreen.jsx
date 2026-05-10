import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Check, Shirt, Laptop, FileText, Heart, Pill, Package } from 'lucide-react';

const ICONS = { Clothes: Shirt, Electronics: Laptop, Documents: FileText, Essentials: Heart, Medicines: Pill };
const COLORS = { Clothes: '#0077B6', Electronics: '#8b5cf6', Documents: '#f59e0b', Essentials: '#06d6a0', Medicines: '#ef4444' };

const defaultItems = {
  Clothes: [
    { text: 'T-shirts (3)', done: true }, { text: 'Jeans (2)', done: false },
    { text: 'Jacket', done: false }, { text: 'Underwear', done: true }, { text: 'Swimwear', done: false },
  ],
  Electronics: [
    { text: 'Phone charger', done: true }, { text: 'Power bank', done: false },
    { text: 'Camera', done: false }, { text: 'Universal adapter', done: true },
  ],
  Documents: [
    { text: 'Passport', done: true }, { text: 'Visa copies', done: true },
    { text: 'Travel insurance', done: false }, { text: 'Hotel bookings', done: true },
  ],
  Essentials: [
    { text: 'Sunscreen', done: false }, { text: 'Toothbrush', done: true },
    { text: 'Sunglasses', done: false }, { text: 'Water bottle', done: false },
  ],
  Medicines: [
    { text: 'First aid kit', done: false }, { text: 'Motion sickness pills', done: false },
    { text: 'Prescribed meds', done: true },
  ],
};

export default function PackingScreen() {
  const navigate = useNavigate();
  const [items, setItems] = useState(defaultItems);
  const [newItem, setNewItem] = useState({});
  const categories = Object.keys(items);

  const toggle = (cat, i) => {
    setItems((p) => ({
      ...p,
      [cat]: p[cat].map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)),
    }));
  };

  const remove = (cat, i) => {
    setItems((p) => ({ ...p, [cat]: p[cat].filter((_, idx) => idx !== i) }));
  };

  const add = (cat) => {
    if (!newItem[cat]?.trim()) return;
    setItems((p) => ({ ...p, [cat]: [...p[cat], { text: newItem[cat], done: false }] }));
    setNewItem((p) => ({ ...p, [cat]: '' }));
  };

  const totalItems = categories.reduce((s, c) => s + items[c].length, 0);
  const doneItems = categories.reduce((s, c) => s + items[c].filter((i) => i.done).length, 0);
  const overallPct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="font-poppins text-lg font-bold text-gray-900">Packing Checklist</h1>
            <p className="text-xs text-gray-400">{doneItems}/{totalItems} packed</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#0077B6]">{overallPct}%</span>
            <div className="w-20 bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div animate={{ width: `${overallPct}%` }} className="h-full rounded-full bg-[#0077B6]" transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {categories.map((cat, ci) => {
          const catDone = items[cat].filter((i) => i.done).length;
          const catPct = items[cat].length ? Math.round((catDone / items[cat].length) * 100) : 0;
          const Icon = ICONS[cat] || Package;
          const color = COLORS[cat] || '#0077B6';

          return (
            <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="font-poppins text-sm font-bold text-gray-900 flex-1">{cat}</span>
                <span className="text-xs font-semibold" style={{ color }}>{catPct}%</span>
                <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div animate={{ width: `${catPct}%` }} className="h-full rounded-full" style={{ backgroundColor: color }} transition={{ duration: 0.5 }} />
                </div>
              </div>

              {/* Items */}
              <div className="p-3 space-y-1">
                <AnimatePresence>
                  {items[cat].map((item, i) => (
                    <motion.div key={item.text + i} exit={{ opacity: 0, x: -20 }} layout
                      className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-gray-50 transition-colors group">
                      <button onClick={() => toggle(cat, i)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                          item.done ? 'border-transparent' : 'border-gray-200 hover:border-gray-300'
                        }`} style={item.done ? { backgroundColor: color } : {}}>
                        {item.done && <Check size={13} className="text-white" />}
                      </button>
                      <span className={`text-sm flex-1 ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.text}</span>
                      <button onClick={() => remove(cat, i)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add item */}
                <div className="flex gap-2 pt-2">
                  <input value={newItem[cat] || ''} onChange={(e) => setNewItem((p) => ({ ...p, [cat]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && add(cat)}
                    placeholder={`Add ${cat.toLowerCase()} item...`}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-lg py-2 px-3 text-xs text-gray-700 outline-none focus:border-gray-200 transition-all" />
                  <button onClick={() => add(cat)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors" style={{ backgroundColor: color }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}
