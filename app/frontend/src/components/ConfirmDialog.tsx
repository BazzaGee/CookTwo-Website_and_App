import { AlertTriangle, X } from 'lucide-react';
import { useConfirmStore } from '../stores/confirmStore';

export default function ConfirmDialog() {
  const { visible, title, message, confirmLabel, cancelLabel, danger, dismiss, confirm } = useConfirmStore();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
            danger ? 'bg-error/10' : 'bg-sage/10'
          }`}
        >
          <AlertTriangle size={22} className={danger ? 'text-error' : 'text-sage'} />
        </div>

        <h2 id="confirm-title" className="text-text-primary text-xl font-semibold text-center mb-2">
          {title}
        </h2>

        <p className="text-text-secondary text-sm text-center leading-relaxed mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={confirm}
            className={`w-full text-white font-medium py-3 px-6 rounded-xl active:scale-[0.99] transition-all ${
              danger ? 'bg-error hover:bg-error/90' : 'bg-sage hover:bg-sage-dark'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="w-full text-text-secondary text-sm font-medium py-2 hover:text-text-primary transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
