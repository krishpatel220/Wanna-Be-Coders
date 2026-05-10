import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowRight, ArrowLeft } from 'lucide-react';
import { slides } from './slides';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
};

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) { setDirection(1); setCurrent((p) => p + 1); }
    else navigate('/welcome');
  };

  const goPrev = () => {
    if (current > 0) { setDirection(-1); setCurrent((p) => p - 1); }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-6 px-6 sm:px-10 overflow-hidden">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 lg:mb-10 pt-4">
        <Logo size="md" light={false} />
        <button onClick={() => navigate('/welcome')} className="text-gray-400 hover:text-[#4F46E5] text-sm font-medium transition-colors">
          Skip
        </button>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col justify-center">
        {/* Image Panel */}
        <div className="w-full relative h-[30vh] min-h-[250px] max-h-[400px] rounded-3xl overflow-hidden shadow-xl mb-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={slide.id}
              custom={direction}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full"
            >
              <h2 className="font-poppins text-2xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-gray-500 text-sm lg:text-lg leading-relaxed max-w-xl mx-auto mb-10">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Footer: Dots + Navigation */}
          <div className="w-full mt-auto pb-4">
            <div className="flex justify-center gap-2 mb-10">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current ? 'bg-[#4F46E5] w-8' : 'bg-gray-200 w-2'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              {current > 0 ? (
                <button
                  onClick={goPrev}
                  className="w-14 h-14 rounded-full border-2 border-gray-100 text-gray-400 flex items-center justify-center hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors bg-white shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : <div className="w-14" />}

              <Button variant="primary" onClick={goNext} className="px-10 py-4 text-base rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-[#4F46E5] hover:bg-[#4338CA]">
                {current === slides.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight size={18} className="ml-2 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
