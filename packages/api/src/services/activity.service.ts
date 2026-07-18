import { nativeToScVal, rpc, scValToNative, xdr as xdrNs } from '@komunify/contract-client';
import type { ActivityItem } from '@komunify/shared';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Per-wallet activity feed for `GET /me/activity`. No new database table — built from the same
 * `getEvents` / `"kmf"` topic source as `stats.service.ts`'s `recentEvents`, filtered to the
 * session wallet in the topic's 3rd segment (member/who — see CONTRACT_SPEC.md §2.6). Kept
 * separate from stats.service.ts because the topic filter (per-wallet) and shape (adds
 * contentId/at, drops 'content'/'settled') differ from the public dashboard feed.
 */

// Same lookback window as stats.service.ts's recentEvents: ~5.5h of history on testnet.
const EVENT_LOOKBACK_LEDGERS = 4000;
const KMF_TOPIC = 'kmf';
const ACTIVITY_LIMIT = 20;

function rpcServer(): rpc.Server {
  const rpcUrl = env.SOROBAN_RPC_URL;
  return new rpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
}

function scValToNativeSafe(val: xdrNs.ScVal): unknown {
  try {
    return scValToNative(val);
  } catch {
    return undefined;
  }
}

function isActivityEventType(t: string): t is ActivityItem['type'] {
  return t === 'subscribed' || t === 'accessed' || t === 'claimed';
}

export async function getWalletActivity(wallet: string): Promise<ActivityItem[]> {
  if (!env.KOMUNIFY_CONTRACT_ID) {
    return [];
  }

  try {
    const server = rpcServer();
    const latest = await server.getLatestLedger();
    const startLedger = Math.max(1, latest.sequence - EVENT_LOOKBACK_LEDGERS);

    const kmfTopic = nativeToScVal(KMF_TOPIC, { type: 'symbol' }).toXDR('base64');
    const walletTopic = nativeToScVal(wallet, { type: 'address' }).toXDR('base64');
    const response = await server.getEvents({
      startLedger,
      filters: [
        { type: 'contract', contractIds: [env.KOMUNIFY_CONTRACT_ID], topics: [[kmfTopic, '*', walletTopic]] },
      ],
      limit: 100,
    });

    const items: ActivityItem[] = [];
    for (const e of response.events) {
      const topics = e.topic.map((t) => scValToNativeSafe(t));
      const [, eventType] = topics;
      if (typeof eventType !== 'string' || !isActivityEventType(eventType)) continue;

      const data = scValToNativeSafe(e.value) as Record<string, unknown> | undefined;
      const contentId =
        eventType === 'accessed' && data?.content_id !== undefined ? String(data.content_id) : undefined;
      const amount =
        (eventType === 'subscribed' || eventType === 'claimed') && data
          ? String(data.price ?? data.amount ?? '')
          : undefined;

      items.push({
        type: eventType,
        contentId,
        amount: amount || undefined,
        ledger: e.ledger,
        txHash: e.txHash,
        at: e.ledgerClosedAt,
      });
    }

    items.sort((a, b) => b.ledger - a.ledger);
    return items.slice(0, ACTIVITY_LIMIT);
  } catch (err) {
    logger.warn('activity: getEvents failed, returning empty activity', { error: (err as Error).message });
    return [];
  }
}
