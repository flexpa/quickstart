'use client';

import type { Attachment, DocumentReference } from 'fhir/r4';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NarrativeHtml } from '@/components/api-requests/narrative-html';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  type CcdaDocument,
  decodeBase64,
  isTextContentType,
  normalizeBase64,
  parseCcda,
} from '@/lib/ccda';

type ViewMode = 'none' | 'text' | 'ccda';

/**
 * Renders the attachments of a DocumentReference (content[].attachment) with
 * affordances to view the underlying document: a structured C-CDA viewer for
 * XML, decoded text for other text formats, plus download/open-link actions.
 */
export function DocumentAttachments({
  document,
}: {
  document: DocumentReference;
}) {
  const content = document.content ?? [];

  if (!content.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No attachment content available.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {content.map((entry, index) => (
        <AttachmentViewer
          key={`${document.id ?? 'document'}-${index}`}
          attachment={entry.attachment}
          index={index}
        />
      ))}
    </div>
  );
}

function AttachmentViewer({
  attachment,
  index,
}: {
  attachment?: Attachment;
  index: number;
}) {
  const [view, setView] = useState<ViewMode>('none');

  const decodedText = useMemo(() => {
    if (view !== 'text' || !attachment?.data) return undefined;
    return decodeBase64(attachment.data);
  }, [view, attachment?.data]);

  const ccda = useMemo<CcdaDocument | undefined>(() => {
    if (view !== 'ccda' || !attachment?.data || typeof window === 'undefined') {
      return undefined;
    }
    const decoded = decodeBase64(attachment.data);
    if (!decoded) {
      return {
        title: 'C-CDA Document',
        sections: [],
        error: 'Unable to decode attachment data.',
      };
    }
    return parseCcda(decoded);
  }, [view, attachment?.data]);

  // Only link out to absolute http(s) URLs. Relative attachment URLs (e.g.
  // `Binary/123`) can't be resolved here: the quickstart has no Binary proxy
  // and a raw browser request wouldn't carry the session's bearer token.
  const externalUrl = useMemo(() => {
    if (!attachment?.url) return undefined;
    try {
      const parsed = new URL(attachment.url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        ? parsed.toString()
        : undefined;
    } catch {
      return undefined;
    }
  }, [attachment?.url]);

  if (!attachment) {
    return (
      <p className="text-sm text-muted-foreground">
        Attachment details unavailable.
      </p>
    );
  }

  const contentType = (attachment.contentType || 'application/octet-stream')
    .trim()
    .toLowerCase();
  const isXml = contentType.includes('xml');
  const isText = isTextContentType(contentType);
  const dataUrl = attachment.data
    ? `data:${contentType};base64,${normalizeBase64(attachment.data)}`
    : undefined;

  const toggle = (mode: ViewMode) =>
    setView((prev) => (prev === mode ? 'none' : mode));

  return (
    <div className="space-y-3 rounded-md border p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">
            {attachment.title || `Attachment ${index + 1}`}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {contentType}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {attachment.data && isXml && (
          <Button
            size="sm"
            variant={view === 'ccda' ? 'secondary' : 'outline'}
            onClick={() => toggle('ccda')}
          >
            <FileText className="h-4 w-4" />
            {view === 'ccda' ? 'Hide document' : 'View document'}
          </Button>
        )}
        {attachment.data && isText && (
          <Button
            size="sm"
            variant={view === 'text' ? 'secondary' : 'outline'}
            onClick={() => toggle('text')}
          >
            {view === 'text' ? 'Hide text' : 'View text'}
          </Button>
        )}
        {dataUrl && (
          <Button asChild size="sm" variant="outline">
            <a
              href={dataUrl}
              download={attachment.title || `document-attachment-${index + 1}`}
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        )}
        {/* Only offer "Open link" when there's no inline data. With inline
            data the content is available locally (View/Download cover it), and
            the url can be a raw upstream Binary endpoint that 401s on a plain
            browser request. Without inline data the url is the only path, and
            per the docs Flexpa serves a signed binary.flexpa.com URL that needs
            no Authorization header. */}
        {!attachment.data && externalUrl && (
          <Button asChild size="sm" variant="outline">
            <a href={externalUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open link
            </a>
          </Button>
        )}
        {!attachment.data && !externalUrl && (
          <span className="text-xs text-muted-foreground">
            No viewable content.
          </span>
        )}
      </div>

      {view === 'text' && (
        <ScrollArea className="h-72 rounded-md border">
          <pre className="whitespace-pre-wrap p-3 font-mono text-xs">
            {decodedText ?? 'Unable to decode attachment data.'}
          </pre>
        </ScrollArea>
      )}

      {view === 'ccda' && <CcdaViewer document={ccda} />}
    </div>
  );
}

function CcdaViewer({ document }: { document?: CcdaDocument }) {
  if (!document) return null;

  if (document.error) {
    return <p className="text-xs text-destructive">{document.error}</p>;
  }

  if (!document.sections.length) {
    return (
      <p className="text-xs text-muted-foreground">
        No sections found in this document.
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
        {document.title} · {document.sections.length} sections
      </div>
      <ScrollArea className="h-96">
        <Accordion type="single" collapsible className="px-3">
          {document.sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="py-3 text-sm">
                <span className="text-left">
                  {section.title}
                  {section.display && (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {section.display}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {section.html ? (
                  <NarrativeHtml
                    html={section.html}
                    className="overflow-x-auto text-xs text-gray-700 [&_p]:my-2 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1"
                  />
                ) : section.text ? (
                  <div className="whitespace-pre-wrap text-xs text-muted-foreground">
                    {section.text}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No narrative text for this section.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
