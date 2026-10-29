import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, FileText, Lock, X } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-teal-800 text-white p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Regulatory & Compliance Mode</h3>
              <p className="text-xs text-teal-200">Educational Safety & RBI Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-slate-700 leading-relaxed">
          {/* Demo Sandbox Alert */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Demo / Prototype Environment</h4>
              <p className="text-xs text-amber-800 mt-1">
                PocketSafe is currently operating in sandbox prototype mode. No real money, real bank accounts, or real UPI transactions are processed. All merchants, account numbers, and currency balances are simulated.
              </p>
            </div>
          </div>

          {/* RBI Regulatory Requirements */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              RBI PPI & Co-Branded Card Directives
            </h4>
            <p className="text-xs text-slate-600">
              In India, financial products for teenagers under 18 years of age operate under strict Reserve Bank of India (RBI) Master Directions for Prepaid Payment Instruments (PPIs):
            </p>
            <ul className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Regulated Banking Partner:</strong> A live production launch requires partnership with an RBI-licensed PPI issuer or scheduled commercial bank.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Guardian as Primary KYC Holder:</strong> Full KYC must be fulfilled by the adult parent or legal guardian. The minor is an authorized sub-cardholder.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Pre-Paid Allowance:</strong> Under no circumstances can a minor access overdrafts, personal loans, BNPL (Buy Now Pay Later), or negative balances.
                </span>
              </li>
            </ul>
          </div>

          {/* Aadhaar Privacy Blueprint */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              Mock Aadhaar Identity Verification Rules
            </h4>
            <p className="text-xs text-slate-600">
              UIDAI Aadhaar Act regulations prohibit non-authorized entities from capturing, storing, or handling raw Aadhaar numbers or biometrics:
            </p>
            <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-xl space-y-1.5 text-xs text-teal-900">
              <p>• <strong>Zero Aadhaar Storage:</strong> PocketSafe never collects, asks for, or stores 12-digit Aadhaar numbers, OTPs, or biometric templates.</p>
              <p>• <strong>Mock Secure QR:</strong> The onboarding verification demonstrates non-intrusive offline XML/QR signature validation, extracting only masked identifiers (e.g., <code>XXXX-XXXX-8921</code>).</p>
              <p>• <strong>Minors Protected:</strong> Teens are registered solely through guardian consent and guardian-issued credentials without requiring identity documents.</p>
            </div>
          </div>

          {/* Zero-Trust Architecture */}
          <div className="p-3.5 bg-slate-100 rounded-xl text-xs space-y-1">
            <div className="font-semibold text-slate-800">Controlled-Spending Safeguards Active:</div>
            <p className="text-slate-600">✓ Balance must be ≥ 0 at all times.</p>
            <p className="text-slate-600">✓ Per-day spending caps enforced synchronously.</p>
            <p className="text-slate-600">✓ Category limits (Food, Travel, Education, Entertainment).</p>
            <p className="text-slate-600">✓ Emergency instant wallet pause button for guardians.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
