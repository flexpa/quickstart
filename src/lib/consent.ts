export interface ConsentEndpoint {
  id: string;
  name: string;
  label: string[];
  refreshable: boolean;
}

export interface PatientAuthorizationResponse {
  id: string;
  state: string;
  usage: string;
  createdAt: string;
  authorizedAt: string | null;
  exchangedAt: string | null;
  revokedAt: string | null;
  expiredAt: string | null;
  patient: string | null;
  endpoint: ConsentEndpoint | null;
  active: boolean;
  type?: string;
}

export interface ConsentResponse {
  id: string;
  createdAt: string;
  updatedAt: string | null;
  patientAuthorizations: PatientAuthorizationResponse[];
}

export async function fetchConsent(
  accessToken: string,
): Promise<ConsentResponse | null> {
  try {
    const response = await fetch('https://api.flexpa.com/rest/consent', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ConsentResponse;
  } catch {
    return null;
  }
}
