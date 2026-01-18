import { useEffect, useRef } from "react";

export default function Modal({ children, isOpen, onClose, title, size = "medium", actions }) {
  const modalRef = useRef(null);

  const handleOverlayClick = (event) => {
    if (event.target === modalRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="oyk-modal-overlay" onClick={handleOverlayClick}>
      <div className={`oyk-modal oyk-modal--${size}`}>
        {title && (
          <header className="oyk-modal-header">
            <h3 className="oyk-modal-header-title">{title}</h3>
            {actions && <div className="oyk-modal-header-actions">{actions}</div>}
          </header>
        )}
        <div className="oyk-modal-content">{children}</div>
      </div>
    </div>
  );
}