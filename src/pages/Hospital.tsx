import { useRef, useState } from 'react';
import type { AppData, Diagnosis, DocumentType, HospitalVisit, Medication, MedicalDocument } from '../types';
import Sheet from '../components/Sheet';

interface Props {
  data: AppData;
  onUpdate: (d: AppData) => void;
}

const DOCUMENT_TYPES: DocumentType[] = ['조제내역서', '진단서', '처방전', '영수증', '기타'];

function resizeImage(file: File, maxSide = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          const scale = maxSide / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas unavailable')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
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

function MedSheet({ title, initial, onClose, onSave }: {
  title: string;
  initial?: Partial<Omit<Medication, 'id'>>;
  onClose: () => void;
  onSave: (m: Omit<Medication, 'id' | 'active'>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [dosage, setDosage] = useState(initial?.dosage ?? '');
  const [freq, setFreq] = useState(initial?.frequency ?? '');
  const [start, setStart] = useState(initial?.startDate ?? new Date().toISOString().split('T')[0]);

  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">{title}</h3>
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
        onClick={() => { if (name.trim()) { onSave({ name: name.trim(), dosage: dosage.trim(), frequency: freq.trim(), startDate: start }); onClose(); } }}
        disabled={!name.trim()}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95 disabled:opacity-40"
        style={{ background: '#4A7CCC' }}
      >
        저장하기
      </button>
    </>
  );
}

function DiagnosisFormSheet({ title, initial, onClose, onSave }: {
  title: string;
  initial?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [val, setVal] = useState(initial ?? '');
  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">{title}</h3>
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
        저장하기
      </button>
    </>
  );
}

function EditDiagnosesSheet({ diagnoses, onClose, onEdit, onRemove }: {
  diagnoses: Diagnosis[];
  onClose: () => void;
  onEdit: (d: Diagnosis) => void;
  onRemove: (id: string) => void;
}) {
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-5">진단명 편집</h3>
      {diagnoses.length === 0 ? (
        <p className="text-sm text-[#9B94A8] mb-4">등록된 진단명이 없어요</p>
      ) : (
        <div className="space-y-2 mb-4">
          {diagnoses.map(d => (
            <div key={d.id} className="flex items-center justify-between gap-2 p-3 rounded-xl" style={{ background: '#F7F4F0' }}>
              <span className="text-sm font-semibold text-[#2A2730] flex-1 min-w-0 truncate">{d.name}</span>
              {confirmRemove === d.id ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-[#9B94A8]">삭제할까요?</span>
                  <button onClick={() => onRemove(d.id)} className="text-xs font-bold text-white px-2.5 py-1 rounded-lg" style={{ background: '#E55250' }}>삭제</button>
                  <button onClick={() => setConfirmRemove(null)} className="text-xs font-bold text-[#9B94A8] px-2.5 py-1 rounded-lg" style={{ background: '#EDEAE6' }}>취소</button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => onEdit(d)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EBF3FF' }}>✏️</button>
                  <button onClick={() => setConfirmRemove(d.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFECEC' }}>🗑️</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose} className="w-full h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>닫기</button>
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

function AddDocumentSheet({ imageDataUrl, onClose, onSave }: {
  imageDataUrl: string;
  onClose: () => void;
  onSave: (doc: Omit<MedicalDocument, 'id'>) => void;
}) {
  const [type, setType] = useState<DocumentType>('처방전');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');

  return (
    <>
      <h3 className="text-lg font-black text-[#2A2730] mb-4">서류 저장</h3>
      <img src={imageDataUrl} alt="preview" className="w-full max-h-64 object-contain rounded-2xl mb-4 bg-[#F7F4F0]" />
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">종류</label>
          <div className="flex flex-wrap gap-2">
            {DOCUMENT_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={{ background: type === t ? '#4A7CCC' : '#F7F4F0', color: type === t ? 'white' : '#2A2730' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">날짜</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3.5 py-3 rounded-xl text-sm outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#2A2730] mb-1.5">메모 (선택)</label>
          <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="예: 8월 정기 진료분" className="w-full px-3.5 py-3 rounded-xl text-sm text-[#2A2730] placeholder-[#C5BFC8] outline-none" style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DD' }} />
        </div>
      </div>
      <button
        onClick={() => { onSave({ type, date, imageDataUrl, memo: memo.trim() || undefined }); onClose(); }}
        className="w-full h-14 rounded-2xl font-bold text-white text-base active:scale-95"
        style={{ background: '#4A7CCC' }}
      >
        저장하기
      </button>
    </>
  );
}

function DocumentViewer({ doc, onClose, onDelete }: { doc: MedicalDocument; onClose: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dateStr = new Date(doc.date + 'T00:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-[#4A7CCC]">{doc.type}</p>
          <p className="text-base font-bold text-[#2A2730]">{dateStr}</p>
        </div>
      </div>
      <img src={doc.imageDataUrl} alt={doc.type} className="w-full rounded-2xl mb-4 bg-[#F7F4F0]" />
      {doc.memo && <p className="text-sm text-[#2A2730] mb-4">{doc.memo}</p>}
      {confirmDelete ? (
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(false)} className="flex-1 h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>취소</button>
          <button onClick={onDelete} className="flex-1 h-12 rounded-2xl font-bold text-white text-sm" style={{ background: '#E55250' }}>삭제</button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>닫기</button>
          <button onClick={() => setConfirmDelete(true)} className="flex-1 h-12 rounded-2xl font-bold text-[#E55250] text-sm" style={{ background: '#FFECEC' }}>삭제</button>
        </div>
      )}
    </>
  );
}

export default function Hospital({ data, onUpdate }: Props) {
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddDiag, setShowAddDiag] = useState(false);
  const [showEditDiag, setShowEditDiag] = useState(false);
  const [editingDiag, setEditingDiag] = useState<Diagnosis | null>(null);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<HospitalVisit | null>(null);
  const [expandMeds, setExpandMeds] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { hospital } = data;

  const nextVisit = hospital.visits.find(v => v.nextAppointment)?.nextAppointment;

  const handleAddVisit = (v: Omit<HospitalVisit, 'id'>) => {
    onUpdate({ ...data, hospital: { ...hospital, visits: [{ id: crypto.randomUUID(), ...v }, ...hospital.visits] } });
  };

  const handleAddMed = (m: Omit<Medication, 'id' | 'active'>) => {
    onUpdate({ ...data, hospital: { ...hospital, medications: [{ id: crypto.randomUUID(), ...m, active: true }, ...hospital.medications] } });
  };

  const handleUpdateMed = (id: string, m: Omit<Medication, 'id' | 'active'>) => {
    onUpdate({ ...data, hospital: { ...hospital, medications: hospital.medications.map(med => med.id === id ? { ...med, ...m } : med) } });
  };

  const handleToggleMed = (id: string) => {
    onUpdate({ ...data, hospital: { ...hospital, medications: hospital.medications.map(m => m.id === id ? { ...m, active: !m.active } : m) } });
  };

  const handleAddDiag = (name: string) => {
    onUpdate({ ...data, hospital: { ...hospital, diagnoses: [...hospital.diagnoses, { id: crypto.randomUUID(), name }] } });
  };

  const handleUpdateDiag = (id: string, name: string) => {
    onUpdate({ ...data, hospital: { ...hospital, diagnoses: hospital.diagnoses.map(d => d.id === id ? { ...d, name } : d) } });
  };

  const handleRemoveDiag = (id: string) => {
    onUpdate({ ...data, hospital: { ...hospital, diagnoses: hospital.diagnoses.filter(d => d.id !== id) } });
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      setPendingImage(dataUrl);
    } catch {
      // ignore unreadable file
    }
  };

  const handleSaveDocument = (doc: Omit<MedicalDocument, 'id'>) => {
    onUpdate({ ...data, hospital: { ...hospital, documents: [{ id: crypto.randomUUID(), ...doc }, ...hospital.documents] } });
  };

  const handleDeleteDocument = (id: string) => {
    onUpdate({ ...data, hospital: { ...hospital, documents: hospital.documents.filter(d => d.id !== id) } });
    setViewingDoc(null);
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
            <div className="flex items-center gap-1.5">
              <button onClick={() => setShowEditDiag(true)} className="text-xs font-bold text-[#9B94A8] px-2.5 py-1 rounded-lg" style={{ background: '#F2EFED' }}>편집</button>
              <button onClick={() => setShowAddDiag(true)} className="text-xs font-bold text-[#4A7CCC] px-2.5 py-1 rounded-lg" style={{ background: '#EBF3FF' }}>+ 추가</button>
            </div>
          </div>
          {hospital.diagnoses.length === 0 ? (
            <p className="text-sm text-[#9B94A8]">진단명을 추가해보세요</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hospital.diagnoses.map(d => (
                <div key={d.id} className="px-3 py-1.5 rounded-xl" style={{ background: '#EBF3FF' }}>
                  <span className="text-sm font-semibold text-[#1E3A6E]">{d.name}</span>
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
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setEditingMed(med)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EBF3FF' }}>✏️</button>
                    <button
                      onClick={() => handleToggleMed(med.id)}
                      className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{ background: '#D6F5E5', color: '#1E6F50' }}
                    >
                      복용중
                    </button>
                  </div>
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
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditingMed(med)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EDEAE6' }}>✏️</button>
                        <button onClick={() => handleToggleMed(med.id)} className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: '#F2EFED', color: '#9B94A8' }}>
                          중단됨
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#2A2730]">🧾 서류 보관함</p>
            <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-[#4A7CCC] px-2.5 py-1 rounded-lg" style={{ background: '#EBF3FF' }}>+ 촬영/업로드</button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelected} />
          </div>
          {hospital.documents.length === 0 ? (
            <p className="text-sm text-[#9B94A8]">조제내역서, 진단서, 처방전, 영수증을 촬영해 보관해보세요</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {hospital.documents.map(doc => (
                <button key={doc.id} onClick={() => setViewingDoc(doc)} className="relative aspect-square rounded-xl overflow-hidden transition-all active:scale-95">
                  <img src={doc.imageDataUrl} alt={doc.type} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 px-1.5 py-1 text-[10px] font-bold text-white text-center truncate" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    {doc.type}
                  </span>
                </button>
              ))}
            </div>
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
      {showAddMed && <Sheet onClose={() => setShowAddMed(false)}><MedSheet title="복용약 추가" onClose={() => setShowAddMed(false)} onSave={handleAddMed} /></Sheet>}
      {editingMed && (
        <Sheet onClose={() => setEditingMed(null)}>
          <MedSheet
            title="복용약 수정"
            initial={editingMed}
            onClose={() => setEditingMed(null)}
            onSave={m => handleUpdateMed(editingMed.id, m)}
          />
        </Sheet>
      )}
      {showAddDiag && <Sheet onClose={() => setShowAddDiag(false)}><DiagnosisFormSheet title="진단명 추가" onClose={() => setShowAddDiag(false)} onSave={handleAddDiag} /></Sheet>}
      {showEditDiag && (
        <Sheet onClose={() => setShowEditDiag(false)}>
          <EditDiagnosesSheet
            diagnoses={hospital.diagnoses}
            onClose={() => setShowEditDiag(false)}
            onEdit={d => { setShowEditDiag(false); setEditingDiag(d); }}
            onRemove={handleRemoveDiag}
          />
        </Sheet>
      )}
      {editingDiag && (
        <Sheet onClose={() => setEditingDiag(null)}>
          <DiagnosisFormSheet
            title="진단명 수정"
            initial={editingDiag.name}
            onClose={() => setEditingDiag(null)}
            onSave={name => handleUpdateDiag(editingDiag.id, name)}
          />
        </Sheet>
      )}
      {selectedVisit && <Sheet onClose={() => setSelectedVisit(null)}><VisitDetail visit={selectedVisit} onClose={() => setSelectedVisit(null)} /></Sheet>}
      {pendingImage && (
        <Sheet onClose={() => setPendingImage(null)}>
          <AddDocumentSheet imageDataUrl={pendingImage} onClose={() => setPendingImage(null)} onSave={handleSaveDocument} />
        </Sheet>
      )}
      {viewingDoc && (
        <Sheet onClose={() => setViewingDoc(null)}>
          <DocumentViewer doc={viewingDoc} onClose={() => setViewingDoc(null)} onDelete={() => handleDeleteDocument(viewingDoc.id)} />
        </Sheet>
      )}
    </div>
  );
}
