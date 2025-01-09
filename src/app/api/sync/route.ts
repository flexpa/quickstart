import { NextResponse } from 'next/server'
import FlexpaClient from '@flexpa/node-sdk'
import { MedplumClient } from '@medplum/core';
import { getSession } from '@/lib/session';
import { Bundle, FhirResource } from 'fhir/r4';

export const medplum = new MedplumClient({
  clientId: process.env.MEDPLUM_CLIENT_ID,
  clientSecret: process.env.MEDPLUM_CLIENT_SECRET
});

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const client = FlexpaClient.fromBearerToken(session.accessToken);
  const everything = await client.$everything();

  const batch: Bundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: everything.entry?.map((entry) => ({
      resource: {
        ...entry.resource as FhirResource,
        meta: {
          ...entry.resource?.meta,
          tag: [
            ...(entry.resource?.meta?.tag || []),
            {
              system: 'https://fhir.flexpa.com/identifiers/ResourceId',
              code: entry.resource?.id
            }
          ]
        }
      },
      request: {
        method: 'POST',
        url: `${entry.resource?.resourceType}`,
        ifNoneExist: `_tag=https://fhir.flexpa.com/identifiers/ResourceId|${entry.resource?.id}`
      },
    })),
  };

  const outcome = await medplum.executeBatch(batch);

  return NextResponse.json(outcome);
}