import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { PhotoCapture } from './PhotoCapture';
import { FaceAnalysisResult } from '../types/api';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: FaceAnalysisResult) => void;
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

  const handleComplete = (result: FaceAnalysisResult) => {
    onAnalysisComplete(result);
    // Automatically close modal after brief confirmation
    setTimeout(onClose, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white/60">
          <div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#2D2825]">
              AI Facial Shade Calibration
            </h3>
            <p className="text-xs text-stone-500">
              Instant in-memory analysis calibrated for Indian complexions.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
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
