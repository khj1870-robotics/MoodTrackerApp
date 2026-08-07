import { useState } from 'react';
import type { AppData, TherapyProgram, TherapySession } from '../types';
import Sheet from '../components/Sheet';
import FullPage from '../components/FullPage';

interface Props {
  data: AppData;
  onUpdate: (d: AppData) => void;
}

function AddSessionSheet({ program, onClose, onSave }: {
  program: TherapyProgram;
  onClose: () => void;
  onSave: (s: Omit<TherapySession, 'id' | 'sessionNumber'>) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topics, setTopics] = useState('');
  const [notes, setNotes] = useState('');
  const [hw, setHw] = useState('');
  const [next, setNext] = useState('');

  const nextNum = program.sessions.reduce((m, s) => Math.max(m, s.sessionNumber), 0) + 1;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-purple-50">💬</div>
        <div>
          <p className="text-xs text-[#9B94A8] font-semibold">{program.therapistName} · 제{nextNum}회기</p>
          <p className="text-lg font-black text-[#2A2730]">상담 기록 추가</p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담일</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">오늘 다룬 주제</label>
          <input value={topics} onChange={e => setTopics(e.target.value)} placeholder="가족 관계, 직장 스트레스, 자기 비판..." className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담 내용 메모</label>
          <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="오늘 상담에서 이야기한 것, 느낀 것, 기억하고 싶은 것..." className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">숙제 / 과제 (선택)</label>
          <input value={hw} onChange={e => setHw(e.target.value)} placeholder="다음 상담까지 해볼 것..." className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">다음 상담 예정일 (선택)</label>
          <input type="date" value={next} onChange={e => setNext(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
      </div>
      <button
        onClick={() => { if (notes.trim()) { onSave({ date, topics: topics.trim(), notes: notes.trim(), homework: hw.trim() || undefined, nextSessionDate: next || undefined }); onClose(); } }}
        disabled={!notes.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#7C6BE8' }}
      >
        기록 저장하기
      </button>
    </>
  );
}

function AddProgramSheet({ onClose, onSave }: {
  onClose: () => void;
  onSave: (p: Omit<TherapyProgram, 'id' | 'sessions'>) => void;
}) {
  const [therapist, setTherapist] = useState('');
  const [institution, setInstitution] = useState('');
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);
  const [next, setNext] = useState('');

  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">새 상담 등록</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담사 이름</label>
          <input value={therapist} onChange={e => setTherapist(e.target.value)} placeholder="예: 김지은 선생님" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담 기관</label>
          <input value={institution} onChange={e => setInstitution(e.target.value)} placeholder="예: 마음채 심리상담센터" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">상담 시작일</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">다음 상담 예정일 (선택)</label>
          <input type="date" value={next} onChange={e => setNext(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
      </div>
      <button
        onClick={() => { if (therapist.trim()) { onSave({ therapistName: therapist.trim(), institution: institution.trim(), startDate: start, active: true, nextAppointment: next || undefined }); onClose(); } }}
        disabled={!therapist.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#7C6BE8' }}
      >
        상담 시작하기
      </button>
    </>
  );
}

function SessionCard({ session, expanded, onClick }: {
  session: TherapySession;
  expanded: boolean;
  onClick: () => void;
}) {
  const date = new Date(session.date + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <button onClick={onClick} className="w-full p-4 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black" style={{ background: '#EDE9FF', color: '#7C6BE8' }}>
            {session.sessionNumber}
          </div>
          <div>
            <p className="text-sm font-bold text-[#2A2730]">{session.topics || '제' + session.sessionNumber + '회기'}</p>
            <p className="text-xs text-[#9B94A8]">{date}</p>
          </div>
        </div>
        <span className="text-[#C5BFC8] transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}>›</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="h-px" style={{ background: '#F0EAFF' }} />
          <div>
            <p className="text-xs font-bold text-[#7C6BE8] mb-1.5">상담 내용</p>
            <p className="text-sm text-[#2A2730] leading-relaxed whitespace-pre-wrap">{session.notes}</p>
          </div>
          {session.homework && (
            <div className="p-3 rounded-xl" style={{ background: '#FFF8E0' }}>
              <p className="text-xs font-bold text-[#8B6914] mb-1">📝 숙제</p>
              <p className="text-sm text-[#6B5210]">{session.homework}</p>
            </div>
          )}
          {session.nextSessionDate && (
            <div className="p-3 rounded-xl" style={{ background: '#EDE9FF' }}>
              <p className="text-xs font-bold text-[#5541C0] mb-1">📅 다음 상담</p>
              <p className="text-sm text-[#3B2D8F]">
                {new Date(session.nextSessionDate + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PastProgramDetail({ program, onClose }: { program: TherapyProgram; onClose: () => void }) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const sorted = [...program.sessions].sort((a, b) => b.sessionNumber - a.sessionNumber);

  return (
    <FullPage title={program.therapistName} onClose={onClose}>
      <div className="bg-white rounded-2xl p-4 mb-4 mt-2">
        <p className="text-sm font-bold text-[#2A2730]">{program.institution}</p>
        <p className="text-xs text-[#9B94A8] mt-1">
          {formatDate(program.startDate)} — {program.endDate ? formatDate(program.endDate) : '진행중'}
        </p>
        <p className="text-xs text-[#9B94A8] mt-1">총 {program.sessions.length}회기</p>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-[#9B94A8] text-center py-8">회기 기록이 없어요</p>
      ) : (
        <div className="space-y-2">
          {sorted.map(s => (
            <SessionCard
              key={s.id}
              session={s}
              expanded={expandedSession === s.id}
              onClick={() => setExpandedSession(expandedSession === s.id ? null : s.id)}
            />
          ))}
        </div>
      )}
    </FullPage>
  );
}

export default function Therapy({ data, onUpdate }: Props) {
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [viewingPast, setViewingPast] = useState<TherapyProgram | null>(null);

  const activeProgram = data.therapyPrograms.find(p => p.active);
  const pastPrograms = data.therapyPrograms.filter(p => !p.active);

  const handleAddSession = (s: Omit<TherapySession, 'id' | 'sessionNumber'>) => {
    if (!activeProgram) return;
    const nextNum = activeProgram.sessions.reduce((m, ss) => Math.max(m, ss.sessionNumber), 0) + 1;
    const newSession: TherapySession = { id: crypto.randomUUID(), sessionNumber: nextNum, ...s };
    const updated = {
      ...activeProgram,
      sessions: [...activeProgram.sessions, newSession],
      nextAppointment: s.nextSessionDate || activeProgram.nextAppointment,
    };
    onUpdate({ ...data, therapyPrograms: data.therapyPrograms.map(p => p.id === activeProgram.id ? updated : p) });
  };

  const handleAddProgram = (p: Omit<TherapyProgram, 'id' | 'sessions'>) => {
    // End current active program if any
    const programs = data.therapyPrograms.map(prog =>
      prog.active ? { ...prog, active: false, endDate: new Date().toISOString().split('T')[0] } : prog
    );
    onUpdate({ ...data, therapyPrograms: [...programs, { id: crypto.randomUUID(), sessions: [], ...p }] });
  };

  const handleEndProgram = () => {
    if (!activeProgram) return;
    onUpdate({
      ...data,
      therapyPrograms: data.therapyPrograms.map(p =>
        p.id === activeProgram.id ? { ...p, active: false, endDate: new Date().toISOString().split('T')[0] } : p
      ),
    });
    setConfirmEnd(false);
  };

  const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const daysUntil = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return '오늘';
    if (diff === 1) return '내일';
    if (diff > 0) return `${diff}일 후`;
    return `${Math.abs(diff)}일 전`;
  };

  const sortedSessions = activeProgram ? [...activeProgram.sessions].sort((a, b) => b.sessionNumber - a.sessionNumber) : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-black text-[#2A2730]" style={{ fontFamily: "'DM Serif Display', serif" }}>심리 상담</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {activeProgram && (
              <button onClick={() => setShowAddSession(true)} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95" style={{ background: '#7C6BE8' }}>
                + 회기 기록
              </button>
            )}
            <button onClick={() => setShowAddProgram(true)} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95" style={{ background: '#EDE9FF', color: '#7C6BE8' }}>
              + 새 상담
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {/* Active program card */}
        {activeProgram ? (
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #7C6BE8 0%, #9B8CF8 100%)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-purple-200 mb-1">진행 중인 상담</p>
                <p className="text-xl font-black text-white">{activeProgram.therapistName}</p>
                <p className="text-sm text-purple-200 mt-0.5">{activeProgram.institution}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white/20">💬</div>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-white/20 rounded-xl p-3">
                <p className="text-xs text-purple-200 font-semibold">총 회기</p>
                <p className="text-xl font-black text-white">{activeProgram.sessions.length}회</p>
              </div>
              <div className="flex-1 bg-white/20 rounded-xl p-3">
                <p className="text-xs text-purple-200 font-semibold">시작일</p>
                <p className="text-sm font-bold text-white">{new Date(activeProgram.startDate + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</p>
              </div>
              {activeProgram.nextAppointment && (
                <div className="flex-1 bg-white/20 rounded-xl p-3">
                  <p className="text-xs text-purple-200 font-semibold">다음 상담</p>
                  <p className="text-sm font-bold text-white">{daysUntil(activeProgram.nextAppointment)}</p>
                </div>
              )}
            </div>

            {activeProgram.nextAppointment && (
              <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
                <span className="text-sm">📅</span>
                <p className="text-sm text-white font-semibold">
                  다음 상담 · {formatDate(activeProgram.nextAppointment)}
                </p>
              </div>
            )}

            {/* Last session preview */}
            {sortedSessions[0] && (
              <div className="mt-3 bg-white/10 rounded-xl px-3 py-3">
                <p className="text-xs text-purple-200 font-semibold mb-1">지난 회기 (제{sortedSessions[0].sessionNumber}회기) 메모</p>
                <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">{sortedSessions[0].notes}</p>
                {sortedSessions[0].homework && (
                  <p className="text-xs text-yellow-200 mt-1.5">📝 숙제: {sortedSessions[0].homework}</p>
                )}
              </div>
            )}

            {confirmEnd ? (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-white/80 flex-1">이 상담을 종료할까요?</span>
                <button onClick={() => setConfirmEnd(false)} className="text-xs font-bold text-white px-2.5 py-1.5 rounded-lg bg-white/20">취소</button>
                <button onClick={handleEndProgram} className="text-xs font-bold text-[#7C6BE8] px-2.5 py-1.5 rounded-lg bg-white">종료</button>
              </div>
            ) : (
              <button onClick={() => setConfirmEnd(true)} className="mt-3 text-xs font-semibold text-white/70 underline">
                상담 종료
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-base font-bold text-[#2A2730] mb-1">진행 중인 상담이 없어요</p>
            <p className="text-sm text-[#9B94A8] mb-5">심리 상담을 시작하면 회기별로 기록할 수 있어요.</p>
            <button onClick={() => setShowAddProgram(true)} className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95" style={{ background: '#7C6BE8' }}>
              상담 시작하기
            </button>
          </div>
        )}

        {/* Session list */}
        {activeProgram && sortedSessions.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider mb-3">회기 기록</p>
            <div className="space-y-2">
              {sortedSessions.map(s => (
                <SessionCard
                  key={s.id}
                  session={s}
                  expanded={expandedSession === s.id}
                  onClick={() => setExpandedSession(expandedSession === s.id ? null : s.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeProgram && sortedSessions.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-sm text-[#9B94A8]">아직 회기 기록이 없어요. 상담 후 기록해보세요!</p>
          </div>
        )}

        {/* Past programs */}
        {pastPrograms.length > 0 && (
          <div>
            <button onClick={() => setShowPast(v => !v)} className="flex items-center gap-2 text-xs font-bold text-[#9B94A8] uppercase tracking-wider mb-3">
              지난 상담 {pastPrograms.length}개 {showPast ? '▲' : '▼'}
            </button>
            {showPast && (
              <div className="space-y-3">
                {pastPrograms.map(p => (
                  <button key={p.id} onClick={() => setViewingPast(p)} className="w-full bg-white rounded-2xl p-4 text-left transition-all active:scale-[0.99]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#F2EFED' }}>💬</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#9B94A8]">{p.therapistName}</p>
                        <p className="text-xs text-[#C5BFC8]">{p.institution}</p>
                        <p className="text-xs text-[#C5BFC8] mt-0.5">
                          {formatDate(p.startDate)} — {p.endDate ? formatDate(p.endDate) : '진행중'}
                        </p>
                        <p className="text-xs text-[#9B94A8] mt-1">총 {p.sessions.length}회기</p>
                      </div>
                      <span className="text-[#C5BFC8] text-sm flex-shrink-0">›</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddSession && activeProgram && (
        <Sheet onClose={() => setShowAddSession(false)}>
          <AddSessionSheet program={activeProgram} onClose={() => setShowAddSession(false)} onSave={handleAddSession} />
        </Sheet>
      )}
      {showAddProgram && (
        <Sheet onClose={() => setShowAddProgram(false)}>
          <AddProgramSheet onClose={() => setShowAddProgram(false)} onSave={handleAddProgram} />
        </Sheet>
      )}
      {viewingPast && <PastProgramDetail program={viewingPast} onClose={() => setViewingPast(null)} />}
    </div>
  );
}
