/** Wallet-address-prefixed query keys — see `services/auth/auth.queries.ts` for the convention. */
export const activityKeys = {
  all: (address: string | null) => ['activity', address] as const,
  list: (address: string | null) => [...activityKeys.all(address), 'list'] as const,
};
