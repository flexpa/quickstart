'use server'

import FlexpaClient from '@flexpa/node-sdk'
import { setCodeVerifier } from './session'

export async function startOAuthFlow() {
  const codeVerifier = FlexpaClient.generateCodeVerifier()
  const codeChallenge = FlexpaClient.generateCodeChallenge(codeVerifier)

  await setCodeVerifier(codeVerifier)

  const authUrl = FlexpaClient.buildAuthorizationUrl({
    publishableKey: process.env.NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY!,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
    codeChallenge,
    externalId: crypto.randomUUID(),
  })

  return authUrl
}
