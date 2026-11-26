import type { ItemCategory, RegionId } from '../types/game';

interface GeoRushSvgProps {
  region: RegionId;
  regionLabel: string;
  category: ItemCategory;
  categoryLabel: string;
  lat: number;
  lon: number;
  riverPath?: Array<[number, number]>;
  cluesRevealed: 1 | 2 | 3;
  secondsLeft: number;
  totalDuration: number;
  caption: string;
}

const WIDTH = 420;
const HEIGHT = 210;

function projectPoint(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * WIDTH;
  const y = ((90 - lat) / 180) * HEIGHT;
  return { x, y };
}

const REGION_BOXES: Record<RegionId, { x: number; y: number; w: number; h: number }> = {
  americas: { x: 42, y: 20, w: 132, h: 165 },
  europe: { x: 185, y: 24, w: 62, h: 48 },
  africa: { x: 188, y: 74, w: 72, h: 78 },
  middle_east: { x: 235, y: 54, w: 46, h: 42 },
  asia: { x: 264, y: 28, w: 122, h: 98 },
  oceania: { x: 325, y: 126, w: 86, h: 66 },
};

// Simplified clean world landmass paths in equirectangular 420x210 coordinate space
const CONTINENT_PATHS = [
  // North & Central America
  'M 42 36 L 78 24 L 122 24 L 146 38 L 134 56 L 116 64 L 106 78 L 115 88 L 96 96 L 80 78 L 62 66 L 44 48 Z',
  // Greenland
  'M 138 14 L 164 12 L 172 28 L 152 34 L 140 24 Z',
  // South America
  'M 118 100 L 142 104 L 166 122 L 156 148 L 140 176 L 128 182 L 122 152 L 112 122 Z',
  // Europe
  'M 192 58 L 198 42 L 214 28 L 236 28 L 244 42 L 238 58 L 222 62 L 202 64 Z',
  // Africa
  'M 192 74 L 224 72 L 246 84 L 256 106 L 242 138 L 226 148 L 214 128 L 204 106 L 188 92 Z',
  // Eurasia / Asia
  'M 244 38 L 288 26 L 348 28 L 386 42 L 372 64 L 352 78 L 332 92 L 314 104 L 296 92 L 278 96 L 264 78 L 242 66 Z',
  // Maritime SE Asia
  'M 326 104 L 342 102 L 352 112 L 334 114 Z',
  // Australia & New Zealand
  'M 338 134 L 374 130 L 386 148 L 372 162 L 340 156 Z M 396 156 L 406 148 L 408 164 L 398 172 Z',
];

export function GeoRushSvg({
  region,
  regionLabel,
  category,
  categoryLabel,
  lat,
  lon,
  riverPath,
  cluesRevealed,
  secondsLeft,
  totalDuration,
  caption,
}: GeoRushSvgProps) {
  const target = projectPoint(lat, lon);
  const sector = REGION_BOXES[region];

  // Center of broad Clue 1 halo stays slightly offset deterministically from exact pin so Clue 1 narrows region without spoiling exact spot
  const haloX = sector.x + sector.w * 0.5;
  const haloY = sector.y + sector.h * 0.5;

  const clue2X = (haloX + target.x) / 2;
  const clue2Y = (haloY + target.y) / 2;

  const progress = Math.max(0, Math.min(1, secondsLeft / Math.max(1, totalDuration)));
  const ringRadius = 15;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - progress);
  const timerColor = secondsLeft <= 15 ? '#DC2626' : secondsLeft <= 30 ? '#D97706' : '#1E40AF';

  const projectedRiver =
    riverPath && riverPath.length > 1
      ? riverPath
          .map(([rLat, rLon], idx) => {
            const p = projectPoint(rLat, rLon);
            return `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          })
          .join(' ')
      : null;

  return (
    <figure className="w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`${caption}: ${regionLabel} · ${categoryLabel}`}
        className="block h-auto w-full select-none"
      >
        <defs>
          <pattern id="geoGrid" width="35" height="35" patternUnits="userSpaceOnUse">
            <path
              d="M 35 0 L 0 0 0 35"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Ocean canvas & graticule */}
        <rect width={WIDTH} height={HEIGHT} fill="#F8FAFC" />
        <rect width={WIDTH} height={HEIGHT} fill="url(#geoGrid)" />

        {/* Equator & Prime Meridian hairlines */}
        <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={WIDTH / 2} y1="0" x2={WIDTH / 2} y2={HEIGHT} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

        {/* Stylized Continents */}
        <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" strokeLinejoin="round">
          {CONTINENT_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Highlighted Target Region Sector */}
        <rect
          x={sector.x}
          y={sector.y}
          width={sector.w}
          height={sector.h}
          rx="6"
          fill="#1E40AF"
          fillOpacity="0.08"
          stroke="#1E40AF"
          strokeWidth="1.25"
          strokeDasharray="4 3"
        />

        {/* Clue 1: Broad Sector Beacon */}
        {cluesRevealed === 1 && (
          <g>
            <circle cx={haloX} cy={haloY} r="28" fill="#D97706" fillOpacity="0.14" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={haloX} cy={haloY} r="4" fill="#D97706" />
          </g>
        )}

        {/* Clue 2: Tighter Meridian/Parallel Reticle */}
        {cluesRevealed === 2 && (
          <g>
            <circle cx={clue2X} cy={clue2Y} r="18" fill="#1E40AF" fillOpacity="0.12" stroke="#1E40AF" strokeWidth="1.5" />
            <line x1={clue2X - 24} y1={clue2Y} x2={clue2X + 24} y2={clue2Y} stroke="#1E40AF" strokeWidth="1" />
            <line x1={clue2X} y1={clue2Y - 24} x2={clue2X} y2={clue2Y + 24} stroke="#1E40AF" strokeWidth="1" />
          </g>
        )}

        {/* Clue 3: Precision Target Coordinates + Category Motif */}
        {cluesRevealed === 3 && (
          <g>
            {projectedRiver && (
              <path
                d={projectedRiver}
                fill="none"
                stroke="#0284C7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <circle cx={target.x} cy={target.y} r="11" fill="#059669" fillOpacity="0.18" stroke="#059669" strokeWidth="1.5" />
            {category === 'monuments' ? (
              <polygon
                points={`${target.x},${target.y - 6} ${target.x + 5},${target.y + 4} ${target.x - 5},${target.y + 4}`}
                fill="#059669"
              />
            ) : category === 'capitals' ? (
              <circle cx={target.x} cy={target.y} r="4.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.5" />
            ) : (
              <circle cx={target.x} cy={target.y} r="4" fill="#059669" />
            )}
          </g>
        )}

        {/* Integrated SVG Countdown Gauge */}
        <g transform="translate(382, 32)">
          <circle cx="0" cy="0" r="19" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="0" cy="0" r={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle
            cx="0"
            cy="0"
            r={ringRadius}
            fill="none"
            stroke={timerColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90)"
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="700"
            fill="#0F172A"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {secondsLeft}
          </text>
        </g>

        {/* Bottom Schematic Strip */}
        <g transform="translate(10, 196)">
          <text x="0" y="0" fontSize="9.5" fontWeight="600" fill="#475569">
            {regionLabel} · {categoryLabel}
          </text>
        </g>
      </svg>
    </figure>
  );
}
