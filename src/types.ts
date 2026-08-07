export interface EmotionCard {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  dot: string; // calendar dot color
  direction?: number; // 1 = positive, -1 = negative (used for stats trend). Defaults to -1.
}

export interface MoodAnswer {
  question: string;
  answer: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  emotion: string; // references EmotionCard.id
  intensity: number; // 1–5
  answers: MoodAnswer[];
  note?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  active: boolean;
}

export interface HospitalVisit {
  id: string;
  date: string;
  memo: string;
  nextAppointment?: string;
}

export interface Diagnosis {
  id: string;
  name: string;
}

export type DocumentType = '조제내역서' | '진단서' | '처방전' | '영수증' | '기타';

export interface MedicalDocument {
  id: string;
  type: DocumentType;
  date: string;
  imageDataUrl: string;
  memo?: string;
}

export interface HospitalData {
  diagnoses: Diagnosis[];
  medications: Medication[];
  visits: HospitalVisit[];
  documents: MedicalDocument[];
}

export interface TherapySession {
  id: string;
  sessionNumber: number;
  date: string;
  topics: string;
  notes: string;
  nextSessionDate?: string;
  homework?: string;
}

export interface TherapyProgram {
  id: string;
  therapistName: string;
  institution: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  sessions: TherapySession[];
  nextAppointment?: string;
}

export interface AppData {
  moodEntries: MoodEntry[];
  emotionCards: EmotionCard[];
  hospital: HospitalData;
  therapyPrograms: TherapyProgram[];
}
