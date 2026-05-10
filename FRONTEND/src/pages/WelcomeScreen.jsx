import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0077B6] flex flex-col lg:flex-row">
      {/* Brand Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative z-10 flex flex-col items-center"
        >
          <Logo size="xl" light={true} />
          <p className="text-white/80 mt-4 text-center max-w-sm text-sm leading-relaxed">
            Your personalized travel companion for unforgettable journeys.
          </p>
        </motion.div>
      </div>

      {/* Action Section */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
        className="bg-white flex-1 lg:flex-none w-full lg:w-1/2 rounded-t-[40px] lg:rounded-t-none lg:rounded-l-[48px] px-8 pt-10 pb-12 flex flex-col items-center justify-center shadow-[0_-8px_40px_rgba(0,0,0,0.1)] lg:shadow-[-8px_0_40px_rgba(0,0,0,0.1)]"
      >
        <div className="w-full max-w-sm flex flex-col items-center">
          <h2 className="font-poppins text-xl font-bold text-gray-900 mb-2 text-center">Get Started</h2>
          <p className="text-gray-400 text-sm mb-8 text-center">Plan smarter. Travel better.</p>

        <div className="w-full max-w-xs space-y-3">
          <Button variant="primary" onClick={() => navigate('/login')} className="w-full py-4 text-sm">
            LOGIN
          </Button>
          <Button variant="secondary" onClick={() => navigate('/signup')} className="w-full py-4 text-sm">
            SIGN UP
          </Button>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
