import type { HTMLAttributes, ReactNode, TransitionEvent } from "react";
import type { Icon } from "@tabler/icons-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { oykClass } from "@/utils";
import OykScrollbar from "./Scrollbar";

type OykDrawerHelpers = {
  close: () => void;
};

type OykDrawerSlot = ReactNode | ((helpers: OykDrawerHelpers) => ReactNode);

type OykDrawerPlacement = "top" | "right" | "bottom" | "left";

type OykDrawerSize = "sm" | "md" | "lg";

interface OykDrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  content: OykDrawerSlot;
  title?: string;
  suptitle?: string;
  headerIcon?: Icon;
  headerColor?: string;
  actions?: OykDrawerSlot;
  prependActions?: OykDrawerSlot;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closable?: boolean;
  closeOnBackdrop?: boolean;
  disabled?: boolean;
  placement?: OykDrawerPlacement;
  size?: OykDrawerSize;
  color?: string;
  className?: string;
}

function renderSlot(slot: OykDrawerSlot | undefined, helpers: OykDrawerHelpers) {
  if (slot == null) return null;
  return typeof slot === "function" ? slot(helpers) : slot;
}

export default function OykDrawer({
  content,
  title,
  suptitle,
  headerIcon: HeaderIcon,
  headerColor = "accent",
  actions,
  prependActions,
  open: openProp,
  onOpenChange,
  closable = true,
  closeOnBackdrop = true,
  disabled = false,
  placement = "right",
  size = "md",
  color = "default",
  className = "",
  ...props
}: OykDrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const wantOpen = open && !disabled && Boolean(content);

  const close = () => setOpen(false);
  const helpers = { close };

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (wantOpen) setMounted(true);
  }, [wantOpen]);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (!wantOpen) {
      setShown(false);
      return;
    }
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShown(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [mounted, wantOpen]);

  useEffect(() => {
    if (!wantOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closable) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [wantOpen, closable]);

  useEffect(() => {
    if (!shown) return;
    panelRef.current?.focus();
  }, [shown]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
    if (!wantOpen) setMounted(false);
  };

  const handleBackdropClick = () => {
    if (!closeOnBackdrop || !closable) return;
    setOpen(false);
  };

  const renderedContent = renderSlot(content, helpers);
  const renderedActions = renderSlot(actions, helpers);
  const renderedPrependActions = renderSlot(prependActions, helpers);

  if (!mounted) return null;

  return createPortal(
    <div
      className={oykClass(
        "oyk-drawer",
        `oyk-drawer-from-${placement}`,
        shown && "oyk-open",
        className,
      )}
      {...props}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="oyk-drawer-backdrop" onClick={handleBackdropClick} />
      <div
        ref={panelRef}
        className={oykClass(
          "oyk-drawer-panel",
          `oyk-drawer-size-${size}`,
          color !== "default" && `oyk-drawer-color-${color}`,
          !title && "oyk-drawer-untitled",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || closable) && (
          <header className={oykClass("oyk-drawer-header", headerColor !== "default" && `oyk-drawer-header-color-${headerColor}`)}>
            {HeaderIcon && (
              <div className="oyk-drawer-header-icon">
                <HeaderIcon size={24} stroke={1.5} />
              </div>
            )}
            <div>
              {suptitle && (
                <p className="oyk-drawer-suptitle">{suptitle}</p>
              )}
              {title && (
                <h2 id={titleId} className="oyk-drawer-title">
                  {title}
                </h2>
              )}
            </div>
            {closable && (
              <button
                type="button"
                className="oyk-drawer-close"
                onClick={close}
                aria-label="Close"
              >
                <IconX size={16} />
              </button>
            )}
          </header>
        )}
        <OykScrollbar
          flex
          className={oykClass(
            "oyk-drawer-body",
            renderedActions != null && "oyk-drawer-body-with-actions",
          )}
        >
          {renderedContent}
        </OykScrollbar>
        {(renderedActions != null || renderedPrependActions != null) && (
          <footer className="oyk-drawer-actions">
            {renderedPrependActions != null && (
              <div className="oyk-drawer-actions-prepend">
                {renderedPrependActions}
              </div>
            )}
            {renderedActions}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
