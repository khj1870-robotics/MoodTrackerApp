import type { EmotionCard, MoodEntry } from '../types';
import { getEmotionCard } from '../emotions';

interface Props {
  entry: MoodEntry;
  emotionCards: EmotionCard[];
  onClose: () => void;
}

export default function MoodEntryDetail({ entry, emotionCards, onClose }: Props) {
  const def = getEmotionCard(emotionCards, entry.emotion);
  const date = new Date(entry.date).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: def.bg }}>
          {def.emoji}
        </div>
        <div>
          <p className="text-xs text-[#9B94A8] font-semibold">{date}</p>
          <p className="text-xl font-bold" style={{ color: def.color }}>{def.label}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-5">
        <span className="text-xs font-semibold text-[#9B94A8] mr-2">감정 강도</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < entry.intensity ? def.dot : '#E8E3DD' }} />
        ))}
        <span className="text-xs font-bold text-[#9B94A8] ml-1">{entry.intensity}/5</span>
      </div>

      {entry.answers.length > 0 && (
        <div className="space-y-3 mb-4">
          {entry.answers.map((a, i) => (
            <div key={i} className="bg-[#F7F4F0] rounded-2xl p-4">
              <p className="text-xs font-bold text-[#9B94A8] mb-1.5">{a.question}</p>
              <p className="text-sm text-[#2A2730] leading-relaxed whitespace-pre-wrap">{a.answer}</p>
            </div>
          ))}
        </div>
      )}

      {entry.note && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: def.bg }}>
          <p className="text-xs font-bold mb-1.5" style={{ color: def.color }}>자유 메모</p>
          <p className="text-sm text-[#2A2730] leading-relaxed whitespace-pre-wrap">{entry.note}</p>
        </div>
      )}

      <button onClick={onClose} className="w-full h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>
        닫기
      </button>
    </>
  );
}
