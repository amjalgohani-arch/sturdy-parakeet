import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  PlusCircle,
  ThumbsUp,
  Award,
  CheckCircle2,
  X,
  FileText,
  AlertCircle,
  Sparkles,
  Share2,
  Trash2,
} from 'lucide-react';
import {
  StudentReflection,
  SubjectTrack,
  ThinkingLevel,
} from '../types';
import { INITIAL_REFLECTIONS } from '../data/educationalContent';
import { generateQRMatrix } from '../utils/qrGenerator';

const STORAGE_KEY = 'afaq_student_reflections_v1';

interface StudentPublishingBoardProps {
  prefillData: {
    track: SubjectTrack;
    topicTitle: string;
    empiricalFinding: string;
  } | null;
  onClearPrefill: () => void;
  selectedCertificate: StudentReflection | null;
  onSelectCertificate: (reflection: StudentReflection | null) => void;
}

export const StudentPublishingBoard: React.FC<StudentPublishingBoardProps> = ({
  prefillData,
  onClearPrefill,
  selectedCertificate,
  onSelectCertificate,
}) => {
  const [reflections, setReflections] = useState<StudentReflection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial reflections
    }
    return INITIAL_REFLECTIONS;
  });

  const [trackFilter, setTrackFilter] = useState<'all' | SubjectTrack>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | ThinkingLevel>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);

  // Form state
  const [studentName, setStudentName] = useState('');
  const [gradeOrRole, setGradeOrRole] = useState('الصف الثالث الثانوي - مسار علمي');
  const [schoolOrClub, setSchoolOrClub] = useState('');
  const [track, setTrack] = useState<SubjectTrack>('biology');
  const [topicTitle, setTopicTitle] = useState('');
  const [thinkingLevel, setThinkingLevel] =
    useState<ThinkingLevel>('استقصاء علمي');
  const [empiricalFinding, setEmpiricalFinding] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [vision2030Commitment, setVision2030Commitment] = useState('');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('');

  // Save to localStorage whenever reflections change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
    } catch {
      // Ignore storage quota errors
    }
  }, [reflections]);

  // Handle simulation lab prefill
  useEffect(() => {
    if (prefillData) {
      setTrack(prefillData.track);
      setTopicTitle(prefillData.topicTitle);
      setEmpiricalFinding(prefillData.empiricalFinding);
      setShowForm(true);
      setFormError('');
    }
  }, [prefillData]);

  const filteredReflections = useMemo(() => {
    return reflections.filter((item) => {
      const matchesTrack = trackFilter === 'all' || item.track === trackFilter;
      const matchesLevel =
        levelFilter === 'all' || item.thinkingLevel === levelFilter;
      return matchesTrack && matchesLevel;
    });
  }, [reflections, trackFilter, levelFilter]);

  // Quick Demo Auto-fill Helper for instant testing
  const handleFillDemoData = () => {
    const isBio = track === 'biology';
    setStudentName('عبد الإله بن خالد الشمري');
    setGradeOrRole('الصف الثالث الثانوي - مسار الصحة والحياة');
    setSchoolOrClub('ثانوية الرياض النموذجية - نادي الابتكار العلمي');
    setTopicTitle(
      isBio
        ? 'تحليل كفاءة التمثيل الضوئي في أشجار المانجروف الساحلية'
        : 'رصد الجهد المداري وخصائص الاستشعار في القمر الصناعي شاهين سات'
    );
    setThinkingLevel('استقصاء علمي');
    setEmpiricalFinding(
      isBio
        ? 'استقرت ذروة إنتاجية الأكسجين عند درجة حرارة 28.5°C مع كثافة ضوئية 1200 µmol/m²/s.'
        : 'حقق القمر مسحاً طيفياً عالي الدقة بارتفاع مداري 550 كم بزاوية ميل 97.4 درجة.'
    );
    setReflectionText(
      isBio
        ? 'تبيّن من خلال التجربة والمحاكاة أن التكيف الفسيولوجي للمانجروف يسهم بشكل حاسم في تثبيت الكربون الأزرق وتلطيف المناخ الساحلي.'
        : 'أثبتت القراءات التجريبية للمدار الشمسي المتزامن تفوقه في المراقبة الدورية للغطاء النباتي وموارد المياه في المملكة.'
    );
    setVision2030Commitment(
      isBio
        ? 'دعم مبادرة السعودية الخضراء لزراعة 100 مليون شجرة مانجروف على سواحل المملكة.'
        : 'المساهمة في تعزيز وتوطين صناعات الفضاء والتقنيات المدارية الوطنية وفق مستهدفات 2030.'
    );
    setFormError('');
  };

  const handleCreateReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !topicTitle.trim() || !reflectionText.trim()) {
      setFormError('يرجى ملء الحقول الإلزامية: اسم الطالب، وعنوان الظاهرة، ونص التأمل العلمي.');
      return;
    }

    setFormError('');
    const prefix = track === 'biology' ? 'BIO' : 'SPC';
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newEntry: StudentReflection = {
      id: `ref-${Date.now()}`,
      serialNumber: `AFQ-2026-${prefix}-${randomCode}`,
      studentName: studentName.trim(),
      gradeOrRole: gradeOrRole.trim() || 'باحث طلابي',
      schoolOrClub: schoolOrClub.trim() || 'نادي العلوم والابتكار المدرسي',
      track,
      topicTitle: topicTitle.trim(),
      thinkingLevel,
      reflectionText: reflectionText.trim(),
      empiricalFinding:
        empiricalFinding.trim() ||
        'تم التحقق من الفرضية العلمية عبر المحاكي التفاعلي لمنصة آفاق وتأملات.',
      vision2030Commitment:
        vision2030Commitment.trim() ||
        'الإسهام الفاعل في مبادرات الاستدامة البيئية والابتكار العلمي لتحقيق مستهدفات رؤية المملكة 2030.',
      createdAt: new Date().toISOString().slice(0, 10),
      endorsements: 1,
    };

    setReflections((prev) => [newEntry, ...prev]);
    setStudentName('');
    setTopicTitle('');
    setReflectionText('');
    setEmpiricalFinding('');
    setVision2030Commitment('');
    onClearPrefill();
    setShowForm(false);
    setHighlightedCardId(newEntry.id);
    setTimeout(() => setHighlightedCardId(null), 6000);

    setPublishSuccessMsg(
      `تم اعتماد ونشر بطاقة التأمل بنجاح برقم توثيق (${newEntry.serialNumber})!`
    );
    setTimeout(() => setPublishSuccessMsg(''), 6000);
    onSelectCertificate(newEntry);
  };

  const handleEndorse = (id: string) => {
    setReflections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, endorsements: item.endorsements + 1 } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف بطاقة التأمل هذه من سجلك؟')) {
      setReflections((prev) => prev.filter((item) => item.id !== id));
      if (selectedCertificate?.id === id) {
        onSelectCertificate(null);
      }
    }
  };

  const downloadCertificateAsPng = (cert: StudentReflection) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crisp Parchment / Academic White Canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Academic Frame
    const accentColor = cert.track === 'biology' ? '#059669' : '#0284c7';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // Top Header Banner
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 34px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      'وثيقة وشهادة تأمل علمي معتمدة — منصة آفاق وتأملات',
      canvas.width / 2,
      105
    );

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 20px Tajawal, sans-serif';
    const trackTitle =
      cert.track === 'biology'
        ? 'مسار علوم الأحياء والبيئة والاستدامة الحيوية'
        : 'مسار علوم الأرض والفضاء والاستشعار المداري';
    ctx.fillText(
      `${trackTitle}  ·  مستوى التفكير: ${cert.thinkingLevel}  ·  رقم الاعتماد: ${cert.serialNumber}`,
      canvas.width / 2,
      148
    );

    // Divider Line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 175);
    ctx.lineTo(canvas.width - 90, 175);
    ctx.stroke();

    // Student Info
    ctx.textAlign = 'right';
    ctx.fillStyle = '#475569';
    ctx.font = '20px Tajawal, sans-serif';
    ctx.fillText(
      `الباحث / الطالب: ${cert.studentName}   |   الجهة التعليمية: ${cert.schoolOrClub} (${cert.gradeOrRole})`,
      canvas.width - 90,
      220
    );

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px Cairo, sans-serif';
    ctx.fillText(`الموضوع العلمي: ${cert.topicTitle}`, canvas.width - 90, 268);

    // Helper for wrapping Arabic lines
    const wrapArabicText = (
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      lineHeight: number
    ) => {
      const words = text.split(' ');
      let line = '';
      let y = startY;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), x, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, y);
      return y + lineHeight;
    };

    ctx.fillStyle = '#1e293b';
    ctx.font = '21px Tajawal, sans-serif';
    let nextY = wrapArabicText(
      `التأمل والاستنتاج العلمي: ${cert.reflectionText}`,
      canvas.width - 90,
      320,
      1020,
      36
    );

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 19px Tajawal, sans-serif';
    nextY = wrapArabicText(
      `القراءة التجريبية المرصودة: ${cert.empiricalFinding}`,
      canvas.width - 90,
      nextY + 22,
      1020,
      34
    );

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 19px Tajawal, sans-serif';
    wrapArabicText(
      `الالتزام السلوكي برؤية المملكة 2030: ${cert.vision2030Commitment}`,
      canvas.width - 90,
      nextY + 24,
      1020,
      34
    );

    // Footer Seal & Date
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '18px IBM Plex Mono, monospace';
    ctx.fillText(
      `Issued: ${cert.createdAt} | Serial: ${cert.serialNumber}`,
      90,
      canvas.height - 75
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px Cairo, sans-serif';
    ctx.fillText(
      'اعتماد مختبر آفاق وتأملات — الأحياء وعلوم الأرض والفضاء',
      canvas.width - 90,
      canvas.height - 75
    );

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `certificate-${cert.serialNumber}.png`;
      a.click();
    } catch {
      window.print();
    }
  };

  const thinkingLevels: ThinkingLevel[] = [
    'تحليل نقدي',
    'استقصاء علمي',
    'ابتكار مستقبلي',
    'ربط برؤية 2030',
  ];

  return (
    <section id="publishing" className="py-10 border-t border-slate-200">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>مجلة النشر والتوثيق الأكاديمي الطلابي</span>
            <span aria-hidden="true">·</span>
            <span>شهادات تأمل علمي معتمدة وجاهزة للطباعة (A4)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            لوحة منشورات الطلاب وبطاقات التأمل العلمي المعتمدة
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>
            {showForm ? 'إغلاق نموذج النشر' : 'إضافة وتوثيق بطاقة تأمل جديدة'}
          </span>
        </button>
      </div>

      {/* Toast message on successful publish */}
      {publishSuccessMsg && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-800 shadow-xs animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{publishSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setPublishSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            إخفاء
          </button>
        </div>
      )}

      {/* Interactive Submission Form */}
      {showForm && (
        <form
          onSubmit={handleCreateReflection}
          className="mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                إصدار ونشر بطاقة تأمل علمي معتمدة
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تُحفظ البطاقة تلقائياً في السجل وتصدر لها شهادة أكاديمية برقم تسلسلي معتمد قابلة للطباعة الفورية.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFillDemoData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                title="تعبئة بيانات نموذجية جاهزة لتجربة النشر بضغطة واحدة"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>تعبئة تجريبية نموذجية سريعة</span>
              </button>

              {prefillData && (
                <span className="text-xs font-bold text-emerald-700">
                  ✓ مستورد من المحاكي
                </span>
              )}
            </div>
          </div>

          {/* Form Error Alert if fields are missing */}
          {formError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="input-student-name"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                اسم الطالب / الباحث الثلاثي <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                required
                placeholder="مثال: ريان بن فهد العتيبي"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (formError) setFormError('');
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="input-grade-role"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                الصف الدراسي / المسار
              </label>
              <input
                id="input-grade-role"
                type="text"
                placeholder="مثال: الصف الثالث الثانوي - مسار علمي"
                value={gradeOrRole}
                onChange={(e) => setGradeOrRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="input-school"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                المدرسة / النادي العلمي
              </label>
              <input
                id="input-school"
                type="text"
                placeholder="مثال: ثانوية الملك عبد العزيز - النادي العلمي"
                value={schoolOrClub}
                onChange={(e) => setSchoolOrClub(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="select-track"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                مسار المادة العلمية <span className="text-rose-600">*</span>
              </label>
              <select
                id="select-track"
                value={track}
                onChange={(e) => setTrack(e.target.value as SubjectTrack)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                <option value="biology">علوم الأحياء والبيئة</option>
                <option value="earth_space">علوم الأرض والفضاء</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="select-thinking"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                مستوى التفكير العلمي <span className="text-rose-600">*</span>
              </label>
              <select
                id="select-thinking"
                value={thinkingLevel}
                onChange={(e) =>
                  setThinkingLevel(e.target.value as ThinkingLevel)
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              >
                {thinkingLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="input-topic"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                عنوان الظاهرة أو التجربة العلمية <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-topic"
                type="text"
                required
                placeholder="مثال: كفاءة البناء الضوئي في شعاب البحر الأحمر"
                value={topicTitle}
                onChange={(e) => {
                  setTopicTitle(e.target.value);
                  if (formError) setFormError('');
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="textarea-reflection"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                نص التأمل والاستنتاج العلمي <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="textarea-reflection"
                required
                rows={3}
                placeholder="اكتب تحليلك العلمي للظاهرة وكيف تفسر العلاقة بين المتغيرات..."
                value={reflectionText}
                onChange={(e) => {
                  setReflectionText(e.target.value);
                  if (formError) setFormError('');
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="input-finding"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  القراءة التجريبية أو المعادلة المرصودة
                </label>
                <input
                  id="input-finding"
                  type="text"
                  placeholder="مثال: عند حرارة 30.5°C استقرت كفاءة البناء الضوئي عند 88%"
                  value={empiricalFinding}
                  onChange={(e) => setEmpiricalFinding(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label
                  htmlFor="input-vision"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  التوصية والالتزام السلوكي برؤية المملكة 2030
                </label>
                <input
                  id="input-vision"
                  type="text"
                  placeholder="مثال: المساهمة في حماية الغطاء النباتي وترشيد المياه"
                  value={vision2030Commitment}
                  onChange={(e) => setVision2030Commitment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError('');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>نشر التأمل وإصدار الشهادة المعتمدة</span>
            </button>
          </div>
        </form>
      )}

      {/* Interactive Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl">
          <button
            type="button"
            onClick={() => setTrackFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              trackFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            جميع المسارات ({reflections.length})
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('biology')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              trackFilter === 'biology'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مسار الأحياء والبيئة
          </button>
          <button
            type="button"
            onClick={() => setTrackFilter('earth_space')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              trackFilter === 'earth_space'
                ? 'bg-white text-sky-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مسار الأرض والفضاء
          </button>
        </div>

        {/* Thinking Level Filter */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              levelFilter === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كل مستويات التفكير
          </button>
          {thinkingLevels.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                levelFilter === lvl
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReflections.map((item) => {
          const isHighlighted = highlightedCardId === item.id;
          return (
            <article
              key={item.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                isHighlighted
                  ? 'border-emerald-500 ring-2 ring-emerald-200 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Metadata Line */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                  <span
                    className={
                      item.track === 'biology'
                        ? 'font-bold text-emerald-700'
                        : 'font-bold text-sky-700'
                    }
                  >
                    {item.track === 'biology'
                      ? 'علوم الأحياء والبيئة'
                      : 'علوم الأرض والفضاء'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">
                    {item.thinkingLevel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{item.serialNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{item.createdAt}</span>
                </div>

                {/* Card Primary Title */}
                <h3 className="text-lg font-bold text-slate-900 font-display leading-snug mb-3">
                  {item.topicTitle}
                </h3>

                {/* Reflection Prose */}
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {item.reflectionText}
                </p>

                {/* Empirical Finding & Vision 2030 Commitment */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <p className="text-slate-800">
                    <strong className="font-bold text-slate-900">
                      المخرج التجريبي:{' '}
                    </strong>
                    {item.empiricalFinding}
                  </p>
                  <p className="text-slate-600">
                    <strong className="font-bold text-emerald-800">
                      الالتزام السلوكي (رؤية 2030):{' '}
                    </strong>
                    {item.vision2030Commitment}
                  </p>
                </div>
              </div>

              {/* Author & Certificate Action Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {item.studentName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.gradeOrRole} · {item.schoolOrClub}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEndorse(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                    title="تأييد علمي لهذا التأمل"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono-num">{item.endorsements}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectCertificate(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تصدير بطاقة النشر / طباعة الشهادة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="حذف البطاقة"
                    aria-label="حذف بطاقة التأمل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Student Reflection Certificate Modal (A4 Print & PNG Export Ready) */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto print-only-certificate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden print-only-certificate">
            {/* Top Action Toolbar (Hidden when printing) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-900 text-white no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span
                  id="certificate-modal-title"
                  className="text-sm font-bold font-display"
                >
                  معاينة بطاقة وشهادة التأمل العلمي المعتمدة (جاهزة للطباعة A4)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة فورية / حفظ PDF (A4)</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadCertificateAsPng(selectedCertificate)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                  <span>تحميل كصورة (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCertificate(null)}
                  aria-label="إغلاق المعاينة"
                  className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Academic Certificate Body */}
            <div className="p-8 md:p-10 bg-white">
              <div
                className={`border-2 rounded-2xl p-6 md:p-8 relative ${
                  selectedCertificate.track === 'biology'
                    ? 'border-emerald-700'
                    : 'border-sky-700'
                }`}
              >
                {/* Certificate Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      المملكة العربية السعودية · مبادرات الإثراء العلمي والمدارس الخضراء
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                      شهادة وبطاقة تأمل علمي معتمدة
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 mt-1">
                      منصة «آفاق وتأملات: الأحياء وعلوم الأرض والفضاء»
                    </p>
                  </div>

                  <div className="text-left sm:text-left font-mono-num text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                    <div className="font-bold text-slate-900">
                      {selectedCertificate.serialNumber}
                    </div>
                    <div>تاريخ الإصدار: {selectedCertificate.createdAt}</div>
                    <div>
                      المسار:{' '}
                      {selectedCertificate.track === 'biology'
                        ? 'علوم الأحياء والبيئة'
                        : 'علوم الأرض والفضاء'}
                    </div>
                  </div>
                </div>

                {/* Student / Researcher Details */}
                <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div>
                    <span className="block text-[11px] text-slate-500">
                      اسم الطالب / الباحث العلمي
                    </span>
                    <strong className="text-sm font-bold text-slate-900 font-display">
                      {selectedCertificate.studentName}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">
                      المرحلة الدراسية / الصفة
                    </span>
                    <strong className="text-xs font-bold text-slate-800">
                      {selectedCertificate.gradeOrRole}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">
                      المدرسة / النادي العلمي
                    </span>
                    <strong className="text-xs font-bold text-slate-800">
                      {selectedCertificate.schoolOrClub}
                    </strong>
                  </div>
                </div>

                {/* Scientific Reflection Content */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span>موضوع الاستقصاء العلمي</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-slate-800">
                        مستوى التفكير: {selectedCertificate.thinkingLevel}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 font-display">
                      {selectedCertificate.topicTitle}
                    </h4>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl">
                    <span className="block text-xs font-bold text-slate-900 mb-1.5">
                      نص التأمل والتحليل العلمي:
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {selectedCertificate.reflectionText}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="block text-xs font-bold text-slate-900 mb-1">
                        المخرج التجريبي المرصود في المختبر:
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedCertificate.empiricalFinding}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                      <span className="block text-xs font-bold text-emerald-950 mb-1">
                        الالتزام السلوكي والاستدامة (رؤية المملكة 2030):
                      </span>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        {selectedCertificate.vision2030Commitment}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Certificate Official Seal & Verification QR Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-6">
                  {/* Official Geometric Academic Seal SVG */}
                  <div className="flex items-center gap-3">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-16 h-16 shrink-0"
                      aria-hidden="true"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="1"
                        strokeDasharray="4 2"
                      />
                      <text
                        x="50"
                        y="44"
                        textAnchor="middle"
                        fill="#059669"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        معتمد علمياً
                      </text>
                      <text
                        x="50"
                        y="60"
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        آفاق وتأملات
                      </text>
                      <text
                        x="50"
                        y="73"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="8"
                      >
                        2030
                      </text>
                    </svg>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-display">
                        ختم التوثيق العلمي للمنصة
                      </div>
                      <div className="text-[11px] text-slate-500">
                        تم التحقق من الأصالة والمنهجية العلمية عبر مختبر آفاق وتأملات
                      </div>
                    </div>
                  </div>

                  {/* Verification QR Code */}
                  {(() => {
                    const verifyMatrix = generateQRMatrix(
                      `https://ais-pre-tqvqjdbrdy5mh4zbgzwwmk-715018921945.europe-west1.run.app/#cert=${selectedCertificate.serialNumber}`
                    );
                    return (
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-800">
                            رمز التحقق الرقمي
                          </div>
                          <div className="text-[11px] font-mono-num text-slate-500">
                            {selectedCertificate.serialNumber}
                          </div>
                        </div>
                        <div className="p-1.5 bg-white border border-slate-200 rounded-lg">
                          <svg
                            viewBox={`0 0 ${verifyMatrix.length + 2} ${
                              verifyMatrix.length + 2
                            }`}
                            className="w-14 h-14"
                            aria-label="رمز التحقق من الشهادة"
                          >
                            {verifyMatrix.map((row, r) =>
                              row.map((cell, c) =>
                                cell ? (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={c + 1}
                                    y={r + 1}
                                    width={1.02}
                                    height={1.02}
                                    fill="#0f172a"
                                  />
                                ) : null
                              )
                            )}
                          </svg>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
