import React, { useState } from 'react';
import { User, Users, RefreshCw, ChevronDown, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { store } from '../../services/store';

interface RoleSwitcherProps {
  onResetData: () => void;
  onOpenCompliance: () => void;
  onOpenAadhaarDemo: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  onResetData,
  onOpenCompliance,
  onOpenAadhaarDemo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const guardian = store.getGuardian();
  const teens = state.teens;

  const currentWallet = currentUser?.role === 'teen' ? store.getTeenWallet(currentUser.id) : null;

  return (
    <div className="relative z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-white font-black text-base shadow-xs tracking-tight">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                Pocket<span className="text-teal-700">Safe</span>
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                India
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5">
              Controlled Teen Allowance
            </p>
          </div>
        </div>

        {/* Role Selector Dropdown Trigger */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 transition-all border border-slate-200/70"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-teal-700 text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser?.fullName.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[11px] text-slate-500 font-normal leading-none">
                  Viewing as:
                </span>
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.fullName} ({currentUser?.role === 'guardian' ? 'Parent' : 'Teen'})
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (Demo Switcher)
                    </p>
                    <p className="text-xs text-slate-500">
                      Experience both Guardian controls and Teen spending flows
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* Guardian Option */}
                    {guardian && (
                      <button
                        type="button"
                        onClick={() => {
                          store.setCurrentUser(guardian.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                          currentUser?.id === guardian.id
                            ? 'bg-teal-50 border border-teal-200 text-teal-950'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                            P
                          </div>
                          <div>
                            <div className="font-bold text-xs flex items-center gap-1.5">
                              {guardian.fullName}
                              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                Guardian
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Family Reserve: ₹{state.family.familyBalance.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        {currentUser?.id === guardian.id && (
                          <Check className="w-4 h-4 text-teal-700" />
                        )}
                      </button>
                    )}

                    {/* Teens Options */}
                    {teens.map((teen) => {
                      const wallet = state.wallets[teen.walletId];
                      const isSelected = currentUser?.id === teen.id;
                      return (
                        <button
                          key={teen.id}
                          type="button"
                          onClick={() => {
                            store.setCurrentUser(teen.id);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                            isSelected
                              ? 'bg-teal-50 border border-teal-200 text-teal-950'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-amber-900">
                              {teen.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-xs flex items-center gap-1.5">
                                {teen.name}
                                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  Age {teen.age}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                Balance: ₹{wallet ? wallet.balance.toLocaleString('en-IN') : 0}
                                {wallet?.isPaused && (
                                  <span className="text-red-600 font-bold ml-1.5">
                                    [Paused]
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-teal-700" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenAadhaarDemo();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
                      <span>Mock Aadhaar Verification (Demo)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenCompliance();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-lg text-left"
                    >
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>RBI & Safety Guidelines</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onResetData();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-medium"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                      <span>Reset Demo Data to Initial Seeds</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
