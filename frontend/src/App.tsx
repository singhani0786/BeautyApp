import React, { useState, useEffect } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { ComplexionCard } from './components/ComplexionCard';
import { EditorialCard } from './components/EditorialCard';
import { PhotoModal } from './components/PhotoModal';
import { EditProfileModal } from './components/EditProfileModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ShortlistModal } from './components/ShortlistModal';
import { SingleProductModal } from './components/SingleProductModal';
import {
  FaceAnalysisResult,
  RecommendationResponse,
  RecommendationCategoryResult,
} from './types/api';
import { API_BASE_URL } from './api/config';
import { Sparkles, ShoppingBag } from 'lucide-react';

const CATEGORIES = [
  { id: 'foundation', label: 'Foundation', icon: '🧴' },
  { id: 'concealer', label: 'Concealer', icon: '🪄' },
  { id: 'lipstick', label: 'Lipstick', icon: '💄' },
  { id: 'blush', label: 'Blush', icon: '🌸' },
  { id: 'compact', label: 'Compact', icon: '🪞' },
];

export function App() {
  // Complexion & Filter States
  const [undertone, setUndertone] = useState<string>('warm');
  const [skinDepth, setSkinDepth] = useState<string>('medium');
  const [skinType, setSkinType] = useState<string>('all');
  const [category, setCategory] = useState<string>('foundation');
  const [budgetInr, setBudgetInr] = useState<number | null>(1000);

  // Data States
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<RecommendationCategoryResult | null>(null);
  const [shortlist, setShortlist] = useState<RecommendationCategoryResult[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [activeTab, setActiveTab] = useState<'studio' | 'how-it-works'>('studio');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);

  // Initial recommendation fetch
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAnalysisComplete = (result: FaceAnalysisResult, photoUrl?: string) => {
    setFaceAnalysis(result);
    if (photoUrl) {
      setUserPhotoUrl(photoUrl);
    }
    setUndertone(result.undertone);
    setSkinDepth(result.skin_depth);

    // Refresh recommendations with newly calibrated shade
    fetchRecommendationsWithParams(result.undertone, result.skin_depth, skinType, category, budgetInr);
  };

  const fetchRecommendations = () => {
    fetchRecommendationsWithParams(undertone, skinDepth, skinType, category, budgetInr);
  };

  const fetchRecommendationsWithParams = async (
    u: string,
    d: string,
    st: string,
    cat: string,
    budget: number | null
  ) => {
    setIsLoadingRecommendations(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          undertone: u,
          skin_depth: d,
          skin_type: st,
          category: cat,
          budget_inr: budget,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve recommendations.');
      }

      const data: RecommendationResponse = await res.json();
      setRecommendations(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading recommendations.');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleToggleShortlist = (item: RecommendationCategoryResult) => {
    setShortlist(prev => {
      const exists = prev.some(p => p.product.id === item.product.id);
      if (exists) {
        return prev.filter(p => p.product.id !== item.product.id);
      }
      return [...prev, item];
    });
  };

  const handleTabChange = (tab: 'studio' | 'how-it-works') => {
    setActiveTab(tab);
    if (tab === 'how-it-works') {
      setIsHowItWorksOpen(true);
    }
  };

  const sampleShadeDots = [
    { bg: '#F8D9B6', label: 'Fair' },
    { bg: '#E7BF92', label: 'Light' },
    { bg: '#DFA975', label: 'Medium' },
    { bg: '#BF824A', label: 'Tan' },
    { bg: '#8B4D29', label: 'Deep' },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#FFF5F7] via-[#FFFBF9] to-[#FDF4F8] text-[#2D2529] selection:bg-rose-100 selection:text-rose-900 relative">
      
      {/* Ambient Dreamy Floating Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Minimalist Editorial Header */}
      <StudioHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
      />

      {/* 2. Main Studio Viewport Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex flex-col justify-between overflow-y-auto lg:overflow-hidden gap-3">
        
        {/* Compact Hero Banner Matching Screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 border-b border-rose-100/80 pb-2.5">
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-widest uppercase text-rose-500 block mb-0.5">
              ✨ A little science, a whole lot of glam 💄
            </span>
            <h1 className="font-serif-editorial text-2xl sm:text-4xl text-[#2D2529] font-normal tracking-tight leading-none">
              Find your kind of <span className="font-serif-italic bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent font-semibold">match. ✨</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Good makeup starts with you. Let's find your dream shade. 🌸
            </p>
          </div>

          {/* Right Natural Shade Belonging Swatch Bar */}
          <div className="flex flex-col sm:items-end gap-1">
            <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-rose-100/80 shadow-2xs">
              {sampleShadeDots.map((dot) => (
                <span
                  key={dot.label}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs transition-transform hover:scale-125"
                  style={{ backgroundColor: dot.bg }}
                  title={dot.label}
                />
              ))}
            </div>
            <span className="font-serif-italic text-[11px] text-stone-500">
              Every skin shade belongs. 💖
            </span>
          </div>
        </div>

        {/* Studio Two-Column Single-Viewport Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch min-h-0">
          
          {/* Left Column: Complexion Portrait & Budget Control */}
          <div className="flex-shrink-0 flex justify-center lg:justify-start">
            <ComplexionCard
              skinDepth={skinDepth}
              undertone={undertone}
              budgetInr={budgetInr}
              onBudgetChange={(b) => {
                setBudgetInr(b);
                fetchRecommendationsWithParams(undertone, skinDepth, skinType, category, b);
              }}
              onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              faceAnalysis={faceAnalysis}
              userPhotoUrl={userPhotoUrl}
            />
          </div>

          {/* Right Column: Your Foundation Edit & Curated Cards */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-rose-100/80">
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif-editorial text-lg text-[#2D2529] font-semibold tracking-tight capitalize">
                  Your {category} edit ✨
                </h2>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/70">
                  {recommendations ? `0${recommendations.recommendations.length} Matches` : '04 Matches'}
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      fetchRecommendationsWithParams(undertone, skinDepth, skinType, cat.id, budgetInr);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
                      category === cat.id
                        ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white shadow-xs shadow-rose-200 border border-transparent'
                        : 'bg-white/85 hover:bg-rose-50/70 text-stone-600 border border-rose-200/60'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500 bg-white/70 px-2.5 py-1 rounded-full border border-rose-100">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Calibrated for your skin 💖</span>
              </div>
            </div>

            {/* Product Cards Row - Responsive 1 to 4 columns fitting perfectly in viewport */}
            <div className="flex-1 flex items-center min-h-0">
              {isLoadingRecommendations ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 animate-pulse space-y-3 h-[290px] flex flex-col justify-between">
                      <div className="h-28 bg-stone-100 rounded-xl" />
                      <div className="space-y-1.5">
                        <div className="h-3 bg-stone-200 rounded w-1/3" />
                        <div className="h-5 bg-stone-200 rounded w-3/4" />
                        <div className="h-3 bg-stone-100 rounded w-1/2" />
                      </div>
                      <div className="h-8 bg-stone-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : recommendations && recommendations.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
                  {recommendations.recommendations.slice(0, 4).map((rec, idx) => (
                    <EditorialCard
                      key={rec.product.id || rec.tag}
                      item={rec}
                      index={idx}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                      isShortlisted={shortlist.some(s => s.product.id === rec.product.id)}
                      onToggleShortlist={handleToggleShortlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full text-center py-12 bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
                  <h3 className="font-bold text-sm text-[#2D2825]">No Formulations Under ₹{budgetInr}</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try raising your budget limit or select "No budget limit" to see luxury formulations.
                  </p>
                  <button
                    onClick={() => {
                      setBudgetInr(null);
                      fetchRecommendationsWithParams(undertone, skinDepth, skinType, category, null);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-full bg-[#2D2825] text-white text-xs font-semibold"
                  >
                    Clear Budget
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Sub-footer Note */}
            <div className="flex items-center justify-between text-[10px] text-stone-500 pt-2 border-t border-[#E8E2D9]/70">
              <span className="font-serif-italic">Thoughtfully chosen. Always your choice.</span>
              <button
                onClick={() => setIsHowItWorksOpen(true)}
                className="hover:text-[#4A6953] transition-colors flex items-center gap-1"
              >
                <span>ⓘ A note on shade matching & store prices</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* 3. Modals (Preserves Single-Viewport Layout Without Page Expansion) */}
      
      {/* Photo Capture Modal */}
      <PhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
        isLoading={isLoadingAnalysis}
        analysisResult={faceAnalysis}
      />

      {/* Edit Profile / Shade Tuning Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        undertone={undertone}
        setUndertone={setUndertone}
        skinDepth={skinDepth}
        setSkinDepth={setSkinDepth}
        skinType={skinType}
        setSkinType={setSkinType}
        onApply={fetchRecommendations}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => {
          setIsHowItWorksOpen(false);
          setActiveTab('studio');
        }}
      />

      {/* Shortlist Modal */}
      <ShortlistModal
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={shortlist}
        onRemove={(item) => handleToggleShortlist(item)}
        onSelectProduct={(item) => setSelectedProduct(item)}
      />

      {/* Dedicated Multi-Store Product & Checkout Modal */}
      {selectedProduct && (
        <SingleProductModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
