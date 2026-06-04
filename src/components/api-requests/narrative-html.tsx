// biome-ignore-all lint/security/noDangerouslySetInnerHtml: input is C-CDA narrative already sanitized via sanitizeNarrativeHtml (allowlist tags/attrs, strips scripts and unsafe URLs)

/** Renders pre-sanitized narrative HTML (e.g. a C-CDA section). */
export function NarrativeHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
