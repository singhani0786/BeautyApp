import React from 'react';
import { Upload, Lock, Sliders, Sparkles } from 'lucide-react';
import { FaceAnalysisResult } from '../types/api';

interface ComplexionCardProps {
  skinDepth: string;
  undertone: string;
  budgetInr: number | null;
  onBudgetChange: (val: number | null) => void;
  onOpenPhotoModal: () => void;
  onOpenEditProfile: () => void;
  faceAnalysis: FaceAnalysisResult | null;
}

export const ComplexionCard: React.FC<ComplexionCardProps> = ({
  skinDepth,
  undertone,
  budgetInr,
  onBudgetChange,
  onOpenPhotoModal,
  onOpenEditProfile,
  faceAnalysis,
}) => {
  // Swatch hex fallback
  const swatchColor = faceAnalysis?.dominant_hex || (
    undertone === 'cool' ? '#D69F78' :
    undertone === 'olive' ? '#CE9E69' :
    undertone === 'neutral' ? '#D9A47B' : '#DFA975'
  );

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-[270px]">
      
      {/* Main Complexion Portrait Card */}
      <div className="bg-[#F6F2EC] rounded-2xl p-4 border border-[#E8E1D5] shadow-xs flex flex-col justify-between relative overflow-hidden">
        
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif-editorial text-lg text-[#2D2825] font-semibold tracking-tight">
            Your complexion
          </h2>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/80 text-stone-600 border border-stone-200/60 shadow-2xs">
            {faceAnalysis ? 'AI Calibrated' : 'Sample'}
          </span>
        </div>

        {/* Minimalist Line-Art Face Inside Organic Swatch */}
        <div className="relative my-2 py-3 flex flex-col items-center justify-center">
          {/* Concentric subtle line rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-36 h-28 rounded-[50%] border border-stone-400/50" />
            <div className="absolute w-44 h-24 rounded-[50%] border border-stone-400/30 rotate-12" />
          </div>

          {/* Organic Face Swatch Oval */}
          <div
            className="w-20 h-24 rounded-[45%] shadow-md flex items-center justify-center relative transition-all duration-500 transform hover:scale-105 border-2 border-white/70"
            style={{ backgroundColor: swatchColor }}
          >
            {/* Minimal SVG Face Line Art */}
            <svg
              className="w-10 h-10 text-white/80 drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Face contour */}
              <path d="M12 3a6 7 0 0 0-6 7c0 4 3 8 6 10 3-2 6-6 6-10a6 7 0 0 0-6-7z" />
              {/* Eyes */}
              <circle cx="9.5" cy="10" r="0.8" fill="currentColor" />
              <circle cx="14.5" cy="10" r="0.8" fill="currentColor" />
              {/* Nose */}
              <path d="M12 10.5v2a.5.5 0 0 0 .5.5" />
              {/* Soft smile */}
              <path d="M10 15a2.5 2.5 0 0 0 4 0" />
            </svg>
          </div>

          <p className="font-serif-italic text-[11px] text-stone-600 mt-2 tracking-wide">
            a tone that's all your own
          </p>
        </div>

        {/* Depth & Undertone Metadata */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200/80 mb-3 text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
              Skin Depth
            </span>
            <span className="font-serif-display text-sm font-bold text-[#2D2825] capitalize">
              {skinDepth}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
              Undertone
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-serif-display text-sm font-bold text-[#2D2825] capitalize">
                {undertone}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-white shadow-2xs"
                style={{ backgroundColor: swatchColor }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPhotoModal}
            className="w-full py-1.5 px-2 bg-white hover:bg-stone-50 text-[#2D2825] text-[11px] font-semibold rounded-lg border border-stone-300 shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Upload className="w-3 h-3 text-[#4A6953]" />
            <span>Add photo</span>
          </button>
          
          <button
            type="button"
            onClick={onOpenEditProfile}
            className="w-full py-1.5 px-2 bg-white hover:bg-stone-50 text-[#2D2825] text-[11px] font-semibold rounded-lg border border-stone-300 shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Sliders className="w-3 h-3 text-stone-500" />
            <span>Edit profile</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-stone-500 mt-2.5">
          <Lock className="w-2.5 h-2.5 text-emerald-700" />
          <span>Your photo stays in this tab</span>
        </div>

      </div>

      {/* Budget Selector Box */}
      <div className="space-y-1 text-left">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-[#2D2825]">
            Your budget
          </label>
          <span className="text-[10px] text-stone-500">per product</span>
        </div>

        <select
          value={budgetInr === null ? 'any' : budgetInr}
          onChange={(e) => {
            const val = e.target.value === 'any' ? null : Number(e.target.value);
            onBudgetChange(val);
          }}
          className="w-full py-1.5 px-3 bg-white text-xs font-semibold text-[#2D2825] rounded-xl border border-stone-300 shadow-2xs focus:outline-[#4A6953] cursor-pointer"
        >
          <option value={500}>Under ₹500</option>
          <option value={1000}>Under ₹1,000</option>
          <option value={1500}>Under ₹1,500</option>
          <option value={2500}>Under ₹2,500</option>
          <option value="any">No budget limit</option>
        </select>
      </div>

      {/* Philosophy Quote */}
      <div className="pt-1 text-left">
        <div className="flex items-start gap-1.5 text-stone-500">
          <span className="text-[#4A6953] text-xs leading-none">✦</span>
          <p className="font-serif-italic text-xs text-stone-600 leading-snug">
            Your skin is unique.<br />
            <span className="text-[#2D2825]">A shade is just the beginning.</span>
          </p>
        </div>
      </div>

    </div>
  );
};
