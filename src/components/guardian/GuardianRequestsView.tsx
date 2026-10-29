import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Loader2,
} from 'lucide-react';
import { store } from '../../services/store';
import { MoneyRequest } from '../../types';
import { fetchAiRejectionDraft } from '../../services/geminiClient';

interface GuardianRequestsViewProps {
  onRefresh?: () => void;
}

export const GuardianRequestsView: React.FC<GuardianRequestsViewProps> = ({ onRefresh }) => {
  const state = store.getState();
  const requests = state.moneyRequests;
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const pastRequests = requests.filter((r) => r.status !== 'pending');

  const [activeRejectingId, setActiveRejectingId] = useState<string | null>(null);
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [isAiDrafting, setIsAiDrafting] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleApprove = (req: MoneyRequest) => {
    setActionError(null);
    const res = store.approveMoneyRequest(req.id, 'Approved by guardian');
    if (!res.success) {
      setActionError(res.error || 'Failed to approve request.');
      return;
    }
    onRefresh?.();
  };

  const startRejectFlow = async (req: MoneyRequest) => {
    setActiveRejectingId(req.id);
    setActionError(null);
    setRejectionNote('');
    setIsAiDrafting(true);

    const teenWallet = store.getTeenWallet(req.teenId);
    try {
      const draft = await fetchAiRejectionDraft({
        amount: req.amount,
        category: req.category,
        reason: req.reason,
        dailyLimit: teenWallet?.dailySpendingLimit || 400,
        currentBalance: teenWallet?.balance || 0,
      });
      setRejectionNote(draft);
    } catch (err) {
      setRejectionNote(
        `Hi beta, let's hold off on this ₹${req.amount} expense right now. Your current allowance should cover upcoming essentials.`
      );
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleConfirmReject = (requestId: string) => {
    store.rejectMoneyRequest(requestId, rejectionNote);
    setActiveRejectingId(null);
    setRejectionNote('');
    onRefresh?.();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Allowance Requests</h2>
          <p className="text-xs text-slate-500">
            Teens can request extra funds with categories and reasons for parental review.
          </p>
        </div>
        <div className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs">
          {pendingRequests.length} Pending
        </div>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Pending Requests Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Awaiting Your Review
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2">
            <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800">All Caught Up!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              No pending money requests from teens. When they ask for extra funds, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const teen = store.getTeenProfile(req.teenId);
              const wallet = store.getTeenWallet(req.teenId);
              const isRejecting = activeRejectingId === req.id;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold flex items-center justify-center text-sm">
                        {req.teenName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          {req.teenName}
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                            {req.category}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Requested {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">
                        ₹{req.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Current Bal: ₹{wallet?.balance ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Reason Box */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Reason: </span>
                    &ldquo;{req.reason}&rdquo;
                  </div>

                  {/* Action Buttons */}
                  {!isRejecting ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApprove(req)}
                        className="flex-1 py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Send ₹{req.amount}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => startRejectFlow(req)}
                        className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
                        <span>Decline...</span>
                      </button>
                    </div>
                  ) : (
                    /* AI-Assisted Polite Decline Panel */
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3 animate-in fade-in duration-200 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>AI Guardian Assistant</span>
                        </div>
                        <span className="text-[10px] text-amber-800 font-medium">
                          Constructive Feedback
                        </span>
                      </div>

                      {isAiDrafting ? (
                        <div className="py-3 flex items-center justify-center gap-2 text-slate-500">
                          <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                          <span>Gemini drafting a warm, constructive message...</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={rejectionNote}
                            onChange={(e) => setRejectionNote(e.target.value)}
                            placeholder="Write a supportive note explaining why..."
                            className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-600"
                          />
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => startRejectFlow(req)}
                              className="text-[11px] text-teal-700 hover:underline flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" /> Re-draft with AI
                            </button>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveRejectingId(null)}
                                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmReject(req.id)}
                                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                              >
                                Send & Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Requests History */}
      {pastRequests.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Request History
          </h3>
          <div className="space-y-2">
            {pastRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                      req.status === 'approved' ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}
                  >
                    {req.status === 'approved' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      {req.teenName} • {req.category} (₹{req.amount})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {req.reason}
                      {req.guardianNote && ` • Guardian note: "${req.guardianNote}"`}
                    </div>
                  </div>
                </div>
                <div
                  className={`capitalize font-bold text-[11px] px-2 py-0.5 rounded-full ${
                    req.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {req.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
