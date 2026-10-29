import React, { useState, useEffect } from 'react';
import {
  Home,
  QrCode,
  Send,
  Receipt,
  Sparkles,
  Inbox,
  FileSpreadsheet,
  Settings,
  Shield,
  HelpCircle,
  PlusCircle,
  User,
  Users,
} from 'lucide-react';
import { store } from './services/store';
import { DemoBanner } from './components/common/DemoBanner';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { ComplianceModal } from './components/common/ComplianceModal';
import { AadhaarDemoModal } from './components/common/AadhaarDemoModal';
import { AuthModal } from './components/auth/AuthModal';
import { GuardianDashboard } from './components/guardian/GuardianDashboard';
import { GuardianRequestsView } from './components/guardian/GuardianRequestsView';
import { TeenDashboard } from './components/teen/TeenDashboard';
import { PayMerchantModal } from './components/teen/PayMerchantModal';
import { RequestMoneyModal } from './components/teen/RequestMoneyModal';
import { AiInsightsModal } from './components/teen/AiInsightsModal';
import { TransactionLedger } from './components/ledger/TransactionLedger';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  const [, setTick] = useState(0);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const isGuardian = currentUser?.role === 'guardian';
  const pendingRequestsCount = state.moneyRequests.filter((r) => r.status === 'pending').length;

  // Navigation tab state
  const [guardianTab, setGuardianTab] = useState<'dashboard' | 'requests' | 'ledger' | 'settings'>('dashboard');
  const [teenTab, setTeenTab] = useState<'home' | 'pay' | 'request' | 'passbook' | 'insights'>('home');

  // Global modals
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isAadhaarDemoOpen, setIsAadhaarDemoOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Teen direct action modals
  const [isTeenPayOpen, setIsTeenPayOpen] = useState(false);
  const [isTeenRequestOpen, setIsTeenRequestOpen] = useState(false);
  const [isTeenInsightsOpen, setIsTeenInsightsOpen] = useState(false);

  const handleResetData = () => {
    store.resetToDefault();
    setGuardianTab('dashboard');
    setTeenTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-teal-100 selection:text-teal-900 pb-20 md:pb-10">
      {/* 1. Mandatory Sandbox & Compliance Banner */}
      <DemoBanner onOpenCompliance={() => setIsComplianceOpen(true)} />

      {/* 2. Top Header with Demo Role Switcher */}
      <RoleSwitcher
        onResetData={handleResetData}
        onOpenCompliance={() => setIsComplianceOpen(true)}
        onOpenAadhaarDemo={() => setIsAadhaarDemoOpen(true)}
      />

      {/* 3. Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-[31px] z-30">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          {/* Guardian Navigation */}
          {isGuardian ? (
            <nav className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto w-full">
              <button
                type="button"
                onClick={() => setGuardianTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  guardianTab === 'dashboard'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setGuardianTab('requests')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 relative ${
                  guardianTab === 'requests'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGuardianTab('ledger')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  guardianTab === 'ledger'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Ledger & History</span>
              </button>

              <button
                type="button"
                onClick={() => setGuardianTab('settings')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  guardianTab === 'settings'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings & Safety</span>
              </button>
            </nav>
          ) : (
            /* Teen Desktop Navigation */
            <nav className="hidden md:flex items-center gap-2 py-2 overflow-x-auto w-full">
              <button
                type="button"
                onClick={() => setTeenTab('home')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  teenTab === 'home'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Wallet Home</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTeenPayOpen(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-slate-700 hover:bg-slate-100"
              >
                <QrCode className="w-3.5 h-3.5 text-teal-700" />
                <span>Pay Merchant</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTeenRequestOpen(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-slate-700 hover:bg-slate-100"
              >
                <Send className="w-3.5 h-3.5 text-amber-600" />
                <span>Ask Parent</span>
              </button>

              <button
                type="button"
                onClick={() => setTeenTab('passbook')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  teenTab === 'passbook'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Passbook</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTeenInsightsOpen(true)}
                className="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-slate-700 hover:bg-slate-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Insights</span>
              </button>
            </nav>
          )}

          <div className="hidden sm:flex items-center gap-2 shrink-0 py-2">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs font-semibold text-slate-500 hover:text-teal-800 cursor-pointer"
            >
              Profiles
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setIsComplianceOpen(true)}
              className="text-xs font-semibold text-slate-500 hover:text-teal-800 cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-teal-700" />
              <span>Compliance</span>
            </button>
          </div>
        </div>
      </header>

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {isGuardian ? (
          /* GUARDIAN VIEWS */
          <>
            {guardianTab === 'dashboard' && (
              <GuardianDashboard
                onNavigateTab={setGuardianTab}
                onOpenCompliance={() => setIsComplianceOpen(true)}
              />
            )}
            {guardianTab === 'requests' && <GuardianRequestsView />}
            {guardianTab === 'ledger' && <TransactionLedger />}
            {guardianTab === 'settings' && (
              <SettingsView
                onResetData={handleResetData}
                onOpenCompliance={() => setIsComplianceOpen(true)}
                onOpenAadhaarDemo={() => setIsAadhaarDemoOpen(true)}
              />
            )}
          </>
        ) : (
          /* TEEN VIEWS */
          <>
            {teenTab === 'home' && currentUser && (
              <TeenDashboard
                teenId={currentUser.id}
                onNavigateTab={(tab) => {
                  if (tab === 'pay') setIsTeenPayOpen(true);
                  else if (tab === 'request') setIsTeenRequestOpen(true);
                  else if (tab === 'insights') setIsTeenInsightsOpen(true);
                  else setTeenTab('passbook');
                }}
                onOpenCompliance={() => setIsComplianceOpen(true)}
              />
            )}

            {teenTab === 'passbook' && <TransactionLedger />}
          </>
        )}
      </main>

      {/* 5. Teen Mobile Bottom Navigation (Native App Feel) */}
      {!isGuardian && currentUser && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-4 py-2 flex items-center justify-around shadow-lg">
          <button
            type="button"
            onClick={() => setTeenTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
              teenTab === 'home' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTeenPayOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-teal-800 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center -mt-5 shadow-lg border-2 border-white">
              <QrCode className="w-5 h-5" />
            </div>
            <span>Pay</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTeenRequestOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>Ask</span>
          </button>

          <button
            type="button"
            onClick={() => setTeenTab('passbook')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors cursor-pointer ${
              teenTab === 'passbook' ? 'text-teal-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span>Passbook</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTeenInsightsOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI</span>
          </button>
        </nav>
      )}

      {/* 6. Footer Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            PocketSafe India • Controlled Teen Digital Spending & Allowance Architecture
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsComplianceOpen(true)}
              className="text-teal-700 hover:underline font-semibold"
            >
              RBI PPI Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAadhaarDemoOpen(true)}
              className="text-teal-700 hover:underline font-semibold"
            >
              Mock QR Verification
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
      />

      <AadhaarDemoModal
        isOpen={isAadhaarDemoOpen}
        onClose={() => setIsAadhaarDemoOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenAadhaarDemo={() => setIsAadhaarDemoOpen(true)}
        onOpenCompliance={() => setIsComplianceOpen(true)}
      />

      {/* Teen Modals */}
      {currentUser && (
        <>
          <PayMerchantModal
            isOpen={isTeenPayOpen}
            onClose={() => setIsTeenPayOpen(false)}
            teenId={currentUser.id}
          />
          <RequestMoneyModal
            isOpen={isTeenRequestOpen}
            onClose={() => setIsTeenRequestOpen(false)}
            teenId={currentUser.id}
          />
          <AiInsightsModal
            isOpen={isTeenInsightsOpen}
            onClose={() => setIsTeenInsightsOpen(false)}
            teenId={currentUser.id}
          />
        </>
      )}
    </div>
  );
}
