import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Filter,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  X,
  Lock,
} from 'lucide-react';
import { store } from '../../services/store';
import { SpendCategory, Transaction, TransactionStatus } from '../../types';

interface TransactionLedgerProps {
  onRefresh?: () => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({ onRefresh }) => {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const isGuardian = currentUser?.role === 'guardian';
  const teens = state.teens;

  // Filter state
  const [selectedTeenId, setSelectedTeenId] = useState<string>(
    isGuardian ? 'ALL' : currentUser?.id || 'ALL'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTxDetail, setActiveTxDetail] = useState<Transaction | null>(null);
  const [reversalToast, setReversalToast] = useState<string | null>(null);

  // Filtered transactions
  const transactions = state.transactions.filter((tx) => {
    if (!isGuardian && tx.teenId !== currentUser?.id) {
      return false;
    }
    if (selectedTeenId !== 'ALL' && tx.teenId !== selectedTeenId) {
      return false;
    }
    if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'ALL' && tx.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPayee = tx.payeeName.toLowerCase().includes(q);
      const matchNote = tx.note.toLowerCase().includes(q);
      const matchId = tx.id.toLowerCase().includes(q);
      if (!matchPayee && !matchNote && !matchId) return false;
    }
    return true;
  });

  const handleReverse = (tx: Transaction) => {
    const res = store.reverseTransaction(tx.id, 'Parent requested reversal in ledger');
    if (res.success) {
      setReversalToast(`Transaction #${tx.id} reversed and refunded to ${tx.teenName}`);
      setTimeout(() => setReversalToast(null), 3000);
      setActiveTxDetail(null);
      onRefresh?.();
    }
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
    <div className="space-y-6">
      {/* Reversal notification */}
      {reversalToast && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{reversalToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-700" />
            <span>Immutable Ledger</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographic ledger tracking all spends, allowance loads, and parent reversals.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {transactions.length} record{transactions.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payee, note, or ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Teen Filter (Guardian only) */}
          {isGuardian && (
            <select
              value={selectedTeenId}
              onChange={(e) => setSelectedTeenId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            >
              <option value="ALL">All Teens</option>
              {teens.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="success">Success</option>
            <option value="reversed">Reversed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No transactions match the selected filters.
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setActiveTxDetail(tx)}
              className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    tx.type === 'spend'
                      ? 'bg-slate-100 text-slate-800'
                      : tx.type === 'reversal'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tx.type === 'spend' ? '₹' : tx.type === 'reversal' ? '↩' : '+'}
                </div>

                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span>{tx.payeeName}</span>
                    {tx.status === 'reversed' && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded-full">
                        Reversed
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    {isGuardian && <span className="font-semibold text-slate-700">{tx.teenName}</span>}
                    <span>• {tx.category}</span>
                    <span>• {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`font-black text-sm ${
                      tx.type === 'spend' && tx.status !== 'reversed'
                        ? 'text-slate-900'
                        : tx.type === 'reversal'
                        ? 'text-purple-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {tx.type === 'spend' ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Bal: ₹{tx.balanceAfter}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Drawer / Modal */}
      {activeTxDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-teal-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Ledger Record</h3>
                  <p className="text-xs text-teal-200 font-mono">#{activeTxDetail.id}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTxDetail(null)}
                className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="text-center py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Transaction Amount
                </span>
                <div className="text-3xl font-black text-slate-900 mt-0.5">
                  ₹{activeTxDetail.amount.toLocaleString('en-IN')}
                </div>
                <span
                  className={`inline-block mt-1 font-bold text-[10px] px-2 py-0.5 rounded-full capitalize ${
                    activeTxDetail.status === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeTxDetail.status === 'reversed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {activeTxDetail.status}
                </span>
              </div>

              {/* Data Rows */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Payee / Entity:</span>
                  <span className="font-bold text-slate-900">{activeTxDetail.payeeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Teen Account:</span>
                  <span className="font-semibold text-slate-900">{activeTxDetail.teenName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-900">{activeTxDetail.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Type:</span>
                  <span className="font-mono text-slate-700 uppercase">{activeTxDetail.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Balance Before:</span>
                  <span className="text-slate-700">₹{activeTxDetail.balanceBefore}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Balance After:</span>
                  <span className="font-bold text-teal-800">₹{activeTxDetail.balanceAfter}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Created At:</span>
                  <span className="text-slate-700">
                    {new Date(activeTxDetail.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {activeTxDetail.note && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                  <span className="font-semibold text-slate-700">Memo: </span>
                  <span className="text-slate-600 italic">&ldquo;{activeTxDetail.note}&rdquo;</span>
                </div>
              )}

              {/* Guardian Reverse Action */}
              {isGuardian &&
                activeTxDetail.type === 'spend' &&
                activeTxDetail.status !== 'reversed' && (
                  <button
                    type="button"
                    onClick={() => handleReverse(activeTxDetail)}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refund / Reverse This Transaction (Guardian Action)</span>
                  </button>
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTxDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
