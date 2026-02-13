import { useRouter } from "@/services/router";
import { buildRoutePath } from "@/services/router/utils";

export default function OykLink({
  children,
  routeName,
  params = {},
  disabled = false,
  block = false,
  className = {},
  ...props
}) {
  const { n, lang } = useRouter();

  const buildPath = buildRoutePath(routeName, params, lang) || "";
  const href = !disabled ? `/${lang}/${!buildPath && routeName !== "home" ? routeName : buildPath}` : "/";

  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled) {
      n(routeName, params, lang);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={`oyk-link ${disabled ? "oyk-disabled" : ""} ${block ? "oyk-block" : ""} ${className}`} {...props}>
      {children}
    </a>
  );
}
