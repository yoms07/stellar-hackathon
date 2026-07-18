'use client';

import { useEffect, useRef } from 'react';

import { SidenavContent } from '@/components/app-shell/app-sidenav';

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div className="min-[901px]:hidden">
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        id="mobile-nav-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[264px] flex-col gap-8 overflow-y-auto border-r border-[var(--color-border-medium)] bg-[var(--color-bg-elevated)] px-4 py-5 transition-transform duration-200 ease-out motion-reduce:transition-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidenavContent collapsed={false} onNavigate={onClose} />
      </div>
    </div>
  );
}
