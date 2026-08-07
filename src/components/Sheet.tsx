interface SheetProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Sheet({ children, onClose }: SheetProps) {
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
