import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useRouter } from "@/services/router";
import { buildLocalizedPath, buildRoutePath } from "@/services/router/utils";

interface OykLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  routeName?: string;
  className?: string;
}

export default function OykLink({ children, href, routeName, className, onClick, ...props }: OykLinkProps) {
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
    <a href={resolvedHref} className={className} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
