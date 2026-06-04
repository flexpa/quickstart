// Minimal allowlist-based sanitizer for FHIR/C-CDA narrative HTML. Browser-only
// (relies on DOMParser). Strips scripts, event handlers, and unsafe URLs so the
// narrative can be rendered with dangerouslySetInnerHTML.

const STRIP_CONTENT_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'link',
  'meta',
]);
const ALLOWED_TAGS = new Set([
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
]);
const GLOBAL_ALLOWED_ATTRIBUTES = new Set(['colspan', 'rowspan']);
const TAG_ALLOWED_ATTRIBUTES: Partial<Record<string, Set<string>>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  th: new Set(['scope']),
};
const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function isSafeUrl(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('//')) {
    return false;
  }

  if (trimmedValue.startsWith('#') || trimmedValue.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(trimmedValue, 'https://example.com');
    return SAFE_URL_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeElement(element: Element) {
  const tagName = element.tagName.toLowerCase();

  if (STRIP_CONTENT_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  if (!ALLOWED_TAGS.has(tagName)) {
    element.replaceWith(...Array.from(element.childNodes));
    return;
  }

  for (const attribute of Array.from(element.attributes)) {
    const attributeName = attribute.name.toLowerCase();
    const allowedAttributes = TAG_ALLOWED_ATTRIBUTES[tagName];
    const isAllowedAttribute =
      GLOBAL_ALLOWED_ATTRIBUTES.has(attributeName) ||
      Boolean(allowedAttributes?.has(attributeName));

    if (!isAllowedAttribute || attributeName.startsWith('on')) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (
      (attributeName === 'href' || attributeName === 'src') &&
      !isSafeUrl(attribute.value)
    ) {
      element.removeAttribute(attribute.name);
    }
  }

  if (tagName === 'a') {
    const target = element.getAttribute('target');
    if (target === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    } else {
      element.removeAttribute('target');
      element.removeAttribute('rel');
    }
  }

  for (const child of Array.from(element.children)) {
    sanitizeElement(child);
  }
}

export function sanitizeNarrativeHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    'text/html',
  );
  const body = parsed.body;

  for (const child of Array.from(body.children)) {
    sanitizeElement(child);
  }

  return body.innerHTML;
}
