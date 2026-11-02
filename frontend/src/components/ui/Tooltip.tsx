import type { HTMLAttributes, ReactNode, TransitionEvent } from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { oykClass } from "@/utils";

type OykTooltipPlacement = "top" | "right" | "bottom" | "left";

interface OykTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: ReactNode;
  placement?: OykTooltipPlacement;
  disabled?: boolean;
  hint?: boolean;
  offset?: number;
  children?: ReactNode;
  className?: string;
}

function placeTooltip(
  trigger: DOMRect,
  tooltip: DOMRect,
  placement: OykTooltipPlacement,
  offset: number,
) {
  let top = 0;
  let left = 0;

  if (placement === "right") {
    left = trigger.right + offset;
    top = trigger.top + (trigger.height - tooltip.height) / 2;
  } else if (placement === "left") {
    left = trigger.left - tooltip.width - offset;
    top = trigger.top + (trigger.height - tooltip.height) / 2;
  } else if (placement === "top") {
    left = trigger.left + (trigger.width - tooltip.width) / 2;
    top = trigger.top - tooltip.height - offset;
  } else {
    left = trigger.left + (trigger.width - tooltip.width) / 2;
    top = trigger.bottom + offset;
  }

  const pad = 8;
  left = Math.max(pad, Math.min(left, window.innerWidth - tooltip.width - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - tooltip.height - pad));

  return { top, left };
}

export default function OykTooltip({
  content,
  placement = "right",
  disabled = false,
  hint = false,
  offset = 8,
  children,
  className = "",
  ...props
}: OykTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  const wantOpen = open && !disabled && Boolean(content);

  const show = () => {
    if (!disabled && content) setOpen(true);
  };

  const hide = () => {
    setOpen(false);
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [wantOpen]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const update = () => {
      const trigger = triggerRef.current;
      const tip = contentRef.current;
      if (!trigger || !tip) return;
      const { top, left } = placeTooltip(
        trigger.getBoundingClientRect(),
        tip.getBoundingClientRect(),
        placement,
        offset,
      );
      tip.style.top = `${top}px`;
      tip.style.left = `${left}px`;
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [mounted, placement, offset, content]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
    if (!wantOpen) setMounted(false);
  };

  return (
    <div
      ref={triggerRef}
      className={oykClass("oyk-tooltip", className, hint && "oyk-hint")}
      {...props}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={shown ? tooltipId : undefined}
    >
      {children}
      {mounted &&
        createPortal(
          <div
            ref={contentRef}
            id={tooltipId}
            className={oykClass("oyk-tooltip-content", shown && "oyk-open")}
            data-placement={placement}
            role="tooltip"
            onTransitionEnd={handleTransitionEnd}
          >
            {content}
          </div>,
          document.body,
        )}
    </div>
  );
}
