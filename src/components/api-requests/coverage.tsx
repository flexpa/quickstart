'use client';

import { Copy, Check, ArrowRight, FileJson, LayoutDashboard, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Bundle, Coverage } from 'fhir/r4';
import { handleCopyJson } from '@/components/api-requests';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurlExample } from '@/components/curl-example';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function CoverageRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [coverageData, setCoverageData] = useState<Bundle<Coverage> | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleCoverageRequest = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/fhir/Coverage');
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      console.log('Coverage data:', data);
      setCoverageData(data);
    } catch (error) {
      console.error('Error fetching coverage data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(coverageData);
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
          <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">Coverage</code>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <code className="text-xs font-mono">/fhir/Coverage</code>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">Insurance coverage details</span>
        </div>
      </div>

      <CurlExample 
        method="GET"
        url="https://api.flexpa.com/fhir/Coverage"
      />

      {!coverageData && (
        <Button 
          onClick={handleCoverageRequest} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Loading...' : 'Send Request'}
        </Button>
      )}

      {coverageData && coverageData.entry && coverageData.entry.length > 0 && (
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
            {coverageData.entry.length} insurance plans found
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Resource
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
              >
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
                      <TableHead>Plan</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverageData.entry.map((entry) => {
                      const coverage = entry.resource as Coverage;
                      return (
                        <TableRow key={coverage.id}>
                          <TableCell>
                            {coverage.class?.[0]?.name || coverage.type?.text || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {coverage.type?.coding?.[0]?.code || 'Unknown'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {coverage.period?.start && formatDate(coverage.period.start)}
                            {coverage.period?.end && ` - ${formatDate(coverage.period.end)}`}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {coverage.status}
                            </Badge>
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
                  {JSON.stringify(coverageData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
