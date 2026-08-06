import { useState } from 'react';
import type { AppData, MoodEntry, EmotionKey } from '../types';
import { EMOTIONS, EMOTION_MAP, MOOD_QUESTIONS } from '../emotions';

interface Props {
  data: AppData;
  onUpdate: (d: AppData) => void;
  onGoTo: (tab: string) => void;
}

type Step = 'select' | 'detail' | 'done';

function MoodSheet({ emotion, onClose, onSave }: {
  emotion: EmotionKey;
  onClose: () => void;
  onSave: (entry: Omit<MoodEntry, 'id' | 'date'>) => void;
}) {
  const def = EMOTION_MAP[emotion];
  const [step, setStep] = useState<Step>('select');
  const [intensity, setIntensity] = useState(3);
  const [answers, setAnswers] = useState<string[]>(MOOD_QUESTIONS.map(() => ''));
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave({
      emotion,
      intensity,
      answers: MOOD_QUESTIONS.map((q, i) => ({ question: q.question, answer: answers[i] })).filter(a => a.answer.trim()),
      note: note.trim() || undefined,
    });
    setStep('done');
    setTimeout(onClose, 1400);
  };

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="text-5xl">✅</div>
        <p className="text-lg font-bold text-[#2A2730]">기록됐어요</p>
        <p className="text-sm text-[#9B94A8]">오늘도 감정을 들여다봐 줘서 잘했어요.</p>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: def.bg }}>
            {def.emoji}
          </div>
          <div>
            <p className="text-xs text-[#9B94A8] font-semibold uppercase tracking-wider">선택한 감정</p>
            <p className="text-xl font-bold" style={{ color: def.color }}>{def.label}</p>
          </div>
        </div>

        <p className="text-sm font-semibold text-[#2A2730] mb-3">이 감정이 얼마나 강한가요?</p>
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setIntensity(n)}
              className="flex-1 h-12 rounded-xl font-bold text-sm transition-all"
              style={{
                background: intensity >= n ? def.bg : '#F2EFED',
                color: intensity >= n ? def.color : '#C0BAB8',
                border: intensity === n ? `2px solid ${def.color}` : '2px solid transparent',
                transform: intensity === n ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#9B94A8] mb-8 px-1">
          <span>약하게</span><span>매우 강하게</span>
        </div>

        <button
          onClick={() => setStep('detail')}
          className="w-full h-14 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
          style={{ background: def.color }}
        >
          다음 →
        </button>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: def.bg }}>
          {def.emoji}
        </div>
        <p className="text-base font-bold text-[#2A2730]">{def.label} · 강도 {intensity}/5</p>
      </div>

      <div className="space-y-4 mb-5">
        {MOOD_QUESTIONS.map((q, i) => (
          <div key={q.id}>
            <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">{q.question}</label>
            <textarea
              rows={2}
              placeholder={q.placeholder}
              value={answers[i]}
              onChange={e => setAnswers(prev => { const a = [...prev]; a[i] = e.target.value; return a; })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none transition-all"
              style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
              onFocus={e => { e.target.style.borderColor = def.color; e.target.style.background = def.bg; }}
              onBlur={e => { e.target.style.borderColor = '#E8E3DD'; e.target.style.background = '#F7F4F0'; }}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">자유롭게 적어요 (선택)</label>
          <textarea
            rows={3}
            placeholder="지금 마음에 있는 것을 자유롭게 적어보세요..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none transition-all"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
            onFocus={e => { e.target.style.borderColor = def.color; e.target.style.background = def.bg; }}
            onBlur={e => { e.target.style.borderColor = '#E8E3DD'; e.target.style.background = '#F7F4F0'; }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full h-14 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
        style={{ background: def.color }}
      >
        기록 저장하기
      </button>
    </>
  );
}

function QuickVisitSheet({ onClose, onSave }: { onClose: () => void; onSave: (memo: string, next?: string) => void }) {
  const [memo, setMemo] = useState('');
  const [next, setNext] = useState('');

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-blue-50">🏥</div>
        <div>
          <p className="text-xs text-[#9B94A8] font-semibold uppercase tracking-wider">병원 진료 메모</p>
          <p className="text-xl font-bold text-[#2A2730]">오늘 진료 기록</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">진료 내용 / 메모</label>
          <textarea
            rows={5}
            placeholder="의사 선생님이 하신 말씀, 처방 변경 내용, 다음에 꼭 말하고 싶은 것 등..."
            value={memo}
            onChange={e => setMemo(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">다음 진료 예정일 (선택)</label>
          <input
            type="date"
            value={next}
            onChange={e => setNext(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
      </div>

      <button
        onClick={() => { if (memo.trim()) { onSave(memo.trim(), next || undefined); onClose(); } }}
        disabled={!memo.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-40"
        style={{ background: '#4A7CCC' }}
      >
        저장하기
      </button>
    </>
  );
}

function QuickTherapySheet({ onClose, onSave }: { onClose: () => void; onSave: (topics: string, notes: string, next?: string, hw?: string) => void }) {
  const [topics, setTopics] = useState('');
  const [notes, setNotes] = useState('');
  const [next, setNext] = useState('');
  const [hw, setHw] = useState('');

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-purple-50">💬</div>
        <div>
          <p className="text-xs text-[#9B94A8] font-semibold uppercase tracking-wider">심리 상담 기록</p>
          <p className="text-xl font-bold text-[#2A2730]">오늘 상담 기록</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">오늘 다룬 주제</label>
          <input
            type="text"
            placeholder="가족 관계, 직장 스트레스, 자기 비판..."
            value={topics}
            onChange={e => setTopics(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담 내용 메모</label>
          <textarea
            rows={4}
            placeholder="오늘 상담에서 이야기한 것, 느낀 것, 기억하고 싶은 것..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">숙제 / 과제 (선택)</label>
          <input
            type="text"
            placeholder="다음 상담까지 해볼 것..."
            value={hw}
            onChange={e => setHw(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">다음 상담 예정일 (선택)</label>
          <input
            type="date"
            value={next}
            onChange={e => setNext(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] outline-none"
            style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }}
          />
        </div>
      </div>

      <button
        onClick={() => { if (notes.trim()) { onSave(topics.trim(), notes.trim(), next || undefined, hw.trim() || undefined); onClose(); } }}
        disabled={!notes.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base transition-all active:scale-95 disabled:opacity-40"
        style={{ background: '#7C6BE8' }}
      >
        저장하기
      </button>
    </>
  );
}

interface SheetProps { children: React.ReactNode; onClose: () => void; }
function Sheet({ children, onClose }: SheetProps) {
  return (
    <div className="fixed inset-0 z-50 fade-in" style={{ background: 'rgba(42,39,48,0.5)' }} onClick={onClose}>
      <div
        className="absolute bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl bg-white p-6 pb-10 max-h-[90vh] overflow-y-auto sheet-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#E8E3DD] mx-auto mb-6" />
        {children}
      </div>
    </div>
  );
}

export default function Home({ data, onUpdate, onGoTo }: Props) {
  const [activeEmotion, setActiveEmotion] = useState<EmotionKey | null>(null);
  const [showVisit, setShowVisit] = useState(false);
  const [showTherapy, setShowTherapy] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = data.moodEntries.filter(e => e.date.startsWith(todayStr));

  const activeProgram = data.therapyPrograms.find(p => p.active);
  const nextVisit = data.hospital.visits[0]?.nextAppointment;
  const nextTherapy = activeProgram?.nextAppointment;

  const formatDateRelative = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const diff = Math.ceil((d.getTime() - today.setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return '오늘';
    if (diff === 1) return '내일';
    if (diff > 0) return `${diff}일 후`;
    return `${Math.abs(diff)}일 전`;
  };

  const handleSaveMood = (entry: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...entry,
    };
    onUpdate({ ...data, moodEntries: [newEntry, ...data.moodEntries] });
  };

  const handleSaveVisit = (memo: string, next?: string) => {
    const newVisit = { id: crypto.randomUUID(), date: new Date().toISOString(), memo, nextAppointment: next };
    onUpdate({ ...data, hospital: { ...data.hospital, visits: [newVisit, ...data.hospital.visits] } });
  };

  const handleSaveTherapy = (topics: string, notes: string, next?: string, hw?: string) => {
    if (!activeProgram) return;
    const maxNum = activeProgram.sessions.reduce((m, s) => Math.max(m, s.sessionNumber), 0);
    const newSession = {
      id: crypto.randomUUID(),
      sessionNumber: maxNum + 1,
      date: new Date().toISOString().split('T')[0],
      topics, notes,
      nextSessionDate: next,
      homework: hw,
    };
    const updatedProgram = {
      ...activeProgram,
      sessions: [...activeProgram.sessions, newSession],
      nextAppointment: next || activeProgram.nextAppointment,
    };
    onUpdate({
      ...data,
      therapyPrograms: data.therapyPrograms.map(p => p.id === activeProgram.id ? updatedProgram : p),
    });
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? '좋은 아침이에요' : hour < 18 ? '안녕하세요' : '오늘 하루 어떠셨나요';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-sm text-[#9B94A8] font-semibold">{greeting} 👋</p>
        <h1 className="text-2xl font-black text-[#2A2730]" style={{ fontFamily: "'DM Serif Display', serif" }}>
          지금 어떤 감정인가요?
        </h1>

        {/* Upcoming appointments strip */}
        {(nextVisit || nextTherapy) && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {nextVisit && (
              <button onClick={() => onGoTo('hospital')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95" style={{ background: '#E8F0FF', color: '#2C5282' }}>
                🏥 진료 {formatDateRelative(nextVisit)}
              </button>
            )}
            {nextTherapy && (
              <button onClick={() => onGoTo('therapy')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95" style={{ background: '#EDE9FF', color: '#5541C0' }}>
                💬 상담 {formatDateRelative(nextTherapy)}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Today's entries */}
        {todayEntries.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider mb-2">오늘 기록</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {todayEntries.map(e => {
                const def = EMOTION_MAP[e.emotion];
                return (
                  <div key={e.id} className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0" style={{ background: def.bg }}>
                    <span className="text-base">{def.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: def.color }}>{def.label}</span>
                    <span className="text-xs font-semibold" style={{ color: def.color, opacity: 0.6 }}>{'●'.repeat(e.intensity)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Emotion grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {EMOTIONS.map(emotion => (
            <button
              key={emotion.key}
              onClick={() => setActiveEmotion(emotion.key)}
              className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl transition-all active:scale-95"
              style={{ background: emotion.bg }}
            >
              <span className="text-3xl">{emotion.emoji}</span>
              <span className="text-xs font-bold leading-tight text-center" style={{ color: emotion.color }}>
                {emotion.label}
              </span>
            </button>
          ))}
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setShowVisit(true)}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95"
            style={{ background: '#EBF3FF' }}
          >
            <span className="text-2xl">🏥</span>
            <div>
              <p className="text-sm font-bold text-[#1E3A6E]">진료 메모</p>
              <p className="text-xs text-[#4A6FA5]">진료 직후 기록</p>
            </div>
          </button>
          <button
            onClick={activeProgram ? () => setShowTherapy(true) : () => onGoTo('therapy')}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-95"
            style={{ background: '#EDE9FF' }}
          >
            <span className="text-2xl">💬</span>
            <div>
              <p className="text-sm font-bold text-[#3B2D8F]">상담 기록</p>
              <p className="text-xs text-[#6B5CC4]">상담 직후 기록</p>
            </div>
          </button>
        </div>

        {/* Recent mood entries */}
        {data.moodEntries.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider mb-3">최근 기록</p>
            <div className="space-y-2">
              {data.moodEntries.slice(0, 5).map(entry => {
                const def = EMOTION_MAP[entry.emotion];
                const d = new Date(entry.date);
                const dateLabel = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
                return (
                  <div key={entry.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: def.bg }}>
                      {def.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold" style={{ color: def.color }}>{def.label}</span>
                        <span className="text-xs text-[#9B94A8]">{dateLabel}</span>
                      </div>
                      {entry.note && (
                        <p className="text-xs text-[#6B6470] mt-0.5 line-clamp-2">{entry.note}</p>
                      )}
                      {!entry.note && entry.answers[0] && (
                        <p className="text-xs text-[#6B6470] mt-0.5 line-clamp-1">{entry.answers[0].answer}</p>
                      )}
                    </div>
                    <div className="flex gap-0.5 pt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < entry.intensity ? def.dot : '#E8E3DD' }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sheets */}
      {activeEmotion && (
        <Sheet onClose={() => setActiveEmotion(null)}>
          <MoodSheet
            emotion={activeEmotion}
            onClose={() => setActiveEmotion(null)}
            onSave={handleSaveMood}
          />
        </Sheet>
      )}
      {showVisit && (
        <Sheet onClose={() => setShowVisit(false)}>
          <QuickVisitSheet onClose={() => setShowVisit(false)} onSave={handleSaveVisit} />
        </Sheet>
      )}
      {showTherapy && (
        <Sheet onClose={() => setShowTherapy(false)}>
          <QuickTherapySheet onClose={() => setShowTherapy(false)} onSave={handleSaveTherapy} />
        </Sheet>
      )}
    </div>
  );
}
