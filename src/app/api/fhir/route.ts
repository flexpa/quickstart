import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Helper function to verify authorization
function isAuthorized(authHeader: string | null): boolean {
  if (!authHeader) return false
  return authHeader.startsWith('Bearer ')
}

export async function GET() {
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!isAuthorized(authorization)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // const { href } = new URL(
  //   `fhir${req.url}`,
  //   process.env.FLEXPA_PUBLIC_API_BASE_URL,
  // );

  return NextResponse.json({ message: 'FHIR endpoint' })
}
