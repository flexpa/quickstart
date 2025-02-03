import { NextResponse } from 'next/server'
import FlexpaClient from '@flexpa/node-sdk'
import { getSession } from '@/lib/session';
import { Bundle, BundleEntry, Coverage, FhirResource, Patient } from 'fhir/r4';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

const [projectId, location, datasetId, fhirStoreId] = (process.env.NEXT_PUBLIC_GOOGLE_FHIR_STORE_URL || '').match(/projects\/([^/]+)\/locations\/([^/]+)\/datasets\/([^/]+)\/fhirStores\/([^/]+)/)?.slice(1) || [];

if (!projectId || !location || !datasetId || !fhirStoreId) {
  throw new Error('Invalid NEXT_PUBLIC_GOOGLE_FHIR_STORE_URL format. Expected format: https://healthcare.googleapis.com/v1/projects/{projectId}/locations/{location}/datasets/{datasetId}/fhirStores/{fhirStoreId}/fhir');
}

const baseUrl = `https://healthcare.googleapis.com/v1/projects/${projectId}/locations/${location}/datasets/${datasetId}/fhirStores/${fhirStoreId}/fhir`;

export async function POST() {
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
    entry: everything.entry?.map((entry) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { meta, ...rest } = entry.resource as FhirResource;
        return {
      resource: rest,
      request: {
        method: 'POST',
        url: `${baseUrl}/${entry.resource?.resourceType}`
      },
    }
    }) as BundleEntry<Coverage | Patient>[],
  };

  try {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/fhir+json'
      },
      body: JSON.stringify(batch)
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(response);
      throw new Error(`HTTP error! status: ${response.status}, message: ${error.message}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error executing bundle:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Google FHIR store' },
      { status: 500 }
    );
  }
}