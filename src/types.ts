export type SubjectTrack = 'biology' | 'earth_space';

export type ThinkingLevel =
  | 'تحليل نقدي'
  | 'استقصاء علمي'
  | 'ابتكار مستقبلي'
  | 'ربط برؤية 2030';

export interface StudentReflection {
  id: string;
  serialNumber: string;
  studentName: string;
  gradeOrRole: string;
  schoolOrClub: string;
  track: SubjectTrack;
  topicTitle: string;
  thinkingLevel: ThinkingLevel;
  reflectionText: string;
  empiricalFinding: string;
  vision2030Commitment: string;
  createdAt: string;
  endorsements: number;
}

export interface SimulationStage {
  stageNumber: number;
  title: string;
  summary: string;
  presetValues: Record<string, number>;
  scientificEquation: string;
  observationPrompt: string;
}

export interface SimulationModule {
  id: string;
  track: SubjectTrack;
  title: string;
  subtitle: string;
  visionConnection: string;
  stages: SimulationStage[];
}

export interface CurriculumTopic {
  id: string;
  track: SubjectTrack;
  unitNumber: string;
  title: string;
  coreConcept: string;
  keyEquationOrMetric: string;
  saudiContextExample: string;
  interactiveQuestion: string;
  reflectionPrompt: string;
}

export interface DiagnosticQuestion {
  id: string;
  track: SubjectTrack;
  thinkingLevel: ThinkingLevel;
  question: string;
  scenarioContext: string;
  options: string[];
  correctIndex: number;
  scientificExplanation: string;
}
