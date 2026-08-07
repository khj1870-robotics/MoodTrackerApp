interface FullPageProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FullPage({ title, onClose, children }: FullPageProps) {
  return (
    <div className="fixed inset-0 z-50 fade-in flex justify-center" style={{ background: 'rgba(42,39,48,0.5)' }}>
      <div className="relative w-full max-w-[430px] h-full flex flex-col bg-[#F7F4F0] sheet-enter">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3 flex-shrink-0 bg-[#F7F4F0]">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#7C6BE8] font-bold transition-all active:scale-90"
            style={{ background: '#F0EEFF' }}
          >
            ‹
          </button>
          <h2 className="text-lg font-black text-[#2A2730]">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
