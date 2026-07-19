import { sanitizeHtml } from "@/lib/sanitize";

/**
 * The single sanctioned use of dangerouslySetInnerHTML in this codebase.
 * Every other component should render plain strings as React children
 * (React escapes those automatically) — reach for this component only
 * when the source genuinely contains markup, e.g. a rich-text course
 * description saved from an instructor's editor.
 */
export function SafeHtml({ html, className }: { html: string; className?: string }) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />
  );
}
