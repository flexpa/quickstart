'use server';

import FlexpaClient from '@flexpa/node-sdk';
import { env } from './env';
import { setCodeVerifier } from './session';

export type ConsentFlow = 'search' | 'ial2';

export async function startOAuthFlow(flow: ConsentFlow = 'search') {
  const codeVerifier = await FlexpaClient.generateCodeVerifier();
  const codeChallenge = await FlexpaClient.generateCodeChallenge(codeVerifier);

  await setCodeVerifier(codeVerifier);

  const authUrl = FlexpaClient.buildAuthorizationUrl({
    publishableKey: env.publishableKey,
    redirectUri: env.redirectUri,
    codeChallenge,
    externalId: crypto.randomUUID(),
    flow: flow === 'ial2' ? { type: 'ial2' } : { type: 'search' },
  });

  return authUrl;
}
