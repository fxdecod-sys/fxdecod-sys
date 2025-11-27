import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider">AI CONNECTED</span>
        </div>

        {/* Logo - LTR Forced */}
        <div className="flex items-center" dir="ltr">
          <h1 className="text-3xl font-black tracking-tighter cursor-pointer select-none">
            <span className="text-white">FX</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Decod</span>
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;