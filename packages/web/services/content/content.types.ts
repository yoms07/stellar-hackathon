import type { ContentListItem, DownloadResponse, Progress, UpdateProgressRequest } from '@komunify/shared';

export type { ContentListItem, DownloadResponse, Progress, UpdateProgressRequest };

export interface OnChainContent {
  id: bigint;
  creator: string;
  managers: string[];
  active: boolean;
  sha256: Uint8Array;
}

/** Content grid row, merged from the chain (source of truth for id/active) and, once Lane B's
 *  `GET /content` ships, Postgres title/description. Title falls back to "Content #<id>". */
export interface ContentGridItem {
  contentId: string;
  title: string;
  active: boolean;
  creatorWallet: string;
}
