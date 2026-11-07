import type { CSSProperties, HTMLAttributes, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { oykClass } from "@/utils";

interface OykScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  flex?: boolean;
  children?: ReactNode;
  className?: string;
}

type DragAxis = "vertical" | "horizontal";

type DragState = {
  axis: DragAxis;
  startPos: number;
  startScroll: number;
};

function toCssSize(value?: string | number) {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

export default function OykScrollbar({
  height,
  flex = false,
  children,
  className = "",
  style,
  ...props
}: OykScrollbarProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const vBarRef = useRef<HTMLDivElement>(null);
  const hBarRef = useRef<HTMLDivElement>(null);
  const vThumbRef = useRef<HTMLDivElement>(null);
  const hThumbRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const [hasVertical, setHasVertical] = useState(false);
  const [hasHorizontal, setHasHorizontal] = useState(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const view = viewRef.current;
    if (!wrap || !view) return;

    const update = () => {
      const { clientHeight, clientWidth, scrollHeight, scrollWidth, scrollTop, scrollLeft } = wrap;
      const nextHasVertical = scrollHeight > clientHeight + 1;
      const nextHasHorizontal = scrollWidth > clientWidth + 1;

      setHasVertical(nextHasVertical);
      setHasHorizontal(nextHasHorizontal);

      const vThumb = vThumbRef.current;
      const vBar = vBarRef.current;
      if (vThumb && vBar) {
        if (nextHasVertical) {
          const trackHeight = vBar.clientHeight;
          const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);
          const maxTop = trackHeight - thumbHeight;
          const top = maxTop <= 0 ? 0 : (scrollTop / (scrollHeight - clientHeight)) * maxTop;
          vThumb.style.height = `${thumbHeight}px`;
          vThumb.style.transform = `translateY(${top}px)`;
        } else {
          vThumb.style.height = "0px";
          vThumb.style.transform = "translateY(0)";
        }
      }

      const hThumb = hThumbRef.current;
      const hBar = hBarRef.current;
      if (hThumb && hBar) {
        if (nextHasHorizontal) {
          const trackWidth = hBar.clientWidth;
          const thumbWidth = Math.max((clientWidth / scrollWidth) * trackWidth, 20);
          const maxLeft = trackWidth - thumbWidth;
          const left = maxLeft <= 0 ? 0 : (scrollLeft / (scrollWidth - clientWidth)) * maxLeft;
          hThumb.style.width = `${thumbWidth}px`;
          hThumb.style.transform = `translateX(${left}px)`;
        } else {
          hThumb.style.width = "0px";
          hThumb.style.transform = "translateX(0)";
        }
      }
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(wrap);
    resizeObserver.observe(view);
    if (vBarRef.current) resizeObserver.observe(vBarRef.current);
    if (hBarRef.current) resizeObserver.observe(hBarRef.current);
    wrap.addEventListener("scroll", update, { passive: true });

    return () => {
      resizeObserver.disconnect();
      wrap.removeEventListener("scroll", update);
    };
  }, []);

  useLayoutEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      const wrap = wrapRef.current;
      if (!drag || !wrap) return;

      if (drag.axis === "vertical") {
        const { clientHeight, scrollHeight } = wrap;
        const trackHeight = vBarRef.current?.clientHeight ?? clientHeight;
        const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 20);
        const maxTop = trackHeight - thumbHeight;
        if (maxTop <= 0) return;
        const delta = event.clientY - drag.startPos;
        const scrollRange = scrollHeight - clientHeight;
        wrap.scrollTop = drag.startScroll + (delta / maxTop) * scrollRange;
        return;
      }

      const { clientWidth, scrollWidth } = wrap;
      const trackWidth = hBarRef.current?.clientWidth ?? clientWidth;
      const thumbWidth = Math.max((clientWidth / scrollWidth) * trackWidth, 20);
      const maxLeft = trackWidth - thumbWidth;
      if (maxLeft <= 0) return;
      const delta = event.clientX - drag.startPos;
      const scrollRange = scrollWidth - clientWidth;
      wrap.scrollLeft = drag.startScroll + (delta / maxLeft) * scrollRange;
    };

    const onPointerUp = () => {
      dragRef.current = null;
      document.body.style.removeProperty("user-select");
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const startDrag = (axis: DragAxis, event: ReactPointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    event.preventDefault();
    event.stopPropagation();
    document.body.style.userSelect = "none";
    dragRef.current = {
      axis,
      startPos: axis === "vertical" ? event.clientY : event.clientX,
      startScroll: axis === "vertical" ? wrap.scrollTop : wrap.scrollLeft,
    };
  };

  const jumpVertical = (event: ReactPointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const thumb = vThumbRef.current;
    if (!wrap || !thumb || event.target === thumb) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const thumbHeight = thumb.offsetHeight;
    const maxTop = event.currentTarget.clientHeight - thumbHeight;
    if (maxTop <= 0) return;
    const clickY = event.clientY - rect.top - thumbHeight / 2;
    const ratio = Math.min(Math.max(clickY / maxTop, 0), 1);
    wrap.scrollTop = ratio * (wrap.scrollHeight - wrap.clientHeight);
  };

  const jumpHorizontal = (event: ReactPointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    const thumb = hThumbRef.current;
    if (!wrap || !thumb || event.target === thumb) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const thumbWidth = thumb.offsetWidth;
    const maxLeft = event.currentTarget.clientWidth - thumbWidth;
    if (maxLeft <= 0) return;
    const clickX = event.clientX - rect.left - thumbWidth / 2;
    const ratio = Math.min(Math.max(clickX / maxLeft, 0), 1);
    wrap.scrollLeft = ratio * (wrap.scrollWidth - wrap.clientWidth);
  };

  const rootStyle: CSSProperties = {
    ...style,
    height: toCssSize(height) ?? "100%",
  };

  return (
    <div
      className={oykClass(
        "oyk-scrollbar",
        flex && "oyk-scrollbar--flex",
        hasVertical && "oyk-scrollbar--vertical",
        hasHorizontal && "oyk-scrollbar--horizontal",
        className,
      )}
      style={rootStyle}
      {...props}
    >
      <div ref={wrapRef} className="oyk-scrollbar-wrap">
        <div ref={viewRef} className="oyk-scrollbar-view">
          {children}
        </div>
      </div>
      <div
        ref={vBarRef}
        className={oykClass("oyk-scrollbar-bar", "oyk-scrollbar-bar--vertical", hasVertical && "oyk-show")}
        onPointerDown={jumpVertical}
      >
        <div
          ref={vThumbRef}
          className="oyk-scrollbar-thumb"
          onPointerDown={(event) => startDrag("vertical", event)}
        />
      </div>
      <div
        ref={hBarRef}
        className={oykClass("oyk-scrollbar-bar", "oyk-scrollbar-bar--horizontal", hasHorizontal && "oyk-show")}
        onPointerDown={jumpHorizontal}
      >
        <div
          ref={hThumbRef}
          className="oyk-scrollbar-thumb"
          onPointerDown={(event) => startDrag("horizontal", event)}
        />
      </div>
    </div>
  );
}
