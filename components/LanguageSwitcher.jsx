import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../src/i18n';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';

export default function LanguageSwitcher({ collapsed = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (collapsed) {
    return (
      <div className="relative group" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full bg-base-200 border border-base-content/10 text-base-content/60 text-[10px] font-mono rounded-lg px-1 py-2.5 cursor-pointer hover:border-primary/30 transition-colors text-center"
          aria-label="Language"
        >
          {current.code.toUpperCase()}
        </button>
        {open && (
          <div className="absolute left-full top-0 ml-2 z-[70] bg-base-200 border border-base-content/10 rounded-lg shadow-xl py-1 min-w-[160px] max-h-[300px] overflow-y-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                  l.code === i18n.language
                    ? 'bg-primary/15 text-primary'
                    : 'text-base-content/60 hover:bg-base-300 hover:text-base-content'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        {!open && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-base-300 text-xs font-medium text-base-content whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-[60] shadow-lg">
            Language
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-base-200 border border-base-content/10 text-base-content/60 text-xs font-mono rounded-lg px-2.5 py-2 cursor-pointer hover:border-primary/30 hover:text-base-content/80 transition-colors"
        aria-label="Language"
      >
        <span>{current.label}</span>
        <ChevronUpDownIcon className="w-3.5 h-3.5 opacity-40" />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 z-[70] bg-base-200 border border-base-content/10 rounded-lg shadow-xl py-1 max-h-[300px] overflow-y-auto">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                l.code === i18n.language
                  ? 'bg-primary/15 text-primary'
                  : 'text-base-content/60 hover:bg-base-300 hover:text-base-content'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
