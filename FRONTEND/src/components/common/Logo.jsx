import { Send } from 'lucide-react';

export default function Logo({ size = 'md', light = false, showIcon = true }) {
  // size can be 'sm', 'md', 'lg', 'xl'
  const sizes = {
    sm: { icon: 16, text: 'text-lg', spacing: 'gap-1.5' },
    md: { icon: 20, text: 'text-2xl', spacing: 'gap-2' },
    lg: { icon: 28, text: 'text-4xl', spacing: 'gap-3' },
    xl: { icon: 36, text: 'text-5xl', spacing: 'gap-4' },
  };

  const { icon, text, spacing } = sizes[size];
  const color = light ? 'text-white' : 'text-[#4F46E5]';

  return (
    <div className={`flex items-center ${spacing}`}>
      {showIcon && (
        <div className={`shrink-0 flex items-center justify-center ${light ? 'bg-white/10' : 'bg-[#4F46E5]/10'} rounded-xl p-2`}>
          <Send size={icon} className={color} />
        </div>
      )}
      <div className={`font-poppins font-bold tracking-tighter flex items-center ${text} ${color}`}>
        <span>travel</span>
      </div>
    </div>
  );
}
