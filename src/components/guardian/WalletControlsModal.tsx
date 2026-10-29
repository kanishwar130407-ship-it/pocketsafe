import React, { useState } from 'react';
import { Sliders, Shield, AlertTriangle, CheckCircle2, Lock, Unlock, X } from 'lucide-react';
import { store } from '../../services/store';
import { SpendCategory } from '../../types';

interface WalletControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
}

export const WalletControlsModal: React.FC<WalletControlsModalProps> = ({
  isOpen,
  onClose,
  walletId,
}) => {
  const wallet = store.getWallet(walletId);
  const teen = wallet ? store.getTeenProfile(wallet.teenId) : null;

  const [isPaused, setIsPaused] = useState(wallet?.isPaused || false);
  const [dailyLimit, setDailyLimit] = useState(wallet?.dailySpendingLimit || 400);
  const [allowanceAmount, setAllowanceAmount] = useState(wallet?.allowanceAmount || 1000);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'custom'>(
    wallet?.allowanceFrequency || 'weekly'
  );
  const [categoryLimits, setCategoryLimits] = useState<Record<SpendCategory, number>>(
    wallet?.categoryLimits || {
      Food: 2000,
      Travel: 1500,
      Education: 1200,
      Entertainment: 800,
      Shopping: 1000,
      Other: 500,
    }
  );
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen || !wallet || !teen) return null;

  const handleSave = () => {
    store.updateWalletControls(wallet.id, {
      isPaused,
      dailySpendingLimit: Number(dailyLimit),
      allowanceAmount: Number(allowanceAmount),
      allowanceFrequency: frequency,
      categoryLimits,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  const handleCategoryChange = (category: SpendCategory, value: number) => {
    setCategoryLimits((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const categories: SpendCategory[] = [
    'Food',
    'Travel',
    'Education',
    'Entertainment',
    'Shopping',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-teal-800 text-white p-5 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Controls for {teen.name}
              </h3>
              <p className="text-xs text-teal-200">Wallet limits & spending policies</p>
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
          {/* Emergency Lock / Pause Card */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isPaused
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isPaused ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isPaused ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {isPaused ? 'Wallet Is Locked / Paused' : 'Wallet Is Active'}
                  </h4>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {isPaused
                      ? 'Teen cannot make any merchant payments until you unpause.'
                      : 'Teen can make merchant spends within assigned daily limits.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                  isPaused
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {isPaused ? 'Unlock Wallet' : 'Pause Spends'}
              </button>
            </div>
          </div>

          {/* Daily Limit & Allowance Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Daily Spending Limit (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  step="50"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Today&apos;s spent: ₹{wallet.spentToday}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Scheduled Allowance (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  max="20000"
                  step="100"
                  value={allowanceAmount}
                  onChange={(e) => setAllowanceAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {(['weekly', 'monthly'] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                      frequency === freq
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Per-Category Monthly Limits */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-700" />
                Category Monthly Limits (₹)
              </h4>
              <p className="text-[11px] text-slate-500">
                Spends in each category are capped to prevent budget drainage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{cat}</span>
                    <span className="text-[10px] text-slate-500">
                      Spent: ₹{wallet.categorySpentMonth[cat] || 0}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={categoryLimits[cat] || 0}
                      onChange={(e) => handleCategoryChange(cat, Number(e.target.value))}
                      className="w-full pl-7 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between rounded-b-2xl">
          {savedToast ? (
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
            </span>
          ) : (
            <span className="text-slate-400 text-xs">Synchronized via Zero-Trust Rules</span>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-600 hover:bg-slate-200/60 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Save Controls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
