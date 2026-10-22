import React, { useState } from 'react';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { RecommendationCategoryResult } from '../types/api';
import { getAvailableStores, getRetailerDisplayName } from '../utils/urlHelper';
import { getProductDisplayImage } from '../utils/productImages';

interface EditorialCardProps {
  item: RecommendationCategoryResult;
  index: number;
  onSelectProduct: (item: RecommendationCategoryResult) => void;
  isShortlisted: boolean;
  onToggleShortlist: (item: RecommendationCategoryResult) => void;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  item,
  index,
  onSelectProduct,
  isShortlisted,
  onToggleShortlist,
}) => {
  const { product, tag, label } = item;
  const variant = product.matched_variant;
  const price = product.best_price;

  // Resolve stores to show live verified store and price
  const availableStores = getAvailableStores(
    product.brand,
    product.title,
    variant?.shade_name,
    price?.retailer,
    variant?.prices,
    price
  );

  const bestStore = availableStores.find(s => s.isLowest) || availableStores[0];
  const displayPrice = bestStore?.price || price?.current_price || 0;
  const displayRetailer = bestStore?.name || getRetailerDisplayName(price?.retailer, product.brand);

  // Editorial custom tier pill labels with cute chic styling
  const tierLabels: Record<string, string> = {
    best_overall: 'The Holy Grail ✨',
    budget_friendly: 'Budget Bestie 🌸',
    best_value: 'Everyday Glow 💖',
    premium: 'Luxe Indulgence 💎',
  };
  const pickLabel = tierLabels[tag] || label || 'Our curated pick ✨';

  // Dreamy cosmetic pastels for bottle frame (Rosewater, Peach Milk, Mauve Petal, Champagne)
  const bgColors = [
    'bg-gradient-to-b from-[#FFF0F4] to-[#FFE4EC]',
    'bg-gradient-to-b from-[#FFF5ED] to-[#FFE8DA]',
    'bg-gradient-to-b from-[#FAF0F8] to-[#F5DFF0]',
    'bg-gradient-to-b from-[#FFF9EE] to-[#FDF0D5]',
  ];
  const frameBg = bgColors[index % bgColors.length];

  return (
    <div className="bg-white/95 rounded-2xl border border-rose-100/90 shadow-2xs hover:shadow-lg hover:shadow-rose-100/70 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
      
      {/* Top Visual Container */}
      <div className={`${frameBg} p-3.5 relative flex flex-col justify-between min-h-[170px] sm:min-h-[185px]`}>
        
        {/* Top Header Pill & Wishlist */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full bg-white/90 text-rose-800 border border-rose-200/70 shadow-2xs">
            {pickLabel}
          </span>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(item);
            }}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-stone-500 hover:text-rose-500 transition-colors shadow-2xs hover:shadow-xs"
            title="Add to shortlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
            />
          </button>
        </div>

        {/* Centered Product Item Image */}
        <div className="my-auto py-1 flex items-center justify-center h-28 sm:h-32">
          <img
            src={getProductDisplayImage(product.category, product.brand, product.title, variant?.image_url)}
            alt={product.title}
            className="max-h-full w-auto object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = getProductDisplayImage(product.category, product.brand, product.title);
            }}
          />
        </div>

        {/* Bottom index and finish tag */}
        <div className="flex items-center justify-between text-[11px] z-10">
          <span className="font-mono text-rose-900/40 text-[10px] font-semibold">
            0{index + 1}
          </span>
          <span className="font-serif-italic text-stone-600 text-[11px]">
            {product.finish} finish ✨
          </span>
        </div>

      </div>

      {/* Bottom Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
        
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="font-bold uppercase tracking-wider text-rose-900/60">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-900">{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-editorial text-lg font-semibold text-[#2D2529] leading-tight line-clamp-1" title={product.title}>
            {product.category === 'foundation'
              ? product.title.replace(' Liquid Foundation', '').replace(' Foundation', '')
              : product.title}
          </h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
            {product.category === 'foundation'
              ? 'Matte Cover Formulation'
              : `${product.finish ? product.finish.charAt(0).toUpperCase() + product.finish.slice(1) : 'Authentic'} ${product.category}`}
          </p>
        </div>

        {/* Shade Swatch & Coverage */}
        {variant && (
          <div className="pt-2 border-t border-rose-50 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-4 h-4 rounded-full border border-white shadow-2xs flex-shrink-0 ring-2 ring-rose-200/70"
                style={{ backgroundColor: variant.hex_color }}
                title={variant.shade_name}
              />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                  Suggested shade
                </span>
                <span className="text-xs font-semibold text-[#2D2529] truncate block">
                  {variant.shade_name}
                </span>
              </div>
            </div>

            <span className="text-[10px] text-stone-500 capitalize flex-shrink-0 pl-1">
              {product.coverage} cov
            </span>
          </div>
        )}

        {/* Pricing & Compare CTA */}
        <div className="pt-2.5 border-t border-rose-50 flex items-center justify-between">
          <div>
            <div className="text-base font-bold font-serif-display text-rose-950">
              ₹{displayPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-500">
              at {displayRetailer}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(item)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-500 hover:to-pink-500 border border-rose-200/80 hover:border-transparent text-xs font-semibold text-rose-700 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs hover:shadow-xs hover:shadow-rose-200 group/btn"
          >
            <span>Compare</span>
            <ArrowRight className="w-3 h-3 text-rose-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};

