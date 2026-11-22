"use client";

import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!open) return null;

  return (
    <dialog ref={ref} className="glass-strong rounded-2xl p-6 max-w-sm w-full backdrop:bg-black/40" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
      <h2 id="confirm-title" className="text-lg font-bold text-green-950">{title}</h2>
      <p id="confirm-msg" className="text-sm text-muted mt-2">{message}</p>
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={onCancel} className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium">{cancelLabel}</button>
        <button onClick={onConfirm} className="btn-primary px-4 py-2 rounded-xl text-sm font-medium">{confirmLabel}</button>
      </div>
    </dialog>
  );
}