import React, { useState, useEffect } from 'react';
import { Tag, Copy, Check } from 'lucide-react';

interface PromoSliderProps {
  onCopyCode: (code: string) => void;
}

const PROMO_SLIDES = [
  {
    id: 1,
    title: '🔥 ৫০% ছাড় প্রথম অর্ডারে!',
    subtitle: 'Get 50% discount up to ৳200 on your first food order across all restaurants in Dhaka.',
    code: 'WELCOME50',
    bg: 'from-[#ef0909] to-[#ff6b35]',
    emoji: '🍔',
  },
  {
    id: 2,
    title: '🛵 Free Delivery All Weekend!',
    subtitle: 'Zero delivery charges on all your favorite meals with minimum order of ৳250.',
    code: 'FREEWEEKEND',
    bg: 'from-[#6366f1] to-[#a855f7]',
    emoji: '🍕',
  },
  {
    id: 3,
    title: '🎉 30% Off Bestselling Menus',
    subtitle: 'Use voucher on Kacchi, Biriyani, Burgers & Kebabs to save up to ৳150 instantly.',
    code: 'BOGOFOOD',
    bg: 'from-[#059669] to-[#10b981]',
    emoji: '🍚',
  },
];

export const PromoSlider: React.FC<PromoSliderProps> = ({ onCopyCode }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    onCopyCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-sm">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIdx * 100}%)` }}
      >
        {PROMO_SLIDES.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full p-6 sm:p-8 bg-gradient-to-r ${slide.bg} text-white flex items-center justify-between relative overflow-hidden`}
          >
            <div className="relative z-10 max-w-xl space-y-2 sm:space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                Limited Time Promo
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">{slide.title}</h3>
              <p className="text-xs sm:text-sm text-white/90">{slide.subtitle}</p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleCopy(slide.code)}
                  className="px-4 py-2 rounded-xl bg-white/25 hover:bg-white text-white hover:text-gray-900 border border-white/40 font-mono font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{slide.code}</span>
                  {copiedCode === slide.code ? (
                    <Check className="w-3.5 h-3.5 text-green-300" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-75" />
                  )}
                </button>
                <span className="text-xs text-white/80 font-medium">Click to apply at checkout</span>
              </div>
            </div>

            {/* Giant decorative emoji */}
            <div className="hidden sm:block text-7xl lg:text-8xl opacity-30 select-none transform rotate-12 -mr-4 pointer-events-none">
              {slide.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {PROMO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentIdx === idx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
