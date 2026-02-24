'use client';

import {
  ArrowRight,
  Check,
  Copy,
  FileJson,
  LayoutDashboard,
  Timer,
} from 'lucide-react';
import { useState } from 'react';
import { CurlExample } from '@/components/curl-example';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type ViewDefinitionEntry,
  viewDefinitionRegistry,
} from '@/lib/viewDefinitions/registry';

function formatCellValue(value: unknown): string {
  if (value == null) return '\u2014';
  if (Array.isArray(value)) return value.join(', ') || '\u2014';
  return String(value);
}

function getCurlBody(entry: ViewDefinitionEntry): string {
  return JSON.stringify(
    {
      resourceType: 'Parameters',
      parameter: [{ name: 'viewResource', resource: entry.definition }],
    },
    null,
    2,
  );
}

interface ResponseData {
  rows: Array<Record<string, unknown>>;
  resourceCount?: number;
}

export function ParsedRecords() {
  const [selectedKey, setSelectedKey] = useState(viewDefinitionRegistry[0].key);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const selectedEntry =
    viewDefinitionRegistry.find((e) => e.key === selectedKey) ??
    viewDefinitionRegistry[0];

  const handleSelectionChange = (key: string) => {
    setSelectedKey(key);
    setResponseData(null);
    setLatencyMs(null);
  };

  const handleSendRequest = async () => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const response = await fetch('/api/view-definition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewDefinitionKey: selectedKey }),
      });
      const data = await response.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      setResponseData(data);
    } catch (error) {
      console.error('Error running ViewDefinition:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const rows = responseData?.rows ?? [];

  return (
    <div className="space-y-6">
      {/* Select dropdown */}
      <Select value={selectedKey} onValueChange={handleSelectionChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {viewDefinitionRegistry.map((entry) => (
            <SelectItem key={entry.key} value={entry.key}>
              {entry.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Request info */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge variant="outline">POST</Badge>
          <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-sm">
            ViewDefinition/$run
          </code>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <code className="text-xs font-mono">/fhir/ViewDefinition/$run</code>
          <ArrowRight className="h-3 w-3" />
          <span className="text-xs">{selectedEntry.description}</span>
        </div>
      </div>

      {/* Collapsible curl + ViewDefinition JSON */}
      <Accordion type="multiple" className="space-y-0">
        <AccordionItem value="curl">
          <AccordionTrigger className="text-sm">cURL Example</AccordionTrigger>
          <AccordionContent>
            <CurlExample
              method="POST"
              url="https://api.flexpa.com/fhir/ViewDefinition/$run"
              body={getCurlBody(selectedEntry)}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="view-definition">
          <AccordionTrigger className="text-sm">
            ViewDefinition JSON
          </AccordionTrigger>
          <AccordionContent>
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      JSON.stringify(selectedEntry.definition, null, 2),
                    );
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {JSON.stringify(selectedEntry.definition, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Send Request button */}
      {!responseData && (
        <Button
          onClick={handleSendRequest}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? 'Loading...' : 'Send Request'}
        </Button>
      )}

      {/* Result area */}
      {responseData && (
        <Accordion type="single" collapsible defaultValue="response">
          <AccordionItem value="response">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                Response
                {latencyMs != null && (
                  <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    {latencyMs}ms
                  </div>
                )}
                <span className="text-xs text-muted-foreground font-normal">
                  {rows.length} {rows.length === 1 ? 'row' : 'rows'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Tabs defaultValue="table" className="w-full">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger
                        value="table"
                        className="flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Table
                      </TabsTrigger>
                      <TabsTrigger
                        value="json"
                        className="flex items-center gap-2"
                      >
                        <FileJson className="h-4 w-4" />
                        JSON
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

                  <TabsContent value="table" className="mt-4">
                    {rows.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No data returned
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {rows.map((row, rowIndex) => (
                          <div key={String(row.id ?? rowIndex)}>
                            {rows.length > 1 && (
                              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                Row {rowIndex + 1}
                              </h4>
                            )}
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[200px]">
                                      Field
                                    </TableHead>
                                    <TableHead>Value</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(row).map(([key, value]) => (
                                    <TableRow key={key}>
                                      <TableCell className="font-medium font-mono text-xs">
                                        {key}
                                      </TableCell>
                                      <TableCell className="font-mono text-xs">
                                        {formatCellValue(value)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="json" className="mt-4">
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        {JSON.stringify(responseData, null, 2)}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
