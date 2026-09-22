/*
  Payload's REST API, mounted at /cms-api rather than the default /api.

  app/api/quote/route.ts already owns /api, and a catch-all at /api/[...slug]
  in a second route group would either fail the build as a duplicate route or
  shadow the quote endpoint — which is the site's only conversion path. The
  move is configured in payload.config.ts under `routes.api`; the two must
  stay in step.
*/
import config from '@payload-config';
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
} from '@payloadcms/next/routes';

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const OPTIONS = REST_OPTIONS(config);
