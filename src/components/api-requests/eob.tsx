'use client';

import type { Bundle, ExplanationOfBenefit } from 'fhir/r4';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EobRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [eobData, setEobData] = useState<Bundle<ExplanationOfBenefit> | null>(
    null,
  );
  const [hasCopied, setHasCopied] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleEobRequest = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/fhir/ExplanationOfBenefit');
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      console.log('EOB data:', data);
      setEobData(data);
    } catch (error) {
      console.error('Error fetching EOB data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(eobData);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge variant="outline">GET</Badge>
          <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
            ExplanationOfBenefit
          </code>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <code className="text-xs font-mono">/fhir/ExplanationOfBenefit</code>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">Claims and payment information</span>
        </div>
      </div>

      <CurlExample
        method="GET"
        url="https://api.flexpa.com/fhir/ExplanationOfBenefit"
      />

      {!eobData && (
        <Button
          onClick={handleEobRequest}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Loading...' : 'Send Request'}
        </Button>
      )}

      {eobData?.entry && eobData.entry.length > 0 && (
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
            {eobData.entry.length} claims found
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
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eobData.entry.map((entry) => {
                      const eob = entry.resource as ExplanationOfBenefit;
                      const total = eob.total?.[0]?.amount?.value;
                      return (
                        <TableRow key={eob.id}>
                          <TableCell>
                            {eob.created && formatDate(eob.created)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {eob.type?.coding?.[0]?.code || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {eob.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {total ? formatCurrency(total) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(eobData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
