import React, { useState } from 'react';
import {
  Settings,
  Shield,
  RotateCcw,
  FileText,
  Lock,
  Server,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Bell,
  Database,
  ExternalLink,
} from 'lucide-react';
import { store } from '../../services/store';

interface SettingsViewProps {
  onResetData: () => void;
  onOpenCompliance: () => void;
  onOpenAadhaarDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetData,
  onOpenCompliance,
  onOpenAadhaarDemo,
}) => {
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  const family = state.family;
  const auditLogs = state.auditLogs;

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'compliance' | 'firebase' | 'audit'>('profile');
  const [resetConfirm, setResetConfirm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" />
            <span>Settings & Compliance</span>
          </h2>
          <p className="text-xs text-slate-500">
            Account preferences, regulatory blueprint, audit trails, and cloud setup.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'profile'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Profile & Security
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('compliance')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'compliance'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          RBI & Minor Safety
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('firebase')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'firebase'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Firebase Setup Guide
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer shrink-0 ${
            activeSubTab === 'audit'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: PROFILE & RESET */}
      {activeSubTab === 'profile' && (
        <div className="space-y-5 text-xs text-slate-700">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Active Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">User Name:</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser?.fullName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Role:</span>
                <span className="font-bold text-teal-800 uppercase">{currentUser?.role}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Family Account:</span>
                <span className="font-bold text-slate-900">{family.familyName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Guardian KYC:</span>
                <span className="font-bold text-emerald-700">
                  {family.guardianVerified ? 'Verified (Mock Secure QR)' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onOpenAadhaarDemo}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Re-run Mock Aadhaar Verification (Demo)</span>
              </button>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-rose-950 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset Sandbox Database</span>
            </h3>
            <p className="text-xs text-slate-600">
              Clear your local edits and restore the pre-seeded demo state (Sharma family, Aarav, Ananya, mock merchants, and historical spends).
            </p>

            {!resetConfirm ? (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold cursor-pointer transition-colors"
              >
                Reset Demo Data
              </button>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl space-y-2">
                <p className="font-bold text-rose-900">Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetData();
                      setResetConfirm(false);
                    }}
                    className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                  >
                    Yes, Reset to Initial Seeds
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGULATORY & RBI BLUEPRINT */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs text-slate-700">
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
            <h3 className="font-extrabold text-sm text-teal-950 flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-700" />
              <span>Regulatory Blueprint for Minor Wallets in India</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              PocketSafe is engineered specifically to align with the legal and regulatory framework in India for adolescent financial education and parental allowance management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                RBI PPI Co-Branding Guidelines
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Minors under 18 years cannot open independent bank accounts with credit or overdraft facilities. PocketSafe operates under the Prepaid Payment Instrument (PPI) model where an adult parent is the master account holder who loads and supervises a linked prepaid card/wallet.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Strict Zero-Debt Mandate
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Indian law strictly prohibits lending or debt contracts with minors. PocketSafe guarantees in code that balances can never drop below ₹0.00. Teens cannot take out advances, borrow money, or load funds independently.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                UIDAI Aadhaar Data Minimization
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Under the Aadhaar Act, private entities cannot store raw Aadhaar numbers or biometrics. Our demo verification tests offline digitally signed QR codes, extracting only masked references (`XXXX-XXXX-8921`) and demographic metadata without saving identity scans.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Instant Emergency Kill Switch
              </h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Guardians have complete real-time sovereignty. With a single tap, a parent can pause/freeze all teen QR payments, adjust daily spending limits, or set category caps (e.g. limiting Entertainment or Food).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FIREBASE SETUP & ONBOARDING GUIDE */}
      {activeSubTab === 'firebase' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Production Firebase Setup Instructions
              </h3>
              <p className="text-[11px] text-slate-500">
                Step-by-step instructions for your engineering team to enable live Cloud Firestore & Auth.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">1. Enable Cloud Firestore</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>Go to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-teal-700 underline font-semibold">Firebase Console</a> and open your project.</li>
                <li>Navigate to <strong>Build &gt; Firestore Database</strong>.</li>
                <li>Click <strong>Create Database</strong> and select your preferred region (e.g. <code>asia-south1</code> for Mumbai, India).</li>
                <li>Choose <strong>Production Mode</strong> so that security rules are enforced.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">2. Enable Authentication</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>Navigate to <strong>Build &gt; Authentication</strong>.</li>
                <li>Under the <strong>Sign-in method</strong> tab, enable <strong>Email/Password</strong> or <strong>Google Sign-In</strong>.</li>
                <li>For teen access, guardian-generated credentials (phone or username/email) are linked under the guardian&apos;s family ID.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">3. Deploy Zero-Trust Security Rules</h4>
              <p className="text-[11px] text-slate-600">
                PocketSafe includes complete, hardened security rules in <code>firestore.rules</code> following zero-trust RBAC architecture. Deploy them via Firebase CLI:
              </p>
              <pre className="p-2.5 bg-slate-900 text-teal-300 rounded-lg text-[10px] font-mono overflow-x-auto">
                firebase deploy --only firestore:rules
              </pre>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">4. Connect App Configuration</h4>
              <p className="text-[11px] text-slate-600">
                Populate <code>firebase-applet-config.json</code> with your web app&apos;s apiKey, authDomain, and projectId:
              </p>
              <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg text-[10px] font-mono overflow-x-auto">
{`{
  "apiKey": "YOUR_FIREBASE_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT.appspot.com",
  "firestoreDatabaseId": "(default)"
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">System Audit Trail</h3>
            <span className="text-[11px] text-slate-500 font-mono">Immutable Log</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-slate-600 text-[11px]">by {log.actorRole}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
