import type { EmotionCard } from './types';

export const DEFAULT_EMOTION_CARDS: EmotionCard[] = [
  { id: 'happy',     label: '행복해요',     emoji: '😄', color: '#92650A', bg: '#FFF3CC', dot: '#F5C400', direction: 1 },
  { id: 'calm',      label: '평온해요',     emoji: '😌', color: '#1E6F50', bg: '#D6F5E5', dot: '#4CAF88', direction: 1 },
  { id: 'elevated',  label: '들떠요',       emoji: '✨', color: '#7B4F00', bg: '#FFF8E0', dot: '#FFB830', direction: 1 },
  { id: 'sad',       label: '슬퍼요',       emoji: '😢', color: '#2C5282', bg: '#E8F0FF', dot: '#6B93D6', direction: -1 },
  { id: 'anxious',   label: '불안해요',     emoji: '😰', color: '#A0410A', bg: '#FFF0E5', dot: '#F07030', direction: -1 },
  { id: 'angry',     label: '화나요',       emoji: '😤', color: '#B52B27', bg: '#FFECEC', dot: '#E55250', direction: -1 },
  { id: 'depressed', label: '우울해요',     emoji: '😔', color: '#364F6B', bg: '#EBF0F7', dot: '#607B9E', direction: -1 },
  { id: 'lethargic', label: '무기력해요',   emoji: '😴', color: '#6B6360', bg: '#F2EFED', dot: '#A09898', direction: -1 },
  { id: 'irritated', label: '짜증나요',     emoji: '😒', color: '#9E3A00', bg: '#FFF1EC', dot: '#E0723A', direction: -1 },
  { id: 'lonely',    label: '외로워요',     emoji: '🥺', color: '#2A567A', bg: '#E5F2FA', dot: '#5A90B8', direction: -1 },
  { id: 'confused',  label: '혼란스러워요', emoji: '🌀', color: '#5E349C', bg: '#F2EAFF', dot: '#9B6FD4', direction: -1 },
  { id: 'fearful',   label: '무서워요',     emoji: '😨', color: '#503080', bg: '#EDE5FF', dot: '#8060C0', direction: -1 },
];

export const FALLBACK_EMOTION_CARD: EmotionCard = {
  id: '__deleted__',
  label: '삭제된 감정',
  emoji: '❔',
  color: '#8A8390',
  bg: '#EDEAE6',
  dot: '#C5BFC8',
  direction: -1,
};

export function emotionMapOf(cards: EmotionCard[]): Record<string, EmotionCard> {
  return Object.fromEntries(cards.map(c => [c.id, c]));
}

export function getEmotionCard(cards: EmotionCard[], id: string): EmotionCard {
  return cards.find(c => c.id === id) ?? { ...FALLBACK_EMOTION_CARD, id };
}

export const MOOD_QUESTIONS = [
  { id: 'when',    question: '이 감정이 언제부터 시작됐나요?', placeholder: '아침부터, 특정 사건 이후, 잘 모르겠음...' },
  { id: 'sleep',   question: '어젯밤 수면은 어떠셨나요?',     placeholder: '몇 시간 잤는지, 잘 잤는지 못 잤는지...' },
  { id: 'trigger', question: '무슨 일이 있었나요? (선택)',     placeholder: '감정의 원인이 된 상황이나 생각...' },
  { id: 'body',    question: '몸 상태는 어떤가요? (선택)',     placeholder: '두통, 가슴 답답함, 피로감, 괜찮다...' },
];
