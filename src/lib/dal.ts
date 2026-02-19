import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getSession } from '@/lib/session';

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.accessToken) {
    redirect('/');
  }

  return session;
});
