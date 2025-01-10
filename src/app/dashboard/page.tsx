'use server'

import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session';
import { decodeJwt } from 'jose';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiRequests } from '@/components/api-requests'
import { AccessTokenDisplay } from '@/components/access-token-display'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CopyButton } from '@/components/copy-button'
import MedplumSync from '@/components/medplum-sync';

export default async function Dashboard() {
  const token = await decrypt((await cookies()).get('session')?.value);
  const decoded = decodeJwt(token?.accessToken as string);
  const isMedplumConfigured = process.env.MEDPLUM_CLIENT_ID && process.env.MEDPLUM_CLIENT_SECRET;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-lg mx-auto items-center">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold inline-block">Flexpa Quickstart</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container max-w-screen-lg mx-auto py-6">
        <div className="grid gap-6">
          {/* Authorization Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Patient Authorization</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    A Flexpa access token is obtained after a successful <Link href="https://www.flexpa.com/docs/consent" className="underline">Flexpa Link</Link> consent flow. This token contains patient information and authorization details needed to access the Flexpa FHIR API.
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="space-y-4">
                    <p className="text-sm">
                      After a user connects their health plan with Flexpa Link, you&apos;ll receive a <code className="text-xs">public_token</code> that can be <Link href="https://www.flexpa.com/docs/consent#exchange-public-token" className="underline">exchanged</Link> for an <code className="text-xs">access_token</code>. 
                      This token provides secure access to the patient&apos;s FHIR resources through Flexpa&apos;s API.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
                    <div className="text-sm font-medium text-muted-foreground">Authorization ID</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                        {decoded.sub as string}
                      </code>
                      <CopyButton value={decoded.sub as string} />
                    </div>

                    <div className="text-sm font-medium text-muted-foreground">Patient ID</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                        {decoded.patient as string}
                      </code>
                      <CopyButton value={decoded.patient as string} />
                    </div>

                    <div className="text-sm font-medium text-muted-foreground">Access Token</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative rounded bg-muted px-3 py-2">
                        <AccessTokenDisplay token={token?.accessToken as string} />
                      </div>
                      <CopyButton value={token?.accessToken as string} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Explorer Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>FHIR API Explorer</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    <Link href="https://www.flexpa.com/docs/records" className="underline">Flexpa&apos;s API</Link> uses FHIR (Fast Healthcare Interoperability Resources), a standard for exchanging healthcare information electronically. The API synchronizes and normalizes data from health plans, providing reliable access to patient claims, demographics, and clinical data in the FHIR R4 format.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
                  <div className="text-sm font-medium text-muted-foreground">Base URL</div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                      https://api.flexpa.com/fhir
                    </code>
                    <CopyButton value="https://api.flexpa.com/fhir" />
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm">
                        The endpoints below demonstrate core FHIR capabilities:
                      </p>
                      <ul className="text-sm list-disc list-inside space-y-1">
                        <li><code className="text-xs">$everything</code> - Comprehensive patient record with all available resources</li>
                        <li><code className="text-xs">Patient</code> - Basic demographic information</li>
                        <li><code className="text-xs">ExplanationOfBenefit</code> - Claims and payment information</li>
                        <li><code className="text-xs">Coverage</code> - Insurance coverage details</li>
                      </ul>
                      <p className="text-sm mt-4">
                        Each response includes Flexpa-specific metadata and transformations to ensure consistency and reliability across different payer endpoints.
                      </p>
                    </div>
                  </div>
                </div>

                <ApiRequests />
              </div>
            </CardContent>
          </Card>

          {/* Medplum Sync Card */}
          {isMedplumConfigured && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Medplum Integration</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Store your Flexpa health records in a secure, HIPAA-compliant FHIR server using <Link href="https://flexpa.com/docs/guides/medplum" className="underline">Medplum</Link>. While Flexpa helps you retrieve claims, coverage, and clinical records from health plans, Medplum provides a fully-managed FHIR server with built-in data modeling, search capabilities, and healthcare-specific features that make it ideal for storing and working with claims data.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="space-y-4">
                      <p className="text-sm">
                        This integration allows you to maintain and manage patient data in a fully compliant environment. See the guide <Link href="https://flexpa.com/docs/guides/medplum" className="underline">here</Link> to learn how to sync your Flexpa health records to Medplum. Once synced, click on a resource ID to view the data in Medplum.
                      </p>
                    </div>
                  </div>

                  <MedplumSync />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
