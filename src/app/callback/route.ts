import FlexpaClient from '@flexpa/node-sdk';
import { type NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import {
  createSession,
  deleteCodeVerifier,
  getCodeVerifier,
} from '@/lib/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    const errorDescription = searchParams.get('error_description') || error;
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(errorDescription)}`, request.url),
    );
  }

  // Validate authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=No+authorization+code+received', request.url),
    );
  }

  // Retrieve stored code verifier
  const codeVerifier = await getCodeVerifier();
  if (!codeVerifier) {
    return NextResponse.redirect(
      new URL('/?error=Code+verifier+not+found', request.url),
    );
  }

  try {
    // Exchange authorization code for access token
    const client = await FlexpaClient.fromAuthorizationCode(
      code,
      codeVerifier,
      env.redirectUri,
      env.publishableKey,
    );

    // Store access token in session
    await createSession(client.getAccessToken());

    // Clean up code verifier
    await deleteCodeVerifier();

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err) {
    console.error('Token exchange error:', err);
    return NextResponse.redirect(
      new URL('/?error=Token+exchange+failed', request.url),
    );
  }
}
