import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X,
  PieChart,
} from 'lucide-react';
import { store } from '../../services/store';
import { fetchSpendingInsights } from '../../services/geminiClient';
import { SpendingInsightsResult } from '../../server/geminiHandler';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  teenId,
}) => {
  const teen = store.getTeenProfile(teenId);
  const wallet = store.getTeenWallet(teenId);
  const transactions = store.getState().transactions.filter((t) => t.teenId === teenId);

  const [insights, setInsights] = useState<SpendingInsightsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSpendingInsights(transactions, wallet);
      setInsights(data);
    } catch (err: any) {
      setError('Unable to load AI insights. Displaying local summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadInsights();
    }
  }, [isOpen, teenId]);

  if (!isOpen || !teen || !wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-800 to-slate-900 text-white p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-amber-950 rounded-xl shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Spending Insights</h3>
                <span className="bg-teal-700 text-teal-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-teal-200">Personalized Financial Coaching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-slate-700">
          {/* Privacy Note */}
          <div className="p-2.5 bg-teal-50/60 border border-teal-100 rounded-xl text-[11px] text-teal-900 flex items-center justify-between">
            <span>🔒 Anonymized telemetry: Zero personal identifiers or names are sent to AI.</span>
            <button
              onClick={loadInsights}
              disabled={loading}
              className="text-teal-700 hover:text-teal-950 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
              <p className="text-xs font-bold text-slate-800">
                Analyzing spending trends & limit health...
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Synthesizing categorized ledger records into teen-friendly financial advice
              </p>
            </div>
          ) : insights ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Financial Health Score & Weekly Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Weekly Overview
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {insights.weeklySummary}
                  </p>
                </div>
                <div className="text-center shrink-0 p-3 bg-white border border-teal-200 rounded-2xl shadow-xs">
                  <div className="text-2xl font-black text-teal-800">
                    {insights.healthScore}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">
                    Health Score
                  </span>
                </div>
              </div>

              {/* Limit Status & Warning */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                  insights.limitWarning.toLowerCase().includes('warning') ||
                  insights.limitWarning.toLowerCase().includes('alert')
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <AlertTriangle
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    insights.limitWarning.toLowerCase().includes('warning')
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                />
                <div>
                  <h4 className="font-bold text-xs">Limit Monitor</h4>
                  <p className="text-[11px] mt-0.5 leading-normal">
                    {insights.limitWarning}
                  </p>
                </div>
              </div>

              {/* Top Categories Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-teal-700" />
                  Top Spending Categories
                </h4>
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {insights.topSpendingCategories.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{item.category}</span>
                        <span className="text-slate-600 font-medium">
                          ₹{item.amount.toLocaleString('en-IN')}{' '}
                          <span className="text-slate-400">({item.percentage}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-teal-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Teen Saving Suggestion */}
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-teal-700 text-white rounded-xl shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-teal-950 text-xs">Smart Saving Tip</h4>
                  <p className="text-[11px] text-teal-900 mt-1 leading-relaxed">
                    {insights.savingSuggestion}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              No insights available yet. Spend at a few demo merchants to see analytics!
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
