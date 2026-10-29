import React, { useState } from 'react';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Share2,
  X,
  CreditCard,
} from 'lucide-react';
import { store, DEMO_MERCHANTS } from '../../services/store';
import { DemoMerchant, SpendCategory, Transaction } from '../../types';

interface PayMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
}

export const PayMerchantModal: React.FC<PayMerchantModalProps> = ({
  isOpen,
  onClose,
  teenId,
}) => {
  const teen = store.getTeenProfile(teenId);
  const wallet = store.getTeenWallet(teenId);

  const [step, setStep] = useState<'select' | 'scanner' | 'amount' | 'confirm' | 'receipt'>('select');
  const [selectedMerchant, setSelectedMerchant] = useState<DemoMerchant | null>(null);
  const [customPayeeCode, setCustomPayeeCode] = useState('');
  const [amount, setAmount] = useState<number>(75);
  const [category, setCategory] = useState<SpendCategory>('Food');
  const [note, setNote] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  if (!isOpen || !teen || !wallet) return null;

  const dailyRemaining = Math.max(0, wallet.dailySpendingLimit - wallet.spentToday);
  const catRemaining = Math.max(
    0,
    (wallet.categoryLimits[category] ?? 1000) - (wallet.categorySpentMonth[category] ?? 0)
  );

  const handleSelectMerchant = (m: DemoMerchant) => {
    setSelectedMerchant(m);
    setCategory(m.category);
    if (m.defaultAmount) {
      setAmount(m.defaultAmount);
    }
    setNote(`Payment to ${m.name}`);
    setStep('amount');
  };

  const handleManualCodeSubmit = () => {
    if (!customPayeeCode.trim()) {
      setValidationError('Please enter a merchant name or UPI code.');
      return;
    }
    setSelectedMerchant({
      id: 'custom_' + Date.now(),
      name: customPayeeCode.trim(),
      category,
      upiHandle: customPayeeCode.includes('@') ? customPayeeCode : `${customPayeeCode.toLowerCase().replace(/\s+/g, '')}@demoupi`,
      description: 'Direct code entry merchant',
      iconName: 'ShoppingBag',
      qrPayload: `upi://pay?pa=${customPayeeCode}`,
    });
    setStep('amount');
  };

  const validatePayment = (): boolean => {
    setValidationError(null);

    if (wallet.isPaused) {
      setValidationError('Wallet paused by guardian. Spends are currently locked for your safety.');
      return false;
    }
    if (amount <= 0) {
      setValidationError('Amount must be positive.');
      return false;
    }
    if (amount > wallet.balance) {
      setValidationError(
        `Insufficient balance. You have ₹${wallet.balance.toLocaleString('en-IN')}, but payment requires ₹${amount.toLocaleString('en-IN')}.`
      );
      return false;
    }
    if (amount > dailyRemaining) {
      setValidationError(
        `Daily limit reached! You can spend up to ₹${dailyRemaining.toLocaleString('en-IN')} more today (Daily limit: ₹${wallet.dailySpendingLimit}).`
      );
      return false;
    }
    if (amount > catRemaining) {
      setValidationError(
        `Monthly limit for ${category} reached! Remaining budget: ₹${catRemaining.toLocaleString('en-IN')}.`
      );
      return false;
    }
    return true;
  };

  const handleProceedToConfirm = () => {
    if (!validatePayment()) return;
    setIdempotencyKey('idemp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
    setStep('confirm');
  };

  const handleExecutePayment = () => {
    if (!validatePayment() || !selectedMerchant) return;

    const res = store.spendMoney({
      teenId: teen.id,
      amount: Number(amount),
      category,
      payeeName: selectedMerchant.name,
      payeeCode: selectedMerchant.upiHandle,
      note,
      idempotencyKey,
    });

    if (!res.success) {
      setValidationError(res.error || 'Payment failed.');
      setStep('amount');
      return;
    }

    setCompletedTx(res.transaction || null);
    setStep('receipt');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedMerchant(null);
    setValidationError(null);
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Pay Merchant</h3>
                <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-1.5 py-0.5 rounded">
                  DEMO UPI
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Wallet Balance: ₹{wallet.balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* STEP 1: Select Merchant or Scan */}
          {step === 'select' && (
            <div className="space-y-4">
              {/* Simulated QR Viewfinder Trigger */}
              <div
                onClick={() => setStep('scanner')}
                className="p-4 bg-linear-to-r from-teal-900 to-slate-900 text-white rounded-2xl cursor-pointer hover:opacity-95 transition-all shadow-md flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                    <ScanLine className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Scan Demo QR Code</h4>
                    <p className="text-[11px] text-teal-200">Point at simulated merchant QR</p>
                  </div>
                </div>
                <div className="bg-teal-700 p-2 rounded-xl text-white">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Pick Sample Merchants */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Sample Teen Outlets
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_MERCHANTS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMerchant(m)}
                      className="p-3 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          {m.name}
                          <span className="text-[10px] font-semibold bg-slate-200/80 group-hover:bg-teal-100 text-slate-700 group-hover:text-teal-900 px-2 py-0.2 rounded-full">
                            {m.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {m.upiHandle}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-teal-800">
                          ₹{m.defaultAmount}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="font-bold text-slate-700 block">
                  Or Enter Demo Merchant / UPI Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPayeeCode}
                    onChange={(e) => setCustomPayeeCode(e.target.value)}
                    placeholder="e.g. stationery@demoupi"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleManualCodeSubmit}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Simulated Camera Scanner */}
          {step === 'scanner' && (
            <div className="space-y-4 text-center">
              <div className="relative w-64 h-64 mx-auto bg-slate-900 rounded-2xl overflow-hidden border-4 border-teal-600 flex items-center justify-center shadow-lg">
                <div className="absolute inset-4 border-2 border-dashed border-teal-400/60 rounded-xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-teal-400 shadow-[0_0_12px_#2dd4bf] animate-bounce" />
                <QrCode className="w-24 h-24 text-teal-500/40" />
                <div className="absolute bottom-3 text-[11px] text-teal-300 bg-slate-900/80 px-3 py-1 rounded-full">
                  Align camera with merchant QR
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Select a test merchant to simulate scanning instant QR:
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {DEMO_MERCHANTS.slice(0, 3).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMerchant(m)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold text-xs border border-teal-200 cursor-pointer"
                  >
                    Scan &ldquo;{m.name}&rdquo;
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Back to merchant list
              </button>
            </div>
          )}

          {/* STEP 3: Enter Amount & Category */}
          {step === 'amount' && selectedMerchant && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Paying to:</div>
                  <div className="font-extrabold text-sm text-slate-900">{selectedMerchant.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{selectedMerchant.upiHandle}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-xs text-teal-700 hover:underline font-semibold"
                >
                  Change
                </button>
              </div>

              {/* Amount input */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Payment Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={wallet.balance}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-black text-2xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex gap-2">
                {[20, 50, 100, 200].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setAmount(chip)}
                    className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                      amount === chip
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{chip}
                  </button>
                ))}
              </div>

              {/* Category Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Expense Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Food', 'Travel', 'Education', 'Entertainment', 'Shopping', 'Other'] as SpendCategory[]).map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-1 rounded-xl text-center font-bold transition-all border ${
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

              {/* Note */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Note / Item description (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Canteen lunch with friends"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {/* Spending Rules Check */}
              <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl space-y-1 text-[11px] text-teal-900">
                <div className="flex justify-between">
                  <span>Available Balance:</span>
                  <span className="font-bold">₹{wallet.balance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily limit remaining:</span>
                  <span className="font-bold">₹{dailyRemaining}</span>
                </div>
                <div className="flex justify-between">
                  <span>{category} monthly remaining:</span>
                  <span className="font-bold">₹{catRemaining}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToConfirm}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Pay ₹{amount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Confirmation screen */}
          {step === 'confirm' && selectedMerchant && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Confirm Payment
                </span>
                <div className="text-3xl font-black text-slate-900">
                  ₹{amount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs font-bold text-teal-800">
                  To: {selectedMerchant.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedMerchant.upiHandle}
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-bold">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance Before:</span>
                  <span className="font-bold">₹{wallet.balance}</span>
                </div>
                <div className="flex justify-between text-teal-800 font-bold">
                  <span>Balance After:</span>
                  <span>₹{wallet.balance - amount}</span>
                </div>
                {note && (
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span>Note:</span>
                    <span className="italic text-slate-600">&ldquo;{note}&rdquo;</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('amount')}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="flex-2 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-200" />
                  <span>Authorize & Pay</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success Receipt */}
          {step === 'receipt' && completedTx && (
            <div className="py-2 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Payment Successful
                </span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  ₹{completedTx.amount.toLocaleString('en-IN')}
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  Paid to {completedTx.payeeName}
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{completedTx.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="text-slate-900 font-medium">
                    {new Date(completedTx.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-bold text-slate-900">{completedTx.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80">
                  <span className="text-slate-500">Balance Before:</span>
                  <span className="text-slate-600">₹{completedTx.balanceBefore}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">New Available Balance:</span>
                  <span className="font-extrabold text-teal-800 text-sm">
                    ₹{completedTx.balanceAfter}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-teal-900 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Synchronized with parent guardian dashboard in real time</span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
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
