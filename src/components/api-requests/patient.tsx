'use client';

import type { Patient } from 'fhir/r4';
import {
  ArrowRight,
  Check,
  Copy,
  FileJson,
  LayoutDashboard,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import { handleCopyJson } from '@/components/api-requests';
import { CurlExample } from '@/components/curl-example';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PatientRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handlePatientRequest = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/fhir/Patient');
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      console.log('Patient data:', data);
      setPatientData(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(patientData);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge variant="outline">GET</Badge>
          <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
            Patient
          </code>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <code className="text-xs font-mono">/fhir/Patient/$PATIENT_ID</code>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">Demographic information</span>
        </div>
      </div>

      <CurlExample
        method="GET"
        url="https://api.flexpa.com/fhir/Patient/$PATIENT_ID"
      />

      {!patientData && (
        <Button
          onClick={handlePatientRequest}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Loading...' : 'Send Request'}
        </Button>
      )}

      {patientData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Response Overview</h3>
            <Badge variant="outline" className="font-mono">
              searchset
            </Badge>
            {latencyMs && (
              <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                {latencyMs}ms
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Patient demographic information
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Resource
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" size="icon" onClick={handleCopy}>
                {hasCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <TabsContent value="overview" className="mt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="w-[200px] font-medium">
                      Name
                    </TableCell>
                    <TableCell>
                      {patientData.name?.[0]?.given?.join(' ')}{' '}
                      {patientData.name?.[0]?.family}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Birth Date</TableCell>
                    <TableCell>
                      {patientData.birthDate &&
                        formatDate(patientData.birthDate)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gender</TableCell>
                    <TableCell className="capitalize">
                      {patientData.gender}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Address</TableCell>
                    <TableCell>
                      {(() => {
                        const addr = patientData.address?.[0];
                        if (!addr) return null;
                        const line = addr.line?.join(', ');
                        const locality = [
                          addr.city,
                          [addr.state, addr.postalCode]
                            .filter(Boolean)
                            .join(' '),
                        ]
                          .filter(Boolean)
                          .join(', ');
                        return (
                          <>
                            {line}
                            {line && locality && <br />}
                            {locality}
                          </>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Contact</TableCell>
                    <TableCell>
                      {patientData.telecom?.map((telecom, i) => (
                        <div key={`${telecom.system}-${telecom.value}-${i}`}>
                          {telecom.system}: {telecom.value}
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(patientData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
