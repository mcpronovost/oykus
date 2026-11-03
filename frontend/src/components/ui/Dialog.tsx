import type { CSSProperties, HTMLAttributes, ReactNode, TransitionEvent } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { oykClass } from "@/utils";

type OykDialogPlacement = "top" | "right" | "bottom" | "left";

type OykDialogHelpers = {
  close: () => void;
};

type OykDialogContent = ReactNode | ((helpers: OykDialogHelpers) => ReactNode);

interface OykDialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: OykDialogContent;
  placement?: OykDialogPlacement;
  disabled?: boolean;
  offset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

function placeDialog(
  trigger: DOMRect,
  width: number,
  height: number,
  placement: OykDialogPlacement,
  offset: number,
) {
  let top = 0;
  let left = 0;

  if (placement === "right") {
    left = trigger.right + offset;
    top = trigger.bottom - height;
  } else if (placement === "left") {
    left = trigger.left - width - offset;
    top = trigger.bottom - height;
  } else if (placement === "top") {
    left = trigger.left + (trigger.width - width) / 2;
    top = trigger.top - height - offset;
  } else {
    left = trigger.left + (trigger.width - width) / 2;
    top = trigger.bottom + offset;
  }

  const pad = 8;
  left = Math.max(pad, Math.min(left, window.innerWidth - width - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - height - pad));

  return { top, left };
}

export default function OykDialog({
  content,
  placement = "right",
  disabled = false,
  offset = 8,
  open: openProp,
  onOpenChange,
  children,
  className = "",
  ...props
}: OykDialogProps) {
  const dialogId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const wantOpen = open && !disabled && Boolean(content);

  const close = () => setOpen(false);

  const toggle = () => {
    if (disabled || !content) return;
    setOpen(!open);
  };

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

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [wantOpen]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const update = () => {
      const trigger = triggerRef.current;
      const panel = contentRef.current;
      if (!trigger || !panel) return;

      const triggerRect = trigger.getBoundingClientRect();
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      if (!width || !height) return;

      setCoords(placeDialog(triggerRect, width, height, placement, offset));
    };

    update();

    const observer = new ResizeObserver(update);
    if (contentRef.current) observer.observe(contentRef.current);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [mounted, shown, placement, offset, content]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
    if (!wantOpen) {
      setMounted(false);
      setCoords(null);
    }
  };

  const renderedContent = typeof content === "function" ? content({ close }) : content;

  const contentStyle: CSSProperties | undefined = coords
    ? { top: coords.top, left: coords.left }
    : undefined;

  return (
    <div
      ref={triggerRef}
      className={oykClass("oyk-dialog", className)}
      {...props}
      onClick={toggle}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={contentRef}
            id={dialogId}
            className={oykClass("oyk-dialog-content", shown && coords && "oyk-open")}
            data-placement={placement}
            role="dialog"
            aria-modal="false"
            style={contentStyle}
            onClick={(event) => event.stopPropagation()}
            onTransitionEnd={handleTransitionEnd}
          >
            {renderedContent}
          </div>,
          document.body,
        )}
    </div>
  );
}
