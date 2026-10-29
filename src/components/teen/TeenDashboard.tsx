import React, { useState } from 'react';
import {
  QrCode,
  Send,
  Sparkles,
  Lock,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import { store } from '../../services/store';
import { PayMerchantModal } from './PayMerchantModal';
import { RequestMoneyModal } from './RequestMoneyModal';
import { AiInsightsModal } from './AiInsightsModal';
import { SpendCategory } from '../../types';

interface TeenDashboardProps {
  teenId: string;
  onNavigateTab: (tab: 'home' | 'pay' | 'request' | 'passbook' | 'insights') => void;
  onOpenCompliance: () => void;
}

export const TeenDashboard: React.FC<TeenDashboardProps> = ({
  teenId,
  onNavigateTab,
  onOpenCompliance,
}) => {
  const teen = store.getTeenProfile(teenId);
  const wallet = store.getTeenWallet(teenId);
  const guardian = store.getGuardian();
  const allTx = store.getState().transactions.filter((t) => t.teenId === teenId);
  const recentTx = allTx.slice(0, 5);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  if (!teen || !wallet) {
    return (
      <div className="p-8 text-center text-slate-500">
        Teen wallet profile not found.
      </div>
    );
  }

  const dailyRemaining = Math.max(0, wallet.dailySpendingLimit - wallet.spentToday);
  const dailySpentPercent =
    wallet.dailySpendingLimit > 0
      ? Math.min(100, Math.round((wallet.spentToday / wallet.dailySpendingLimit) * 100))
      : 0;

  const categories: SpendCategory[] = ['Food', 'Travel', 'Education', 'Entertainment'];

  return (
    <div className="space-y-6">
      {/* Wallet Paused Alert if applicable */}
      {wallet.isPaused && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-3 text-rose-950 shadow-xs">
          <div className="p-2.5 bg-rose-600 text-white rounded-xl shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Wallet Paused by Guardian</h4>
            <p className="text-xs text-rose-800 mt-0.5">
              Your payments are temporarily paused. Contact {guardian?.fullName || 'your parent'} to reactivate spending.
            </p>
          </div>
        </div>
      )}

      {/* Main Teen Allowance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-700 via-teal-800 to-slate-900 text-white p-6 shadow-xl border border-teal-600/30">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                Digital Allowance Balance
              </span>
              <span className="bg-teal-900/80 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-600/40">
                INR (₹)
              </span>
            </div>
            <span className="text-xs font-medium text-teal-200">
              Parent: {guardian?.fullName || 'Priya Sharma'}
            </span>
          </div>

          <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-1">
            <span>₹</span>
            <span>{wallet.balance.toLocaleString('en-IN')}</span>
          </div>

          {/* Daily limit tracker inside card */}
          <div className="pt-2 border-t border-teal-600/40 space-y-1.5">
            <div className="flex justify-between text-xs text-teal-100">
              <span>Today&apos;s Spending Room:</span>
              <span className="font-bold">
                ₹{dailyRemaining} left of ₹{wallet.dailySpendingLimit}
              </span>
            </div>
            <div className="w-full bg-teal-950/60 rounded-full h-2 overflow-hidden border border-teal-600/30">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  dailySpentPercent >= 85
                    ? 'bg-rose-400'
                    : dailySpentPercent >= 60
                    ? 'bg-amber-300'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${dailySpentPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {/* Pay Button */}
        <button
          type="button"
          disabled={wallet.isPaused}
          onClick={() => setIsPayModalOpen(true)}
          className="p-3.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs shadow-md flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <span>Pay Merchant</span>
        </button>

        {/* Request Money */}
        <button
          type="button"
          onClick={() => setIsRequestModalOpen(true)}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold text-xs shadow-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <span>Ask Parent</span>
        </button>

        {/* AI Insights */}
        <button
          type="button"
          onClick={() => setIsInsightsOpen(true)}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold text-xs shadow-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>AI Insights</span>
        </button>
      </div>

      {/* Category Remaining Budget Cards */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Monthly Category Budgets
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Guardian Set</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const limit = wallet.categoryLimits[cat] ?? 1000;
            const spent = wallet.categorySpentMonth[cat] ?? 0;
            const remaining = Math.max(0, limit - spent);
            const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;

            return (
              <div
                key={cat}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5"
              >
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat}</span>
                  <span className="text-slate-600 font-bold">₹{remaining} left</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${
                      percent >= 85 ? 'bg-rose-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  Spent ₹{spent} of ₹{limit} limit
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Spend Passbook */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-500" />
            <h3 className="font-extrabold text-sm text-slate-900">
              My Recent Payments
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('passbook')}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTx.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No payments made yet. Tap &ldquo;Pay Merchant&rdquo; to test a simulated scan!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTx.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      tx.type === 'spend'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tx.type === 'spend' ? '₹' : '+'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {tx.payeeName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {tx.category} • {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-black text-sm ${
                      tx.type === 'spend' ? 'text-slate-900' : 'text-emerald-700'
                    }`}
                  >
                    {tx.type === 'spend' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Bal: ₹{tx.balanceAfter}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controlled Spending Notice */}
      <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
        <span>PocketSafe Zero-Debt Rule: You can never borrow or overdraw.</span>
        <button
          onClick={onOpenCompliance}
          className="text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2 ml-2 shrink-0"
        >
          Details
        </button>
      </div>

      {/* Modals */}
      <PayMerchantModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        teenId={teen.id}
      />

      <RequestMoneyModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        teenId={teen.id}
      />

      <AiInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        teenId={teen.id}
      />
    </div>
  );
};
