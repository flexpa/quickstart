'use client';

import { AccessTokenDisplay } from '@/components/access-token-display';
import { CopyButton } from '@/components/copy-button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PatientAuthorizationResponse } from '@/lib/consent';

function formatTimestamp(value: string | null): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function StateBadge({ state }: { state: string }) {
  switch (state) {
    case 'EXCHANGED':
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {state}
        </Badge>
      );
    case 'AUTHORIZING':
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 border-amber-200"
        >
          {state}
        </Badge>
      );
    case 'AUTHORIZED':
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200"
        >
          {state}
        </Badge>
      );
    case 'ERRORED':
      return <Badge variant="destructive">{state}</Badge>;
    default:
      return <Badge variant="secondary">{state}</Badge>;
  }
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

interface ConsentCardProps {
  consentId: string;
  accessToken: string;
  patientAuthorizations: PatientAuthorizationResponse[];
  patientAuthorizationsError?: boolean;
}

export function ConsentCard({
  consentId,
  accessToken,
  patientAuthorizations,
  patientAuthorizationsError,
}: ConsentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Consent</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A consent represents a single authorization session via Flexpa
              Link. Each consent can include one or more patient authorizations
              to health plan endpoints.
            </p>
          </div>
          <Badge variant="outline">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Consent ID
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                    {consentId}
                  </code>
                  <CopyButton value={consentId} />
                </div>

                <div className="text-sm font-medium text-muted-foreground">
                  Access Token
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative rounded bg-muted px-3 py-2">
                    <AccessTokenDisplay token={accessToken} />
                  </div>
                  <CopyButton value={accessToken} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">
              Patient Authorizations{' '}
              {!patientAuthorizationsError &&
                `(${patientAuthorizations.length})`}
            </h4>
            {patientAuthorizationsError && (
              <p className="text-sm text-muted-foreground rounded-lg border border-dashed p-4">
                Unable to load patient authorizations. The consent API may be
                unavailable.
              </p>
            )}
            <Accordion type="multiple" className="space-y-3">
              {patientAuthorizations.map((pa) => (
                <AccordionItem
                  key={pa.id}
                  value={pa.id}
                  className="rounded-lg border border-b"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {pa.endpoint?.label?.[0] ?? 'Unknown Endpoint'}
                      </span>
                      <StateBadge state={pa.state} />
                      {pa.type && (
                        <Badge variant="outline">{titleCase(pa.type)}</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    <div className="grid grid-cols-[160px_1fr] gap-4 items-center">
                      <div className="text-sm font-medium text-muted-foreground">
                        Authorization ID
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                          {pa.id}
                        </code>
                        <CopyButton value={pa.id} />
                      </div>

                      {pa.patient && (
                        <>
                          <div className="text-sm font-medium text-muted-foreground">
                            Patient ID
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 relative rounded bg-muted px-3 py-2 font-mono text-sm">
                              {pa.patient}
                            </code>
                            <CopyButton value={pa.patient} />
                          </div>
                        </>
                      )}

                      {pa.authorizedAt && (
                        <>
                          <div className="text-sm font-medium text-muted-foreground">
                            Authorized
                          </div>
                          <div className="text-sm">
                            {formatTimestamp(pa.authorizedAt)}
                          </div>
                        </>
                      )}

                      {pa.exchangedAt && (
                        <>
                          <div className="text-sm font-medium text-muted-foreground">
                            Exchanged
                          </div>
                          <div className="text-sm">
                            {formatTimestamp(pa.exchangedAt)}
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
