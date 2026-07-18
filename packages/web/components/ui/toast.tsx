'use client';

import { useEffect } from 'react';

import { Icon, type IconName } from './icon';

export type ToastType = 'info' | 'success' | 'error';

export interface ToastState {
  type: ToastType;
  message: string;
  href?: string;
  linkLabel?: string;
}

const ICON: Record<ToastType, IconName> = {
  info: 'clock',
  success: 'check',
  error: 'flag',
};

const COLOR_VAR: Record<ToastType, string> = {
  info: 'var(--color-content-secondary)',
  success: 'var(--color-content-success)',
  error: 'var(--color-content-danger)',
};

/**
 * Tx status notice (DESIGN.md §4.2 TOAST, planned): pending/success/fail feedback
 * for a signed transaction. `Type=Info/Success/Destructive` per §4.3 — never mixed
 * with `State`. Fixed bottom-right, single active toast (no queue): callers own
 * their own `useState<ToastState | null>` and pass `onDismiss` to clear it.
 * Pending toasts stay until replaced by the next state; success/error auto-dismiss.
 */
export function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  useEffect(() => {
    if (toast.type === 'info') return;
    const id = setTimeout(onDismiss, 6000);
    return () => clearTimeout(id);
  }, [toast, onDismiss]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <Icon name={ICON[toast.type]} size={15} style={{ color: COLOR_VAR[toast.type] }} />
      <span className="toast-msg" style={{ color: COLOR_VAR[toast.type] }}>
        {toast.message}
        {toast.href ? (
          <>
            {' '}
            <a href={toast.href} target="_blank" rel="noopener noreferrer" className="explorer-link">
              {toast.linkLabel ?? 'View transaction'}
            </a>
          </>
        ) : null}
      </span>
      <button type="button" className="toast-dismiss" aria-label="Dismiss" onClick={onDismiss}>
        &times;
      </button>
    </div>
  );
}
