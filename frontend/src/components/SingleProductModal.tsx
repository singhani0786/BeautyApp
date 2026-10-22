import React, { useState, useMemo } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Heart,
  Award,
  Store,
  Check
} from 'lucide-react';
import { RecommendationCategoryResult } from '../types/api';
import { getAvailableStores, StoreOption, getRetailerDisplayName } from '../utils/urlHelper';

interface SingleProductModalProps {
  item: RecommendationCategoryResult | null;
  onClose: () => void;
}

const SingleProductModalContent: React.FC<{
  item: RecommendationCategoryResult;
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const { product, tag, label, reason } = item;
  const variant = product.matched_variant;
  const price = product.best_price;

  // Generate available stores for this product with accurate store-specific pricing
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

  // Default store: lowest price verified store deal, exactly matching RecommendationCard
  const defaultStoreId = useMemo(() => {
    const lowest = availableStores.find(s => s.isLowest);
    return lowest?.id || availableStores[0]?.id || 'amazon';
  }, [availableStores]);

  const [selectedStoreId, setSelectedStoreId] = useState<string>(defaultStoreId);

  // Active store based on user selection
  const activeStore: StoreOption = useMemo(() => {
    return availableStores.find(s => s.id === selectedStoreId) || availableStores[0];
  }, [availableStores, selectedStoreId]);

  const currentStorePrice = activeStore?.price || price?.current_price || 0;
  const currentStoreMrp = activeStore?.mrp || price?.mrp || currentStorePrice;
  const currentStoreDiscount = activeStore?.discountPercent ?? (currentStoreMrp > currentStorePrice ? Math.round(((currentStoreMrp - currentStorePrice) / currentStoreMrp) * 100) : 0);

  // Synchronize price in the textual explanation with the active store price
  const formattedReason = useMemo(() => {
    if (!reason) return '';
    return reason.replace(
      /at ₹\d+(?:,\d+)*(?: \(\d+% off MRP\))?/,
      `at ₹${currentStorePrice.toLocaleString('en-IN')}${currentStoreDiscount > 0 ? ` (${currentStoreDiscount}% off MRP)` : ''}`
    );
  }, [reason, currentStorePrice, currentStoreDiscount]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${product.brand} ${product.title} - Shade: ${variant?.shade_name}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200/90 z-10 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              <Award className="w-3.5 h-3.5" />
              {label}
            </span>
            <span className="text-xs text-stone-400 font-medium hidden sm:inline">
              Selected AI Shade Formulation
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Main Visual & Title Block */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            {/* Product Image */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-stone-50 p-3 border border-stone-200/80 shadow-inner flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              {variant?.image_url ? (
                <img
                  src={variant.image_url}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply"
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
                <ShoppingBag className="w-12 h-12 text-stone-300" />
              )}
            </div>

            {/* Title & Brand */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-black uppercase tracking-widest text-rose-600">
                {product.brand}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900 mt-1 leading-snug">
                {product.title}
              </h2>

              {/* Star Rating & Reviews */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold ml-1 text-stone-800">{product.rating}</span>
                </div>
                <span className="text-xs text-stone-400">
                  ({product.review_count.toLocaleString('en-IN')} verified customer reviews)
                </span>
              </div>

              {/* Formulation Tags */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 capitalize">
                  {product.finish} Finish
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 capitalize">
                  {product.coverage} Coverage
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 capitalize">
                  Indian Skin Adapted
                </span>
              </div>

              {/* Pricing Display */}
              {currentStorePrice > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-baseline justify-center sm:justify-start gap-2 sm:gap-3">
                  <div className="flex items-baseline justify-center sm:justify-start gap-2.5">
                    <span className="text-3xl font-black text-stone-900">
                      ₹{currentStorePrice.toLocaleString('en-IN')}
                    </span>
                    {currentStoreMrp > currentStorePrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ₹{currentStoreMrp.toLocaleString('en-IN')}
                      </span>
                    )}
                    {currentStoreDiscount > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {currentStoreDiscount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 self-center sm:self-auto">
                    <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                      on {activeStore.name}
                    </span>
                    {activeStore.isLowest && (
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                        ✨ Best Price Deal
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Precision Shade Match Card */}
          {variant && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-rose-50/70 border border-rose-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md ring-1 ring-stone-200 flex-shrink-0"
                  style={{ backgroundColor: variant.hex_color }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-black text-rose-700 tracking-wider">
                      Your Exact Complexion Match
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  </div>
                  <span className="font-extrabold text-base text-stone-900 block mt-0.5">
                    {variant.shade_name}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    SKU Code: {variant.sku || variant.shade_code || 'AUT-VERIFIED'}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">
                  Harmonized Undertone
                </span>
                <span className="text-xs font-black text-rose-600 capitalize">
                  {variant.undertone}
                </span>
              </div>
            </div>
          )}

          {/* Retailer Store Selection Grid */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-rose-600" />
                Multi-Store Price Comparison:
              </span>
              <span className="text-[11px] text-stone-500">
                Select store to view live price
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableStores.map((store) => {
                const isSelected = store.id === selectedStoreId;
                return (
                  <div
                    key={store.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedStoreId(store.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedStoreId(store.id);
                      }
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between relative cursor-pointer select-none ${
                      isSelected
                        ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
                        : 'bg-white/70 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <div>
                      <span className="text-base block mb-1">{store.logo}</span>
                      <span className="font-bold text-xs text-stone-900 block leading-tight">
                        {store.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 truncate">
                        {store.domain}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-sm font-extrabold text-stone-900">
                          ₹{store.price.toLocaleString('en-IN')}
                        </span>
                        {store.mrp > store.price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{store.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {store.isLowest ? (
                          <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            Best Deal
                          </span>
                        ) : (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              store.isOfficial
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {store.badge}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (store.url) {
                              window.open(store.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded-md hover:bg-stone-100 transition-colors"
                          title={`Open directly on ${store.name}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price comparison helper */}
            <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/50 flex items-start gap-2 text-[11px] text-blue-900">
              <span className="text-sm leading-none mt-0.5">💡</span>
              <p className="leading-snug">
                <strong>Verified Retailer Pricing:</strong> Live prices are verified directly with official retailer and brand partners (Amazon India, Nykaa, and Brand Official Stores). Selecting a store updates your checkout link directly.
              </p>
            </div>
          </div>

          {/* Why this product was recommended */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Match Analysis
            </span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {formattedReason} {product.description}
            </p>
          </div>

          {/* Fulfillment & Authenticity Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50/60 border border-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Genuine Certified Formulation</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50/60 border border-stone-100">
              <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Fulfilled by {activeStore.name} ({activeStore.domain})</span>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div className="p-5 sm:p-6 border-t border-stone-100 bg-white flex flex-col sm:flex-row items-center gap-3">
          
          {/* Copy shade button */}
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Copied Shade Details!</span>
              </>
            ) : (
              <span>Copy Shade Code</span>
            )}
          </button>

          {/* Direct Buy / Checkout Button on Active Selected Store */}
          <a
            href={activeStore.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!activeStore.url) {
                e.preventDefault();
                return;
              }
            }}
            className="flex-1 w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-stone-900/10 hover:shadow-rose-600/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Buy on {activeStore.name} — ₹{currentStorePrice.toLocaleString('en-IN')}</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </div>
  );
};

export const SingleProductModal: React.FC<SingleProductModalProps> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <SingleProductModalContent
      key={item.product.id || `${item.product.brand}-${item.product.title}`}
      item={item}
      onClose={onClose}
    />
  );
};

