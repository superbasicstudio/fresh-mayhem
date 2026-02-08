import { useState } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function ImagePlaceholder({ label, filename, className = '' }) {
  const [hasImage, setHasImage] = useState(false);
  const [errored, setErrored] = useState(false);
  const src = `/screenshots/${filename}`;

  if (filename && !errored) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={src}
          alt={label}
          className="rounded-lg w-full"
          onLoad={() => setHasImage(true)}
          onError={() => setErrored(true)}
          style={{ display: hasImage ? 'block' : 'none' }}
        />
        {!hasImage && <Placeholder label={label} />}
      </div>
    );
  }

  return <Placeholder label={label} className={className} />;
}

function Placeholder({ label, className = '' }) {
  return (
    <div className={`border-2 border-dashed border-base-content/20 rounded-lg p-4 flex flex-col items-center justify-center gap-2 min-h-[80px] ${className}`}>
      <CameraIcon className="w-6 h-6 text-base-content/30" />
      <span className="text-xs text-base-content/40 text-center">{label}</span>
      <span className="text-xs text-base-content/20">Drop screenshot in public/screenshots/</span>
    </div>
  );
}
