import React, { useState } from 'react';
import { Droplets } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  accentHex?: string;
  className?: string;
  label?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  accentHex = '#2D5A3C',
  className = '',
  label,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#F3F2EE] text-[#18181B] p-6 select-none ${className}`}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 35%, ${accentHex}25 0%, transparent 70%)`,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border border-black/10"
          style={{ backgroundColor: `${accentHex}18`, color: accentHex }}
        >
          <Droplets className="w-5 h-5" />
        </div>
        <span className="font-display text-sm sm:text-base font-medium text-center text-zinc-800 max-w-[20ch]">
          {label || alt}
        </span>
        <span className="font-mono-tabular text-[11px] text-zinc-500 mt-1">
          Cold-Pressed · 38°F
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
