import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Send,
  Mail,
  MessageCircle,
  Share2,
  QrCode,
  ExternalLink,
  Globe,
  Sparkles,
} from 'lucide-react';
import { generateQRMatrix, downloadQRCodeAsPng } from '../utils/qrGenerator';

interface SharePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRODUCTION_PUBLIC_URL =
  'https://ais-pre-tqvqjdbrdy5mh4zbgzwwmk-715018921945.europe-west1.run.app';

export const SharePlatformModal: React.FC<SharePlatformModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrTheme, setQrTheme] = useState<'emerald' | 'indigo'>('emerald');
  const [classroomProjection, setClassroomProjection] = useState(false);
  const [useCustomUrl, setUseCustomUrl] = useState(false);

  // Compute public scannable URL
  const defaultResolvedUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location?.href) {
      const current = window.location.href.split('#')[0].split('?')[0];
      // If inside Google AI Studio dev preview, convert to public production pre-url
      if (current.includes('ais-dev-')) {
        return current.replace('ais-dev-', 'ais-pre-');
      }
      // If running on localhost, use the production public URL so mobile cameras can access it
      if (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      ) {
        return PRODUCTION_PUBLIC_URL;
      }
      return current;
    }
    return PRODUCTION_PUBLIC_URL;
  }, []);

  const [activeUrl, setActiveUrl] = useState<string>(defaultResolvedUrl);
  const [customNote, setCustomNote] = useState(
    'ادخل إلى منصة «آفاق وتأملات: الأحياء وعلوم الأرض والفضاء» لتجربة المحاكيات العلمية التفاعلية وتوثيق بطاقة تأملك العلمي المعتمدة:'
  );

  // Dynamic QR Code Matrix generated purely in-browser
  const qrMatrix = useMemo(() => generateQRMatrix(activeUrl), [activeUrl]);

  if (!isOpen) return null;

  const primaryHex = qrTheme === 'emerald' ? '#059669' : '#0284c7';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeUrl);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = activeUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'منصة آفاق وتأملات: الأحياء وعلوم الأرض والفضاء',
          text: customNote,
          url: activeUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedText = encodeURIComponent(`${customNote}\n${activeUrl}`);
  const encodedUrl = encodeURIComponent(activeUrl);
  const encodedTextOnly = encodeURIComponent(customNote);

  const shareLinks = [
    {
      name: 'واتساب',
      href: `https://wa.me/?text=${encodedText}`,
      icon: MessageCircle,
      style: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
    {
      name: 'تيليجرام',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTextOnly}`,
      icon: Send,
      style: 'bg-sky-600 text-white hover:bg-sky-700',
    },
    {
      name: 'منصة X',
      href: `https://twitter.com/intent/tweet?text=${encodedTextOnly}&url=${encodedUrl}`,
      icon: Share2,
      style: 'bg-slate-900 text-white hover:bg-slate-800',
    },
    {
      name: 'البريد الرسمي',
      href: `mailto:?subject=${encodeURIComponent(
        'دعوة علمية: منصة آفاق وتأملات (الأحياء وعلوم الأرض والفضاء)'
      )}&body=${encodedText}`,
      icon: Mail,
      style: 'bg-indigo-600 text-white hover:bg-indigo-700',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className={`bg-white border border-slate-200 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden ${
          classroomProjection ? 'max-w-3xl w-full' : 'max-w-2xl w-full'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h2
                id="share-modal-title"
                className="text-lg font-bold text-slate-900 font-display"
              >
                مركز النشر والمشاركة الفورية للمنصة
              </h2>
              <p className="text-xs text-slate-500">
                مشاركة الرابط العام ورمز الاستجابة السريعة (QR) مع الطلاب والمعلمين
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setClassroomProjection(!classroomProjection)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              title="تكبير رمز QR للعرض على السبورة الذكية في الفصل"
            >
              {classroomProjection ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الوضع القياسي</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تكبير لشاشة الفصل</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق النافذة"
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div
            className={`grid gap-6 ${
              classroomProjection
                ? 'grid-cols-1 place-items-center'
                : 'grid-cols-1 md:grid-cols-12 items-start'
            }`}
          >
            {/* QR Code Interactive Stage */}
            <div
              className={`${
                classroomProjection ? 'w-full max-w-md' : 'md:col-span-5'
              } flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl p-5`}
            >
              {/* Color switcher for QR */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg mb-4 w-full">
                <button
                  type="button"
                  onClick={() => setQrTheme('emerald')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    qrTheme === 'emerald'
                      ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  هوية الأحياء
                </button>
                <button
                  type="button"
                  onClick={() => setQrTheme('indigo')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    qrTheme === 'indigo'
                      ? 'bg-white text-sky-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  هوية الفضاء
                </button>
              </div>

              {/* Dynamic SVG QR Code */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <svg
                  viewBox={`0 0 ${qrMatrix.length + 4} ${qrMatrix.length + 4}`}
                  className={`${
                    classroomProjection ? 'w-72 h-72' : 'w-44 h-44'
                  } block mx-auto`}
                  role="img"
                  aria-label="رمز الاستجابة السريعة للدخول الفوري إلى منصة آفاق وتأملات"
                >
                  <rect
                    width={qrMatrix.length + 4}
                    height={qrMatrix.length + 4}
                    fill="#ffffff"
                  />
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx + 2}
                          y={rIdx + 2}
                          width={1.03}
                          height={1.03}
                          fill={primaryHex}
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <p className="mt-3 text-xs text-slate-600 text-center leading-relaxed">
                وجّه كاميرا الهاتف أو الجهاز اللوحي لمسح الرمز والدخول المباشر للمنصة
              </p>

              <button
                type="button"
                onClick={() =>
                  downloadQRCodeAsPng(
                    activeUrl,
                    'آفاق وتأملات: منصة الأحياء وعلوم الأرض والفضاء',
                    primaryHex
                  )
                }
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>تحميل بطاقة الرمز (PNG)</span>
              </button>
            </div>

            {/* Direct Link & Social Share Controls */}
            <div
              className={`${
                classroomProjection ? 'w-full' : 'md:col-span-7'
              } flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    الرابط المباشر للنشر والمشاركة
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomUrl(!useCustomUrl);
                      if (useCustomUrl) {
                        setActiveUrl(defaultResolvedUrl);
                      }
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                  >
                    {useCustomUrl ? 'استعادة الرابط التلقائي' : 'تعديل الرابط يدوياً'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 mb-2">
                  رابط متاح لكافة الطلاب والزوار للدخول دون الحاجة لتسجيل دخول أو خوادم وسيطة.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly={!useCustomUrl}
                    dir="ltr"
                    value={activeUrl}
                    onChange={(e) => setActiveUrl(e.target.value)}
                    aria-label="رابط المنصة المباشر"
                    className={`flex-1 px-3 py-2 text-xs font-mono-num rounded-lg border text-slate-700 focus:outline-none ${
                      useCustomUrl
                        ? 'bg-white border-emerald-500 ring-2 ring-emerald-100'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      copied
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم النسخ بنجاح</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Toast notification feedback */}
                {copied && (
                  <p
                    role="status"
                    className="mt-2 text-xs font-medium text-emerald-700"
                  >
                    ✓ تم نسخ رابط منصة «آفاق وتأملات» إلى الحافظة، يمكنك لصقه ومشاركته الآن.
                  </p>
                )}

                <div className="mt-2 flex items-center gap-3">
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح المنصة المنشورة في تبويب جديد</span>
                  </a>
                </div>
              </div>

              {/* Editable Invitation Message */}
              <div>
                <label
                  htmlFor="share-custom-note"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  رسالة الدعوة العلمية المرفقة:
                </label>
                <textarea
                  id="share-custom-note"
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* 1-Click Social Share Buttons & Native Share */}
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  مشاركة فورية عبر القنوات التعليمية:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {shareLinks.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${item.style}`}
                      >
                        <IconComponent className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </div>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>مشاركة عبر تطبيقات النظام (Classroom / AirDrop / WhatsApp)</span>
                  </button>
                )}
              </div>

              {/* Pedagogical Usage Tip */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>رابط سحابي مباشر ودائم للمنصة التعليمية</span>
                </span>
                <span className="font-mono-num font-bold text-slate-700">PWA Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
