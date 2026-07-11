interface PelaminanOrnamentProps {
  width?: number
  height?: number
  className?: string
}

export default function PelaminanOrnament({ width = 400, height = 400, className = '' }: PelaminanOrnamentProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background fill */}
      <rect width="400" height="400" fill="none" />

      {/* === CORNER ORNAMENTS === */}
      {/* Top-left lotus */}
      <g transform="translate(30,30)">
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(-45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(90)" />
        <circle cx="0" cy="0" r="5" fill="#6B3F2A" />
      </g>
      {/* Top-right lotus */}
      <g transform="translate(370,30)">
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(-45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(90)" />
        <circle cx="0" cy="0" r="5" fill="#6B3F2A" />
      </g>
      {/* Bottom-left lotus */}
      <g transform="translate(30,370)">
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(-45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(90)" />
        <circle cx="0" cy="0" r="5" fill="#6B3F2A" />
      </g>
      {/* Bottom-right lotus */}
      <g transform="translate(370,370)">
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(-45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.7" transform="rotate(45)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(0)" />
        <ellipse cx="0" cy="0" rx="18" ry="8" fill="#C8A96E" opacity="0.5" transform="rotate(90)" />
        <circle cx="0" cy="0" r="5" fill="#6B3F2A" />
      </g>

      {/* === PARANG BORDER (top) === */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <path
          key={`pt${i}`}
          d={`M${40 + i*32},16 Q${48 + i*32},8 ${56 + i*32},16 Q${64 + i*32},24 ${72 + i*32},16`}
          stroke="#C8A96E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      ))}
      {/* Parang border bottom */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <path
          key={`pb${i}`}
          d={`M${40 + i*32},384 Q${48 + i*32},392 ${56 + i*32},384 Q${64 + i*32},376 ${72 + i*32},384`}
          stroke="#C8A96E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      ))}
      {/* Parang border left */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <path
          key={`pl${i}`}
          d={`M16,${40 + i*32} Q8,${48 + i*32} 16,${56 + i*32} Q24,${64 + i*32} 16,${72 + i*32}`}
          stroke="#C8A96E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      ))}
      {/* Parang border right */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <path
          key={`pr${i}`}
          d={`M384,${40 + i*32} Q392,${48 + i*32} 384,${56 + i*32} Q376,${64 + i*32} 384,${72 + i*32}`}
          stroke="#C8A96E"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      ))}

      {/* === OUTER BORDER FRAME === */}
      <rect x="12" y="12" width="376" height="376" rx="4" stroke="#C8A96E" strokeWidth="1" fill="none" opacity="0.4" />
      <rect x="20" y="20" width="360" height="360" rx="2" stroke="#6B3F2A" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* === KAWUNG MEDALLION CENTER === */}
      {/* Outer ring */}
      <circle cx="200" cy="200" r="100" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="200" cy="200" r="90" stroke="#6B3F2A" strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* Kawung petals — 4 overlapping circles */}
      <circle cx="200" cy="160" r="38" fill="#6B3F2A" opacity="0.15" />
      <circle cx="200" cy="240" r="38" fill="#6B3F2A" opacity="0.15" />
      <circle cx="160" cy="200" r="38" fill="#6B3F2A" opacity="0.15" />
      <circle cx="240" cy="200" r="38" fill="#6B3F2A" opacity="0.15" />

      <circle cx="200" cy="160" r="38" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="200" cy="240" r="38" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="160" cy="200" r="38" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="240" cy="200" r="38" stroke="#C8A96E" strokeWidth="1.5" fill="none" opacity="0.7" />

      {/* Diagonal kawung petals */}
      <circle cx="173" cy="173" r="28" stroke="#6B3F2A" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="227" cy="173" r="28" stroke="#6B3F2A" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="173" cy="227" r="28" stroke="#6B3F2A" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="227" cy="227" r="28" stroke="#6B3F2A" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Center circle */}
      <circle cx="200" cy="200" r="22" fill="#6B3F2A" opacity="0.2" />
      <circle cx="200" cy="200" r="22" stroke="#C8A96E" strokeWidth="2" fill="none" opacity="0.9" />
      <circle cx="200" cy="200" r="14" fill="#C8A96E" opacity="0.3" />
      <circle cx="200" cy="200" r="8" fill="#C8A96E" opacity="0.7" />
      <circle cx="200" cy="200" r="3" fill="#2C1A0E" opacity="0.8" />

      {/* === RADIAL LINES from center === */}
      {[0,45,90,135,180,225,270,315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x1 = 200 + 25 * Math.cos(rad)
        const y1 = 200 + 25 * Math.sin(rad)
        const x2 = 200 + 88 * Math.cos(rad)
        const y2 = 200 + 88 * Math.sin(rad)
        return (
          <line
            key={`rl${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C8A96E"
            strokeWidth="0.8"
            opacity="0.4"
          />
        )
      })}

      {/* === DIAMOND ACCENTS at cardinal points === */}
      {/* Top */}
      <polygon points="200,102 206,112 200,122 194,112" fill="#C8A96E" opacity="0.6" />
      {/* Bottom */}
      <polygon points="200,298 206,288 200,278 194,288" fill="#C8A96E" opacity="0.6" />
      {/* Left */}
      <polygon points="102,200 112,194 122,200 112,206" fill="#C8A96E" opacity="0.6" />
      {/* Right */}
      <polygon points="298,200 288,194 278,200 288,206" fill="#C8A96E" opacity="0.6" />

      {/* === SMALL STAR DOTS along ring === */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = 200 + 100 * Math.cos(rad)
        const y = 200 + 100 * Math.sin(rad)
        return <circle key={`sd${i}`} cx={x} cy={y} r="2.5" fill="#C8A96E" opacity="0.7" />
      })}

      {/* === MID RING decorative === */}
      <circle cx="200" cy="200" r="140" stroke="#C8A96E" strokeWidth="0.8" strokeDasharray="4 6" fill="none" opacity="0.3" />

      {/* === VINE TENDRILS (simplified) === */}
      <path d="M200,60 C210,80 190,100 200,110" stroke="#C8A96E" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M200,340 C190,320 210,300 200,290" stroke="#C8A96E" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M60,200 C80,210 100,190 110,200" stroke="#C8A96E" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M340,200 C320,190 300,210 290,200" stroke="#C8A96E" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  )
}
