import React from 'react';
import { X, Shield, Sparkles, Scale } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full border border-stone-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <span className="text-[#4A6953] text-sm">✦</span>
            <h3 className="font-serif-editorial text-xl font-bold text-[#2D2825]">
              How GlowGuide Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-left text-sm text-stone-700">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EBF1EC] text-[#3D5644] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              01
            </div>
            <div>
              <h4 className="font-bold text-[#2D2825]">In-Memory Facial Calibration</h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Your selfie is analyzed entirely in browser/RAM using Individual Typology Angle (ITA°) metrics. Your photo is never stored on disk.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F6EDE6] text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              02
            </div>
            <div>
              <h4 className="font-bold text-[#2D2825]">True Undertone Matching</h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Calibrated specifically for South Asian complexions. Differentiates golden warm, neutral olive, and wheatish undertones from 30+ brand catalogs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDF2F4] text-rose-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              03
            </div>
            <div>
              <h4 className="font-bold text-[#2D2825]">Direct Store Verification</h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                We compare prices across Amazon India, Nykaa, and Official Brand Stores so you get your exact shade at the lowest verified price.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#2D2825] text-white text-xs font-semibold hover:bg-stone-800 transition-all"
            >
              Back to Match Studio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
