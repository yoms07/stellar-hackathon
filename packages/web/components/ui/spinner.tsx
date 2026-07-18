import { cn } from '@/lib/utils';

/**
 * Route-level loading indicator: a bordered ring, accent segment rotating (transform only,
 * per DESIGN.md §5 motion rules). Used where a content-shaped Skeleton doesn't apply — e.g.
 * bridging the gap while wallet/session state resolves and the page doesn't know its final
 * layout yet (see `/dashboard`'s funnel gate).
 */
function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border-medium)] border-t-[var(--color-content-accent)] motion-reduce:animate-none',
        className,
      )}
    />
  );
}

/** Centers a Spinner in the full viewport, for whole-page loading gates. */
function PageSpinner() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export { Spinner, PageSpinner };
