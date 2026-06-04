// Helpers for decoding base64 FHIR attachment payloads and parsing C-CDA XML
// documents (the format Flexpa returns for clinical documents during IAL2 /
// TEFCA authorizations) into navigable narrative sections. Browser-only.

import { sanitizeNarrativeHtml } from './sanitize-narrative-html';

export interface CcdaSection {
  id: string;
  title: string;
  code?: string;
  display?: string;
  html?: string;
  text?: string;
}

export interface CcdaDocument {
  title: string;
  sections: CcdaSection[];
  error?: string;
}

/**
 * Normalize base64 payloads coming off the wire so they decode cleanly via
 * `atob` and embed correctly in `data:` URLs.
 *
 * Steps:
 *   1. Convert URL-safe base64 (`-`/`_`) to standard base64 (`+`/`/`).
 *   2. Strip characters that are not valid base64 (whitespace, dots, and
 *      other garbage some payers inject into encoded payloads).
 *   3. Remove existing padding before recalculating it, so malformed
 *      padding doesn't cascade into decode failures.
 */
export function normalizeBase64(data: string): string {
  let normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  normalized = normalized.replace(/[^A-Za-z0-9+/=]/g, '');
  const unpadded = normalized.replace(/=+$/, '');
  const padding = unpadded.length % 4;
  return padding ? `${unpadded}${'='.repeat(4 - padding)}` : unpadded;
}

export function decodeBase64(data: string): string | undefined {
  try {
    const binary = atob(normalizeBase64(data));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return undefined;
  }
}

export function parseCcda(xml: string): CcdaDocument {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const parseError = doc.getElementsByTagName('parsererror')[0];
    if (parseError) {
      return {
        title: 'C-CDA Document',
        sections: [],
        error: 'Unable to parse XML.',
      };
    }

    const clinicalDocument = doc.getElementsByTagName('ClinicalDocument')[0];
    const title =
      clinicalDocument?.getElementsByTagName('title')[0]?.textContent?.trim() ||
      'C-CDA Document';
    const serializer = new XMLSerializer();

    const sections = Array.from(doc.getElementsByTagName('section')).map(
      (section, index) => {
        const titleNode = section.getElementsByTagName('title')[0];
        const codeNode = section.getElementsByTagName('code')[0];
        const textNode = section.getElementsByTagName('text')[0];
        const rawHtml = textNode
          ? serializer.serializeToString(textNode)
          : undefined;
        const html = rawHtml
          ? sanitizeNarrativeHtml(
              rawHtml
                .replace(/^<text[^>]*>/i, '')
                .replace(/<\/text>$/i, '')
                .replace(/<paragraph/gi, '<p')
                .replace(/<\/paragraph>/gi, '</p>')
                .replace(/<content/gi, '<span')
                .replace(/<\/content>/gi, '</span>'),
            )
          : undefined;
        const code = codeNode?.getAttribute('code') || undefined;
        const display = codeNode?.getAttribute('displayName') || undefined;
        const text = section.textContent?.replace(/\s+/g, ' ').trim();

        return {
          id: `section-${index}`,
          title: titleNode?.textContent?.trim() || `Section ${index + 1}`,
          ...(code ? { code } : {}),
          ...(display ? { display } : {}),
          ...(html ? { html } : {}),
          ...(text ? { text } : {}),
        };
      },
    );

    const orderedSections = sections
      .map((section, position) => ({ ...section, position }))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(({ position: _position, ...section }) => section);

    return { title, sections: orderedSections };
  } catch {
    return {
      title: 'C-CDA Document',
      sections: [],
      error: 'Unable to parse XML.',
    };
  }
}

export function isTextContentType(contentType?: string | null): boolean {
  return Boolean(
    contentType &&
      (contentType.startsWith('text/') ||
        contentType.includes('json') ||
        contentType.includes('xml') ||
        contentType.includes('html')),
  );
}
