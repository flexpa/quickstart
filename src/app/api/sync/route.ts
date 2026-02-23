import FlexpaClient from '@flexpa/node-sdk';
import { MedplumClient } from '@medplum/core';
import type { Bundle, BundleEntry, FhirResource } from 'fhir/r4';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

type EntryWithResource = BundleEntry & {
  resource: FhirResource & { id: string };
};

function hasResourceWithId(entry: BundleEntry): entry is EntryWithResource {
  return entry.resource != null && typeof entry.resource.id === 'string';
}

const medplum = new MedplumClient({
  clientId: process.env.MEDPLUM_CLIENT_ID,
  clientSecret: process.env.MEDPLUM_CLIENT_SECRET,
});

export async function POST(_request: Request) {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = FlexpaClient.fromBearerToken(session.accessToken);
  const everything = await client.$everything();

  const batch: Bundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: everything.entry?.filter(hasResourceWithId).map((entry) => ({
      resource: {
        ...entry.resource,
        meta: {
          ...entry.resource.meta,
          tag: [
            ...(entry.resource.meta?.tag || []),
            {
              system: 'https://fhir.flexpa.com/identifiers/ResourceId',
              code: entry.resource.id,
            },
          ],
        },
      },
      request: {
        method: 'POST' as const,
        url: entry.resource.resourceType,
        ifNoneExist: `_tag=https://fhir.flexpa.com/identifiers/ResourceId|${entry.resource.id}`,
      },
    })),
  };

  const outcome = await medplum.executeBatch(batch);

  return NextResponse.json(outcome);
}
