import React from 'react';

const SocialLink: React.FC<{ href: string; label: string; colorClass: string; icon: React.ReactNode }> = ({ href, label, colorClass, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 transition-all duration-300 hover:scale-105 ${colorClass}`}
  >
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900/80 border-t border-slate-800 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <div className="mb-6 flex items-center gap-3" dir="ltr">
          <span className="text-2xl font-black text-slate-500">FX</span>
          <span className="text-2xl font-black text-slate-600">Decod</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SocialLink 
            href="https://t.me/fx_decode" 
            label="Telegram" 
            colorClass="hover:text-blue-400 hover:border-blue-400/50"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
          />
          <SocialLink 
            href="https://www.youtube.com/@FX.Decodee" 
            label="YouTube" 
            colorClass="hover:text-red-500 hover:border-red-500/50"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <SocialLink 
            href="https://www.instagram.com/fx.decodee/" 
            label="Instagram" 
            colorClass="hover:text-pink-500 hover:border-pink-500/50"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <SocialLink 
            href="https://www.tiktok.com/@fx.decodee" 
            label="TikTok" 
            colorClass="hover:text-white hover:border-white/50"
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 5.5v10.5a2.5 2.5 0 1 1 -2.5 -2.5v-3h-3v5.5a5.5 5.5 0 1 0 5.5 -5.5z" /><path d="M12.5 5.5h3a5.5 5.5 0 0 0 5.5 -5.5v-2h-3v2a2.5 2.5 0 0 1 -2.5 2.5z" /></svg>}
          />
        </div>
        
        <p className="text-slate-600 text-xs text-center max-w-lg">
          تحذير المخاطر: التداول في الأسواق المالية ينطوي على مخاطر عالية. هذه التحليلات بواسطة الذكاء الاصطناعي هي لأغراض تعليمية وليست نصيحة مالية ملزمة.
        </p>
      </div>
    </footer>
  );
};

export default Footer;