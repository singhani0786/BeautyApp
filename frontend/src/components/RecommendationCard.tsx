import React from 'react';
import { ExternalLink, Star, ShieldCheck, Tag, ShoppingBag, Clock } from 'lucide-react';
import { RecommendationCategoryResult, ProductInfo } from '../types/api';

interface RecommendationCardProps {
  item: RecommendationCategoryResult;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  const { product, tag, label, reason } = item;
  const variant = product.matched_variant;
  const price = product.best_price;

  const tagStyles = {
    best_overall: {
      bg: 'bg-gradient-to-r from-amber-500 to-rose-500 text-white',
      border: 'border-amber-300 ring-2 ring-amber-400/20',
      badge: 'Best Overall Match',
    },
    budget_friendly: {
      bg: 'bg-emerald-600 text-white',
      border: 'border-emerald-200',
      badge: 'Best Budget Pick',
    },
    best_value: {
      bg: 'bg-blue-600 text-white',
      border: 'border-blue-200',
      badge: 'Best Value & Performance',
    },
    premium: {
      bg: 'bg-purple-900 text-purple-100',
      border: 'border-purple-300',
      badge: 'Luxury & Premium Upgrade',
    },
  }[tag] || {
    bg: 'bg-stone-800 text-white',
    border: 'border-stone-200',
    badge: label,
  };

  const retailerName = {
    amazon_in: 'Amazon India',
    nykaa: 'Nykaa',
    cuelinks_merchant: 'Cuelinks Merchant',
    authorized_feed: 'Verified Partner Store',
  }[price?.retailer || ''] || price?.retailer || 'Retailer';

  return (
    <div className={`bg-white rounded-3xl overflow-hidden border shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${tagStyles.border}`}>
      {/* Category Tag Header */}
      <div>
        <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${tagStyles.bg}`}>
          <span>{label}</span>
          <span className="opacity-90 capitalize font-medium text-[11px] lowercase">
            {product.category}
          </span>
        </div>

        {/* Reason pill */}
        <div className="bg-stone-50 border-b border-stone-200/80 px-5 py-2.5 text-xs text-stone-600 font-medium">
          {reason}
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="flex gap-4">
            {/* Variant Image */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200/60 p-2 flex items-center justify-center relative">
              {variant?.image_url ? (
                <img
                  src={variant.image_url}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <ShoppingBag className="w-10 h-10 text-stone-300" />
              )}
            </div>

            {/* Product Meta */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                {product.brand}
              </span>
              <h3 className="font-bold text-base text-stone-900 leading-snug line-clamp-2 mt-0.5">
                {product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold ml-1 text-stone-800">{product.rating}</span>
                </div>
                <span className="text-xs text-stone-400">
                  ({product.review_count.toLocaleString('en-IN')} reviews)
                </span>
              </div>

              {/* Formulation Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md capitalize">
                  {product.finish} Finish
                </span>
                <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md capitalize">
                  {product.coverage} Coverage
                </span>
              </div>
            </div>
          </div>

          {/* Matched Variant Shade Bar */}
          {variant && (
            <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/70 to-amber-50/70 border border-rose-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: variant.hex_color }}
                  title={`Swatch Hex: ${variant.hex_color}`}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-rose-700 tracking-wider block">
                      Your Exact Face Match
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="font-bold text-sm text-stone-900 block mt-0.5">
                    {variant.shade_name}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  Undertone
                </span>
                <span className="text-xs font-extrabold text-rose-600 capitalize">
                  {variant.undertone}
                </span>
              </div>
            </div>
          )}

          {/* Pricing Details */}
          {price && (
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-stone-900">
                    ₹{price.current_price.toLocaleString('en-IN')}
                  </span>
                  {price.mrp > price.current_price && (
                    <span className="text-xs text-stone-400 line-through">
                      ₹{price.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {price.discount_percent > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {Math.round(price.discount_percent)}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Freshness: Verified Live / Seed Data</span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                {retailerName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {price && (
        <div className="p-5 pt-0">
          <a
            href={price.affiliate_url || price.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>View & Buy on {retailerName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
};

