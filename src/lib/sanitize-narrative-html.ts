// Allowlist-based sanitizer for FHIR/C-CDA narrative HTML, delegated to
// DOMPurify so the narrative can be rendered with dangerouslySetInnerHTML.
// Browser-only (DOMPurify relies on the DOM).

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

// target=_blank links need rel=noopener noreferrer; DOMPurify won't add it for us.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitizeNarrativeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
