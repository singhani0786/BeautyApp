import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PhotoCapture } from './components/PhotoCapture';
import { ToneSelector } from './components/ToneSelector';
import { RecommendationCard } from './components/RecommendationCard';
import { RetailerDrawer } from './components/RetailerDrawer';
import {
  FaceAnalysisResult,
  RecommendationResponse,
  SourceStatusInfo,
  ProductInfo,
} from './types/api';
import { API_BASE_URL } from './api/config';
import { Sparkles, ShoppingBag, ShieldCheck, HelpCircle } from 'lucide-react';

export function App() {
  const [sources, setSources] = useState<SourceStatusInfo[]>([]);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // User Preferences
  const [undertone, setUndertone] = useState<string>('warm');
  const [skinDepth, setSkinDepth] = useState<string>('medium');
  const [skinType, setSkinType] = useState<string>('all');
  const [category, setCategory] = useState<string>('foundation');
  const [budgetInr, setBudgetInr] = useState<number | null>(1000);

  // States
  const [faceAnalysis, setFaceAnalysis] = useState<FaceAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch sources status on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sources/status`)
      .then(res => res.json())
      .then(data => setSources(data))
      .catch(() => {
        // Fallback placeholder if backend not yet running during initial render
        setSources([]);
      });
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
      <Header
        sources={sources}
        onOpenMatrix={() => setIsMatrixOpen(true)}
        detectedTone={skinDepth}
        detectedUndertone={undertone}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Complexion Match
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-display text-stone-900 tracking-tight leading-tight">
            Flawless Makeup Shade Recommendations for Indian Skin
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Eliminate shade guesswork. Take or upload a selfie to detect your exact undertone and depth,
            or customize your INR budget to discover verified products across top Indian retailers.
          </p>
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
                <RecommendationCard key={rec.tag} item={rec} />
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

          {/* Alternative Picks Section */}
          {recommendations && recommendations.alternative_picks.length > 0 && (
            <div className="pt-8 space-y-4">
              <h3 className="font-serif-display font-bold text-lg text-stone-900">
                Additional Matching Formulations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.alternative_picks.map(alt => {
                  const altUrl = alt.best_price?.affiliate_url || alt.best_price?.product_url || '#';
                  return (
                    <div
                      key={alt.id}
                      onClick={() => {
                        if (altUrl && altUrl !== '#') window.open(altUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-4 bg-white rounded-2xl border border-stone-200/70 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border border-black/10 shadow-xs flex-shrink-0"
                          style={{ backgroundColor: alt.matched_variant?.hex_color || '#E5A882' }}
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-600 block">
                            {alt.brand}
                          </span>
                          <span className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                            {alt.title}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Shade: {alt.matched_variant?.shade_name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900 block">
                          ₹{alt.best_price?.current_price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-rose-600 font-bold group-hover:underline">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-8 mt-16 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GlowGuide AI. Built for Indian Complexions & Retailers.</p>
          <div className="flex items-center gap-4 text-stone-600">
            <span>In-Memory Privacy Safeguards</span>
            <span>•</span>
            <button
              onClick={() => setIsMatrixOpen(true)}
              className="hover:text-rose-600 font-semibold transition-colors"
            >
              API Integration Matrix
            </button>
          </div>
        </div>
      </footer>

      {/* Retailer Integration Matrix Drawer */}
      <RetailerDrawer
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        sources={sources}
      />
    </div>
  );
}

