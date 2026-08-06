import { useState, useEffect } from 'react';
import type { AppData } from './types';
import { loadData, saveData } from './store';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Hospital from './pages/Hospital';
import Therapy from './pages/Therapy';
import Settings from './pages/Settings';

type Tab = 'home' | 'calendar' | 'hospital' | 'therapy' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',     label: '홈',   icon: '🏠' },
  { id: 'calendar', label: '달력', icon: '📅' },
  { id: 'hospital', label: '진료', icon: '🏥' },
  { id: 'therapy',  label: '상담', icon: '💬' },
  { id: 'settings', label: '설정', icon: '⚙️' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#EDE5D8' }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 430,
          height: '100dvh',
          maxHeight: 932,
          background: '#F7F4F0',
        }}
      >
        {/* Page content */}
        <div className="flex-1 overflow-hidden" style={{ paddingBottom: 72 }}>
          <div className="h-full overflow-hidden">
            {tab === 'home'     && <Home     data={data} onUpdate={setData} onGoTo={(t) => setTab(t as Tab)} />}
            {tab === 'calendar' && <Calendar data={data} />}
            {tab === 'hospital' && <Hospital data={data} onUpdate={setData} />}
            {tab === 'therapy'  && <Therapy  data={data} onUpdate={setData} />}
            {tab === 'settings' && <Settings data={data} onUpdate={setData} />}
          </div>
        </div>

        {/* Bottom nav */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center px-2 pb-safe"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid #F0EAFF',
            height: 72,
            paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
          }}
        >
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all active:scale-90"
              >
                <span className="text-xl transition-transform" style={{ transform: active ? 'scale(1.15)' : 'scale(1)' }}>
                  {t.icon}
                </span>
                <span
                  className="text-[10px] font-bold transition-all"
                  style={{ color: active ? '#7C6BE8' : '#C5BFC8' }}
                >
                  {t.label}
                </span>
                {active && (
                  <div className="w-1 h-1 rounded-full mt-0.5" style={{ background: '#7C6BE8' }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
