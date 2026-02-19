'use client';

import type { Bundle, FhirResource } from 'fhir/r4';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  FileJson,
  LayoutDashboard,
  Search,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import { handleCopyJson } from '@/components/api-requests';
import { CurlExample } from '@/components/curl-example';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResourceInfo {
  type: string;
  count: number;
  examples: FhirResource[];
}

const getResourceInfo = (bundle: Bundle): ResourceInfo[] => {
  const resourceMap = new Map<
    string,
    {
      count: number;
      examples: FhirResource[];
    }
  >();

  bundle.entry?.forEach((entry) => {
    const resource = entry.resource;
    if (!resource?.resourceType) return;

    const info = resourceMap.get(resource.resourceType);
    if (info) {
      info.count++;
      if (info.examples.length < 3) {
        info.examples.push(resource);
      }
    } else {
      resourceMap.set(resource.resourceType, {
        count: 1,
        examples: [resource],
      });
    }
  });

  return Array.from(resourceMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, info]) => ({
      type,
      count: info.count,
      examples: info.examples,
    }));
};

const createBundlePreview = (bundle: Bundle) => {
  return {
    resourceType: bundle.resourceType,
    type: bundle.type,
    timestamp: bundle.timestamp,
    total: bundle.total,
    entry: [
      // Show first entry as example
      ...(bundle.entry?.slice(0, 1).map((entry) => ({
        fullUrl: entry.fullUrl,
        resource: {
          resourceType: entry.resource?.resourceType,
          id: entry.resource?.id,
          // Show this is truncated
          '...': '...',
        },
      })) || []),
      // Show there are more entries
      {
        '...': `${(bundle.entry?.length || 0) - 1} more entries`,
      },
    ],
  };
};

export default function Everything() {
  const [isLoading, setIsLoading] = useState(false);
  const [everythingData, setEverythingData] = useState<Bundle | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [hasResourceCopied, setHasResourceCopied] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceInfo | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExample, setSelectedExample] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const handleEverythingRequest = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/fhir/Patient/$everything');
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      console.log('Everything data:', data);
      setEverythingData(data);
    } catch (error) {
      console.error('Error fetching everything data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    handleCopyJson(everythingData);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleCopyResource = async () => {
    if (!selectedResource) return;
    handleCopyJson(selectedResource.examples[selectedExample]);
    setHasResourceCopied(true);
    setTimeout(() => setHasResourceCopied(false), 2000);
  };

  const renderResourceTable = (resources: ResourceInfo[]) => {
    const filteredResources = resources.filter((r) =>
      r.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <div className="grid grid-cols-[1fr_auto] gap-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow
                  key={resource.type}
                  className={`group cursor-pointer ${selectedResource?.type === resource.type ? 'bg-muted' : 'hover:bg-muted/50'}`}
                  onClick={() => {
                    setSelectedResource(resource);
                    setSelectedExample(0);
                  }}
                >
                  <TableCell className="font-mono">{resource.type}</TableCell>
                  <TableCell className="text-muted-foreground w-[100px] text-right">
                    <Badge variant="secondary" className="font-mono">
                      {resource.count}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[32px]">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedResource && (
          <div className="w-[500px]">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-mono text-sm mb-1">
                    {selectedResource.type}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedResource.count} resources found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyResource}
                  >
                    {hasResourceCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  {selectedResource.examples.length > 1 && (
                    <div className="flex gap-1">
                      {selectedResource.examples.map((example, idx) => (
                        <Button
                          key={`example-${example.resourceType}-${idx}`}
                          variant={
                            selectedExample === idx ? 'secondary' : 'ghost'
                          }
                          size="sm"
                          onClick={() => setSelectedExample(idx)}
                        >
                          #{idx + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(
                  selectedResource.examples[selectedExample],
                  null,
                  2,
                )}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge variant="outline">GET</Badge>
          <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
            $everything
          </code>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <code className="text-xs font-mono">
            /fhir/Patient/$PATIENT_ID/$everything
          </code>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">Comprehensive patient record</span>
        </div>
      </div>

      <CurlExample
        method="GET"
        url="https://api.flexpa.com/fhir/Patient/$PATIENT_ID/$everything"
      />

      {!everythingData && (
        <Button
          onClick={handleEverythingRequest}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Loading...' : 'Send Request'}
        </Button>
      )}

      {everythingData && (
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
            {everythingData.entry?.length || 0} resources returned
          </div>

          <Tabs defaultValue="resources" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="resources"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="bundle" className="flex items-center gap-2">
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

            <TabsContent value="resources" className="mt-4">
              {renderResourceTable(getResourceInfo(everythingData))}
            </TabsContent>

            <TabsContent value="bundle" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono">
                  {JSON.stringify(createBundlePreview(everythingData), null, 2)}
                </pre>
              </ScrollArea>
              <p className="text-xs text-muted-foreground mt-2">
                Simplified Bundle structure. Use the Resources tab to explore
                contents.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
