import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    // dir="ltr" ensures FX comes before Decod regardless of Arabic page setting
    <div className={`flex items-baseline select-none ${className}`} dir="ltr">
      <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">FX</span>
      <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">Decod</span>
    </div>
  );
};