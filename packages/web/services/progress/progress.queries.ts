/** Wallet-address-prefixed query keys — see `services/auth/auth.queries.ts` for the convention. */
export const progressKeys = {
  all: (address: string | null) => ['progress', address] as const,
  list: (address: string | null) => [...progressKeys.all(address), 'list'] as const,
};
