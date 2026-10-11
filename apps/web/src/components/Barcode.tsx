import React from 'react';

interface BarcodeProps {
  value: string;
  height?: number;
  width?: number;
  showText?: boolean;
  className?: string;
}

// Code 128B Encoding Table (107 patterns, each pattern is 6 widths representing bar,space,bar,space,bar,space)
// Total width of each symbol is 11 modules (stop pattern has 7 widths = 13 modules).
const CODE128_PATTERNS: string[] = [
  "212222","222122","222221","121223","121322","131222","122213","122312","132212","221213",
  "221312","231212","112232","122132","122231","113222","123122","123221","223211","221132",
  "221231","213212","223112","312131","311222","321122","321221","312212","322112","322211",
  "212123","212321","232121","111323","131123","131321","112313","132113","132311","211313",
  "231113","231311","112133","112331","132131","113123","113321","133121","313121","211331",
  "231131","213113","213311","213131","311123","311321","331121","312113","312311","332111",
  "314111","221411","431111","111224","111422","121124","121421","141122","141221","112214",
  "112412","122114","122411","142112","142211","241211","221114","413111","241112","134111",
  "111242","121142","121241","114212","124112","124211","411212","421112","421211","212141",
  "214121","412121","111143","111341","131141","114113","114311","411113","411311","113141",
  "114131","311141","411131","211412","211214","211232","2331112"
];

function encodeCode128B(text: string): string[] {
  const codes: number[] = [104]; // Start B
  let checksum = 104;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    if (code >= 0 && code <= 95) {
      codes.push(code);
      checksum += code * (i + 1);
    }
  }

  codes.push(checksum % 103);
  codes.push(106); // Stop symbol

  return codes.map(c => CODE128_PATTERNS[c] || CODE128_PATTERNS[0]);
}

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  height = 54,
  showText = true,
  className = ''
}) => {
  if (!value) return null;

  const patterns = encodeCode128B(value);
  const bars: { width: number; isBar: boolean }[] = [];

  patterns.forEach((pattern) => {
    for (let i = 0; i < pattern.length; i++) {
      const width = parseInt(pattern[i], 10);
      const isBar = i % 2 === 0;
      bars.push({ width, isBar });
    }
  });

  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;
  const rects = bars.map((b, idx) => {
    const x = currentX;
    currentX += b.width;
    if (!b.isBar) return null;
    return (
      <rect
        key={idx}
        x={x}
        y={0}
        width={b.width}
        height={height}
        fill="#000000"
      />
    );
  });

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{ width: '100%', maxWidth: '320px', height: `${height}px` }}
        preserveAspectRatio="none"
        className="block"
      >
        {rects}
      </svg>
      {showText && (
        <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-slate-900 mt-1 uppercase">
          {value}
        </span>
      )}
    </div>
  );
};
