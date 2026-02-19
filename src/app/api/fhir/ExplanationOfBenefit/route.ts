import FlexpaClient from '@flexpa/node-sdk';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = FlexpaClient.fromBearerToken(session.accessToken);
  const eob = await client.search('ExplanationOfBenefit', {});

  return NextResponse.json(eob);
}
