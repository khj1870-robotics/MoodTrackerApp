import { useState } from 'react';
import type { AppData } from '../types';
import { loadData } from '../store';

interface Props {
  data: AppData;
  onUpdate: (d: AppData) => void;
}

export default function Settings({ data, onUpdate }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodtracker_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('moodtracker_v1');
    onUpdate(loadData());
    setShowClearConfirm(false);
  };

  const totalMoods = data.moodEntries.length;
  const totalVisits = data.hospital.visits.length;
  const totalSessions = data.therapyPrograms.reduce((s, p) => s + p.sessions.length, 0);
  const firstEntry = data.moodEntries.length > 0
    ? new Date(Math.min(...data.moodEntries.map(e => new Date(e.date).getTime())))
      .toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-3">
        <h1 className="text-2xl font-black text-[#2A2730]" style={{ fontFamily: "'DM Serif Display', serif" }}>설정</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">

        {/* App summary */}
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #F4F0FF 100%)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white/60">🌱</div>
            <div>
              <p className="text-lg font-black text-[#3B2D8F]">MoodTracker</p>
              <p className="text-xs text-[#7C6BE8]">마음을 기록하는 공간</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '감정 기록', value: totalMoods + '개' },
              { label: '진료 기록', value: totalVisits + '회' },
              { label: '상담 회기', value: totalSessions + '회' },
            ].map(s => (
              <div key={s.label} className="bg-white/60 rounded-xl p-2.5 text-center">
                <p className="text-base font-black text-[#7C6BE8]">{s.value}</p>
                <p className="text-xs text-[#9B8CE8]">{s.label}</p>
              </div>
            ))}
          </div>
          {firstEntry && (
            <p className="text-xs text-[#9B94A8] mt-3 text-center">{firstEntry}부터 기록 중</p>
          )}
        </div>

        {/* Data section */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider px-4 pt-4 pb-2">데이터</p>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-all active:bg-[#F7F4F0]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#EBF3FF' }}>📤</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#2A2730]">데이터 내보내기</p>
                <p className="text-xs text-[#9B94A8]">JSON 파일로 저장</p>
              </div>
            </div>
            {exported ? (
              <span className="text-xs font-bold text-[#4CAF88]">완료 ✓</span>
            ) : (
              <span className="text-[#C5BFC8]">›</span>
            )}
          </button>

          <div className="h-px mx-4" style={{ background: '#F0EAFF' }} />

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 transition-all active:bg-[#FFF0F0]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FFECEC' }}>🗑️</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-[#E55250]">모든 데이터 초기화</p>
                <p className="text-xs text-[#9B94A8]">되돌릴 수 없어요</p>
              </div>
            </div>
            <span className="text-[#C5BFC8]">›</span>
          </button>
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <p className="text-xs font-bold text-[#9B94A8] uppercase tracking-wider px-4 pt-4 pb-2">앱 정보</p>
          {[
            { label: '버전', value: '1.0.0' },
            { label: '데이터 저장 방식', value: '기기 내 저장' },
          ].map((item, i, arr) => (
            <div key={item.label}>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-sm text-[#2A2730]">{item.label}</span>
                <span className="text-sm text-[#9B94A8] font-semibold">{item.value}</span>
              </div>
              {i < arr.length - 1 && <div className="h-px mx-4" style={{ background: '#F0EAFF' }} />}
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="p-4 rounded-2xl" style={{ background: '#F0EAFF' }}>
          <p className="text-xs font-bold text-[#7C6BE8] mb-1">🔒 개인정보 보호</p>
          <p className="text-xs text-[#9B8CE8] leading-relaxed">
            모든 데이터는 이 기기에만 저장됩니다. 어떤 서버에도 전송되거나 저장되지 않아요. 앱을 삭제하면 데이터도 함께 삭제됩니다. 데이터를 보존하려면 내보내기를 사용하세요.
          </p>
        </div>

        {/* Support note */}
        <div className="p-4 rounded-2xl bg-white">
          <p className="text-xs font-bold text-[#2A2730] mb-1">💙 도움이 필요할 때</p>
          <p className="text-xs text-[#9B94A8] leading-relaxed">
            힘든 감정이 지속되거나 위기 상황이라면 전문가의 도움을 받으세요.{'\n'}
            <span className="font-semibold text-[#2A2730]">정신건강위기상담전화 1577-0199</span> (24시간){'\n'}
            <span className="font-semibold text-[#2A2730]">자살예방상담전화 1393</span> (24시간)
          </p>
        </div>
      </div>

      {/* Confirm dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 fade-in flex items-center justify-center p-6" style={{ background: 'rgba(42,39,48,0.5)' }}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-[320px]">
            <p className="text-lg font-black text-[#2A2730] mb-2 text-center">정말 초기화할까요?</p>
            <p className="text-sm text-[#9B94A8] text-center mb-6">모든 감정 기록, 진료 기록, 상담 기록이 삭제됩니다. 이 작업은 되돌릴 수 없어요.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 h-12 rounded-2xl font-bold text-[#7C6BE8] text-sm" style={{ background: '#EDE9FF' }}>
                취소
              </button>
              <button onClick={handleClear} className="flex-1 h-12 rounded-2xl font-bold text-white text-sm" style={{ background: '#E55250' }}>
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
