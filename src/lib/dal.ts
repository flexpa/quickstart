import 'server-only'
 
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
 
export const verifySession = cache(async () => {
  const session = await getSession();
 
  if (!session?.accessToken) {
    redirect('/');
  }
 
  return session;
})