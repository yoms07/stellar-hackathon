'use client';

import { useState, type ReactNode } from 'react';

import { AppSidenav } from '@/components/app-shell/app-sidenav';
import { MobileNavDrawer } from '@/components/app-shell/mobile-nav-drawer';
import { MobileTopbar } from '@/components/app-shell/mobile-topbar';

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col min-[901px]:flex-row">
      <AppSidenav />
      <MobileTopbar open={mobileNavOpen} onOpenNav={() => setMobileNavOpen(true)} />
      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
