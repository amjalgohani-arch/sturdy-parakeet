import React from 'react';
import { Share2 } from 'lucide-react';

interface TopNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenShareModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  onOpenShareModal,
}) => {
  const navItems = [
    { id: 'simulations', label: 'المختبر التفاعلي' },
    { id: 'curriculum', label: 'المسارات العلمية' },
    { id: 'publishing', label: 'مجلة التأملات' },
    { id: 'assessment', label: 'التقييم الذاتي' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 no-print">
      <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (single text element, one line) */}
        <a
          href="#simulations"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('simulations');
          }}
          className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display focus-visible:outline-2 focus-visible:outline-emerald-600"
        >
          آفاق وتأملات
        </a>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                  isActive
                    ? 'border-emerald-600 text-slate-900 font-bold'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة ونشر المنصة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
