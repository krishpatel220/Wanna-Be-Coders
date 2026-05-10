import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Tag, Clock, ChevronRight, Gift } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Early Bird Special: Bali Summer Retreat',
    description: 'Book now for the upcoming summer season and get a flat 20% off on the entire package including flights.',
    discount: '20% OFF',
    validUntil: 'Valid for 3 days',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80',
    type: 'special',
  },
  {
    id: 2,
    title: 'Last Minute Deal: Swiss Alps Adventure',
    description: 'Pack your bags! We have 2 spots left for next week’s Swiss Alps trek. Save $500 if you book today.',
    discount: 'SAVE $500',
    validUntil: 'Ends tonight',
    image: 'https://images.unsplash.com/photo-1531366936337-778550c20f79?auto=format&fit=crop&q=80',
    type: 'urgent',
  },
  {
    id: 3,
    title: 'Weekend Getaway: Paris City Tours',
    description: 'Planning a romantic weekend? Buy 1 get 1 free on all guided Paris city tours this month.',
    discount: 'BUY 1 GET 1',
    validUntil: 'Valid this month',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80',
    type: 'offer',
  },
  {
    id: 4,
    title: 'Luxury Upgrade: Tokyo Cherry Blossom',
    description: 'Book the Tokyo Spring package and receive a complimentary upgrade to a 5-star hotel suite.',
    discount: 'FREE UPGRADE',
    validUntil: 'Limited availability',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80',
    type: 'premium',
  },
  {
    id: 5,
    title: 'Group Discount: Santorini Island Hopper',
    description: 'Traveling with friends? Get an extra 15% discount when you book for a group of 4 or more people.',
    discount: '15% OFF',
    validUntil: 'Ongoing offer',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80',
    type: 'group',
  },
  {
    id: 6,
    title: 'Flash Sale: New York City Explorer',
    description: 'Unlock the magic of the Big Apple. The first 50 bookings today get the NYC Explorer pass at half price.',
    discount: '50% OFF PASS',
    validUntil: 'Only 12 left',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
    type: 'urgent',
  }
];

export default function NotificationsScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#4F46E5]" />
            <h1 className="font-poppins font-bold text-gray-900 text-lg">Notifications & Offers</h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-poppins text-xl font-bold text-gray-900">Latest Offers</h2>
          <span className="bg-[#4F46E5]/10 text-[#4F46E5] text-xs font-bold px-3 py-1 rounded-full">
            {offers.length} New
          </span>
        </div>

        <div className="space-y-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col sm:flex-row gap-5"
            >
              {/* Image */}
              <div className="relative w-full sm:w-32 h-40 sm:h-auto rounded-xl overflow-hidden shrink-0">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <Tag size={10} /> {offer.discount}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-poppins text-base font-bold text-gray-900 leading-snug">{offer.title}</h3>
                  <button className="text-gray-300 hover:text-[#4F46E5] transition-colors shrink-0 sm:hidden lg:block">
                    <ChevronRight size={18} />
                  </button>
                </div>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {offer.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-xs font-semibold flex items-center gap-1 ${offer.type === 'urgent' ? 'text-orange-500' : 'text-gray-400'}`}>
                    <Clock size={12} /> {offer.validUntil}
                  </span>
                  
                  <button className="bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-colors text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5">
                    <Gift size={14} /> Claim Offer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
