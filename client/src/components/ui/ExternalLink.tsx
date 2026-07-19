import type { AnchorHTMLAttributes } from "react";

/**
 * The only sanctioned way to link off-site. A bare <a target="_blank">
 * lets the opened page access window.opener and repoint this tab
 * (reverse tabnabbing) — rel="noopener noreferrer" closes that off.
 * Use this instead of writing target="_blank" by hand anywhere.
 */
export function ExternalLink({
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
