import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface StudioHeaderProps {
  activeTab: 'studio' | 'how-it-works';
  onTabChange: (tab: 'studio' | 'how-it-works') => void;
  shortlistCount: number;
  onOpenShortlist: () => void;
  detectedTone?: string;
  detectedUndertone?: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  onTabChange,
  shortlistCount,
  onOpenShortlist,
  detectedTone,
  detectedUndertone,
}) => {
  return (
    <header className="w-full border-b border-[#E8E2D9] bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-[#4A6953] text-lg font-bold">✦</span>
          <span className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#2D2825]">
            glowguide<span className="text-[#4A6953]">.</span>
          </span>
        </div>

        {/* Center Studio Navigation Tabs */}
        <nav className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => onTabChange('studio')}
            className={`text-xs sm:text-sm font-medium tracking-wide py-1.5 transition-all relative ${
              activeTab === 'studio'
                ? 'text-[#2D2825] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2D2825]'
                : 'text-stone-500 hover:text-[#2D2825]'
            }`}
          >
            Match studio
          </button>
          <button
            onClick={() => onTabChange('how-it-works')}
            className={`text-xs sm:text-sm font-medium tracking-wide py-1.5 transition-all relative ${
              activeTab === 'how-it-works'
                ? 'text-[#2D2825] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2D2825]'
                : 'text-stone-500 hover:text-[#2D2825]'
            }`}
          >
            How it works
          </button>
        </nav>

        {/* Right Wishlist / Shortlist & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenShortlist}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D9D1C5] hover:border-[#4A6953] bg-white/70 text-xs text-[#2D2825] font-medium transition-all shadow-2xs hover:shadow-xs"
          >
            <Heart className={`w-3.5 h-3.5 ${shortlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
            <span className="hidden sm:inline">Shortlist</span>
            <span className="bg-[#EBF1EC] text-[#3D5644] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {shortlistCount}
            </span>
          </button>

          <UserMenu
            detectedTone={detectedTone}
            detectedUndertone={detectedUndertone}
          />
        </div>

      </div>
    </header>
  );
};
