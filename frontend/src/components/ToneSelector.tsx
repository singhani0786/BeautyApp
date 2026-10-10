import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { FaceAnalysisResult } from '../types/api';

interface ToneSelectorProps {
  undertone: string;
  skinDepth: string;
  skinType: string;
  setSkinType: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  budgetInr: number | null;
  setBudgetInr: (val: number | null) => void;
  onFetchRecommendations: () => void;
  isLoading: boolean;
  faceAnalysis: FaceAnalysisResult | null;
}

const CATEGORIES = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'concealer', label: 'Concealer' },
  { id: 'lipstick', label: 'Lipstick' },
  { id: 'blush', label: 'Blush' },
  { id: 'compact', label: 'Compact Powder' },
  { id: 'all', label: 'All Categories' },
];

const QUICK_BUDGETS = [500, 1000, 1500, 2500, 4000];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  undertone,
  skinDepth,
  skinType,
  setSkinType,
  category,
  setCategory,
  budgetInr,
  setBudgetInr,
  onFetchRecommendations,
  isLoading,
  faceAnalysis,
}) => {
  const isNoBudgetLimit = budgetInr === null || budgetInr <= 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
      {/* Automated Face Lock Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: faceAnalysis?.dominant_hex || '#DFA975' }}
          >
            <Sparkles className="w-5 h-5 text-white/90 drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Face Shade Auto-Locked
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                AI Precision Match
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 capitalize">
              {skinDepth} Skin Depth • {undertone} Undertone
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Shades are automatically calibrated from your face. You do not need to guess or select any shade manually.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 bg-white/80 px-3.5 py-2 rounded-xl border border-stone-200/60 shadow-2xs self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Showing only shades tailored for you</span>
        </div>
      </div>

      {/* Category selector */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            What product are you looking for?
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                // Trigger immediate update
                setTimeout(onFetchRecommendations, 50);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                category === cat.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Selector */}
      <div className="bg-stone-50/90 rounded-2xl p-5 border border-stone-200/80 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
              Shopping Budget (INR)
            </label>
            <p className="text-[11px] text-stone-500">
              Set an optional maximum price limit, or view all price tiers.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isNoBudgetLimit}
              onChange={e => {
                setBudgetInr(e.target.checked ? null : 1500);
                setTimeout(onFetchRecommendations, 50);
              }}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-stone-300"
            />
            <span className="text-xs font-semibold text-stone-700">No Budget Limit</span>
          </label>
        </div>

        {!isNoBudgetLimit && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="200"
                  max="10000"
                  step="50"
                  value={budgetInr || ''}
                  onChange={e => {
                    const val = e.target.value ? parseFloat(e.target.value) : null;
                    setBudgetInr(val);
                  }}
                  onBlur={onFetchRecommendations}
                  placeholder="e.g. 1000"
                  className="w-full pl-8 pr-3 py-2 bg-white rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-rose-500 shadow-2xs"
                />
              </div>

              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
                Max: ₹{(budgetInr || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick budget pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-400 font-semibold mr-1">Quick Select:</span>
              {QUICK_BUDGETS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBudgetInr(b);
                    setTimeout(onFetchRecommendations, 50);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    budgetInr === b
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  ₹{b.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Automatic refresh button */}
      <div className="pt-1">
        <button
          onClick={onFetchRecommendations}
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isLoading ? 'Updating Recommendations...' : 'Refresh Matching Recommendations'}</span>
        </button>
      </div>
    </div>
  );
};
