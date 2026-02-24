import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getViewDefinitionByKey } from '@/lib/viewDefinitions/registry';
import { runViewDefinition } from '@/lib/viewDefinitions/runViewDefinition';

export async function POST(req: Request) {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { viewDefinitionKey } = await req.json();

  const entry = getViewDefinitionByKey(viewDefinitionKey);
  if (!entry) {
    return NextResponse.json(
      { error: `Unknown ViewDefinition key: ${viewDefinitionKey}` },
      { status: 400 },
    );
  }

  try {
    const result = await runViewDefinition(
      session.accessToken,
      entry.definition,
    );
    if (result.error) {
      return NextResponse.json(result, { status: result.status ?? 502 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('ViewDefinition/$run error:', error);
    return NextResponse.json(
      { error: 'Failed to run ViewDefinition' },
      { status: 500 },
    );
  }
}
