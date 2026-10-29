import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  AlertCircle,
  X,
  FileCheck2,
  ScanLine,
} from 'lucide-react';
import { store } from '../../services/store';

interface AadhaarDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AadhaarDemoModal: React.FC<AadhaarDemoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'verified'>('upload');
  const [consent, setConsent] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    if (!consent) return;
    setStep('scanning');
    setScanProgress(20);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('verified');
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleConfirmVerification = () => {
    store.verifyGuardianDemoAadhaar({
      maskedAadhaarRef: 'XXXX-XXXX-8921',
      maskedName: 'P*** S***',
      dob: '1984-06-14',
      gender: 'Female',
      consentGiven: true,
    });
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Identity Verification</h3>
                <span className="bg-amber-400 text-amber-950 font-bold text-[10px] px-1.5 py-0.5 rounded">
                  DEMO ONLY
                </span>
              </div>
              <p className="text-xs text-teal-200">Offline Secure QR Signature Test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Privacy Notice Banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>UIDAI Compliance & Privacy Notice</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              This demo simulates client-side offline signature parsing of an Aadhaar Secure QR. It does NOT perform live UIDAI authentication, does not request OTP, and strictly never collects or stores 12-digit Aadhaar numbers or biometric data.
            </p>
          </div>

          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-teal-200 bg-teal-50/40 rounded-2xl p-6 text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-sm border border-teal-200 flex items-center justify-center text-teal-700 relative">
                  <QrCode className="w-9 h-9" />
                  <ScanLine className="w-5 h-5 absolute text-amber-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Simulate Mock Aadhaar QR Verification
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Demonstrates reading UIDAI 2048-bit digital signature offline without transmitting raw identity documents.
                  </p>
                </div>
              </div>

              {/* Explicit Guardian Consent Checkbox */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
                  />
                  <span className="text-xs text-slate-700 leading-normal">
                    <strong className="text-slate-900">Guardian Consent:</strong> I consent to demo identity verification for creating this family account. I understand only masked demographic fields will be rendered.
                  </span>
                </label>
              </div>

              <button
                type="button"
                disabled={!consent}
                onClick={handleSimulateScan}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <ScanLine className="w-4 h-4" />
                Scan Mock Aadhaar QR
              </button>
            </div>
          )}

          {step === 'scanning' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-full flex items-center justify-center text-teal-700 animate-spin">
                <ScanLine className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Simulating Cryptographic Verification...
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Validating mock 2048-bit RSA signature & extracting masked fields
                </p>
              </div>
              <div className="w-48 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-2 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {step === 'verified' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Signature Verified (Demo)
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Extracted non-sensitive masked profile
                  </p>
                </div>
              </div>

              {/* Extracted Mock Demographic Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Full Name (Masked):</span>
                  <span className="font-bold text-slate-900">P*** S***</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Aadhaar Ref (Masked):</span>
                  <span className="font-mono font-bold text-slate-900">XXXX-XXXX-8921</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Date of Birth:</span>
                  <span className="font-bold text-slate-900">14-June-1984</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Gender:</span>
                  <span className="font-bold text-slate-900">Female</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Verification Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified (Parent/Guardian)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  Teens in your family will be authenticated solely via guardian-created credentials without Aadhaar.
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmVerification}
                className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Activate Family Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
