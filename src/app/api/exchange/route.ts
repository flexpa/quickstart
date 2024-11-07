import { NextResponse } from 'next/server'
import FlexpaClient from '@flexpa/node-sdk'
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { publicToken } = body;

    const client = await FlexpaClient.fromExchange(publicToken,  process.env.FLEXPA_SECRET_KEY!);

    const accessToken = client.getAccessToken();

    await createSession(accessToken);

    return NextResponse.json({});
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 400 }
    )
  }
}
