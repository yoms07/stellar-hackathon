import type { ActivityListResponse } from '@komunify/shared';

import { API_ENDPOINTS } from '../api/endpoints';
import { ApiHttp } from '../api/http';

/** `GET /me/activity` (auth) — event-sourced from chain `kmf` events, newest first, capped
 *  at 20. See docs/API_SPEC.md / `packages/shared/src/schemas/activity.schema.ts`. */
export class ActivityService {
  static list(): Promise<ActivityListResponse> {
    return ApiHttp.get<ActivityListResponse>(API_ENDPOINTS.me.activity);
  }
}
