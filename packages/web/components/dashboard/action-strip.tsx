'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

/**
 * Slim one-line nudge card (`.partner-strip` layout, already established for this exact
 * shape: icon/title/hint on the left, one CTA on the right). Reused for every "one more
 * thing you could do" prompt on the dashboard — kept to one shared pattern instead of each
 * caller inventing its own card, so a page never grows more than one of these at a time.
 */
export function ActionStrip({
  icon,
  title,
  hint,
  href,
  cta,
}: {
  icon: IconName;
  title: string;
  hint: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="card partner-strip">
      <div className="row tight" style={{ alignItems: 'center' }}>
        <span style={{ color: 'var(--color-content-secondary)', display: 'inline-flex' }}>
          <Icon name={icon} size={16} />
        </span>
        <div>
          <div className="content-title">{title}</div>
          <div className="content-meta">{hint}</div>
        </div>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href={href}>{cta}</Link>
      </Button>
    </section>
  );
}
