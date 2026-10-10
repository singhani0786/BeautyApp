import React from 'react';
import { X, CheckCircle, AlertTriangle, Key, ExternalLink, HelpCircle } from 'lucide-react';
import { SourceStatusInfo } from '../types/api';

interface RetailerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: SourceStatusInfo[];
}

export const RetailerDrawer: React.FC<RetailerDrawerProps> = ({ isOpen, onClose, sources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <h2 className="text-xl font-bold font-serif-display text-stone-900">
                Retailer Integration & Capability Matrix
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Real status of live APIs, credentials, and affiliate capabilities
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Production Isolation Policy:</span> Missing credentials are
                explicitly reported as <strong>UNCONFIGURED</strong>. The system will never fabricate
                fake live API prices or mock active affiliate networks.
              </div>
            </div>

            <div className="space-y-4">
              {sources.map(source => {
                const isLive = source.is_configured;
                return (
                  <div
                    key={source.source_name}
                    className="p-5 rounded-2xl border border-stone-200/90 bg-stone-50/50 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-stone-900">{source.display_name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isLive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {isLive ? 'Active / Configured' : 'Needs Credentials'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{source.status_reason}</p>
                      </div>
                    </div>

                    {/* Capabilities grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-200/60">
                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/50 text-[11px]">
                        <span className="text-stone-400 block font-semibold text-[10px]">Catalogue</span>
                        <span
                          className={`font-bold ${
                            source.capabilities.has_catalogue_search
                              ? 'text-emerald-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {source.capabilities.has_catalogue_search ? 'Available' : 'No Catalog'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/50 text-[11px]">
                        <span className="text-stone-400 block font-semibold text-[10px]">Live Prices</span>
                        <span
                          className={`font-bold ${
                            source.capabilities.has_live_prices
                              ? 'text-emerald-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {source.capabilities.has_live_prices ? 'Live API' : 'No Live API'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/50 text-[11px]">
                        <span className="text-stone-400 block font-semibold text-[10px]">Affiliate Links</span>
                        <span
                          className={`font-bold ${
                            source.capabilities.has_affiliate_links
                              ? 'text-emerald-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {source.capabilities.has_affiliate_links ? 'Supported' : 'None'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-stone-200/50 text-[11px]">
                        <span className="text-stone-400 block font-semibold text-[10px]">Tracking</span>
                        <span
                          className={`font-bold ${
                            source.capabilities.has_conversion_tracking
                              ? 'text-emerald-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {source.capabilities.has_conversion_tracking ? 'Supported' : 'None'}
                        </span>
                      </div>
                    </div>

                    {/* Missing Credentials Checklist */}
                    {source.missing_credentials.length > 0 && (
                      <div className="pt-2 text-xs">
                        <span className="font-semibold text-stone-700 block mb-1 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-stone-400" />
                          <span>Required Backend Keys (.env):</span>
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {source.missing_credentials.map(c => (
                            <code
                              key={c}
                              className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px]"
                            >
                              {c}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Configure keys in <code>.env</code> and restart the backend container.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold text-xs rounded-xl hover:bg-stone-800 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

