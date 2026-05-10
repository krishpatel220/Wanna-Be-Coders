import { clsx } from 'clsx';

/**
 * Reusable Button — Professional pill-shaped buttons
 * Variants: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({ children, variant = 'primary', className = '', onClick, ...props }) {
  const base =
    'font-inter font-semibold rounded-full transition-all duration-200 ease-out cursor-pointer inline-flex items-center justify-center gap-2 text-sm leading-none select-none';

  const variants = {
    primary:
      'bg-[#4F46E5] text-white px-7 py-3.5 shadow-[0_4px_16px_rgba(79,70,229,0.3)] hover:bg-[#4338CA] hover:shadow-[0_6px_20px_rgba(79,70,229,0.35)] active:scale-[0.97]',
    secondary:
      'border-[1.5px] border-[#4F46E5] text-[#4F46E5] bg-white px-7 py-3 hover:bg-[#EEF2FF] active:scale-[0.97]',
    ghost:
      'text-[#4F46E5] hover:bg-[#EEF2FF] px-5 py-2.5',
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
