import React from 'react';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  detectedTone?: string;
  detectedUndertone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  detectedTone,
  detectedUndertone,
}) => {
  return (
    <header className="border-b border-rose-100/60 bg-white/85 backdrop-blur-xl sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Editorial Title */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 flex items-center justify-center shadow-lg shadow-rose-500/25 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl font-black tracking-tight text-stone-900">
                GlowGuide <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200/80 shadow-2xs">
                Luxury Edition
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              Precision AI Undertone Matching with Verified Store Pricing
            </p>
          </div>
        </div>

        {/* Right Action Elements: Privacy Trust Badge + User Profile / Sign In */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-600 bg-stone-50/90 hover:bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200/60 shadow-2xs transition-all">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">100% In-Memory Privacy</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-800 bg-rose-50/80 px-3 py-1.5 rounded-full border border-rose-200/60 font-semibold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Live Store Verified</span>
          </div>

          <UserMenu
            detectedTone={detectedTone}
            detectedUndertone={detectedUndertone}
          />
        </div>

      </div>
    </header>
  );
};
