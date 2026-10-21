import React from 'react';
import { X, Check } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  undertone: string;
  setUndertone: (val: string) => void;
  skinDepth: string;
  setSkinDepth: (val: string) => void;
  skinType: string;
  setSkinType: (val: string) => void;
  onApply: () => void;
}

const DEPTHS = [
  { id: 'fair', label: 'Fair' },
  { id: 'light', label: 'Light' },
  { id: 'medium', label: 'Medium' },
  { id: 'tan', label: 'Tan' },
  { id: 'deep', label: 'Deep' },
];

const UNDERTONES = [
  { id: 'warm', label: 'Warm (Golden/Yellow)', color: '#DFA975' },
  { id: 'cool', label: 'Cool (Rosy/Pink)', color: '#D69F78' },
  { id: 'neutral', label: 'Neutral (Balanced)', color: '#D9A47B' },
  { id: 'olive', label: 'Olive (Green Tint)', color: '#CE9E69' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  undertone,
  setUndertone,
  skinDepth,
  setSkinDepth,
  skinType,
  setSkinType,
  onApply,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    onApply();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full border border-stone-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70">
          <h3 className="font-serif-editorial text-xl font-bold text-[#2D2825]">
            Edit Complexion Profile
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-left">
          
          {/* Depth selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Skin Depth
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {DEPTHS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSkinDepth(d.id)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${
                    skinDepth === d.id
                      ? 'bg-[#2D2825] text-white border-[#2D2825] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Undertone selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Undertone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {UNDERTONES.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUndertone(u.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-between transition-all ${
                    undertone === u.id
                      ? 'bg-white border-[#4A6953] ring-1 ring-[#4A6953] shadow-xs text-[#2D2825]'
                      : 'bg-white/80 border-stone-300 text-stone-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white shadow-2xs"
                      style={{ backgroundColor: u.color }}
                    />
                    <span>{u.label}</span>
                  </div>
                  {undertone === u.id && <Check className="w-3.5 h-3.5 text-[#4A6953]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
              Skin Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['all', 'oily', 'dry', 'combination'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSkinType(st)}
                  className={`py-2 text-xs font-medium rounded-xl border capitalize transition-all ${
                    skinType === st
                      ? 'bg-[#4A6953] text-white border-[#4A6953] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-[#2D2825] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
          >
            Apply & Recalibrate Edit
          </button>

        </div>

      </div>
    </div>
  );
};

