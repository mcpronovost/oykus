import { createRef, useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { useRouter } from "@/services/router";

import { OykLink } from "@/components/ui";

export default function OykSidenav({ menu = [], accordion = false }) {
  const { params } = useRouter();

  const [openId, setOpenId] = useState(null);

  const refs = useRef({});

  if (!menu || menu.length <= 0) return null;

  const handleToggle = (id) => {
    if (!accordion) return;
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const newRefs = {};

    menu.forEach((m) => {
      const id = m.id ?? m.title;
      newRefs[id] = refs.current[id] || createRef();
    });

    refs.current = newRefs;
  }, [menu]);

  useEffect(() => {
    const exists = menu.some((m) => (m.id ?? m.title) === openId);
    if (!exists) {
      setOpenId(null);
    }
  }, [menu, openId]);

  useEffect(() => {
    if (!openId) return;

    const ref = refs.current[openId];
    if (!ref?.current) return;

    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    });
  }, [menu, openId]);

  useEffect(() => {
    if (openId) return;

    for (const m of menu) {
      const id = m.id ?? m.title;

      const hasActiveLink = m.links.some((l) => l.routeName.endsWith(params?.section));

      if (hasActiveLink) {
        setOpenId(id);
        break;
      }
    }
  }, [menu, params?.section]);

  return (
    <nav className="oyk-sidenav">
      <ul>
        {menu.map((m, index) => {
          const id = m.id ?? m.title;
          const isOpen = openId === id;
          const ref = refs.current[id];

          return (
            <li key={index} className={`oyk-sidenav-item ${index <= 0 ? "oyk-first" : ""}`}>
              <header
                className={`oyk-sidenav-header ${accordion ? "oyk-accordion" : ""}`}
                onClick={() => handleToggle(id)}
              >
                {m.Icon && (
                  <span className="oyk-sidenav-header-icon">
                    <m.Icon size={24} color={"var(--oyk-c-primary)"} />
                  </span>
                )}
                <span className="oyk-sidenav-header-title">
                  <span className="oyk-sidenav-header-title-name">{m.title}</span>
                  <small className={`oyk-sidenav-header-title-desc ${isOpen ? "" : "oyk-clamped"}`}>
                    {m.description}
                  </small>
                </span>
                {accordion && (
                  <span className="oyk-sidenav-header-toggle">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </span>
                )}
              </header>
              <ul
                ref={ref}
                className={`oyk-sidenav-menu ${!accordion || isOpen ? "oyk-open" : ""}`}
                style={
                  accordion
                    ? {
                        height: isOpen ? ref?.current?.scrollHeight : 0,
                      }
                    : {}
                }
              >
                {m.links.map((l, li) => (
                  <li key={li} className="oyk-sidenav-menu-item">
                    <OykLink
                      routeName={l.routeName}
                      params={l.params}
                      className={`oyk-sidenav-menu-item-link ${l.routeName.endsWith(params?.section) ? "oyk-active" : ""}`}
                      disabled={l.disabled}
                    >
                      {l.name}
                    </OykLink>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
