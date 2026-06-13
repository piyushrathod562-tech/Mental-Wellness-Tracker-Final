export interface JournalAnalysis {
  triggers: string[];
  patterns: string[];
  copingStrategies: string[];
  mindfulnessExercises: string[];
  toneExplanation: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  text: string;
  examType: 'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'CA' | 'OTHER';
  moodRating: number; // 1 to 5
  analysis?: JournalAnalysis;
  isCrisis?: boolean;
}

export interface SecurityMetric {
  anonymizationApplied: boolean;
  sanitizationApplied: boolean;
  crisisFilterChecked: boolean;
  rateLimitChecked: boolean;
}

export interface AnalysisResponse {
  entry: JournalEntry;
  security: SecurityMetric;
}
