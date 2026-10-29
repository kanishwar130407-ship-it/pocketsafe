import React, { useState } from 'react';
import { Send, Wallet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { store } from '../../services/store';

interface AllocateAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTeenId?: string;
}

export const AllocateAllowanceModal: React.FC<AllocateAllowanceModalProps> = ({
  isOpen,
  onClose,
  defaultTeenId,
}) => {
  const state = store.getState();
  const teens = state.teens;

  const [selectedTeenId, setSelectedTeenId] = useState<string>(
    defaultTeenId || teens[0]?.id || ''
  );
  const [amount, setAmount] = useState<number>(500);
  const [note, setNote] = useState<string>('Weekly allowance credit');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedTeen = teens.find((t) => t.id === selectedTeenId);
  const selectedWallet = selectedTeen ? state.wallets[selectedTeen.walletId] : null;

  const handleAllocate = () => {
    setError(null);
    if (!selectedTeenId) {
      setError('Please select a teen profile.');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    const res = store.allocateAllowance(selectedTeenId, amount, note);
    if (!res.success) {
      setError(res.error || 'Failed to allocate allowance.');
      return;
    }

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
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
              <h3 className="font-bold text-base leading-tight">Send Allowance</h3>
              <p className="text-xs text-teal-200">Transfer from Family Reserve</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Family Reserve Info Banner */}
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs flex justify-between items-center text-teal-950">
            <span className="font-medium text-slate-600">Available Family Reserve:</span>
            <span className="font-extrabold text-teal-800 text-sm">
              ₹{state.family.familyBalance.toLocaleString('en-IN')}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!isSuccess ? (
            <div className="space-y-4">
              {/* Select Teen */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Teen
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {teens.map((teen) => {
                    const wallet = state.wallets[teen.walletId];
                    const isSelected = selectedTeenId === teen.id;
                    return (
                      <button
                        key={teen.id}
                        type="button"
                        onClick={() => setSelectedTeenId(teen.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-teal-700 bg-teal-50/70 text-teal-950 ring-1 ring-teal-700'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{teen.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Current: ₹{wallet?.balance ?? 0}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Transfer Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    max={state.family.familyBalance}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                {[250, 500, 1000, 1500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      amount === preset
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Memo / Note (Visible to Teen)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Weekly allowance"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <button
                type="button"
                onClick={handleAllocate}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transfer ₹{amount.toLocaleString('en-IN')} to {selectedTeen?.name || 'Teen'}</span>
              </button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Allowance Transferred</h4>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{amount.toLocaleString('en-IN')} has been safely loaded into {selectedTeen?.name}&apos;s wallet.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Teen Updated Balance:</span>
                  <span className="font-bold text-teal-800">
                    ₹{selectedWallet ? selectedWallet.balance.toLocaleString('en-IN') : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Family Reserve:</span>
                  <span className="font-bold text-slate-700">
                    ₹{state.family.familyBalance.toLocaleString('en-IN')}
                  </span>
                </div>
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
