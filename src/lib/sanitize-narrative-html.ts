// Allowlist sanitizer for FHIR/C-CDA narrative HTML, via DOMPurify. Browser-only.

import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'a',
  'b',
  'br',
  'caption',
  'div',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
];
const ALLOWED_ATTR = [
  'href',
  'title',
  'target',
  'rel',
  'colspan',
  'rowspan',
  'scope',
];

// Add rel=noopener to target=_blank links. Registered lazily, not at module
// load: DOMPurify isn't DOM-bound during SSR, where this module still evaluates.
let hookRegistered = false;

function ensureHook(): void {
  if (hookRegistered) return;
  hookRegistered = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

export function sanitizeNarrativeHtml(html: string): string {
  ensureHook();
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
