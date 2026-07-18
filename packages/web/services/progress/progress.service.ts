import type { ProgressListResponse } from '@komunify/shared';

import { API_ENDPOINTS } from '../api/endpoints';
import { ApiHttp } from '../api/http';

/** `GET /me/progress` (auth) — per-wallet, per-content progress. UX convenience layered on
 *  top of chain-verified access, not entitlement or money. */
export class ProgressService {
  static list(): Promise<ProgressListResponse> {
    return ApiHttp.get<ProgressListResponse>(API_ENDPOINTS.me.progress);
  }
}
