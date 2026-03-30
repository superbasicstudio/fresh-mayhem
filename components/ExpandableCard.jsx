import { useState, useId, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/outline';


export default function ExpandableCard({ title, children, className = '', modalMaxWidth = 'max-w-5xl', titleColor = 'text-primary' }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const headerId = useId();
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setExpanded(false);
    // Return focus to the expand button
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // Lock body scroll + handle Escape
  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);

    // Focus the close button on open
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded, close]);

  const modal = expanded
    ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headerId}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div className={`relative z-10 bg-base-200 rounded-xl w-full ${modalMaxWidth} max-h-[90vh] flex flex-col border border-base-content/10`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-base-content/10 shrink-0">
              <h3 className={`font-semibold text-base ${titleColor}`} id={headerId}>{title}</h3>
              <button
                ref={closeRef}
                onClick={close}
                className="btn btn-ghost btn-sm btn-square"
                aria-label={`Close ${title}`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content  -  scrollable */}
            <div
              id={contentId}
              className="p-5 overflow-y-auto flex-1"
            >
              {typeof children === 'function' ? children({ expanded: true }) : children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className={`card bg-[#0c0e14] shadow-md shadow-black/20 ${className}`}>
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-base ${titleColor}`}>{title}</h3>
          </div>
          <button
            ref={triggerRef}
            onClick={() => setExpanded(true)}
            className="btn btn-ghost btn-sm btn-square"
            aria-label={`Expand ${title} to full view`}
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 pb-4">
          {typeof children === 'function' ? children({ expanded: false }) : children}
        </div>
      </div>
      {modal}
    </>
  );
}
