import { useEffect, useRef, useState } from "react";

export default function OykScrollbar({ children, height = 300, className = "" }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const thumbRef = useRef(null);

  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartY = useRef(0);
  const scrollStartTop = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    let rafId = null;

    const updateThumb = () => {
      const containerHeight = container.clientHeight;
      const contentHeight = content.scrollHeight;

      console.log(">>contentHeight ", contentHeight);

      if (!containerHeight || !contentHeight) return;

      if (contentHeight <= containerHeight) {
        setThumbHeight(0);
        setThumbTop(0);
        return;
      }

      const ratio = containerHeight / contentHeight;
      setThumbHeight(Math.min(Math.max(containerHeight * ratio, 20), containerHeight));
      onScroll();
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateThumb);
    };

    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(container);
    ro.observe(content);

    // 🔴 critical part: delayed re-measure
    scheduleUpdate();
    setTimeout(scheduleUpdate, 500);
    setTimeout(scheduleUpdate, 1000);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const onScroll = () => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const maxScroll = content.scrollHeight - container.clientHeight;

    if (maxScroll <= 0) {
      setThumbTop(0);
      return;
    }

    const scrollRatio = content.scrollTop / maxScroll;

    setThumbTop(scrollRatio * (container.clientHeight - thumbHeight));
  };

  const onMouseDown = (e) => {
    setDragging(true);
    dragStartY.current = e.clientY;
    scrollStartTop.current = contentRef.current.scrollTop;
    document.body.classList.add("oyk-no-select");
  };

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e) => {
      const container = containerRef.current;
      const content = contentRef.current;

      const delta = e.clientY - dragStartY.current;

      const scrollableHeight = content.scrollHeight - container.clientHeight;

      const thumbScrollable = container.clientHeight - thumbHeight;

      content.scrollTop = scrollStartTop.current + (delta / thumbScrollable) * scrollableHeight;
    };

    const onMouseUp = () => {
      setDragging(false);
      document.body.classList.remove("oyk-no-select");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, thumbHeight]);

  return (
    <div className="oyk-scrollbar" ref={containerRef} style={{ height }}>
      <div className={`oyk-scrollbar-content ${className}`} ref={contentRef} onScroll={onScroll}>
        {children}
      </div>

      <div className="oyk-scrollbar-track">
        <div
          className="oyk-scrollbar-thumb"
          ref={thumbRef}
          style={{
            height: thumbHeight,
            transform: `translateY(${thumbTop}px)`,
          }}
          onMouseDown={onMouseDown}
        />
      </div>
    </div>
  );
}
