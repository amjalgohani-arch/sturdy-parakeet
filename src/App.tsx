import React, { useState, useEffect } from 'react';
import {
  Monitor,
  QrCode,
  Award,
  Sparkles,
  BookOpen,
  Share2,
} from 'lucide-react';
import { TopNav } from './components/TopNav';
import { InteractiveSimulations } from './components/InteractiveSimulations';
import { StudentPublishingBoard } from './components/StudentPublishingBoard';
import { SelfAssessmentLab } from './components/SelfAssessmentLab';
import { SharePlatformModal } from './components/SharePlatformModal';
import { StudentReflection, SubjectTrack } from './types';
import { INITIAL_REFLECTIONS } from './data/educationalContent';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('simulations');
  const [activeTrack, setActiveTrack] = useState<SubjectTrack>('biology');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [prefillData, setPrefillData] = useState<{
    track: SubjectTrack;
    topicTitle: string;
    empiricalFinding: string;
  } | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<StudentReflection | null>(null);

  // Sync Classroom Presentation Mode class on <html>
  useEffect(() => {
    const rootEl = document.documentElement;
    if (isPresentationMode) {
      rootEl.classList.add('presentation-mode');
    } else {
      rootEl.classList.remove('presentation-mode');
    }
  }, [isPresentationMode]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSendFindingToBoard = (payload: {
    track: SubjectTrack;
    topicTitle: string;
    empiricalFinding: string;
  }) => {
    setPrefillData(payload);
    handleNavigate('publishing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar following the 3-Zone Top Bar Contract */}
      <TopNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Classroom Presentation Mode & Quick Publishing Workspace Bar */}
      <div className="bg-white border-b border-slate-200 no-print">
        <div
          className={`${
            isPresentationMode ? 'max-w-[1440px]' : 'max-w-[1360px]'
          } mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs`}
        >
          <div className="flex flex-wrap items-center gap-2 text-slate-600">
            <span className="font-bold text-slate-900">
              آفاق وتأملات: منصة الأحياء وعلوم الأرض والفضاء
            </span>
            <span aria-hidden="true">·</span>
            <span>بيئة استقصاء علمي ونشر طلابي تفاعلي</span>
            <span aria-hidden="true">·</span>
            <span>مواكبة لمبادرات رؤية المملكة 2030</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Classroom Presentation Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                isPresentationMode
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="تكبير النصوص والمحاكيات لعرضها على السبورة التفاعلية في الفصل"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {isPresentationMode
                  ? 'وضع العرض الصفي: نشط (مكبر)'
                  : 'تفعيل وضع العرض الصفي'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>رمز QR للفصل</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCertificate(INITIAL_REFLECTIONS[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>نموذج شهادة التأمل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main
        className={`flex-1 ${
          isPresentationMode ? 'max-w-[1440px]' : 'max-w-[1360px]'
        } w-full mx-auto px-6`}
      >
        {/* Hero Header Section (Hidden in Presentation Mode if desired, or streamlined) */}
        {!isPresentationMode && (
          <section className="py-8 border-b border-slate-200 no-print">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-bold text-emerald-700">
                      مختبر علوم الحياة والبيئة
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-sky-700">
                      مرصد علوم الأرض والفضاء
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>مركز النشر والتوثيق الطلابي</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight mb-4">
                    آفاق وتأملات: استقصاء الظواهر الحية والمدارية وتوثيق الفكر العلمي
                  </h1>

                  <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
                    منصة تعليمية تفاعلية تجمع بين المحاكيات العلمية الحية لمادتي{' '}
                    <strong className="text-slate-900">الأحياء</strong> و
                    <strong className="text-slate-900">
                      علوم الأرض والفضاء
                    </strong>
                    ، وتمكّن الطلاب والمعلمين من اختبار الفرضيات التجريبية وإصدار{' '}
                    <strong className="text-emerald-800">
                      بطاقات وشهادات تأمل علمي معتمدة
                    </strong>{' '}
                    قابلة للطباعة والمشاركة الفورية عبر رمز الاستجابة السريعة (QR).
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('simulations')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>بدء التجارب التفاعلية الآن</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigate('publishing')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>إصدار وطباعة شهادة تأمل علمي</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4 text-sky-600" />
                    <span>مشاركة المنصة ورمز QR</span>
                  </button>
                </div>
              </div>

              {/* Right Summary Card: Quick Track & Publishing Highlights */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display mb-3">
                    أدوات النشر والتفاعل الصفي الفوري
                  </h2>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="pb-3 border-b border-slate-100">
                      <strong className="block text-slate-900 mb-0.5">
                        01. محاكيات ثنائية المسار (أحياء + فضاء)
                      </strong>
                      <span>
                        تحكم مباشر بدرجات الحرارة، الإشعاع، الجهد المائي، والارتفاع المداري للأقمار السعودية.
                      </span>
                    </div>
                    <div className="pb-3 border-b border-slate-100">
                      <strong className="block text-slate-900 mb-0.5">
                        02. شهادات وبطاقات تأمل معتمدة (A4 & PNG)
                      </strong>
                      <span>
                        توثيق استنتاجات الطالب والتزامه السلوكي برؤية 2030 مع ختم المنصة ورمز تحقق.
                      </span>
                    </div>
                    <div>
                      <strong className="block text-slate-900 mb-0.5">
                        03. مشاركة فورية وعرض صفي ذكي
                      </strong>
                      <span>
                        توليد رمز QR محلياً على المتصفح لمسحه بهواتف الطلاب دون الحاجة لأي سيرفر خارجي.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">عدد المحاكيات والوحدات</span>
                  <span className="font-mono-num font-bold text-slate-900">
                    4 محاكيات حية · 4 وحدات منهجية
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 1. Interactive Simulations Sandbox */}
        <InteractiveSimulations
          activeTrack={activeTrack}
          onSelectTrack={setActiveTrack}
          onSendFindingToBoard={handleSendFindingToBoard}
        />

        {/* 2. Student Reflection & Publishing Board (with Printable Certificate Modal) */}
        <StudentPublishingBoard
          prefillData={prefillData}
          onClearPrefill={() => setPrefillData(null)}
          selectedCertificate={selectedCertificate}
          onSelectCertificate={setSelectedCertificate}
        />

        {/* 3. Curriculum Modules & Diagnostic Self-Assessment Lab */}
        <SelfAssessmentLab onSendTopicToBoard={handleSendFindingToBoard} />
      </main>

      {/* Share & QR Publishing Modal */}
      <SharePlatformModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Quiet Academic Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 no-print">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            منصة «آفاق وتأملات: الأحياء وعلوم الأرض والفضاء» — بيئة تعليمية تفاعلية للنشر العلمي الطلابي.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="text-slate-700 hover:text-emerald-700 font-medium cursor-pointer"
            >
              مشاركة رمز QR
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => handleNavigate('publishing')}
              className="text-slate-700 hover:text-emerald-700 font-medium cursor-pointer"
            >
              إصدار شهادة تأمل
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className="text-slate-700 hover:text-emerald-700 font-medium cursor-pointer"
            >
              {isPresentationMode ? 'إلغاء الوضع الصفي' : 'وضع العرض الصفي'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
