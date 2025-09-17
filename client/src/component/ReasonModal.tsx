import { useState } from "react";
import type React from "react";

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  loading?: boolean;
}

const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [reason, setReason] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const rejectionReasons = [
    "Incomplete documentation",
    "Invalid university credentials",
    "Insufficient verification letter",
    "AISHE code mismatch",
    "Fraudulent application",
    "Missing required signatures",
    "Other (specify below)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    const finalReason = selectedCategory === "Other (specify below)" 
      ? reason 
      : selectedCategory + (reason ? `: ${reason}` : "");
    
    onSubmit(finalReason);
    
    // Reset form
    setReason("");
    setSelectedCategory("");
  };

  const handleClose = () => {
    setReason("");
    setSelectedCategory("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d1220] border border-white/10 rounded-xl max-w-md w-full mx-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">
              Reject University Request
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-red-400 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-300 text-sm font-medium">
                  This action cannot be undone
                </p>
                <p className="text-red-200/80 text-xs mt-1">
                  The university will be notified via email about the rejection.
                </p>
              </div>
            </div>
          </div>

          {/* Rejection Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rejection Category <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {rejectionReasons.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={loading}
                    className="text-red-500 focus:ring-red-500 focus:ring-2 bg-transparent border-white/20"
                  />
                  <span className="text-sm text-slate-300">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Reason Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {selectedCategory === "Other (specify below)" 
                ? "Please specify the reason" 
                : "Additional details (optional)"
              }
              {selectedCategory === "Other (specify below)" && (
                <span className="text-red-400 ml-1">*</span>
              )}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              placeholder={
                selectedCategory === "Other (specify below)"
                  ? "Please provide specific reason for rejection..."
                  : "Provide additional context or details..."
              }
              rows={3}
              className="w-full px-3 py-2 bg-[#0b0f1a] border border-white/20 rounded-lg text-slate-200 placeholder-slate-500 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none transition-colors disabled:opacity-50 resize-none"
            />
            <div className="text-xs text-slate-500 mt-1">
              This message will be included in the rejection email.
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm border border-white/10 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedCategory || (selectedCategory === "Other (specify below)" && !reason.trim())}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {loading ? "Rejecting..." : "Reject Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;