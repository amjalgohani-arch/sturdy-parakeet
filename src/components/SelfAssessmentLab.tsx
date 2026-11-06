import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Compass,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import {
  CURRICULUM_TOPICS,
  DIAGNOSTIC_QUESTIONS,
} from '../data/educationalContent';
import { SubjectTrack } from '../types';

interface SelfAssessmentLabProps {
  onSendTopicToBoard: (payload: {
    track: SubjectTrack;
    topicTitle: string;
    empiricalFinding: string;
  }) => void;
}

export const SelfAssessmentLab: React.FC<SelfAssessmentLabProps> = ({
  onSendTopicToBoard,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [activeCurriculumTrack, setActiveCurriculumTrack] = useState<
    'all' | SubjectTrack
  >('all');

  const visibleTopics = CURRICULUM_TOPICS.filter(
    (t) => activeCurriculumTrack === 'all' || t.track === activeCurriculumTrack
  );

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = DIAGNOSTIC_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <>
      {/* Curriculum Modules Explorer (#curriculum) */}
      <section id="curriculum" className="py-10 border-t border-slate-200 no-print">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>الوحدات العلمية المنهجية</span>
              <span aria-hidden="true">·</span>
              <span>ربط المفاهيم النظرية بمشاريع رؤية المملكة 2030</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              المسارات العلمية: الأحياء وعلوم الأرض والفضاء
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveCurriculumTrack('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCurriculumTrack === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جميع الوحدات (4)
            </button>
            <button
              type="button"
              onClick={() => setActiveCurriculumTrack('biology')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCurriculumTrack === 'biology'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              وحدات الأحياء
            </button>
            <button
              type="button"
              onClick={() => setActiveCurriculumTrack('earth_space')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCurriculumTrack === 'earth_space'
                  ? 'bg-white text-sky-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              وحدات الأرض والفضاء
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-slate-900">
                    {topic.unitNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      topic.track === 'biology'
                        ? 'font-bold text-emerald-700'
                        : 'font-bold text-sky-700'
                    }
                  >
                    {topic.track === 'biology'
                      ? 'علوم الأحياء والبيئة'
                      : 'علوم الأرض والفضاء'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {topic.keyEquationOrMetric}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                  {topic.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  {topic.coreConcept}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <p className="text-slate-800">
                    <strong className="text-slate-900">
                      التطبيق الوطني في المملكة:{' '}
                    </strong>
                    {topic.saudiContextExample}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-emerald-800">
                      سؤال التفكير التأملي:{' '}
                    </strong>
                    {topic.interactiveQuestion}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {topic.reflectionPrompt}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onSendTopicToBoard({
                      track: topic.track,
                      topicTitle: topic.title,
                      empiricalFinding: `تحليل وحدة (${topic.unitNumber}): ${topic.keyEquationOrMetric}`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 mr-3"
                >
                  <span>كتابة تأمل في هذه الوحدة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostic Self-Assessment Lab (#assessment) */}
      <section id="assessment" className="py-10 border-t border-slate-200 no-print">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>مختبر التقويم التكويني</span>
              <span aria-hidden="true">·</span>
              <span>أسئلة استقصاء وتفسير علمي فوري</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              اختبر استيعابك العميق للظواهر العلمية
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-700 font-mono-num">
              النتيجة الحالية:{' '}
              <strong className="text-emerald-700 font-bold">
                {correctCount} / {DIAGNOSTIC_QUESTIONS.length}
              </strong>{' '}
              (تمت الإجابة على {answeredCount})
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedAnswers({})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIAGNOSTIC_QUESTIONS.map((q, qIdx) => {
            const chosen = selectedAnswers[q.id];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-mono-num font-bold text-slate-900">
                      سؤال 0{qIdx + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        q.track === 'biology'
                          ? 'font-bold text-emerald-700'
                          : 'font-bold text-sky-700'
                      }
                    >
                      {q.track === 'biology'
                        ? 'علوم الأحياء'
                        : 'علوم الأرض والفضاء'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{q.thinkingLevel}</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2 font-mono-num">
                    {q.scenarioContext}
                  </p>

                  <h3 className="text-base font-bold text-slate-900 font-display leading-snug mb-4">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = chosen === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                      if (isAnswered) {
                        if (isThisCorrect) {
                          btnStyle =
                            'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle =
                            'bg-red-50 border-red-300 text-red-900';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: optIdx,
                            }))
                          }
                          className={`w-full text-right px-3.5 py-2.5 text-xs border rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          {isAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isThisSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Immediate Contextual Scientific Feedback */}
                {isAnswered && (
                  <div
                    className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/80 border-amber-200 text-amber-950'
                    }`}
                  >
                    <strong className="block mb-1 font-bold">
                      {isCorrect
                        ? '✓ استنتاج علمي دقيق:'
                        : '▲ تفسير الظاهرة العلمية الصحيح:'}
                    </strong>
                    {q.scientificExplanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
