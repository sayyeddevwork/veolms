import DOMPurify from "dompurify";

/**
 * Sanitizes untrusted HTML (course descriptions, review comments, anything
 * that could contain user- or instructor-authored markup) before it's ever
 * rendered. Strips <script>, event handlers (onerror=, onclick=, ...),
 * javascript: URLs, and any tag/attribute outside the allowlist below.
 *
 * Plain-text fields (titles, names, review text as text) should just be
 * rendered as React children — React escapes those by default. This is
 * ONLY for the rare case where HTML markup itself is expected.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}
