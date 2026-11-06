import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FileCheck2,
  Sliders,
  Compass,
  Leaf,
} from 'lucide-react';
import { SubjectTrack } from '../types';

interface InteractiveSimulationsProps {
  activeTrack: SubjectTrack;
  onSelectTrack: (track: SubjectTrack) => void;
  onSendFindingToBoard: (payload: {
    track: SubjectTrack;
    topicTitle: string;
    empiricalFinding: string;
  }) => void;
}

export const InteractiveSimulations: React.FC<InteractiveSimulationsProps> = ({
  activeTrack,
  onSelectTrack,
  onSendFindingToBoard,
}) => {
  // Sub-experiment selector per track
  const [bioLabMode, setBioLabMode] = useState<'coral' | 'vascular'>('coral');
  const [spaceLabMode, setSpaceLabMode] = useState<'orbit' | 'tectonics'>(
    'orbit'
  );
  const [isPlaying, setIsPlaying] = useState(true);

  // Biology Lab 1: Red Sea Coral Reef Thermal Resilience Parameters
  const [waterTemp, setWaterTemp] = useState<number>(29.5); // °C
  const [solarIrradiance, setSolarIrradiance] = useState<number>(750); // W/m²
  const [co2Ppm, setCo2Ppm] = useState<number>(415); // ppm

  // Biology Lab 2: Vascular Xylem/Phloem & Stomatal Regulation
  const [desertTemp, setDesertTemp] = useState<number>(38); // °C
  const [soilMoisture, setSoilMoisture] = useState<number>(45); // %
  const [abaHormoneLevel, setAbaHormoneLevel] = useState<number>(65); // %

  // Space Lab 1: Orbital Mechanics & Remote Sensing Satellite
  const [orbitAltitude, setOrbitAltitude] = useState<number>(600); // km
  const [orbitInclination, setOrbitInclination] = useState<number>(97.8); // deg
  const [sensorSwathFactor, setSensorSwathFactor] = useState<number>(1.2);

  // Space Lab 2: Arabian Shield Rift & Geothermal Gradient
  const [spreadingRate, setSpreadingRate] = useState<number>(1.8); // cm/yr
  const [timeMillions, setTimeMillions] = useState<number>(12); // Myr
  const [drillDepthKm, setDrillDepthKm] = useState<number>(3.5); // km

  // Derived Calculations for Biology Lab 1 (Red Sea Coral vs Standard Tropical Coral)
  const redSeaPhotosynthesis = Math.max(
    18,
    Math.min(
      98,
      Math.round(
        96 -
          Math.max(0, waterTemp - 30.8) * 18 -
          Math.max(0, (co2Ppm - 420) * 0.08) -
          Math.abs(solarIrradiance - 750) * 0.015
      )
    )
  );
  const standardCoralPhotosynthesis = Math.max(
    8,
    Math.min(
      95,
      Math.round(
        92 -
          Math.max(0, waterTemp - 28.5) * 22 -
          Math.max(0, (co2Ppm - 410) * 0.11)
      )
    )
  );
  const oceanPh = (8.18 - (co2Ppm - 400) * 0.0009).toFixed(2);
  const coralState =
    waterTemp <= 30.8
      ? {
          code: '● اتزان تكافلي مثالي',
          tone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        }
      : waterTemp <= 32.2
      ? {
          code: '▲ إجهاد حراري متوسط (مقاومة جينية نشطة)',
          tone: 'text-amber-800 bg-amber-50 border-amber-200',
        }
      : {
          code: '■ عتبة ابيضاض حرجة (طرد الزوزانثيلي)',
          tone: 'text-red-700 bg-red-50 border-red-200',
        };

  // Derived Calculations for Biology Lab 2 (Vascular Xylem & Phloem)
  const stomatalOpeningPct = Math.max(
    12,
    Math.min(
      95,
      Math.round(
        70 + (soilMoisture - 50) * 0.6 - (desertTemp - 30) * 1.4 - (abaHormoneLevel - 50) * 0.45
      )
    )
  );
  const waterPotentialMPa = (
    -0.8 -
    (100 - soilMoisture) * 0.022 -
    (desertTemp - 25) * 0.035 +
    abaHormoneLevel * 0.006
  ).toFixed(2);
  const xylemFlowRate = Math.max(
    1.2,
    Number(
      ((stomatalOpeningPct * 0.085 * soilMoisture) / 45).toFixed(1)
    )
  );
  const vascularState =
    Number(waterPotentialMPa) >= -2.3
      ? {
          code: '● تدفق وعائي متصل (آمن من التكهف)',
          tone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        }
      : Number(waterPotentialMPa) >= -3.1
      ? {
          code: '▲ تنظيم ثغري دفاعي (ترشيد النتح)',
          tone: 'text-amber-800 bg-amber-50 border-amber-200',
        }
      : {
          code: '■ خطر تكهف أوعية الخشب (جفاف شديد)',
          tone: 'text-red-700 bg-red-50 border-red-200',
        };

  // Derived Calculations for Space Lab 1 (Orbital Mechanics)
  const earthRadiusKm = 6371;
  const gmEarth = 398600.4418; // km^3 / s^2
  const orbitalRadius = earthRadiusKm + orbitAltitude;
  const orbitalVelocityKmS = Math.sqrt(gmEarth / orbitalRadius).toFixed(2);
  const orbitalPeriodMin = (
    (2 * Math.PI * Math.sqrt(Math.pow(orbitalRadius, 3) / gmEarth)) /
    60
  ).toFixed(1);
  const groundSwathKm = Math.round(orbitAltitude * 0.24 * sensorSwathFactor);
  const spatialResolutionM = ((orbitAltitude / 500) * 1.45).toFixed(2);
  const orbitState =
    orbitAltitude >= 450 && orbitAltitude <= 800
      ? {
          code: '● مدار أرضي منخفض مثالي للاستشعار الطيفي (LEO)',
          tone: 'text-sky-800 bg-sky-50 border-sky-200',
        }
      : orbitAltitude < 450
      ? {
          code: '▲ مدار شديد الانخفاض (مقاومة غلاف جوي أعلى)',
          tone: 'text-amber-800 bg-amber-50 border-amber-200',
        }
      : {
          code: '◆ مدار متوسط التغطية (حزمة مسح أوسع)',
          tone: 'text-indigo-800 bg-indigo-50 border-indigo-200',
        };

  // Derived Calculations for Space Lab 2 (Arabian Shield Tectonics)
  const riftOpeningWidthKm = Math.round(
    180 + spreadingRate * timeMillions * 10
  );
  const subsurfaceTempC = Math.round(28 + drillDepthKm * 48 + spreadingRate * 14);
  const geothermalPowerMW = Math.round(
    (subsurfaceTempC - 80) * 0.65 * (drillDepthKm / 2.5)
  );
  const tectonicState =
    subsurfaceTempC >= 180
      ? {
          code: '● خزان جيوحراري عالي الكفاءة لتوليد الطاقة النظيفة',
          tone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        }
      : {
          code: '▲ تدرج حراري متوسط (مناسب للتطبيقات الحرارية المباشرة)',
          tone: 'text-sky-800 bg-sky-50 border-sky-200',
        };

  const handleReset = () => {
    if (activeTrack === 'biology') {
      if (bioLabMode === 'coral') {
        setWaterTemp(29.5);
        setSolarIrradiance(750);
        setCo2Ppm(415);
      } else {
        setDesertTemp(38);
        setSoilMoisture(45);
        setAbaHormoneLevel(65);
      }
    } else {
      if (spaceLabMode === 'orbit') {
        setOrbitAltitude(600);
        setOrbitInclination(97.8);
        setSensorSwathFactor(1.2);
      } else {
        setSpreadingRate(1.8);
        setTimeMillions(12);
        setDrillDepthKm(3.5);
      }
    }
  };

  const handleExportToReflection = () => {
    if (activeTrack === 'biology') {
      if (bioLabMode === 'coral') {
        onSendFindingToBoard({
          track: 'biology',
          topicTitle: 'المرونة الحرارية والتكافل في شعاب البحر الأحمر',
          empiricalFinding: `عند درجة حرارة ${waterTemp}°C وتركيز ${co2Ppm} ppm CO₂ (pH ${oceanPh})، حافظت شعاب البحر الأحمر على كفاءة بناء ضوئي ${redSeaPhotosynthesis}% مقابل ${standardCoralPhotosynthesis}% للشعاب غير المتكيفة.`,
        });
      } else {
        onSendFindingToBoard({
          track: 'biology',
          topicTitle: 'تنظيم الجهد المائي والنقل الوعائي في النباتات الصحراوية',
          empiricalFinding: `عند حرارة ${desertTemp}°C ورطوبة تربة ${soilMoisture}%، بلغ الجهد المائي ${waterPotentialMPa} MPa مع فتحة ثغور ${stomatalOpeningPct}% وتدفق خشبي ${xylemFlowRate} mL/h.`,
        });
      }
    } else {
      if (spaceLabMode === 'orbit') {
        onSendFindingToBoard({
          track: 'earth_space',
          topicTitle: 'الميكانيكا المدارية لأقمار الاستشعار عن بُعد (LEO)',
          empiricalFinding: `عند ارتفاع مداري ${orbitAltitude} km وميل ${orbitInclination}°، بلغت السرعة المدارية ${orbitalVelocityKmS} km/s والزمن الدوري ${orbitalPeriodMin} دقيقة بدقة مكانية ${spatialResolutionM} متر.`,
        });
      } else {
        onSendFindingToBoard({
          track: 'earth_space',
          topicTitle: 'تباعد أخدود البحر الأحمر والطاقة الجيوحرارية في الدرع العربي',
          empiricalFinding: `بمعدل تباعد ${spreadingRate} cm/yr وعمق حفر ${drillDepthKm} km في الصخور البازلتية، وصلت حرارة الخزان الجوفي إلى ${subsurfaceTempC}°C بقدرة توليد تقديرية ${geothermalPowerMW} MW.`,
        });
      }
    }
  };

  return (
    <section id="simulations" className="py-8">
      {/* Track & Sub-Experiment Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>المختبر الافتراضي التفاعلي</span>
            <span aria-hidden="true">·</span>
            <span>محاكاة فورية بالمتغيرات الفيزيائية والحيوية</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">
            استكشف الظواهر العلمية وجرّب الفرضيات بنفسك
          </h2>
        </div>

        {/* Main Track Segmented Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-200/75 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectTrack('biology')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTrack === 'biology'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>مختبر علوم الأحياء والبيئة</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('earth_space')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTrack === 'earth_space'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>مختبر علوم الأرض والفضاء</span>
            </button>
          </div>

          {/* Sub-Experiment Selector */}
          {activeTrack === 'biology' ? (
            <div className="flex items-center gap-1 p-1 bg-emerald-50 border border-emerald-200 rounded-xl">
              <button
                type="button"
                onClick={() => setBioLabMode('coral')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  bioLabMode === 'coral'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-emerald-700 hover:text-emerald-950'
                }`}
              >
                01. مرونة شعاب البحر الأحمر
              </button>
              <button
                type="button"
                onClick={() => setBioLabMode('vascular')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  bioLabMode === 'vascular'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-emerald-700 hover:text-emerald-950'
                }`}
              >
                02. النقل الوعائي (الخشب واللحاء)
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 p-1 bg-sky-50 border border-sky-200 rounded-xl">
              <button
                type="button"
                onClick={() => setSpaceLabMode('orbit')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  spaceLabMode === 'orbit'
                    ? 'bg-white text-sky-800 shadow-2xs'
                    : 'text-sky-700 hover:text-sky-950'
                }`}
              >
                01. الميكانيكا المدارية للأقمار (LEO)
              </button>
              <button
                type="button"
                onClick={() => setSpaceLabMode('tectonics')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  spaceLabMode === 'tectonics'
                    ? 'bg-white text-sky-800 shadow-2xs'
                    : 'text-sky-700 hover:text-sky-950'
                }`}
              >
                02. تكتونية الدرع العربي والطاقة الحرارية
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two-Zone Sandbox Layout (65% Interactive Visual Stage / 35% Control & Concept Deck) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Zone A: Interactive Stage Canvas (8 columns on lg) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          {/* Stage Top Status Bar (Explicit text + symbol state, never hue-only) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? 'محاكي التكافل الحيوي والمرونة الحرارية لشعاب البحر الأحمر'
                    : 'محاكي النقل الوعائي (الخشب واللحاء) والجهد المائي في أشجار الغاف'
                  : spaceLabMode === 'orbit'
                  ? 'محاكي المدار الأرضي المنخفض (LEO) وأقمار الاستشعار الطيفي'
                  : 'محاكي تباعد الصفيحة العربية والطاقة الجيوحرارية في الحرات البركانية'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono-num">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? `6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂  |  pH = ${oceanPh}`
                    : `Ψw = Ψs + Ψp = ${waterPotentialMPa} MPa  |  J_xylem = ${xylemFlowRate} mL/h`
                  : spaceLabMode === 'orbit'
                  ? `v = √(G·M / r) = ${orbitalVelocityKmS} km/s  |  T = ${orbitalPeriodMin} min`
                  : `ΔL = v_spread × t  |  T_depth = ${subsurfaceTempC} °C`}
              </p>
            </div>

            <div
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${
                activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? coralState.tone
                    : vascularState.tone
                  : spaceLabMode === 'orbit'
                  ? orbitState.tone
                  : tectonicState.tone
              }`}
            >
              {activeTrack === 'biology'
                ? bioLabMode === 'coral'
                  ? coralState.code
                  : vascularState.code
                : spaceLabMode === 'orbit'
                ? orbitState.code
                : tectonicState.code}
            </div>
          </div>

          {/* Interactive SVG Visual Canvas */}
          <div className="my-4 bg-slate-900 rounded-xl p-4 overflow-hidden relative min-h-[340px] flex items-center justify-center">
            {activeTrack === 'biology' && bioLabMode === 'coral' && (
              <svg
                viewBox="0 0 720 320"
                className="w-full h-auto max-h-[340px]"
                role="img"
                aria-label="رسم تفاعلي يوضح بوليب المرجان وطحالب الزوزانثيلي ومنحنى كفاءة البناء الضوئي"
              >
                {/* Sea Background Gradient */}
                <defs>
                  <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0c4a6e" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                </defs>
                <rect width="720" height="320" rx="12" fill="url(#seaGrad)" />

                {/* Solar Light Rays */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={i}
                    x1={60 + i * 55}
                    y1={0}
                    x2={95 + i * 55}
                    y2={290}
                    stroke="#38bdf8"
                    strokeWidth={Math.max(1, solarIrradiance / 220)}
                    strokeOpacity={0.18}
                  />
                ))}

                {/* Left Side: Coral Polyp & Zooxanthellae Symbiosis */}
                <g transform="translate(30, 30)">
                  <rect
                    x="0"
                    y="0"
                    width="300"
                    height="260"
                    rx="10"
                    fill="#0f172a"
                    fillOpacity="0.65"
                    stroke="#1e293b"
                  />
                  <text
                    x="150"
                    y="26"
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    نسيج مرجان البحر الأحمر (كثافة الزوزانثيلي: {redSeaPhotosynthesis}%)
                  </text>

                  {/* Calcium Carbonate Skeleton Base */}
                  <path
                    d="M 40 230 Q 150 210 260 230 L 270 250 L 30 250 Z"
                    fill="#cbd5e1"
                  />
                  <text
                    x="150"
                    y="244"
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    هيكل كربونات الكالسيوم CaCO₃
                  </text>

                  {/* Coral Polyp Tentacles */}
                  {[-80, -50, -20, 10, 40, 70].map((offset, idx) => {
                    const coralColor =
                      waterTemp <= 30.8
                        ? '#10b981'
                        : waterTemp <= 32.2
                        ? '#f59e0b'
                        : '#f1f5f9';
                    return (
                      <g key={idx}>
                        <path
                          d={`M ${150 + offset} 220 Q ${
                            150 + offset + (isPlaying ? 8 : 0)
                          } 135 ${150 + offset * 1.15} 65`}
                          stroke={coralColor}
                          strokeWidth="18"
                          strokeLinecap="round"
                          fill="none"
                          opacity={0.85}
                        />
                        {/* Symbiotic Algae Cells (Zooxanthellae) inside coral */}
                        {Array.from({
                          length: Math.max(
                            1,
                            Math.round(redSeaPhotosynthesis / 20)
                          ),
                        }).map((__, cellIdx) => (
                          <circle
                            key={cellIdx}
                            cx={150 + offset}
                            cy={200 - cellIdx * 26}
                            r="4.5"
                            fill="#34d399"
                            stroke="#064e3b"
                            strokeWidth="1"
                          />
                        ))}
                      </g>
                    );
                  })}

                  {/* Oxygen Output Bubbles */}
                  {Array.from({
                    length: Math.max(2, Math.round(redSeaPhotosynthesis / 18)),
                  }).map((_, bIdx) => (
                    <g key={bIdx}>
                      <circle
                        cx={70 + bIdx * 36}
                        cy={50 - (bIdx % 2) * 12}
                        r="6"
                        fill="#38bdf8"
                        fillOpacity="0.85"
                      />
                      <text
                        x={70 + bIdx * 36}
                        y={53 - (bIdx % 2) * 12}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        O₂
                      </text>
                    </g>
                  ))}
                </g>

                {/* Right Side: Live Comparative Thermal Response Curve */}
                <g transform="translate(360, 30)">
                  <rect
                    x="0"
                    y="0"
                    width="330"
                    height="260"
                    rx="10"
                    fill="#0f172a"
                    fillOpacity="0.75"
                    stroke="#1e293b"
                  />
                  <text
                    x="165"
                    y="26"
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    منحنى كفاءة البناء الضوئي مقابل حرارة المياه
                  </text>

                  {/* Coordinate Axes */}
                  <line
                    x1="45"
                    y1="215"
                    x2="305"
                    y2="215"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="45"
                    y1="50"
                    x2="45"
                    y2="215"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />

                  {/* Axis Labels */}
                  <text x="175" y="242" textAnchor="middle" fill="#94a3b8" fontSize="11">
                    درجة حرارة المياه (°C) [24°C ── 34°C]
                  </text>
                  <text x="24" y="135" textAnchor="middle" fill="#94a3b8" fontSize="10">
                    %
                  </text>

                  {/* Red Sea Coral Curve (Emerald) */}
                  <path
                    d="M 45 75 Q 185 65 225 85 T 305 185"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  {/* Standard Tropical Coral Curve (Amber/Red dashed) */}
                  <path
                    d="M 45 80 Q 130 75 165 115 T 305 210"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                  />

                  {/* Current Operating Point Marker */}
                  {(() => {
                    const markerX = 45 + ((waterTemp - 24) / 10) * 260;
                    const markerY = 215 - (redSeaPhotosynthesis / 100) * 155;
                    return (
                      <g>
                        <line
                          x1={markerX}
                          y1="55"
                          x2={markerX}
                          y2="215"
                          stroke="#38bdf8"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={markerX}
                          cy={markerY}
                          r="6"
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={Math.min(275, Math.max(65, markerX))}
                          y={markerY - 12}
                          textAnchor="middle"
                          fill="#34d399"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {redSeaPhotosynthesis}% ({waterTemp}°C)
                        </text>
                      </g>
                    );
                  })()}

                  {/* Legend */}
                  <g transform="translate(55, 52)">
                    <line x1="0" y1="0" x2="18" y2="0" stroke="#10b981" strokeWidth="3" />
                    <text x="24" y="4" fill="#cbd5e1" fontSize="10">
                      شعاب البحر الأحمر المتكيفة
                    </text>
                    <line
                      x1="145"
                      y1="0"
                      x2="163"
                      y2="0"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    <text x="169" y="4" fill="#cbd5e1" fontSize="10">
                      شعاب استوائية قياسية
                    </text>
                  </g>
                </g>
              </svg>
            )}

            {activeTrack === 'biology' && bioLabMode === 'vascular' && (
              <svg
                viewBox="0 0 720 320"
                className="w-full h-auto max-h-[340px]"
                role="img"
                aria-label="رسم تفاعلي يوضح تدفق الماء في الخشب والسكروز في اللحاء مع فتحة الثغور الورقية"
              >
                <rect width="720" height="320" rx="12" fill="#0f172a" />

                {/* Left Column: Xylem & Phloem Vascular Bundle */}
                <g transform="translate(35, 25)">
                  <rect
                    x="0"
                    y="0"
                    width="320"
                    height="270"
                    rx="10"
                    fill="#1e293b"
                    stroke="#334155"
                  />
                  <text
                    x="160"
                    y="26"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    الحزمة الوعائية: الخشب (Xylem) واللحاء (Phloem)
                  </text>

                  {/* Xylem Vessel (Upward Water & Minerals - Cerulean Blue) */}
                  <rect
                    x="60"
                    y="45"
                    width="75"
                    height="200"
                    rx="6"
                    fill="#0c4a6e"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                  />
                  <text
                    x="97"
                    y="65"
                    textAnchor="middle"
                    fill="#7dd3fc"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    وعاء الخشب
                  </text>
                  {/* Upward Flow Arrows & Water Molecules */}
                  {[190, 150, 110].map((yPos, idx) => (
                    <g key={idx}>
                      <circle cx="97" cy={yPos} r="10" fill="#0284c7" />
                      <text
                        x="97"
                        y={yPos + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ↑ H₂O
                      </text>
                    </g>
                  ))}
                  <text
                    x="97"
                    y="235"
                    textAnchor="middle"
                    fill="#bae6fd"
                    fontSize="10"
                  >
                    {xylemFlowRate} mL/h
                  </text>

                  {/* Phloem Sieve Tube (Sucrose Transport - Golden Marigold) */}
                  <rect
                    x="185"
                    y="45"
                    width="75"
                    height="200"
                    rx="6"
                    fill="#422006"
                    stroke="#eab308"
                    strokeWidth="2"
                  />
                  <text
                    x="222"
                    y="65"
                    textAnchor="middle"
                    fill="#fde047"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    أنبوب اللحاء
                  </text>
                  {[105, 155, 200].map((yPos, idx) => (
                    <g key={idx}>
                      <circle cx="222" cy={yPos} r="10" fill="#ca8a04" />
                      <text
                        x="222"
                        y={yPos + 4}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        ↓ سكروز
                      </text>
                    </g>
                  ))}
                  {/* Lateral Osmotic Exchange Arrow */}
                  <path
                    d="M 140 135 L 180 135"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="160"
                    y="127"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                  >
                    أسموزية
                  </text>
                </g>

                {/* Right Column: Stomatal Guard Cells Aperture */}
                <g transform="translate(380, 25)">
                  <rect
                    x="0"
                    y="0"
                    width="305"
                    height="270"
                    rx="10"
                    fill="#1e293b"
                    stroke="#334155"
                  />
                  <text
                    x="152"
                    y="26"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    استجابة الخلايا الحارسة والثغور ({stomatalOpeningPct}%)
                  </text>

                  {/* Guard Cells Drawing */}
                  {(() => {
                    const gapWidth = (stomatalOpeningPct / 100) * 34;
                    return (
                      <g transform="translate(152, 135)">
                        {/* Left Guard Cell */}
                        <path
                          d={`M 0 -65 C -55 -55 -55 55 0 65 C ${-gapWidth} 35 ${-gapWidth} -35 0 -65`}
                          fill="#10b981"
                          stroke="#34d399"
                          strokeWidth="2.5"
                        />
                        {/* Right Guard Cell */}
                        <path
                          d={`M 0 -65 C 55 -55 55 55 0 65 C ${gapWidth} 35 ${gapWidth} -35 0 -65`}
                          fill="#10b981"
                          stroke="#34d399"
                          strokeWidth="2.5"
                        />
                        {/* Stomatal Pore Opening */}
                        <ellipse
                          cx="0"
                          cy="0"
                          rx={Math.max(2, gapWidth * 0.65)}
                          ry="38"
                          fill="#0f172a"
                        />
                      </g>
                    );
                  })()}

                  <text
                    x="152"
                    y="225"
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="11"
                  >
                    الجهد المائي للورقة: Ψw = {waterPotentialMPa} MPa
                  </text>
                  <text
                    x="152"
                    y="246"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    تركيز هرمون حمض الأبسيسيك (ABA): {abaHormoneLevel}%
                  </text>
                </g>
              </svg>
            )}

            {activeTrack === 'earth_space' && spaceLabMode === 'orbit' && (
              <svg
                viewBox="0 0 720 320"
                className="w-full h-auto max-h-[340px]"
                role="img"
                aria-label="رسم تفاعلي يوضح مدار القمر الاصطناعي حول الأرض وحزمة المسح الطيفي فوق الجزيرة العربية"
              >
                <rect width="720" height="320" rx="12" fill="#090d16" />

                {/* Starfield Dots */}
                {[
                  [45, 40],
                  [120, 80],
                  [210, 35],
                  [520, 50],
                  [640, 90],
                  [590, 260],
                  [90, 250],
                ].map(([sx, sy], i) => (
                  <circle key={i} cx={sx} cy={sy} r="1.5" fill="#94a3b8" />
                ))}

                {/* Left/Center: Earth & Orbital Ring */}
                <g transform="translate(215, 160)">
                  {/* Dynamic Orbital Path Ring */}
                  {(() => {
                    const orbitRx = 92 + ((orbitAltitude - 350) / 850) * 52;
                    return (
                      <g>
                        <circle
                          cx="0"
                          cy="0"
                          r={orbitRx}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1.8"
                          strokeDasharray="6 4"
                        />

                        {/* Earth Sphere */}
                        <circle
                          cx="0"
                          cy="0"
                          r="68"
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                        {/* Arabian Peninsula & Red Sea Stylized Landmass */}
                        <path
                          d="M -18 -22 L 15 -28 L 32 -5 L 18 24 L -5 20 L -15 -5 Z"
                          fill="#10b981"
                          opacity="0.85"
                        />

                        {/* Remote Sensing Swath Cone */}
                        <polygon
                          points={`0,${-orbitRx} ${
                            -14 * sensorSwathFactor
                          },-68 ${14 * sensorSwathFactor},-68`}
                          fill="#34d399"
                          fillOpacity="0.28"
                          stroke="#10b981"
                          strokeWidth="1"
                        />

                        {/* Satellite Icon at Top of Orbit */}
                        <g transform={`translate(0, ${-orbitRx})`}>
                          <rect
                            x="-22"
                            y="-5"
                            width="14"
                            height="10"
                            fill="#0ea5e9"
                            stroke="#e0f2fe"
                          />
                          <rect
                            x="8"
                            y="-5"
                            width="14"
                            height="10"
                            fill="#0ea5e9"
                            stroke="#e0f2fe"
                          />
                          <rect
                            x="-6"
                            y="-7"
                            width="12"
                            height="14"
                            rx="2"
                            fill="#f8fafc"
                          />
                          {/* Velocity Vector Arrow */}
                          <line
                            x1="28"
                            y1="0"
                            x2="68"
                            y2="0"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                          />
                          <text
                            x="48"
                            y="-8"
                            textAnchor="middle"
                            fill="#fde047"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            v = {orbitalVelocityKmS} km/s
                          </text>
                        </g>
                      </g>
                    );
                  })()}
                </g>

                {/* Right Side Telemetry & NDVI Coverage Card */}
                <g transform="translate(425, 28)">
                  <rect
                    x="0"
                    y="0"
                    width="265"
                    height="264"
                    rx="10"
                    fill="#0f172a"
                    stroke="#1e293b"
                  />
                  <text
                    x="132"
                    y="28"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    قراءات القمر الاصطناعي المدارية
                  </text>

                  <g transform="translate(20, 52)" fontSize="11" fill="#cbd5e1">
                    <text x="225" y="0" textAnchor="start">
                      نصف قطر المدار (r): {orbitalRadius} km
                    </text>
                    <text x="225" y="32" textAnchor="start">
                      السرعة المدارية (v): {orbitalVelocityKmS} km/s
                    </text>
                    <text x="225" y="64" textAnchor="start">
                      الزمن الدوري (T): {orbitalPeriodMin} دقيقة
                    </text>
                    <text x="225" y="96" textAnchor="start">
                      عرض حزمة التصوير: {groundSwathKm} km
                    </text>
                    <text x="225" y="128" textAnchor="start" fill="#34d399" fontWeight="bold">
                      الدقة المكانية الطيفية: {spatialResolutionM} m/pixel
                    </text>
                  </g>

                  <rect
                    x="20"
                    y="204"
                    width="225"
                    height="42"
                    rx="6"
                    fill="#064e3b"
                  />
                  <text
                    x="132"
                    y="229"
                    textAnchor="middle"
                    fill="#a7f3d0"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    تغطية مؤشر الغطاء النباتي (NDVI): نشطة
                  </text>
                </g>
              </svg>
            )}

            {activeTrack === 'earth_space' && spaceLabMode === 'tectonics' && (
              <svg
                viewBox="0 0 720 320"
                className="w-full h-auto max-h-[340px]"
                role="img"
                aria-label="رسم جيولوجي تفاعلي يوضح تباعد الصفيحة العربية عن الإفريقية وتوليد الطاقة الجيوحرارية"
              >
                <rect width="720" height="320" rx="12" fill="#0f172a" />

                {/* Upper Sky / Red Sea Trough Banner */}
                <text
                  x="360"
                  y="28"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="14"
                  fontWeight="bold"
                >
                  المقطع الجيولوجي: تباعد أخدود البحر الأحمر والدرع العربي (عرض الحوض: {riftOpeningWidthKm} km)
                </text>

                {/* Asthenosphere / Magma Mantle Base */}
                <rect x="30" y="210" width="660" height="85" rx="8" fill="#7c2d12" />
                <path
                  d="M 310 295 L 360 125 L 410 295 Z"
                  fill="#ea580c"
                />
                <text
                  x="360"
                  y="275"
                  textAnchor="middle"
                  fill="#fed7aa"
                  fontSize="12"
                  fontWeight="bold"
                >
                  اندفاع الصهارة البازلتية في وشاح الأرض (Asthenosphere Upwelling)
                </text>

                {/* Left Block: African / Nubian Plate */}
                <g
                  transform={`translate(${Math.max(
                    0,
                    25 - spreadingRate * 6
                  )}, 0)`}
                >
                  <polygon
                    points="30,115 290,115 265,210 30,210"
                    fill="#475569"
                    stroke="#94a3b8"
                  />
                  <text
                    x="150"
                    y="165"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    الصفيحة الإفريقية ←
                  </text>
                </g>

                {/* Right Block: Arabian Shield Plate & Geothermal Well */}
                <g
                  transform={`translate(${Math.min(
                    35,
                    spreadingRate * 6
                  )}, 0)`}
                >
                  <polygon
                    points="430,115 660,115 660,210 455,210"
                    fill="#334155"
                    stroke="#94a3b8"
                  />
                  {/* Harrat Volcanic Basalt Cap */}
                  <polygon
                    points="470,115 565,92 615,115"
                    fill="#1e293b"
                    stroke="#64748b"
                  />
                  <text
                    x="545"
                    y="84"
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    حرات الدرع العربي البركانية
                  </text>
                  <text
                    x="555"
                    y="165"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    → الصفيحة العربية ({spreadingRate} cm/yr)
                  </text>

                  {/* Geothermal Drill Well */}
                  <line
                    x1="520"
                    y1="100"
                    x2="520"
                    y2={115 + drillDepthKm * 20}
                    stroke="#38bdf8"
                    strokeWidth="4"
                  />
                  <circle
                    cx="520"
                    cy={115 + drillDepthKm * 20}
                    r="7"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="520"
                    y="62"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    محطة جيوحرارية: {geothermalPowerMW} MW ({subsurfaceTempC}°C)
                  </text>
                </g>

                {/* Red Sea Water Body in Center Rift */}
                <polygon
                  points="285,115 435,115 415,155 305,155"
                  fill="#0284c7"
                  fillOpacity="0.85"
                />
                <text
                  x="360"
                  y="140"
                  textAnchor="middle"
                  fill="#e0f2fe"
                  fontSize="11"
                  fontWeight="bold"
                >
                  حوض البحر الأحمر
                </text>
              </svg>
            )}
          </div>

          {/* Bottom Metrics Strip & Direct Reflection Export */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="block text-xs text-slate-500">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? 'كفاءة البناء الضوئي بالبحر الأحمر'
                    : 'الجهد المائي للورقة (Ψw)'
                  : spaceLabMode === 'orbit'
                  ? 'السرعة المدارية الخطية (v)'
                  : 'درجة حرارة الخزان الجوفي'}
              </span>
              <span className="mt-1 block text-lg font-extrabold text-slate-900 font-mono-num">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? `${redSeaPhotosynthesis}%`
                    : `${waterPotentialMPa} MPa`
                  : spaceLabMode === 'orbit'
                  ? `${orbitalVelocityKmS} km/s`
                  : `${subsurfaceTempC} °C`}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <span className="block text-xs text-slate-500">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? 'مقارنة بالشعاب غير المتكيفة'
                    : 'معدل تدفق أوعية الخشب'
                  : spaceLabMode === 'orbit'
                  ? 'الزمن الدوري وعرض المسح'
                  : 'القدرة الكهربائية الجيوحرارية'}
              </span>
              <span className="mt-1 block text-lg font-extrabold text-emerald-700 font-mono-num">
                {activeTrack === 'biology'
                  ? bioLabMode === 'coral'
                    ? `+${redSeaPhotosynthesis - standardCoralPhotosynthesis}% تفوق حيوي`
                    : `${xylemFlowRate} mL/h`
                  : spaceLabMode === 'orbit'
                  ? `${orbitalPeriodMin} min · ${groundSwathKm} km`
                  : `${geothermalPowerMW} MW`}
              </span>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={handleExportToReflection}
                className="w-full h-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>توثيق النتيجة في بطاقة تأمل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zone B: Parameter Control & Guided Stage Deck (4 columns on lg) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  لوحة التحكم بالمتغيرات
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>إيقاف مؤقت</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>تشغيل</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="إعادة الضبط للقيم القياسية"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </button>
              </div>
            </div>

            {/* Labeled Parameter Sliders with explicit numeric values and units */}
            <div className="mt-5 space-y-5">
              {activeTrack === 'biology' && bioLabMode === 'coral' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-water-temp">
                        درجة حرارة مياه البحر الأحمر:
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {waterTemp.toFixed(1)} °C
                      </span>
                    </div>
                    <input
                      id="slider-water-temp"
                      type="range"
                      min={25}
                      max={34}
                      step={0.2}
                      value={waterTemp}
                      onChange={(e) => setWaterTemp(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono-num mt-1">
                      <span>25.0 °C</span>
                      <span>30.8 °C (عتبة المرونة)</span>
                      <span>34.0 °C</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-irradiance">
                        شدة الإشعاع الضوئي النافذ:
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {solarIrradiance} W/m²
                      </span>
                    </div>
                    <input
                      id="slider-irradiance"
                      type="range"
                      min={300}
                      max={1100}
                      step={25}
                      value={solarIrradiance}
                      onChange={(e) =>
                        setSolarIrradiance(Number(e.target.value))
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-co2">
                        تركيز ثاني أكسيد الكربون المذاب:
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {co2Ppm} ppm (pH {oceanPh})
                      </span>
                    </div>
                    <input
                      id="slider-co2"
                      type="range"
                      min={380}
                      max={600}
                      step={5}
                      value={co2Ppm}
                      onChange={(e) => setCo2Ppm(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTrack === 'biology' && bioLabMode === 'vascular' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-desert-temp">
                        درجة حرارة الهواء المحيط:
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {desertTemp} °C
                      </span>
                    </div>
                    <input
                      id="slider-desert-temp"
                      type="range"
                      min={20}
                      max={48}
                      step={1}
                      value={desertTemp}
                      onChange={(e) => setDesertTemp(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-soil-moisture">
                        محتوى رطوبة التربة الجذرية:
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {soilMoisture}%
                      </span>
                    </div>
                    <input
                      id="slider-soil-moisture"
                      type="range"
                      min={15}
                      max={90}
                      step={5}
                      value={soilMoisture}
                      onChange={(e) => setSoilMoisture(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-aba">
                        استجابة هرمون حمض الأبسيسيك (ABA):
                      </label>
                      <span className="font-mono-num text-emerald-700">
                        {abaHormoneLevel}%
                      </span>
                    </div>
                    <input
                      id="slider-aba"
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={abaHormoneLevel}
                      onChange={(e) =>
                        setAbaHormoneLevel(Number(e.target.value))
                      }
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTrack === 'earth_space' && spaceLabMode === 'orbit' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-altitude">
                        الارتفاع المداري للقمر الاصطناعي (h):
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {orbitAltitude} km
                      </span>
                    </div>
                    <input
                      id="slider-altitude"
                      type="range"
                      min={350}
                      max={1200}
                      step={25}
                      value={orbitAltitude}
                      onChange={(e) =>
                        setOrbitAltitude(Number(e.target.value))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-inclination">
                        زاوية الميل المداري المتزامن شمسياً:
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {orbitInclination.toFixed(1)}°
                      </span>
                    </div>
                    <input
                      id="slider-inclination"
                      type="range"
                      min={28}
                      max={99}
                      step={0.2}
                      value={orbitInclination}
                      onChange={(e) =>
                        setOrbitInclination(Number(e.target.value))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-swath">
                        معامل زاوية الماسح الطيفي المتعدد:
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {sensorSwathFactor.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      id="slider-swath"
                      type="range"
                      min={0.8}
                      max={1.8}
                      step={0.1}
                      value={sensorSwathFactor}
                      onChange={(e) =>
                        setSensorSwathFactor(Number(e.target.value))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </>
              )}

              {activeTrack === 'earth_space' && spaceLabMode === 'tectonics' && (
                <>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-spreading">
                        معدل التباعد التكتوني للصفيحة العربية:
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {spreadingRate.toFixed(1)} cm/year
                      </span>
                    </div>
                    <input
                      id="slider-spreading"
                      type="range"
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      value={spreadingRate}
                      onChange={(e) =>
                        setSpreadingRate(Number(e.target.value))
                      }
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-time-myr">
                        الفترة الزمنية الجيولوجية المحاكاة:
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {timeMillions} مليون سنة
                      </span>
                    </div>
                    <input
                      id="slider-time-myr"
                      type="range"
                      min={2}
                      max={25}
                      step={1}
                      value={timeMillions}
                      onChange={(e) => setTimeMillions(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <label htmlFor="slider-drill-depth">
                        عمق البئر الحراري الأرضي في الحرة:
                      </label>
                      <span className="font-mono-num text-sky-700">
                        {drillDepthKm.toFixed(1)} km
                      </span>
                    </div>
                    <input
                      id="slider-drill-depth"
                      type="range"
                      min={1.5}
                      max={5.0}
                      step={0.5}
                      value={drillDepthKm}
                      onChange={(e) => setDrillDepthKm(Number(e.target.value))}
                      className="w-full accent-sky-600 cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Guided Stage Presets & Scientific Context Note */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-800 mb-2">
              مراحل الاستقصاء الموجه (سيناريوهات جاهزة):
            </span>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-right"
              >
                <span className="block font-bold text-slate-900">
                  المرحلة 1: الاتزان الطبيعي
                </span>
                <span className="text-[11px] text-slate-500">
                  الظروف المرجعية المستقرة
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeTrack === 'biology') {
                    if (bioLabMode === 'coral') {
                      setWaterTemp(31.4);
                      setSolarIrradiance(950);
                      setCo2Ppm(460);
                    } else {
                      setDesertTemp(45);
                      setSoilMoisture(25);
                      setAbaHormoneLevel(90);
                    }
                  } else {
                    if (spaceLabMode === 'orbit') {
                      setOrbitAltitude(450);
                      setSensorSwathFactor(1.5);
                    } else {
                      setSpreadingRate(2.4);
                      setDrillDepthKm(4.5);
                    }
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-right"
              >
                <span className="block font-bold text-emerald-700">
                  المرحلة 2: اختبار الذروة
                </span>
                <span className="text-[11px] text-slate-500">
                  محاكاة الإجهاد أو الدقة القصوى
                </span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">
                تفسير الملاحظة العلمية:
              </strong>
              {activeTrack === 'biology'
                ? bioLabMode === 'coral'
                  ? 'تمتلك شعاب البحر الأحمر طفرات تكيفية في جينات الصدمة الحرارية ولدى طحالبها التكافلية تمنحها صموداً استثنائياً حتى ~31°C، وهو ما يجعلها أمل العلماء لإعادة تأهيل الشعاب عالمياً.'
                  : 'عند ارتفاع الحرارة في الصحراء، يفرز النبات هرمون حمض الأبسيسيك (ABA) لتضييق فتحة الثغور جزئياً، مما يمنع انقطاع عمود الماء داخل أوعية الخشب ويحفظ الحياة النباتية.'
                : spaceLabMode === 'orbit'
                ? 'كلما انخفض مدار القمر الاصطناعي زادت سرعته المدارية اللازمة لموازنة الجاذبية الأرضية، وارتفعت الدقة المكانية لرصد مشاريع التشجير في مبادرة السعودية الخضراء.'
                : 'يؤدي تباعد الصفيحة العربية عن الإفريقية إلى ترقق القشرة الأرضية وصعود الماغما، مما يرفع التدرج الحراري في حرات الدرع العربي ويجعلها مصدراً واعداً للطاقة الجيوحرارية النظيفة.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
