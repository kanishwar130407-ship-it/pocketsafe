import React, { useState } from 'react';
import { UserPlus, ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { store } from '../../services/store';
import { SpendCategory } from '../../types';

interface AddTeenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeenAdded?: (teenId: string) => void;
}

export const AddTeenModal: React.FC<AddTeenModalProps> = ({
  isOpen,
  onClose,
  onTeenAdded,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(14);
  const [phone, setPhone] = useState('+91 98');
  const [username, setUsername] = useState('');
  const [initialAllowance, setInitialAllowance] = useState<number>(500);
  const [dailyLimit, setDailyLimit] = useState<number>(300);
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide the teen full name.');
      return;
    }
    if (age < 7 || age >= 18) {
      setError('Teen age must be between 7 and 17 years old.');
      return;
    }
    if (!username.trim()) {
      setError('Please choose a username for login.');
      return;
    }
    if (!guardianConsent) {
      setError('Parental consent is required to create a minor allowance wallet.');
      return;
    }

    const defaultCategoryLimits: Record<SpendCategory, number> = {
      Food: 1500,
      Travel: 1000,
      Education: 1500,
      Entertainment: 600,
      Shopping: 800,
      Other: 400,
    };

    const result = store.addTeenProfile({
      name,
      age: Number(age),
      phone,
      username,
      initialAllowance: Number(initialAllowance),
      dailyLimit: Number(dailyLimit),
      categoryLimits: defaultCategoryLimits,
    });

    if (!result.success) {
      setError(result.error || 'Failed to create teen profile.');
      return;
    }

    onTeenAdded?.(result.teenId!);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-700 rounded-xl text-teal-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Add Teen Profile</h3>
              <p className="text-xs text-teal-200">Registered by Parent/Guardian</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              <strong>Guardian Control:</strong> Teen will log in with guardian-created credentials. No Aadhaar is collected from teens.
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Teen Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!username && e.target.value) {
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                }
              }}
              placeholder="e.g. Rohan Sharma"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Age (Under 18) *
              </label>
              <input
                type="number"
                min="7"
                max="17"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Teen Username *
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                placeholder="e.g. rohan14"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Mobile Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 00000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Initial Allowance (₹)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={initialAllowance}
                onChange={(e) => setInitialAllowance(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
              <span className="text-[10px] text-slate-500">From family balance</span>
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Daily Spend Limit (₹) *
              </label>
              <input
                type="number"
                min="50"
                step="50"
                required
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-teal-600"
              />
              <span className="text-[10px] text-slate-500">Max spend per day</span>
            </div>
          </div>

          {/* Parental Consent Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={guardianConsent}
                onChange={(e) => setGuardianConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-teal-700 border-slate-300 focus:ring-teal-600"
              />
              <span className="text-[11px] text-slate-700 leading-tight">
                <strong>Parental Consent:</strong> As the verified legal guardian, I authorize creating this controlled sub-wallet for a minor under 18 years old.
              </span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Teen Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
