import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowsPointingOutIcon, XMarkIcon, CameraIcon } from '@heroicons/react/20/solid';

export default function ExpandableImage({ src, alt, className = '' }) {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setExpanded(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [expanded, close]);

  if (errored || !src) return null;

  const modal = expanded
    ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <div className="relative z-10 max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              {alt && <p className="text-sm text-base-content/60 font-body">{alt}</p>}
              <button
                ref={closeRef}
                onClick={close}
                className="btn btn-ghost btn-sm btn-square ml-auto"
                aria-label="Close image"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <img src={src} alt={alt} className="rounded-xl max-h-[82vh] w-full object-contain" />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setExpanded(true)}
        className={`group relative cursor-pointer rounded-lg overflow-hidden block w-full text-left ${className}`}
        aria-label={`Expand screenshot: ${alt}`}
      >
        <span className="absolute bottom-1.5 right-1.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-base-content/40 text-[9px] font-mono backdrop-blur-sm">
          <CameraIcon className="w-2.5 h-2.5" />
          <ArrowsPointingOutIcon className="w-2.5 h-2.5" />
        </span>
        <img
          ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setLoaded(true); }}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full rounded-lg grayscale group-hover:grayscale-0 transition-all duration-300 ${loaded ? '' : 'h-0 overflow-hidden'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
        {!loaded && <div className="w-full h-24 bg-base-300 rounded-lg animate-pulse" />}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
          <ArrowsPointingOutIcon className="w-5 h-5 text-white/70 drop-shadow-lg" />
        </div>
      </button>
      {modal}
    </>
  );
}
