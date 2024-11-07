'use server'

import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
interface SessionPayload extends JWTPayload {
  accessToken: string
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    console.log('Failed to verify session')
  }
}

export async function createSession(accessToken: string) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  const session = await encrypt({ accessToken })
  const cookieStore = await cookies()
  
  cookieStore.set(
    'session',
    session,
    {
      httpOnly: true,
      secure: false,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    }
  )
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  if (!session) {
    return null
  }

  const payload = await decrypt(session.value)
  return payload as SessionPayload | undefined
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}