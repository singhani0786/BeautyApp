import React from 'react';
import { Camera, Heart, Sparkles } from 'lucide-react';

interface StudioHeaderProps {
  activeTab: 'studio' | 'how-it-works';
  onTabChange: (tab: 'studio' | 'how-it-works') => void;
  shortlistCount: number;
  onOpenShortlist: () => void;
  onOpenPhotoModal: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  activeTab,
  onTabChange,
  shortlistCount,
  onOpenShortlist,
  onOpenPhotoModal,
}) => {
  return (
    <header className="w-full border-b border-rose-100/80 bg-white/75 backdrop-blur-md sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-rose-500 text-base font-bold animate-pulse-subtle">✨</span>
          <span className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#2D2529]">
            glowguide<span className="text-rose-500">.</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 ml-1">
            Studio 💖
          </span>
        </div>

        {/* Center Studio Navigation Tabs */}
        <nav className="flex items-center gap-6 sm:gap-10">
          <button
            onClick={() => onTabChange('studio')}
            className={`text-xs sm:text-sm font-medium tracking-wide py-1.5 transition-all relative ${
              activeTab === 'studio'
                ? 'text-rose-950 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-gradient-to-r after:from-rose-500 after:to-pink-500 after:rounded-full'
                : 'text-stone-500 hover:text-rose-700'
            }`}
          >
            Match studio
          </button>
          <button
            onClick={() => onTabChange('how-it-works')}
            className={`text-xs sm:text-sm font-medium tracking-wide py-1.5 transition-all relative ${
              activeTab === 'how-it-works'
                ? 'text-rose-950 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-gradient-to-r after:from-rose-500 after:to-pink-500 after:rounded-full'
                : 'text-stone-500 hover:text-rose-700'
            }`}
          >
            How it works
          </button>
        </nav>

        {/* Right Actions: Shortlist & Prominent "Click Pic" Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenShortlist}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border border-rose-200/70 hover:border-rose-300 bg-white/90 text-xs text-stone-700 font-medium transition-all shadow-2xs hover:shadow-xs hover:bg-rose-50/40"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${shortlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">Shortlist</span>
            <span className={`font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${
              shortlistCount > 0 ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
            }`}>
              {shortlistCount}
            </span>
          </button>

          {/* Prominent "Click Pic" CTA Button */}
          <button
            onClick={onOpenPhotoModal}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold shadow-sm shadow-rose-200/80 hover:shadow-md hover:shadow-rose-300 transition-all active:scale-95 group"
            title="Click selfie or upload photo"
          >
            <Camera className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
            <span>Click Pic ✨</span>
          </button>
        </div>

      </div>
    </header>
  );
};
