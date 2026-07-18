'use client';

import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/providers/theme-provider';

/**
 * Icon-only theme toggle. Shows the icon for the mode you'd switch TO (sun while
 * dark, moon while light), matching the prototype's convention. Styled with the
 * same bordered icon-button treatment as the sidenav collapse control
 * (`app-sidenav.tsx`) so it reads as part of the same control family.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-medium)] bg-[var(--color-bg-input)] text-[var(--color-content-secondary)] transition-colors duration-150 hover:border-[var(--color-border-accent)] hover:bg-[var(--color-bg-accent-tint)] hover:text-[var(--color-content-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-content-accent)] ${className}`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
  );
}
