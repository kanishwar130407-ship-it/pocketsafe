import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  Send,
  Sliders,
  UserPlus,
  AlertCircle,
  Lock,
  Unlock,
  ArrowUpRight,
  RotateCcw,
  Clock,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { store } from '../../services/store';
import { AddFamilyMoneyModal } from './AddFamilyMoneyModal';
import { AllocateAllowanceModal } from './AllocateAllowanceModal';
import { WalletControlsModal } from './WalletControlsModal';
import { AddTeenModal } from './AddTeenModal';
import { TeenProfile, Transaction } from '../../types';

interface GuardianDashboardProps {
  onNavigateTab: (tab: 'dashboard' | 'requests' | 'ledger' | 'settings') => void;
  onOpenCompliance: () => void;
}

export const GuardianDashboard: React.FC<GuardianDashboardProps> = ({
  onNavigateTab,
  onOpenCompliance,
}) => {
  const state = store.getState();
  const family = state.family;
  const teens = state.teens;
  const pendingRequests = state.moneyRequests.filter((r) => r.status === 'pending');
  const recentTransactions = state.transactions.slice(0, 6);

  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [selectedTeenForAllocate, setSelectedTeenForAllocate] = useState<string | undefined>(undefined);
  const [activeControlsWalletId, setActiveControlsWalletId] = useState<string | null>(null);
  const [isAddTeenOpen, setIsAddTeenOpen] = useState(false);
  const [reverseSuccessToast, setReverseSuccessToast] = useState<string | null>(null);

  const handleQuickPauseToggle = (walletId: string, currentPaused: boolean) => {
    store.updateWalletControls(walletId, { isPaused: !currentPaused });
  };

  const handleReverseTransaction = (tx: Transaction) => {
    const res = store.reverseTransaction(tx.id, 'Parent requested demo refund');
    if (res.success) {
      setReverseSuccessToast(`Refunded ₹${tx.amount} back to ${tx.teenName}`);
      setTimeout(() => setReverseSuccessToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Reverse Toast */}
      {reverseSuccessToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reverseSuccessToast}</span>
        </div>
      )}

      {/* Hero Family Reserve Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-6 shadow-xl border border-teal-700/40">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                Family Allowance Reserve (Parent Pool)
              </span>
              <span className="bg-teal-700/60 text-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-600/40">
                Sandbox
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
              <span>₹</span>
              <span>{family.familyBalance.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-teal-200/90 max-w-sm">
              Funds stored here can be allocated to teen wallets on schedule or upon approving teen requests.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddMoneyOpen(true)}
              className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Mock Money</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTeenForAllocate(teens[0]?.id);
                setIsAllocateOpen(true);
              }}
              className="py-2.5 px-4 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all border border-teal-600/60 shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Send Allowance</span>
            </button>
          </div>
        </div>

        {/* Verification Status strip */}
        <div className="mt-5 pt-4 border-t border-teal-700/50 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-teal-100 font-medium">
              Guardian KYC: <strong>{family.verificationDetails?.maskedName || 'Verified (P*** S***)'}</strong>
            </span>
            <span className="text-teal-300 font-mono text-[11px]">
              ({family.verificationDetails?.maskedAadhaarRef || 'XXXX-XXXX-8921'})
            </span>
          </div>
          <button
            onClick={onOpenCompliance}
            className="text-[11px] underline underline-offset-2 hover:text-white"
          >
            Zero-Debt Guarantee Active
          </button>
        </div>
      </div>

      {/* Pending Requests Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {pendingRequests.length}
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-950">
                Pending Money Request{pendingRequests.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-amber-800">
                {pendingRequests[0].teenName} requested ₹{pendingRequests[0].amount} for &ldquo;{pendingRequests[0].reason}&rdquo;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('requests')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Review Requests
          </button>
        </div>
      )}

      {/* Teen Wallets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Teen Allowance Wallets ({teens.length})
            </h3>
            <p className="text-xs text-slate-500">
              Each teen can only spend what you load. Zero loans, zero negative balance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddTeenOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Teen</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teens.map((teen) => {
            const wallet = state.wallets[teen.walletId];
            if (!wallet) return null;

            const spentPercent = wallet.dailySpendingLimit > 0
              ? Math.min(100, Math.round((wallet.spentToday / wallet.dailySpendingLimit) * 100))
              : 0;

            const remainingDaily = Math.max(0, wallet.dailySpendingLimit - wallet.spentToday);

            return (
              <div
                key={teen.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs relative ${
                  wallet.isPaused
                    ? 'border-rose-300 ring-1 ring-rose-300/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Status Badges */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-base text-teal-800">
                      {teen.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {teen.name}
                        </h4>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Age {teen.age}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        @{teen.username} • Weekly Allowance: ₹{wallet.allowanceAmount}
                      </p>
                    </div>
                  </div>

                  {wallet.isPaused ? (
                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                      <Lock className="w-3 h-3" /> Paused
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                {/* Balances & Daily Limits Meter */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">Available Balance</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{wallet.balance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Daily limit progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">
                        Daily spent: <strong>₹{wallet.spentToday}</strong> of ₹{wallet.dailySpendingLimit}
                      </span>
                      <span className="font-semibold text-slate-700">
                        ₹{remainingDaily} left today
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          spentPercent >= 90
                            ? 'bg-rose-500'
                            : spentPercent >= 70
                            ? 'bg-amber-500'
                            : 'bg-teal-600'
                        }`}
                        style={{ width: `${spentPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons for Teen */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTeenForAllocate(teen.id);
                      setIsAllocateOpen(true);
                    }}
                    className="flex-1 py-2 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Funds</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveControlsWalletId(wallet.id)}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Limits</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPauseToggle(wallet.id, wallet.isPaused)}
                    title={wallet.isPaused ? 'Unpause Wallet' : 'Pause Wallet'}
                    className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      wallet.isPaused
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {wallet.isPaused ? (
                      <Lock className="w-4 h-4 text-rose-700" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed with Reversal Capability */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Recent Family Transactions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('ledger')}
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>Full Ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    tx.type === 'spend'
                      ? 'bg-slate-100 text-slate-700'
                      : tx.type === 'reversal'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tx.type === 'spend' ? '₹' : '+'}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    {tx.payeeName}
                    {tx.status === 'reversed' && (
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">
                        Reversed
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {tx.teenName || 'Teen'} • {tx.category} • {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`font-black text-sm ${
                      tx.type === 'spend' && tx.status !== 'reversed'
                        ? 'text-slate-900'
                        : 'text-emerald-700'
                    }`}
                  >
                    {tx.type === 'spend' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Bal: ₹{tx.balanceAfter}
                  </div>
                </div>

                {/* Reverse Button for Guardian Demo */}
                {tx.type === 'spend' && tx.status !== 'reversed' && (
                  <button
                    type="button"
                    onClick={() => handleReverseTransaction(tx)}
                    title="Reverse transaction (guardian refund demo)"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddFamilyMoneyModal
        isOpen={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
      />

      <AllocateAllowanceModal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        defaultTeenId={selectedTeenForAllocate}
      />

      {activeControlsWalletId && (
        <WalletControlsModal
          isOpen={true}
          onClose={() => setActiveControlsWalletId(null)}
          walletId={activeControlsWalletId}
        />
      )}

      <AddTeenModal
        isOpen={isAddTeenOpen}
        onClose={() => setIsAddTeenOpen(false)}
        onTeenAdded={(newId) => {
          setSelectedTeenForAllocate(newId);
        }}
      />
    </div>
  );
};
