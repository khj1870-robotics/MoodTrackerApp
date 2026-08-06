import { useState } from 'react';
import type { AppData, HospitalVisit, Medication } from '../types';

interface Props {
  data: AppData;
  onUpdate: (d: AppData) => void;
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

function AddVisitSheet({ onClose, onSave }: { onClose: () => void; onSave: (v: Omit<HospitalVisit, 'id'>) => void }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [next, setNext] = useState('');

  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">진료 기록 추가</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">진료일</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">진료 내용 / 메모</label>
          <textarea rows={5} value={memo} onChange={e => setMemo(e.target.value)} placeholder="의사 선생님이 하신 말씀, 처방 변경, 다음에 말하고 싶은 것..." className="w-full px-3.5 py-2.5 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] resize-none outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">다음 진료 예정일 (선택)</label>
          <input type="date" value={next} onChange={e => setNext(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
      </div>
      <button
        onClick={() => { if (memo.trim()) { onSave({ date: new Date(date + 'T09:00:00').toISOString(), memo: memo.trim(), nextAppointment: next || undefined }); onClose(); } }}
        disabled={!memo.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#4A7CCC' }}
      >
        저장하기
      </button>
    </>
  );
}

function AddMedSheet({ onClose, onSave }: { onClose: () => void; onSave: (m: Omit<Medication, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [freq, setFreq] = useState('');
  const [start, setStart] = useState(new Date().toISOString().split('T')[0]);

  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">복용약 추가</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">약 이름 (용량 포함)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="예: 에스시탈로프람 10mg" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">복용량</label>
            <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="예: 1정" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">복용 방법</label>
            <input value={freq} onChange={e => setFreq(e.target.value)} placeholder="예: 매일 아침" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">복용 시작일</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
      </div>
      <button
        onClick={() => { if (name.trim()) { onSave({ name: name.trim(), dosage: dosage.trim(), frequency: freq.trim(), startDate: start, active: true }); onClose(); } }}
        disabled={!name.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#4A7CCC' }}
      >
        추가하기
      </button>
    </>
  );
}

function AddDiagnosisSheet({ onClose, onSave }: { onClose: () => void; onSave: (d: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">진단명 추가</h3>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">진단명 (ICD 코드 포함 가능)</label>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="예: 주요우울장애 (F32.1)" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        <p className="text-xs text-[#9B94A8] mt-2">진단명은 진료기록부나 의사 소견서에서 확인할 수 있어요.</p>
      </div>
      <button
        onClick={() => { if (val.trim()) { onSave(val.trim()); onClose(); } }}
        disabled={!val.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#4A7CCC' }}
      >
        추가하기
      </button>
    </>
  );
}

function VisitDetail({ visit, onClose }: { visit: HospitalVisit; onClose: () => void }) {
  const date = new Date(visit.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-blue-50">🏥</div>
        <div>
          <p className="text-xs text-[#9B94A8] font-semibold">진료 기록</p>
          <p className="text-base font-bold text-[#2A2730]">{date}</p>
        </div>
      </div>
      <div className="bg-[#F7F4F0] rounded-2xl p-4 mb-4">
        <p className="text-sm text-[#2A2730] leading-relaxed whitespace-pre-wrap">{visit.memo}</p>
      </div>
      {visit.nextAppointment && (
        <div className="flex items-center gap-3 p-4 rounded-2xl mb-4" style={{ background: '#EBF3FF' }}>
          <span className="text-lg">📅</span>
          <div>
            <p className="text-xs font-semibold text-[#4A6FA5]">다음 진료</p>
            <p className="text-sm font-bold text-[#1E3A6E]">{new Date(visit.nextAppointment + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</p>
          </div>
        </div>
      )}
      <button onClick={onClose} className="w-full h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>닫기</button>
    </>
  );
}

export default function Hospital({ data, onUpdate }: Props) {
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddDiag, setShowAddDiag] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<HospitalVisit | null>(null);
  const [expandMeds, setExpandMeds] = useState(false);

  const { hospital } = data;

  const nextVisit = hospital.visits.find(v => v.nextAppointment)?.nextAppointment;

  const handleAddVisit = (v: Omit<HospitalVisit, 'id'>) => {
    onUpdate({ ...data, hospital: { ...hospital, visits: [{ id: crypto.randomUUID(), ...v }, ...hospital.visits] } });
  };

  const handleAddMed = (m: Omit<Medication, 'id'>) => {
    onUpdate({ ...data, hospital: { ...hospital, medications: [{ id: crypto.randomUUID(), ...m }, ...hospital.medications] } });
  };

  const handleToggleMed = (id: string) => {
    onUpdate({ ...data, hospital: { ...hospital, medications: hospital.medications.map(m => m.id === id ? { ...m, active: !m.active } : m) } });
  };

  const handleAddDiag = (d: string) => {
    onUpdate({ ...data, hospital: { ...hospital, diagnoses: [...hospital.diagnoses, d] } });
  };

  const handleRemoveDiag = (idx: number) => {
    onUpdate({ ...data, hospital: { ...hospital, diagnoses: hospital.diagnoses.filter((_, i) => i !== idx) } });
  };

  const activeMeds = hospital.medications.filter(m => m.active);
  const inactiveMeds = hospital.medications.filter(m => !m.active);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#2A2730]" style={{ fontFamily: "'DM Serif Display', serif" }}>병원 진료</h1>
            {nextVisit && (
              <p className="text-xs text-[#4A7CCC] font-semibold mt-0.5">
                다음 진료 · {new Date(nextVisit + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowAddVisit(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
            style={{ background: '#4A7CCC' }}
          >
            + 진료 기록
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">

        {/* Diagnoses */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#2A2730]">🩺 진단명</p>
            <button onClick={() => setShowAddDiag(true)} className="text-xs font-bold text-[#4A7CCC] px-2.5 py-1 rounded-lg" style={{ background: '#EBF3FF' }}>+ 추가</button>
          </div>
          {hospital.diagnoses.length === 0 ? (
            <p className="text-sm text-[#9B94A8]">진단명을 추가해보세요</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hospital.diagnoses.map((d, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: '#EBF3FF' }}>
                  <span className="text-sm font-semibold text-[#1E3A6E]">{d}</span>
                  <button onClick={() => handleRemoveDiag(i)} className="text-[#9B94A8] hover:text-[#E55250] text-xs leading-none">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Medications */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#2A2730]">💊 복용 중인 약</p>
            <button onClick={() => setShowAddMed(true)} className="text-xs font-bold text-[#4A7CCC] px-2.5 py-1 rounded-lg" style={{ background: '#EBF3FF' }}>+ 추가</button>
          </div>
          {activeMeds.length === 0 ? (
            <p className="text-sm text-[#9B94A8]">복용 중인 약을 추가해보세요</p>
          ) : (
            <div className="space-y-2">
              {activeMeds.map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F7F4F0' }}>
                  <div>
                    <p className="text-sm font-bold text-[#2A2730]">{med.name}</p>
                    <p className="text-xs text-[#9B94A8] mt-0.5">{med.dosage} · {med.frequency}</p>
                  </div>
                  <button
                    onClick={() => handleToggleMed(med.id)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                    style={{ background: '#D6F5E5', color: '#1E6F50' }}
                  >
                    복용중
                  </button>
                </div>
              ))}
            </div>
          )}

          {inactiveMeds.length > 0 && (
            <>
              <button onClick={() => setExpandMeds(v => !v)} className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#9B94A8]">
                과거 복용약 {inactiveMeds.length}개 {expandMeds ? '▲' : '▼'}
              </button>
              {expandMeds && (
                <div className="space-y-2 mt-2">
                  {inactiveMeds.map(med => (
                    <div key={med.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F7F4F0', opacity: 0.6 }}>
                      <div>
                        <p className="text-sm font-semibold text-[#9B94A8] line-through">{med.name}</p>
                        <p className="text-xs text-[#C5BFC8]">{med.dosage} · {med.frequency}</p>
                      </div>
                      <button onClick={() => handleToggleMed(med.id)} className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: '#F2EFED', color: '#9B94A8' }}>
                        중단됨
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Visit history */}
        <div>
          <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider mb-3">진료 기록</p>
          {hospital.visits.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-3xl mb-2">🏥</p>
              <p className="text-sm text-[#9B94A8]">진료 기록을 추가해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hospital.visits.map(visit => {
                const d = new Date(visit.date);
                const dateStr = d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
                return (
                  <button
                    key={visit.id}
                    onClick={() => setSelectedVisit(visit)}
                    className="w-full bg-white rounded-2xl p-4 text-left transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#EBF3FF' }}>🏥</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#4A7CCC] mb-1">{dateStr}</p>
                          <p className="text-sm text-[#2A2730] line-clamp-2 leading-relaxed">{visit.memo}</p>
                          {visit.nextAppointment && (
                            <p className="text-xs text-[#9B94A8] mt-1.5">
                              다음 진료 · {new Date(visit.nextAppointment + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[#C5BFC8] text-sm flex-shrink-0">›</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAddVisit && <Sheet onClose={() => setShowAddVisit(false)}><AddVisitSheet onClose={() => setShowAddVisit(false)} onSave={handleAddVisit} /></Sheet>}
      {showAddMed && <Sheet onClose={() => setShowAddMed(false)}><AddMedSheet onClose={() => setShowAddMed(false)} onSave={handleAddMed} /></Sheet>}
      {showAddDiag && <Sheet onClose={() => setShowAddDiag(false)}><AddDiagnosisSheet onClose={() => setShowAddDiag(false)} onSave={handleAddDiag} /></Sheet>}
      {selectedVisit && <Sheet onClose={() => setSelectedVisit(null)}><VisitDetail visit={selectedVisit} onClose={() => setSelectedVisit(null)} /></Sheet>}
    </div>
  );
}
