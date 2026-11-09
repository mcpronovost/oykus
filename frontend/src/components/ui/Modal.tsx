import type { HTMLAttributes, ReactNode, TransitionEvent } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { oykClass } from "@/utils";

type OykModalHelpers = {
  close: () => void;
};

type OykModalContent = ReactNode | ((helpers: OykModalHelpers) => ReactNode);

type OykModalSize = "sm" | "md" | "lg";

interface OykModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  content: OykModalContent;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closable?: boolean;
  closeOnBackdrop?: boolean;
  disabled?: boolean;
  size?: OykModalSize;
  className?: string;
}

export default function OykModal({
  content,
  title,
  open: openProp,
  onOpenChange,
  closable = true,
  closeOnBackdrop = true,
  disabled = false,
  size = "md",
  className = "",
  ...props
}: OykModalProps) {
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

  const renderedContent = typeof content === "function" ? content({ close }) : content;

  if (!mounted) return null;

  return createPortal(
    <div
      className={oykClass("oyk-modal", shown && "oyk-open", className)}
      {...props}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="oyk-modal-backdrop" onClick={handleBackdropClick} />
      <div
        ref={panelRef}
        className={oykClass("oyk-modal-panel", `oyk-modal-size-${size}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || closable) && (
          <header className="oyk-modal-header">
            {title && (
              <h2 id={titleId} className="oyk-modal-title">
                {title}
              </h2>
            )}
            {closable && (
              <button
                type="button"
                className="oyk-modal-close"
                onClick={close}
                aria-label="Close"
              >
                <IconX size={16} />
              </button>
            )}
          </header>
        )}
        <div className="oyk-modal-body">{renderedContent}</div>
      </div>
    </div>,
    document.body,
  );
}
