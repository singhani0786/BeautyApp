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
      <div className="bg-[#FAF7F2] rounded-3xl max-w-3xl w-full border border-[#E8E2D9] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A6953] animate-pulse" />
            <div>
              <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#2D2825] leading-tight">
                AI Facial Shade Calibration
              </h3>
              <p className="text-xs text-stone-500 hidden sm:block">
                Instant in-memory analysis calibrated for South Asian skin complexions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-[#EBF1EC] text-[#3D5644] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#D5E2D8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4A6953]" />
              <span>Zero Storage • 100% In-RAM</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors"
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

