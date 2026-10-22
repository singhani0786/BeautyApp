import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';
import { FaceAnalysisResult } from '../types/api';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: FaceAnalysisResult, photoUrl?: string) => void;
  isLoading: boolean;
  analysisResult: FaceAnalysisResult | null;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete,
  isLoading,
  analysisResult,
}) => {
  if (!isOpen) return null;

  const handleComplete = (result: FaceAnalysisResult, photoUrl?: string) => {
    onAnalysisComplete(result, photoUrl);
    // Automatically close modal after brief confirmation
    setTimeout(onClose, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gradient-to-b from-[#FFF7F9] to-[#FAF4F7] rounded-3xl max-w-3xl w-full border border-rose-100 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-rose-100 flex items-center justify-between bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#2D2529] leading-tight">
                AI Facial Shade Calibration ✨
              </h3>
              <p className="text-xs text-stone-500 hidden sm:block">
                Instant in-memory analysis calibrated for South Asian skin complexions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-rose-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Zero Storage • 100% In-RAM 🔒</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-rose-100 text-stone-500 hover:text-rose-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <PhotoCapture
            onAnalysisComplete={handleComplete}
            isLoading={isLoading}
            analysisResult={analysisResult}
          />
        </div>

      </div>
    </div>
  );
};

