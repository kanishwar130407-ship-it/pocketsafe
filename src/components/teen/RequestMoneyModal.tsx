import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';
import { store } from '../../services/store';
import { SpendCategory } from '../../types';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({
  isOpen,
  onClose,
  teenId,
}) => {
  const teen = store.getTeenProfile(teenId);
  const guardian = store.getGuardian();

  const [amount, setAmount] = useState<number>(300);
  const [category, setCategory] = useState<SpendCategory>('Education');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !teen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError('Amount must be positive.');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason so your parent can review it.');
      return;
    }

    const res = store.requestMoney({
      teenId: teen.id,
      amount: Number(amount),
      category,
      reason: reason.trim(),
    });

    if (!res.success) {
      setError(res.error || 'Failed to submit request.');
      return;
    }

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Request Extra Money</h3>
              <p className="text-xs text-teal-200">
                To: {guardian?.fullName || 'Parent/Guardian'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Requested Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    step="10"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-black text-2xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="flex gap-2">
                {[150, 300, 500, 1000].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`flex-1 py-1 rounded-lg font-bold border transition-colors ${
                      amount === q
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{q}
                  </button>
                ))}
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Education', 'Food', 'Travel', 'Entertainment', 'Shopping', 'Other'] as SpendCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-1 rounded-xl text-center font-bold border transition-all ${
                          category === cat
                            ? 'bg-teal-50 border-teal-700 text-teal-950 ring-1 ring-teal-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Reason for Request *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Science project cardboard and poster colors"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Your parent will receive a notification to review this request. Your wallet balance will only increase after they approve it.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Request to {guardian?.fullName || 'Parent'}</span>
              </button>
            </form>
          ) : (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Request Sent!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Your request for ₹{amount.toLocaleString('en-IN')} for &ldquo;{reason}&rdquo; has been sent to {guardian?.fullName}.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
