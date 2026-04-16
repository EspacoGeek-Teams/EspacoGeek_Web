/* eslint-env node */

import { request } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:19080';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const EMAIL = process.env.NATIVE_AGENT_EMAIL || process.env.TEST_EMAIL || '';
const PASSWORD = process.env.NATIVE_AGENT_PASSWORD || process.env.TEST_PASSWORD || '';
const DEVICE_INFO = process.env.NATIVE_AGENT_DEVICE || 'playwright-native-agent';

const endpointCandidates = [
  `${API_BASE.replace(/\/$/, '')}`,
  `${API_BASE.replace(/\/$/, '')}/graphql`,
  `${API_BASE.replace(/\/$/, '')}/api/graphql`
];

function toBody(query, variables = {}) {
  return { query, variables };
}

async function pickEndpoint(ctx) {
  for (const url of endpointCandidates) {
    try {
      const res = await ctx.post(url, {
        data: toBody('query { __typename }')
      });
      if (!res.ok()) continue;
      const json = await res.json();
      if (json?.data?.__typename) return url;
    } catch {
      // keep trying candidates
    }
  }
  throw new Error(`No GraphQL endpoint reachable from candidates: ${endpointCandidates.join(', ')}`);
}

async function gql(ctx, endpoint, query, variables = {}, headers = {}) {
  const res = await ctx.post(endpoint, {
    headers,
    data: toBody(query, variables)
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    // ignored
  }

  return { status: res.status(), ok: res.ok(), payload };
}

async function main() {
  if (!EMAIL || !PASSWORD) {
    throw new Error('Set NATIVE_AGENT_EMAIL and NATIVE_AGENT_PASSWORD to run authenticated flow.');
  }

  const ctx = await request.newContext({
    extraHTTPHeaders: {
      Origin: FRONTEND_ORIGIN
    },
    ignoreHTTPSErrors: true
  });

  try {
    const endpoint = await pickEndpoint(ctx);
    console.log(`[playwright] Resolved GraphQL endpoint: ${endpoint}`);

    const loginMutation = `
      mutation Login($email: String, $password: String, $deviceInfo: String) {
        login(email: $email, password: $password, deviceInfo: $deviceInfo) {
          accessToken
          user { id username email }
        }
      }
    `;

    const login = await gql(ctx, endpoint, loginMutation, {
      email: EMAIL,
      password: PASSWORD,
      deviceInfo: DEVICE_INFO
    });

    if (!login.ok || login.payload?.errors?.length || !login.payload?.data?.login?.accessToken) {
      console.error('[playwright] Login failed:', JSON.stringify(login.payload, null, 2));
      process.exitCode = 2;
      return;
    }

    let accessToken = login.payload.data.login.accessToken;
    console.log('[playwright] Login succeeded.');

    const authHeader = () => ({ Authorization: `Bearer ${accessToken}` });

    const isLogged = await gql(ctx, endpoint, 'query { isLogged }', {}, authHeader());
    console.log('[playwright] isLogged:', JSON.stringify(isLogged.payload));

    const refresh = await gql(ctx, endpoint, 'mutation { refreshToken { accessToken } }');
    if (refresh.payload?.data?.refreshToken?.accessToken) {
      accessToken = refresh.payload.data.refreshToken.accessToken;
      console.log('[playwright] refreshToken succeeded.');

      const isLoggedAfterRefresh = await gql(ctx, endpoint, 'query { isLogged }', {}, authHeader());
      console.log('[playwright] isLogged(after refresh):', JSON.stringify(isLoggedAfterRefresh.payload));
    } else {
      console.warn('[playwright] refreshToken did not return token:', JSON.stringify(refresh.payload));
    }

    const logout = await gql(ctx, endpoint, 'query { logout }', {}, authHeader());
    console.log('[playwright] logout:', JSON.stringify(logout.payload));

    const cookies = await ctx.storageState();
    console.log(`[playwright] Cookies captured: ${cookies.cookies.length}`);
  } finally {
    await ctx.dispose();
  }
}

main().catch((err) => {
  console.error('[playwright] Fatal error:', err.message);
  process.exit(1);
});
