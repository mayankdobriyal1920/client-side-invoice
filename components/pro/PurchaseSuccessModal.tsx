"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PurchaseSuccessModal({ open, onClose }: Props) {
  return (
    <dialog className="glass-strong rounded-2xl p-6 max-w-sm w-full backdrop:bg-black/50 backdrop-blur-sm border border-white/70" open={open} onClose={onClose}>
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center mx-auto mb-3">✓</div>
        <h2 className="text-xl font-bold text-green-950">Purchase complete!</h2>
        <p className="mt-2 text-sm text-muted">Your license key has been emailed to you.</p>
      </div>
      <div className="space-y-3 pt-4">
        <p className="text-xs font-medium text-green-950">To activate Pro:</p>
        <p className="text-xs text-muted leading-relaxed">
          1. Check your email for your license key (EBK-XXXX-XXXX-XXXX-XXXX).<br />
          2. Click &ldquo;Enter license key&rdquo; below or go to /activate.<br />
          3. Enter your license key and click Activate.<br />
          Pro features will unlock instantly.
        </p>
      </div>
      <button onClick={onClose} className="w-full btn-primary px-5 py-2 rounded-xl font-medium">
        Enter license key
      </button>
    </dialog>
  );
}