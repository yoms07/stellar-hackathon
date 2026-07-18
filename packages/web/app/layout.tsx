import type { Metadata } from 'next';
import { AppHeader } from '@/components/app-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { WalletProvider } from '@/providers/wallet-provider';
import { SmoothScroll } from '@/providers/smooth-scroll';
import './globals.css';

export const metadata: Metadata = {
  title: 'Komunify · One subscription, every community perk',
  description:
    'Pay one subscription on Stellar and unlock premium access, member discounts, learning resources, and digital assets across partner communities. Soroban splits every payment on-chain.',
};

// Sets `data-theme` before hydration so the first paint already matches the
// stored preference (dark is the brand default, DESIGN.md §1). Runs inline
// in <head>, ahead of any CSS or React, so there is no flash of the wrong
// theme. Mirrors the prototype's mechanism (`prototype/app.js`), same
// localStorage key (`k_theme`).
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('k_theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <SmoothScroll>
          <QueryProvider>
            <ThemeProvider>
              <WalletProvider>
                <TooltipProvider delayDuration={150}>
                  <AppHeader />
                  {children}
                </TooltipProvider>
              </WalletProvider>
            </ThemeProvider>
          </QueryProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
