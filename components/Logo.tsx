import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    // Added dir="ltr" to force proper English reading order (FX then Decod) regardless of page direction
    <div className={`flex items-baseline gap-0.5 select-none ${className}`} dir="ltr">
      <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">FX</span>
      <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
        Decod
      </span>
    </div>
  );
};