import React, { useMemo } from 'react';
import { Star, ShoppingBag, Sparkles, TrendingUp, Award, Gem, Eye } from 'lucide-react';
import { RecommendationCategoryResult } from '../types/api';
import { getRetailerDisplayName, getAvailableStores } from '../utils/urlHelper';

interface RecommendationCardProps {
  item: RecommendationCategoryResult;
  onSelectProduct?: (item: RecommendationCategoryResult) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, onSelectProduct }) => {
  const { product, tag, label, reason } = item;
  const variant = product.matched_variant;
  const price = product.best_price;

  // Ultra-premium, editorial styling per recommendation category tier
  const cardTheme = {
    best_overall: {
      badgeTitle: 'Best Match',
      gradientBar: 'from-amber-500 via-rose-500 to-rose-600',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
      accentGlow: 'hover:shadow-rose-500/10 hover:border-rose-300',
      icon: <Award className="w-3.5 h-3.5 text-rose-600" />,
      buttonBg: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 shadow-rose-600/20',
      cardTag: 'Top Editorial Pick',
    },
    budget_friendly: {
      badgeTitle: 'Budget Pick',
      gradientBar: 'from-emerald-400 via-teal-500 to-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      accentGlow: 'hover:shadow-emerald-500/10 hover:border-emerald-300',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
      buttonBg: 'bg-stone-900 hover:bg-emerald-600 shadow-stone-900/10',
      cardTag: 'Value Champion',
    },
    best_value: {
      badgeTitle: 'High Performance',
      gradientBar: 'from-blue-500 via-indigo-500 to-violet-600',
      badgeBg: 'bg-blue-50 border-blue-200 text-blue-700',
      accentGlow: 'hover:shadow-blue-500/10 hover:border-blue-300',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-600" />,
      buttonBg: 'bg-stone-900 hover:bg-indigo-600 shadow-stone-900/10',
      cardTag: 'Editor Choice',
    },
    premium: {
      badgeTitle: 'Luxury Upgrade',
      gradientBar: 'from-amber-400 via-purple-600 to-indigo-900',
      badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
      accentGlow: 'hover:shadow-purple-500/10 hover:border-purple-300',
      icon: <Gem className="w-3.5 h-3.5 text-purple-600" />,
      buttonBg: 'bg-gradient-to-r from-stone-950 to-purple-950 hover:from-purple-900 hover:to-indigo-900 shadow-purple-900/20',
      cardTag: 'Luxury Masterpiece',
    },
  }[tag] || {
    badgeTitle: label,
    gradientBar: 'from-stone-600 to-stone-900',
    badgeBg: 'bg-stone-100 border-stone-200 text-stone-800',
    accentGlow: 'hover:shadow-stone-500/10 hover:border-stone-300',
    icon: <Sparkles className="w-3.5 h-3.5 text-stone-700" />,
    buttonBg: 'bg-stone-900 hover:bg-stone-800',
    cardTag: 'Verified Match',
  };

  // Resolve store options & best deal price
  const availableStores = useMemo(() => {
    return getAvailableStores(
      product.brand,
      product.title,
      variant?.shade_name,
      price?.retailer,
      variant?.prices,
      price
    );
  }, [product.brand, product.title, variant?.shade_name, price?.retailer, variant?.prices, price]);

  const bestStore = useMemo(() => {
    return availableStores.find(s => s.isLowest) || availableStores[0];
  }, [availableStores]);

  const displayPrice = bestStore?.price || price?.current_price || 0;
  const displayMrp = bestStore?.mrp || price?.mrp || displayPrice;
  const displayDiscount = bestStore?.discountPercent ?? (displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0);
  const displayRetailer = bestStore?.name || getRetailerDisplayName(price?.retailer, product.brand);

  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct(item);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative bg-white rounded-[28px] overflow-hidden border border-stone-200/80 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group ${cardTheme.accentGlow}`}
    >
      {/* Top Gradient Hairline Accent */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cardTheme.gradientBar}`} />

      <div>
        {/* Modern Header Badge & Category */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${cardTheme.badgeBg}`}>
              {cardTheme.icon}
              {cardTheme.badgeTitle}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 bg-white px-2 py-0.5 rounded-md border border-stone-200/60">
            {product.category}
          </span>
        </div>

        {/* Reason pill */}
        <div className="px-5 py-2.5 bg-stone-50/80 border-b border-stone-100 text-[11px] text-stone-600 leading-relaxed font-medium">
          {reason}
        </div>

        {/* Product Details Section */}
        <div className="p-5">
          <div className="flex gap-4 items-start">
            {/* Product Image Frame */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-50 p-2 flex-shrink-0 overflow-hidden border border-stone-200/70 flex items-center justify-center relative group-hover:scale-105 group-hover:border-stone-300 transition-all duration-300">
              {variant?.image_url ? (
                <img
                  src={variant.image_url}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const b = product.brand?.toLowerCase() || '';
                    if (b.includes('lakme')) {
                      target.src = 'https://images-static.nykaa.com/media/catalog/product/0/0/0060d708901030569210-new_1.jpg';
                    } else if (b.includes('loreal') || b.includes('l\'oreal')) {
                      target.src = 'https://images-static.nykaa.com/media/catalog/product/f/d/fd0ed65LOREA00000050_1.jpg';
                    } else {
                      target.src = 'https://images-static.nykaa.com/media/catalog/product/1/3/132473_h-8901526407270.jpg';
                    }
                  }}
                />
              ) : (
                <ShoppingBag className="w-8 h-8 text-stone-300" />
              )}
            </div>

            {/* Brand & Title */}
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 block">
                {product.brand}
              </span>
              <h3 className="font-bold text-sm text-stone-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-rose-600 transition-colors">
                {product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold ml-1 text-stone-800">{product.rating}</span>
                </div>
                <span className="text-[11px] text-stone-400">
                  ({product.review_count.toLocaleString('en-IN')})
                </span>
              </div>

              {/* Finish & Coverage tags */}
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded capitalize">
                  {product.finish}
                </span>
                <span className="text-[9px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded capitalize">
                  {product.coverage} cov
                </span>
              </div>
            </div>
          </div>

          {/* Precision Shade Swatch Bar */}
          {variant && (
            <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-stone-50 via-rose-50/40 to-stone-50 border border-stone-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0 ring-1 ring-stone-200"
                  style={{ backgroundColor: variant.hex_color }}
                  title={`Swatch Hex: ${variant.hex_color}`}
                />
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-600 block">
                    Your Face Match
                  </span>
                  <span className="font-bold text-xs text-stone-900 truncate block">
                    {variant.shade_name}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <span className="text-[9px] uppercase font-bold text-stone-400 block">
                  Tone
                </span>
                <span className="text-[11px] font-bold text-stone-700 capitalize">
                  {variant.undertone}
                </span>
              </div>
            </div>
          )}

          {/* Pricing Row */}
          {displayPrice > 0 && (
            <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-stone-900">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {displayMrp > displayPrice && (
                    <span className="text-[11px] text-stone-400 line-through">
                      ₹{displayMrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {displayDiscount > 0 && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                      {displayDiscount}% OFF
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100/80 px-2 py-0.5 rounded-md">
                {displayRetailer}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modern View & Buy Action Button */}
      {price && (
        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${cardTheme.buttonBg}`}
          >
            <span>View & Buy This Product</span>
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
