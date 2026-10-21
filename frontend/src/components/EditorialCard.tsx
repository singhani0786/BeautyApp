import React, { useState } from 'react';
import { Star, Heart, ArrowRight } from 'lucide-react';
import { RecommendationCategoryResult } from '../types/api';
import { getAvailableStores, getRetailerDisplayName } from '../utils/urlHelper';

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

  // Editorial custom tier pill labels
  const tierLabels: Record<string, string> = {
    best_overall: 'The longwear pick',
    budget_friendly: 'The budget pick',
    best_value: 'The everyday pick',
    premium: 'The luxury upgrade',
  };
  const pickLabel = tierLabels[tag] || label || 'Our curated pick';

  // Card background pastels for bottle frame
  const bgColors = [
    'bg-[#EFE8DD]',
    'bg-[#F2EAE0]',
    'bg-[#E9EDE7]',
    'bg-[#F6EDE6]',
  ];
  const frameBg = bgColors[index % bgColors.length];

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Visual Container */}
      <div className={`${frameBg} p-3.5 relative flex flex-col justify-between min-h-[170px] sm:min-h-[185px]`}>
        
        {/* Top Header Pill & Wishlist */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-medium tracking-wide px-2.5 py-0.5 rounded-full bg-white/80 text-stone-700 border border-stone-200/50 shadow-2xs">
            {pickLabel}
          </span>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(item);
            }}
            className="w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors shadow-2xs"
            title="Add to shortlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`}
            />
          </button>
        </div>

        {/* Centered Product Bottle Image */}
        <div className="my-auto py-1 flex items-center justify-center h-28 sm:h-32">
          {variant?.image_url ? (
            <img
              src={variant.image_url}
              alt={product.title}
              className="max-h-full w-auto object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                const b = product.brand?.toLowerCase() || '';
                if (b.includes('lakme')) {
                  target.src = 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg';
                } else if (b.includes('loreal') || b.includes("l'oreal")) {
                  target.src = 'https://images-static.nykaa.com/media/catalog/product/f/d/fd0ed65LOREA00000050_1.jpg';
                } else if (b.includes('mac') || b.includes('m.a.c')) {
                  target.src = 'https://m.media-amazon.com/images/I/51wlTTPlSPL._SL1000_.jpg';
                } else if (b.includes('kay')) {
                  target.src = 'https://m.media-amazon.com/images/I/51pnyFKFi4L._SL1000_.jpg';
                } else {
                  target.src = 'https://m.media-amazon.com/images/I/41OUDlgEgnL._SL1080_.jpg';
                }
              }}
            />
          ) : (
            <div className="w-16 h-20 rounded-xl bg-white/50 border border-stone-200" />
          )}
        </div>

        {/* Bottom index and finish tag */}
        <div className="flex items-center justify-between text-[11px] z-10">
          <span className="font-mono text-stone-400 text-[10px]">
            0{index + 1}
          </span>
          <span className="font-serif-italic text-stone-600 text-[11px]">
            {product.finish} finish
          </span>
        </div>

      </div>

      {/* Bottom Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
        
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="font-bold uppercase tracking-wider text-stone-500">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-semibold">
              <Star className="w-3 h-3 fill-stone-700 text-stone-700" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-editorial text-lg font-semibold text-[#2D2825] leading-tight line-clamp-1">
            {product.title.split('Foundation')[0].split('Matte')[0].trim()}
          </h3>
          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
            {product.category === 'foundation' ? 'Matte Cover Foundation' : product.title}
          </p>
        </div>

        {/* Shade Swatch & Coverage */}
        {variant && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-4 h-4 rounded-full border border-white shadow-2xs flex-shrink-0"
                style={{ backgroundColor: variant.hex_color }}
                title={variant.shade_name}
              />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                  Suggested shade
                </span>
                <span className="text-xs font-semibold text-[#2D2825] truncate block">
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
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold font-serif-display text-[#2D2825]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-500">
              at {displayRetailer}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(item)}
            className="px-3.5 py-1.5 rounded-full border border-[#D9D1C5] hover:border-[#4A6953] hover:bg-[#EBF1EC] text-xs font-medium text-[#2D2825] flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
          >
            <span>Compare</span>
            <ArrowRight className="w-3 h-3 text-[#4A6953]" />
          </button>
        </div>

      </div>

    </div>
  );
};
