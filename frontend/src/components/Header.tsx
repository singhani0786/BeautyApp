import React from 'react';
import { Sparkles, ShieldCheck, Database, ExternalLink } from 'lucide-react';
import { SourceStatusInfo } from '../types/api';

interface HeaderProps {
  sources: SourceStatusInfo[];
  onOpenMatrix: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sources, onOpenMatrix }) => {
  const configuredCount = sources.filter(s => s.is_configured).length;

  return (
    <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 flex items-center justify-center shadow-md shadow-rose-500/20 text-white">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl font-bold tracking-tight text-stone-900">
                GlowGuide <span className="text-rose-600">AI</span>
              </span>
              <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                India Edition
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Precision Undertone & Complexion Match with Real INR Pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Photo Persistence</span>
          </div>

          <button
            onClick={onOpenMatrix}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200 transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-stone-600" />
            <span>Retailer Matrix</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              configuredCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {configuredCount}/{sources.length} Live
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

