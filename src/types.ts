export type EmotionKey =
  | 'happy' | 'calm' | 'sad' | 'anxious' | 'angry'
  | 'depressed' | 'lethargic' | 'confused' | 'irritated'
  | 'lonely' | 'elevated' | 'fearful';

export interface MoodAnswer {
  question: string;
  answer: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  emotion: EmotionKey;
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

export interface HospitalData {
  diagnoses: string[];
  medications: Medication[];
  visits: HospitalVisit[];
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
  hospital: HospitalData;
  therapyPrograms: TherapyProgram[];
}
