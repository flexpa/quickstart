'use server';

import FlexpaClient from '@flexpa/node-sdk';
import { env } from './env';
import { setCodeVerifier } from './session';

export async function startOAuthFlow() {
  const codeVerifier = FlexpaClient.generateCodeVerifier();
  const codeChallenge = FlexpaClient.generateCodeChallenge(codeVerifier);

  await setCodeVerifier(codeVerifier);

  const authUrl = FlexpaClient.buildAuthorizationUrl({
    publishableKey: env.publishableKey,
    redirectUri: env.redirectUri,
    codeChallenge,
    externalId: crypto.randomUUID(),
  });

  return authUrl;
}
