import type { EmotionKey } from './types';

export interface EmotionDef {
  key: EmotionKey;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  dot: string; // calendar dot color
}

export const EMOTIONS: EmotionDef[] = [
  { key: 'happy',     label: '행복해요',     emoji: '😄', color: '#92650A', bg: '#FFF3CC', dot: '#F5C400' },
  { key: 'calm',      label: '평온해요',     emoji: '😌', color: '#1E6F50', bg: '#D6F5E5', dot: '#4CAF88' },
  { key: 'elevated',  label: '들떠요',       emoji: '✨', color: '#7B4F00', bg: '#FFF8E0', dot: '#FFB830' },
  { key: 'sad',       label: '슬퍼요',       emoji: '😢', color: '#2C5282', bg: '#E8F0FF', dot: '#6B93D6' },
  { key: 'anxious',   label: '불안해요',     emoji: '😰', color: '#A0410A', bg: '#FFF0E5', dot: '#F07030' },
  { key: 'angry',     label: '화나요',       emoji: '😤', color: '#B52B27', bg: '#FFECEC', dot: '#E55250' },
  { key: 'depressed', label: '우울해요',     emoji: '😔', color: '#364F6B', bg: '#EBF0F7', dot: '#607B9E' },
  { key: 'lethargic', label: '무기력해요',   emoji: '😴', color: '#6B6360', bg: '#F2EFED', dot: '#A09898' },
  { key: 'irritated', label: '짜증나요',     emoji: '😒', color: '#9E3A00', bg: '#FFF1EC', dot: '#E0723A' },
  { key: 'lonely',    label: '외로워요',     emoji: '🥺', color: '#2A567A', bg: '#E5F2FA', dot: '#5A90B8' },
  { key: 'confused',  label: '혼란스러워요', emoji: '🌀', color: '#5E349C', bg: '#F2EAFF', dot: '#9B6FD4' },
  { key: 'fearful',   label: '무서워요',     emoji: '😨', color: '#503080', bg: '#EDE5FF', dot: '#8060C0' },
];

export const EMOTION_MAP = Object.fromEntries(
  EMOTIONS.map(e => [e.key, e])
) as Record<EmotionKey, EmotionDef>;

export const MOOD_QUESTIONS = [
  { id: 'when',    question: '이 감정이 언제부터 시작됐나요?', placeholder: '아침부터, 특정 사건 이후, 잘 모르겠음...' },
  { id: 'sleep',   question: '어젯밤 수면은 어떠셨나요?',     placeholder: '몇 시간 잤는지, 잘 잤는지 못 잤는지...' },
  { id: 'trigger', question: '무슨 일이 있었나요? (선택)',     placeholder: '감정의 원인이 된 상황이나 생각...' },
  { id: 'body',    question: '몸 상태는 어떤가요? (선택)',     placeholder: '두통, 가슴 답답함, 피로감, 괜찮다...' },
];
