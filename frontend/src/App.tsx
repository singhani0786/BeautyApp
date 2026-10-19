import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PhotoCapture } from './components/PhotoCapture';
import { ToneSelector } from './components/ToneSelector';
import { RecommendationCard } from './components/RecommendationCard';
import { SingleProductModal } from './components/SingleProductModal';
import {
  FaceAnalysisResult,
  RecommendationResponse,
  RecommendationCategoryResult,
  ProductInfo,
} from './types/api';
import { API_BASE_URL } from './api/config';
import { getSafeProductUrl } from './utils/urlHelper';
import { Sparkles, ShoppingBag, ShieldCheck, CheckCircle2, Award, HeartHandshake } from 'lucide-react';

export function App() {
  // User Preferences
  const [undertone, setUndertone] = useState<string>('warm');
  const [skinDepth, setSkinDepth] = useState<string>('medium');
  const [skinType, setSkinType] = useState<string>('all');
  const [category, setCategory] = useState<string>('foundation');
  const [budgetInr, setBudgetInr] = useState<number | null>(1000);

  // States
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<RecommendationCategoryResult | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial recommendation fetch
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAnalysisComplete = (result: FaceAnalysisResult) => {
    setFaceAnalysis(result);
    setUndertone(result.undertone);
    setSkinDepth(result.skin_depth);

    // Automatically refresh recommendations with newly calibrated shade
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-800 relative selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      {/* Radiant Luxury Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-rose-100/50 via-amber-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-36 -left-48 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-64 -right-48 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <Header
        detectedTone={skinDepth}
        detectedUndertone={undertone}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Editorial Luxury Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/70 text-rose-800 text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>AI-Powered Shade & Undertone Harmonization</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif-display text-stone-900 tracking-tight leading-[1.15]">
            Discover Your True Shade Formulation for{' '}
            <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 bg-clip-text text-transparent">
              Indian Complexions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Eliminate makeup shade guesswork. Scan your face to reveal your exact undertone and depth, then explore verified, in-stock products with authentic store pricing.
          </p>

          {/* Luxury Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-stone-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% In-Stock Product PDPs
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Official Partner Stores
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Zero Photo Storage
            </span>
          </div>
        </div>

        {/* Step 1: Face Photo Capture */}
        <section>
          <PhotoCapture
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoadingAnalysis}
            analysisResult={faceAnalysis}
          />
        </section>

        {/* Step 2: Preferences & Budget */}
        <section>
          <ToneSelector
            undertone={undertone}
            skinDepth={skinDepth}
            skinType={skinType}
            setSkinType={setSkinType}
            category={category}
            setCategory={setCategory}
            budgetInr={budgetInr}
            setBudgetInr={setBudgetInr}
            onFetchRecommendations={fetchRecommendations}
            isLoading={isLoadingRecommendations}
            faceAnalysis={faceAnalysis}
          />
        </section>

        {/* Step 3: Categorized Recommendations Display */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                Tailored Results
              </span>
              <h2 className="text-2xl font-bold font-serif-display text-stone-900">
                Curated Recommendations
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Showing matches for{' '}
                <span className="font-bold capitalize text-stone-800">{skinDepth}</span> depth,{' '}
                <span className="font-bold capitalize text-stone-800">{undertone}</span> undertone
                {budgetInr ? (
                  <span>
                    {' '}within{' '}
                    <span className="font-bold text-rose-600">
                      ₹{budgetInr.toLocaleString('en-IN')}
                    </span>
                  </span>
                ) : (
                  <span> with no budget cap</span>
                )}
                .
              </p>
            </div>

            {recommendations && (
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full">
                {recommendations.total_candidates_found} suitable variants evaluated
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              {errorMsg}
            </div>
          )}

          {/* 4 Categorized Cards */}
          {isLoadingRecommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm animate-pulse space-y-4">
                  <div className="h-4 bg-stone-200 rounded-full w-2/3" />
                  <div className="h-32 bg-stone-100 rounded-2xl" />
                  <div className="h-5 bg-stone-200 rounded-md w-3/4" />
                  <div className="h-4 bg-stone-100 rounded-md w-1/2" />
                  <div className="h-10 bg-stone-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : recommendations && recommendations.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.recommendations.map(rec => (
                <RecommendationCard
                  key={rec.tag}
                  item={rec}
                  onSelectProduct={(item) => setSelectedProduct(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="font-bold text-lg text-stone-800">No Products Under Selected Budget</h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto">
                No verified products in this category matched the ₹{budgetInr?.toLocaleString('en-IN')}{' '}
                price cap. Try raising your budget or selecting "No Budget Limit" to see luxury formulations.
              </p>
              <button
                onClick={() => {
                  setBudgetInr(null);
                  fetchRecommendationsWithParams(undertone, skinDepth, skinType, category, null);
                }}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all"
              >
                Clear Budget Limit
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/80 backdrop-blur-md py-8 mt-16 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GlowGuide AI. Dedicated to Indian Complexions & Authentic Retailers.</p>
          <div className="flex items-center gap-4 text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% In-Memory Privacy Safeguard
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium text-stone-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
              Live Direct Store Verified
            </span>
          </div>
        </div>
      </footer>

      {/* Single Dedicated Product Modal */}
      {selectedProduct && (
        <SingleProductModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

