import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { RecommendationCategoryResult } from '../types/api';

interface ShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: RecommendationCategoryResult[];
  onRemove: (item: RecommendationCategoryResult) => void;
  onSelectProduct: (item: RecommendationCategoryResult) => void;
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  isOpen,
  onClose,
  shortlist,
  onRemove,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full border border-stone-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-editorial text-xl font-bold text-[#2D2825]">
              Your Shortlist ({shortlist.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {shortlist.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              <p className="font-serif-italic text-sm">No items in your shortlist yet.</p>
              <p className="mt-1">Tap the ♡ heart icon on any product card to save it here.</p>
            </div>
          ) : (
            shortlist.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl p-3.5 border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-stone-50 p-1 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                    {item.product.matched_variant?.image_url ? (
                      <img
                        src={item.product.matched_variant.image_url}
                        alt={item.product.title}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      {item.product.brand}
                    </span>
                    <h4 className="text-xs font-bold text-[#2D2825] truncate">
                      {item.product.title}
                    </h4>
                    <span className="text-[11px] text-[#4A6953] font-semibold">
                      ₹{item.product.best_price?.current_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#2D2825] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemove(item)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

