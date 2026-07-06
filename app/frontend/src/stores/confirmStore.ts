import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm?: () => void | Promise<void>;
}

interface ConfirmState extends ConfirmOptions {
  visible: boolean;
  show: (opts: ConfirmOptions) => void;
  dismiss: () => void;
  confirm: () => Promise<void>;
}

export const useConfirmStore = create<ConfirmState>()((set, get) => ({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
  onConfirm: undefined,
  show: (opts) =>
    set({
      visible: true,
      title: opts.title,
      message: opts.message,
      confirmLabel: opts.confirmLabel ?? 'Confirm',
      cancelLabel: opts.cancelLabel ?? 'Cancel',
      danger: opts.danger ?? false,
      onConfirm: opts.onConfirm,
    }),
  dismiss: () => set({ visible: false, onConfirm: undefined }),
  confirm: async () => {
    const cb = get().onConfirm;
    set({ visible: false, onConfirm: undefined });
    if (cb) await cb();
  },
}));
