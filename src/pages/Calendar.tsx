import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import type { AppData, MoodEntry } from '../types';
import { EMOTION_MAP, EMOTIONS } from '../emotions';

interface Props { data: AppData; }

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// Positive = high value, Negative = low value for trend
const INTENSITY_DIRECTION: Record<string, number> = {
  happy: 1, calm: 1, elevated: 1,
  sad: -1, anxious: -1, angry: -1, depressed: -1,
  lethargic: -1, confused: -1, irritated: -1, lonely: -1, fearful: -1,
};

function moodScore(entry: MoodEntry) {
  const dir = INTENSITY_DIRECTION[entry.emotion] ?? -1;
  return dir * entry.intensity;
}

export default function Calendar({ data }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [tab, setTab] = useState<'calendar' | 'stats'>('calendar');

  const entriesByDate = useMemo(() => {
    const map: Record<string, MoodEntry[]> = {};
    data.moodEntries.forEach(e => {
      const d = e.date.split('T')[0];
      if (!map[d]) map[d] = [];
      map[d].push(e);
    });
    return map;
  }, [data.moodEntries]);

  const visitDates = useMemo(() => new Set(data.hospital.visits.map(v => v.date.split('T')[0])), [data.hospital.visits]);
  const nextVisitDate = data.hospital.visits[0]?.nextAppointment;

  const sessionDates = useMemo(() => {
    const set = new Set<string>();
    data.therapyPrograms.forEach(p => p.sessions.forEach(s => set.add(s.date)));
    return set;
  }, [data.therapyPrograms]);

  const nextTherapyDate = data.therapyPrograms.find(p => p.active)?.nextAppointment;

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const todayStr = now.toISOString().split('T')[0];

  const selectedEntries = selectedDay ? (entriesByDate[selectedDay] ?? []) : [];

  // Stats: last 30 days mood score trend (daily avg)
  const trendData = useMemo(() => {
    const days: { date: string; label: string; score: number | null }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - 86400000 * i);
      const key = d.toISOString().split('T')[0];
      const entries = entriesByDate[key];
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      if (entries && entries.length) {
        const avg = entries.reduce((s, e) => s + moodScore(e), 0) / entries.length;
        days.push({ date: key, label, score: Math.round(avg * 10) / 10 });
      } else {
        days.push({ date: key, label, score: null });
      }
    }
    return days.filter((_, i) => i % 3 === 0); // show every 3 days
  }, [entriesByDate]);

  // Emotion frequency
  const freqData = useMemo(() => {
    return EMOTIONS.map(e => ({
      label: e.label,
      emoji: e.emoji,
      count: data.moodEntries.filter(m => m.emotion === e.key).length,
      color: e.dot,
    })).filter(e => e.count > 0).sort((a, b) => b.count - a.count).slice(0, 7);
  }, [data.moodEntries]);

  return (
    <div className="flex flex-col h-full">
      {/* Tab switcher */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex p-1 rounded-2xl gap-1" style={{ background: '#EDE9FF' }}>
          {(['calendar', 'stats'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: tab === t ? '#7C6BE8' : 'transparent',
                color: tab === t ? 'white' : '#7C6BE8',
              }}
            >
              {t === 'calendar' ? '📅 달력' : '📊 통계'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {tab === 'calendar' ? (
          <>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7C6BE8] font-bold transition-all active:scale-90" style={{ background: '#F0EEFF' }}>‹</button>
              <h2 className="text-lg font-black text-[#2A2730]">{year}년 {MONTHS[month]}</h2>
              <button onClick={nextMonth} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7C6BE8] font-bold transition-all active:scale-90" style={{ background: '#F0EEFF' }}>›</button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-3 text-xs text-[#9B94A8] font-semibold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4A7CCC] inline-block" />진료</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C6BE8] inline-block" />상담</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E8A0A8] inline-block" />예정</span>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map((d, i) => (
                <div key={d} className="text-center text-xs font-bold py-1" style={{ color: i === 0 ? '#E55250' : i === 6 ? '#4A7CCC' : '#9B94A8' }}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-y-1 mb-4">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayEntries = entriesByDate[dateStr] ?? [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDay;
                const hasVisit = visitDates.has(dateStr);
                const hasSession = sessionDates.has(dateStr);
                const isNextVisit = nextVisitDate === dateStr;
                const isNextTherapy = nextTherapyDate === dateStr;
                const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                    className="flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all active:scale-90"
                    style={{ background: isSelected ? '#EDE9FF' : isToday ? '#F7F4F0' : 'transparent' }}
                  >
                    <span
                      className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background: isToday ? '#7C6BE8' : 'transparent',
                        color: isToday ? 'white' : isWeekend ? (idx % 7 === 0 ? '#E55250' : '#4A7CCC') : '#2A2730',
                      }}
                    >
                      {day}
                    </span>
                    {/* Mood dots */}
                    <div className="flex gap-0.5 flex-wrap justify-center min-h-[8px]">
                      {dayEntries.slice(0, 3).map((e, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: EMOTION_MAP[e.emotion].dot }} />
                      ))}
                    </div>
                    {/* Event markers */}
                    <div className="flex gap-0.5">
                      {(hasVisit || isNextVisit) && <div className="w-1.5 h-1.5 rounded-full" style={{ background: isNextVisit ? '#E8A0A8' : '#4A7CCC' }} />}
                      {(hasSession || isNextTherapy) && <div className="w-1.5 h-1.5 rounded-full" style={{ background: isNextTherapy ? '#E8A0A8' : '#7C6BE8' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected day detail */}
            {selectedDay && (
              <div className="rounded-2xl p-4 bg-white mb-4">
                <p className="text-sm font-bold text-[#2A2730] mb-3">
                  {new Date(selectedDay + 'T00:00:00').toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
                </p>

                {selectedEntries.length === 0 && !visitDates.has(selectedDay) && !sessionDates.has(selectedDay) && (
                  <p className="text-sm text-[#9B94A8]">기록 없음</p>
                )}

                {selectedEntries.map(e => {
                  const def = EMOTION_MAP[e.emotion];
                  return (
                    <div key={e.id} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: def.bg }}>
                        {def.emoji}
                      </div>
                      <div>
                        <span className="text-sm font-bold" style={{ color: def.color }}>{def.label}</span>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < e.intensity ? def.dot : '#E8E3DD' }} />
                          ))}
                        </div>
                        {e.note && <p className="text-xs text-[#6B6470] mt-1">{e.note}</p>}
                      </div>
                    </div>
                  );
                })}

                {visitDates.has(selectedDay) && (
                  <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #F0EAFF' }}>
                    <span className="text-base">🏥</span>
                    <span className="text-xs font-semibold text-[#2C5282]">병원 진료일</span>
                  </div>
                )}
                {sessionDates.has(selectedDay) && (
                  <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #F0EAFF' }}>
                    <span className="text-base">💬</span>
                    <span className="text-xs font-semibold text-[#5541C0]">심리 상담일</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-black text-[#2A2730] mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>감정 통계</h2>
            <p className="text-xs text-[#9B94A8] mb-5">전체 기록 {data.moodEntries.length}개 기반</p>

            {/* Trend chart */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-sm font-bold text-[#2A2730] mb-1">최근 30일 기분 흐름</p>
              <p className="text-xs text-[#9B94A8] mb-4">양수 = 긍정적, 음수 = 부정적 감정</p>
              {trendData.some(d => d.score !== null) ? (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={trendData} margin={{ left: -20, right: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9B94A8' }} tickLine={false} axisLine={false} interval={2} />
                    <YAxis domain={[-5, 5]} tick={{ fontSize: 10, fill: '#9B94A8' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                      formatter={(v) => [typeof v === 'number' && v > 0 ? `+${v}` : v, '기분 점수']}
                    />
                    <Line type="monotone" dataKey="score" stroke="#7C6BE8" strokeWidth={2.5} dot={{ fill: '#7C6BE8', r: 3 }} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-[#9B94A8] text-center py-8">아직 데이터가 부족해요</p>
              )}
            </div>

            {/* Emotion frequency */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-sm font-bold text-[#2A2730] mb-4">자주 느끼는 감정</p>
              {freqData.length > 0 ? (
                <div className="space-y-2.5">
                  {freqData.map(e => (
                    <div key={e.label} className="flex items-center gap-3">
                      <span className="text-base w-6">{e.emoji}</span>
                      <span className="text-xs font-semibold text-[#2A2730] w-20">{e.label}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F2EFED' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(e.count / freqData[0].count) * 100}%`, background: e.color }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#9B94A8] w-6 text-right">{e.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9B94A8] text-center py-6">아직 기록이 없어요</p>
              )}
            </div>

            {/* Intensity over time bar */}
            <div className="bg-white rounded-2xl p-4 mb-4">
              <p className="text-sm font-bold text-[#2A2730] mb-1">평균 감정 강도 (최근 30일)</p>
              <p className="text-xs text-[#9B94A8] mb-4">1 = 약하게, 5 = 매우 강하게</p>
              {trendData.some(d => d.score !== null) ? (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={trendData} margin={{ left: -20, right: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9B94A8' }} tickLine={false} axisLine={false} interval={2} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#9B94A8' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {trendData.map((d, i) => (
                        <Cell key={i} fill={d.score !== null && d.score >= 0 ? '#7C6BE8' : '#F4A8B8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-[#9B94A8] text-center py-6">아직 데이터가 부족해요</p>
              )}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: '총 기록', value: data.moodEntries.length + '개' },
                { label: '진료 횟수', value: data.hospital.visits.length + '회' },
                { label: '상담 회기', value: data.therapyPrograms.reduce((s, p) => s + p.sessions.length, 0) + '회' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-3 text-center">
                  <p className="text-xl font-black text-[#7C6BE8]">{s.value}</p>
                  <p className="text-xs text-[#9B94A8] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
