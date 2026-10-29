import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

interface DemoBannerProps {
  onOpenCompliance?: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenCompliance }) => {
  return (
    <div className="bg-amber-500 text-amber-950 px-3.5 py-1.5 border-b border-amber-600/30 text-xs font-medium flex items-center justify-between shadow-xs sticky top-0 z-50">
      <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="inline-flex items-center justify-center p-0.5 rounded bg-amber-950/15 text-amber-950 font-bold text-[10px] uppercase tracking-wider">
          Sandbox
        </span>
        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-900" />
        <span className="font-semibold truncate">
          Demo Mode — No real money is processed
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenCompliance}
        className="flex items-center gap-1 shrink-0 text-amber-950 hover:text-amber-900 underline underline-offset-2 ml-2 font-medium cursor-pointer transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>RBI Safety Info</span>
      </button>
    </div>
  );
};
