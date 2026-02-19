'use client';

import type { Bundle } from 'fhir/r4';
import {
  ArrowRight,
  Check,
  Copy,
  FileJson,
  LayoutDashboard,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
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

export default function MedplumSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncData, setSyncData] = useState<Bundle | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleSync = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      console.log('Sync data:', data);
      setSyncData(data);
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!syncData) return;
    await navigator.clipboard.writeText(JSON.stringify(syncData, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge variant="outline">POST</Badge>
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
              $import
            </code>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <code className="text-xs font-mono">
              https://api.medplum.com/fhir/R4
            </code>
            <ArrowRight className="h-3 w-3" />
            <span className="text-xs">FHIR transaction bundle</span>
          </div>
        </div>
        {syncData ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleSync}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Syncing...' : 'Start Sync'}
          </Button>
        )}
      </div>

      {syncData && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Batch Transaction Results</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Resource synchronization status
                </p>
                {latencyMs && (
                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    {latencyMs}ms
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className="font-mono">
              {syncData.resourceType}
            </Badge>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Response
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncData.entry?.map((entry, index) => (
                    <TableRow
                      key={`${entry.resource?.resourceType}-${entry.resource?.id}-${index}`}
                    >
                      <TableCell className="font-medium">
                        {entry.resource?.resourceType}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <a
                          href={`https://app.medplum.com/${entry.resource?.resourceType}/${entry.resource?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {entry.resource?.id}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.response?.status?.startsWith('2')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {entry.response?.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(syncData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
