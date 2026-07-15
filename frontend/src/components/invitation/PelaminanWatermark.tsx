export default function PelaminanWatermark() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4"
      style={{
        background: 'rgba(44, 26, 14, 0.90)',
        borderTop: '1px solid #C8A96E',
        minHeight: '48px',
      }}
    >
      {/* Pelaminan logo text */}
      <span
        className="font-cormorant italic text-lg leading-none"
        style={{ color: '#C8A96E' }}
      >
        Pelaminan
      </span>

      {/* Separator */}
      <span
        className="text-xs hidden sm:inline"
        style={{ color: 'rgba(200, 169, 110, 0.4)' }}
      >
        ·
      </span>

      {/* CTA text */}
      <span
        className="font-cinzel text-[10px] tracking-wide"
        style={{ color: 'rgba(250, 247, 242, 0.7)' }}
      >
        Buat undangan digitalmu di
      </span>

      {/* Link */}
      <a
        href="https://pelaminan.id"
        target="_blank"
        rel="noopener noreferrer"
        className="font-cinzel text-[10px] tracking-wide hover:opacity-80 transition-opacity"
        style={{ color: '#C8A96E' }}
      >
        pelaminan.id
      </a>
    </div>
  )
}
