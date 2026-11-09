import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { oykClass } from "@/utils";
import { useRouter } from "@/services/router";
import { buildLocalizedPath, buildRoutePath } from "@/services/router/utils";

interface OykLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  routeName?: string;
  disabled?: boolean;
  className?: string;
}

export default function OykLink({ children, href, routeName, disabled, className, onClick, ...props }: OykLinkProps) {
  const { lang, n } = useRouter();

  const resolvedHref = (() => {
    if (routeName) {
      const routePath = buildRoutePath(routeName, {}, lang);
      return routePath !== null ? buildLocalizedPath(routePath, lang) : undefined;
    }
    return href;
  })();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !routeName) return;
    event.preventDefault();
    n(routeName);
  };

  return (
    <a href={resolvedHref} className={oykClass("oyk-link", className, (disabled || !resolvedHref) && "oyk-disabled")} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
