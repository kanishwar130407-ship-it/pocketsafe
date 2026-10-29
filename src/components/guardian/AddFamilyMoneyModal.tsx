import React, { useState } from 'react';
import { PlusCircle, Wallet, CheckCircle2, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { store } from '../../services/store';

interface AddFamilyMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFamilyMoneyModal: React.FC<AddFamilyMoneyModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(2000);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [1000, 2000, 5000, 10000];

  const handleDeposit = () => {
    if (amount <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      const methodLabel =
        selectedMethod === 'upi' ? 'Simulated UPI Auto-Pay (HDFC Bank)' : 'Simulated NetBanking (ICICI Bank)';
      store.addFamilyMoney(amount, methodLabel);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Add Family Funds</h3>
              <p className="text-xs text-teal-200">Sandbox Parent Deposit</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Demo Sandbox Alert */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Mode:</strong> No real bank account will be charged. This simulates a parent loading allowance reserves.
            </span>
          </div>

          {!isSuccess ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deposit Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="flex items-center gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      amount === q
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{q.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Payment Method simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Simulated Funding Source
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-teal-700 bg-teal-50/70 text-teal-950'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">UPI Sandbox</div>
                    <div className="text-[11px] text-slate-500 font-normal">HDFC Bank Auto-Pay</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'border-teal-700 bg-teal-50/70 text-teal-950'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold">NetBanking Demo</div>
                    <div className="text-[11px] text-slate-500 font-normal">ICICI Bank Salaried</div>
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={amount <= 0 || isProcessing}
                onClick={handleDeposit}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Processing Demo Deposit...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Load ₹{amount.toLocaleString('en-IN')} to Family Reserve</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Deposit Successful</h4>
                <p className="text-xs text-slate-500 mt-1">
                  ₹{amount.toLocaleString('en-IN')} has been added to your Family Allowance Pool.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between">
                <span>Updated Family Balance:</span>
                <span className="font-bold text-teal-800">
                  ₹{store.getState().family.familyBalance.toLocaleString('en-IN')}
                </span>
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
