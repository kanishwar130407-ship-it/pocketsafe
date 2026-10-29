import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  X,
} from 'lucide-react';
import { store } from '../../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAadhaarDemo: () => void;
  onOpenCompliance: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onOpenAadhaarDemo,
  onOpenCompliance,
}) => {
  const [mode, setMode] = useState<'demo' | 'signup' | 'signin'>('demo');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const state = store.getState();
  const guardian = store.getGuardian();
  const teens = state.teens;

  const handleSelectRole = (userId: string) => {
    store.setCurrentUser(userId);
    onClose();
  };

  const handleGuardianSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    onOpenAadhaarDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Banner */}
        <div className="bg-linear-to-br from-teal-800 via-teal-900 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-sm">
                P
              </div>
              <span className="font-extrabold text-lg tracking-tight">PocketSafe</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-teal-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">
            Family Allowance & Controlled Spending for Teens
          </h3>
          <p className="text-xs text-teal-200 mt-1.5 leading-relaxed">
            Teens spend only from guardian-funded balances. Zero loans, zero negative balance, zero independent loading.
          </p>

          <div className="mt-4 p-2.5 bg-amber-400/20 border border-amber-400/30 rounded-xl text-[11px] text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Demo Mode — No real money or real Aadhaar required.</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setMode('demo')}
            className={`flex-1 py-3 transition-colors ${
              mode === 'demo'
                ? 'border-b-2 border-teal-700 text-teal-900 bg-teal-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Quick 1-Click Demo
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 transition-colors ${
              mode === 'signup'
                ? 'border-b-2 border-teal-700 text-teal-900 bg-teal-50/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Guardian Sign Up
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-slate-500 text-[11px]">
                Select any pre-configured profile to immediately test the app:
              </p>

              {/* Guardian Card */}
              {guardian && (
                <button
                  type="button"
                  onClick={() => handleSelectRole(guardian.id)}
                  className="w-full p-3.5 bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      P
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                        {guardian.fullName}
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded">
                          Parent
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Family Reserve: ₹{state.family.familyBalance.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-700 transition-colors" />
                </button>
              )}

              {/* Teen Cards */}
              {teens.map((teen) => {
                const wallet = state.wallets[teen.walletId];
                return (
                  <button
                    key={teen.id}
                    type="button"
                    onClick={() => handleSelectRole(teen.id)}
                    className="w-full p-3.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold flex items-center justify-center text-sm shadow-xs">
                        {teen.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                          {teen.name}
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                            Age {teen.age}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Wallet: ₹{wallet?.balance ?? 0} • Daily limit: ₹{wallet?.dailySpendingLimit ?? 0}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-700 transition-colors" />
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleGuardianSignUp} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Parent / Guardian Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-teal-900">
                Next Step: You will complete a simulated mock Aadhaar offline QR verification to establish guardian identity.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Mock Identity Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenCompliance}
              className="text-[11px] text-slate-500 hover:text-teal-700 underline"
            >
              Read RBI Minor Wallet Compliance Blueprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
