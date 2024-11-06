import { NextResponse } from 'next/server'
import FlexpaClient from '@flexpa/node-sdk'
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const client = FlexpaClient.fromBearerToken(session.accessToken);
  const everything = await client.$everything();

  return NextResponse.json(everything)
}
