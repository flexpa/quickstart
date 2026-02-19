'use server';

import 'server-only';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

import { requiredEnv } from './env';

const secretKey = requiredEnv('SESSION_SECRET');
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload extends JWTPayload {
  accessToken: string;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = '',
): Promise<SessionPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch {
    console.log('Failed to verify session');
  }
}

export async function createSession(accessToken: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  const session = await encrypt({ accessToken });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return null;
  }

  const payload = await decrypt(session.value);
  return payload as SessionPayload | undefined;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function setCodeVerifier(codeVerifier: string) {
  const cookieStore = await cookies();
  cookieStore.set('flexpa_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax',
    path: '/',
  });
}

export async function getCodeVerifier() {
  const cookieStore = await cookies();
  return cookieStore.get('flexpa_code_verifier')?.value;
}

export async function deleteCodeVerifier() {
  const cookieStore = await cookies();
  cookieStore.delete('flexpa_code_verifier');
}
