export async function runViewDefinition(
  accessToken: string,
  viewDefinition: Record<string, unknown>,
) {
  const response = await fetch(
    'https://api.flexpa.com/fhir/ViewDefinition/$run',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceType: 'Parameters',
        parameter: [{ name: 'viewResource', resource: viewDefinition }],
      }),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `ViewDefinition/$run failed: ${response.status} ${response.statusText}`,
    );
    return {
      error: `API returned ${response.status}`,
      status: response.status,
      details: errorText,
    };
  }
  return response.json();
}
