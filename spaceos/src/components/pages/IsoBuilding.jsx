import { getFloorData } from "../../data";

// ── Isometric constants ────────────────────────────────────────────────────
// W = x-axis dimension (goes right-down in screen → narrow right face)
// D = y-axis dimension (goes left-down in screen → wide left face = main facade)
const W = 46; // floor width  (x-axis, right face — narrower)
const D = 80; // floor depth  (y-axis, left face — wider, main facade)
const H = 16; // floor height
const GAP = 5; // gap between floor slabs
const COS30 = 0.866;
const SIN30 = 0.5;

function iso(x, y, z, ox, oy) {
  return [ox + (x - y) * COS30, oy - z + (x + y) * SIN30];
}
function ptStr(pts, ox, oy) {
  return pts.map(([x, y, z]) => iso(x, y, z, ox, oy).join(",")).join(" ");
}
function getZone(idx, total) {
  if (idx < Math.ceil(total * 0.34)) return "lower";
  if (idx < Math.ceil(total * 0.67)) return "mid";
  return "upper";
}

const HVAC_PAL = {
  Cool: {
    accent: "#00b4ff",
    wall: "rgba(0,130,255,0.06)",
    top: "rgba(0,150,255,0.09)",
  },
  Heat: {
    accent: "#ff6030",
    wall: "rgba(255,90,40,0.07)",
    top: "rgba(255,100,50,0.10)",
  },
  Fan: {
    accent: "#69f0ae",
    wall: "rgba(90,235,165,0.04)",
    top: "rgba(90,235,165,0.06)",
  },
  Auto: {
    accent: "#00d4ff",
    wall: "rgba(0,200,255,0.05)",
    top: "rgba(0,210,255,0.08)",
  },
};

// Main facade windows: on the LEFT face (x=W, y varies within [0, D=80])
const WIN_MAIN = [
  { y: 10, w: 22 }, // y: 10–32  ✓ fits in D=80
  { y: 48, w: 22 }, // y: 48–70  ✓ fits in D=80
];

export default function IsoBuilding({
  buildingId,
  floors: n,
  selectedFloor,
  onFloorSelect,
  abbrev,
  lights = { upper: true, mid: true, lower: true, common: true },
  brightness = 75,
  hvacMode = "Auto",
  hvacA = true,
  hvacB = false,
  hvacTemp = 72,
}) {
  const hvacOn = hvacA || hvacB;
  const pal = HVAC_PAL[hvacMode] || HVAC_PAL.Auto;
  const bF = brightness / 100;

  const ox = 190;
  const oy = 282;

  const clipDefs = [];
  const floorElems = [];

  for (let i = 0; i < n; i++) {
    const fd = getFloorData(buildingId, i + 1);
    const sel = i === selectedFloor;
    const zone = getZone(i, n);
    const lit = lights[zone] && bF > 0;
    const litF = lit ? bF : 0;

    const zB = i * (H + GAP);
    const zT = zB + H;

    // Face fills
    const mainFill = sel ? "rgba(0,175,215,0.50)" : "rgba(14,24,42,0.92)"; // left face (main)
    const sideFill = sel ? "rgba(0,145,180,0.45)" : "rgba(10,20,38,0.95)"; // right face
    const topFill = sel ? "rgba(0,210,255,0.35)" : "rgba(18,30,52,0.88)";
    const stroke = sel ? "rgba(0,212,255,0.80)" : "rgba(255,255,255,0.06)";
    const sw = sel ? 1.5 : 0.5;

    // pRight = y=0 face (x from 0→W, goes RIGHT-DOWN, narrow)
    // pLeft  = x=W face (y from 0→D, goes LEFT-DOWN, wide — main facade)
    const pRight = ptStr(
      [
        [0, 0, zB],
        [W, 0, zB],
        [W, 0, zT],
        [0, 0, zT],
      ],
      ox,
      oy,
    );
    const pLeft = ptStr(
      [
        [W, 0, zB],
        [W, D, zB],
        [W, D, zT],
        [W, 0, zT],
      ],
      ox,
      oy,
    );
    const pTop = ptStr(
      [
        [0, 0, zT],
        [W, 0, zT],
        [W, D, zT],
        [0, D, zT],
      ],
      ox,
      oy,
    );

    // ClipPath for the main (left) facade
    const clipId = `cl${i}`;
    clipDefs.push(
      <clipPath key={clipId} id={clipId}>
        <polygon points={pLeft} />
      </clipPath>,
    );

    // ── Main facade windows (left face, y-axis positions) ───────────────
    const winH = H * 0.52;
    const winZ = zB + H * 0.24;

    const winElems = WIN_MAIN.map(({ y: wy, w: ww }, wi) => {
      const wPts = ptStr(
        [
          [W, wy, winZ],
          [W, wy + ww, winZ],
          [W, wy + ww, winZ + winH],
          [W, wy, winZ + winH],
        ],
        ox,
        oy,
      );
      const alpha = lit ? 0.08 + litF * 0.5 : 0.02;
      const wStroke = lit
        ? `rgba(255,200,80,${0.18 + litF * 0.38})`
        : "rgba(40,65,110,0.18)";
      return (
        <g key={wi}>
          {lit && litF > 0.15 && (
            <polygon
              points={wPts}
              fill={`rgba(255,215,90,${litF * 0.22})`}
              filter="url(#wGlow)"
            />
          )}
          <polygon
            points={wPts}
            fill={`rgba(255,215,90,${alpha})`}
            stroke={wStroke}
            strokeWidth={0.5}
          />
        </g>
      );
    });

    // ── Side window on right face (y=0, x varies within [0, W=46]) ──────
    const swPts = ptStr(
      [
        [12, 0, winZ],
        [30, 0, winZ],
        [30, 0, winZ + winH],
        [12, 0, winZ + winH],
      ],
      ox,
      oy,
    );
    const swAlpha = lit ? 0.05 + litF * 0.36 : 0.02;

    // Top-face grid lines
    const gridElems =
      sel || lit
        ? [0.33, 0.66].map((t, gi) => {
            const gy = D * t;
            return (
              <line
                key={gi}
                x1={iso(0, gy, zT, ox, oy)[0]}
                y1={iso(0, gy, zT, ox, oy)[1]}
                x2={iso(W, gy, zT, ox, oy)[0]}
                y2={iso(W, gy, zT, ox, oy)[1]}
                stroke={`rgba(255,255,255,${sel ? 0.12 : 0.05})`}
                strokeWidth={0.4}
              />
            );
          })
        : [];

    // Occupancy pulse dot on top face
    const [dotX, dotY] = iso(W * 0.45, D * 0.42, zT + 2.5, ox, oy);
    const occDot = fd.occupied ? (
      <g>
        <circle cx={dotX} cy={dotY} r={4.5} fill="#00e676" opacity={0.08}>
          <animate
            attributeName="r"
            values="4.5;7;4.5"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.08;0.03;0.08"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={dotX} cy={dotY} r={2.8} fill="#00e676" opacity={0.85}>
          <animate
            attributeName="opacity"
            values="0.85;0.35;0.85"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    ) : null;

    // Floor label — right of the right face
    const [lx, ly] = iso(W + 4, 0, zB + H * 0.5, ox, oy);

    floorElems.push(
      <g key={i} onClick={() => onFloorSelect(i)} style={{ cursor: "pointer" }}>
        {/* Right face (narrow) */}
        <polygon
          points={pRight}
          fill={sideFill}
          stroke={stroke}
          strokeWidth={sw}
        />
        {/* Left face (wide, main facade) */}
        <polygon
          points={pLeft}
          fill={mainFill}
          stroke={stroke}
          strokeWidth={sw}
        />
        {/* Top face */}
        <polygon
          points={pTop}
          fill={topFill}
          stroke={stroke}
          strokeWidth={sw}
        />
        {/* HVAC tint overlay */}
        {hvacOn && (
          <>
            <polygon points={pLeft} fill={pal.wall} />
            <polygon points={pRight} fill={pal.wall} />
            <polygon points={pTop} fill={pal.top} />
          </>
        )}
        {/* Top grid lines */}
        {gridElems}
        {/* Main facade windows (clipped to left face) */}
        <g clipPath={`url(#${clipId})`}>{winElems}</g>
        {/* Right face window */}
        <polygon
          points={swPts}
          fill={`rgba(255,215,90,${swAlpha})`}
          stroke={
            lit
              ? `rgba(255,195,75,${0.12 + litF * 0.28})`
              : "rgba(35,58,100,0.16)"
          }
          strokeWidth={0.4}
        />
        {/* Occupancy pulse */}
        {occDot}
        {/* Floor label */}
        <text
          x={lx + 3}
          y={ly + 2.5}
          fontSize={6.5}
          textAnchor="start"
          fill={sel ? "#00d4ff" : "rgba(70,90,130,0.50)"}
          fontFamily="'Space Mono', monospace"
        >
          F{i + 1}
        </text>
      </g>,
    );
  }

  // ── Roof ────────────────────────────────────────────────────────────────
  const roofZ = n * (H + GAP) - GAP;

  // HVAC units: same (x,y) on roof top-left, different z → clean vertical stack in screen
  const [u1x, u1y] = iso(9, 56, roofZ + 4, ox, oy);
  const [u2x, u2y] = iso(9, 56, roofZ + 20, ox, oy);

  function HvacUnit({ cx, cy, label, active }) {
    return (
      <g opacity={active ? 1 : 0.35}>
        <rect
          x={cx - 7}
          y={cy - 4}
          width={14}
          height={8}
          rx={1.5}
          fill="rgba(5,12,26,0.92)"
          stroke={pal.accent}
          strokeWidth={active ? 0.8 : 0.4}
        />
        {[0, 1].map((s) => (
          <line
            key={s}
            x1={cx - 3 + s * 5}
            y1={cy - 2.5}
            x2={cx - 3 + s * 5}
            y2={cy + 2.5}
            stroke={pal.accent}
            strokeWidth={0.6}
            opacity={0.85}
          />
        ))}
        <text
          x={cx}
          y={cy - 7}
          fontSize={4.5}
          fill={pal.accent}
          textAnchor="middle"
          fontFamily="'Space Mono', monospace"
          fontWeight="700"
        >
          {label}
        </text>
        {active && (
          <circle cx={cx} cy={cy} r={1.2} fill={pal.accent}>
            <animate
              attributeName="cy"
              values={`${cy};${cy - 12}`}
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
    );
  }

  // ── HVAC mode badge — pushed well right of the model ──────────────────
  const [badgeX, badgeY] = iso(W + 26, 0, roofZ * 0.5, ox, oy);

  // ── Zone lighting indicators (light-bulb icons, left of main facade) ──
  const zoneDots = ["lower", "mid", "upper"].map((zone, zi) => {
    const zf = Math.floor((n * (zi + 0.5)) / 3);
    const zk = zf * (H + GAP) + H * 0.5;
    const [zx, zy] = iso(W, D + 18, zk, ox, oy);
    const on = lights[zone] && bF > 0;
    const lum = on ? 0.3 + bF * 0.62 : 0;

    return (
      <g key={zone}>
        {on && bF > 0.1 && (
          <circle cx={zx} cy={zy} r={7} fill={`rgba(255,210,70,${bF * 0.1})`} />
        )}
        {/* Bulb globe */}
        <circle
          cx={zx}
          cy={zy - 1}
          r={3.8}
          fill={on ? `rgba(255,220,80,${lum})` : "rgba(22,38,66,0.70)"}
          stroke={
            on ? `rgba(255,195,65,${0.25 + bF * 0.35})` : "rgba(35,56,92,0.38)"
          }
          strokeWidth={0.6}
        >
          {on && bF > 0.1 && (
            <animate
              attributeName="opacity"
              values="1;0.65;1"
              dur={`${1.8 + zi * 0.4}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
        {/* Bulb base */}
        <rect
          x={zx - 1.6}
          y={zy + 2.5}
          width={3.2}
          height={1.5}
          rx={0.5}
          fill={
            on ? `rgba(255,195,65,${0.28 + bF * 0.22})` : "rgba(32,50,84,0.45)"
          }
        />
        <rect
          x={zx - 1.2}
          y={zy + 3.8}
          width={2.4}
          height={0.8}
          rx={0.3}
          fill={
            on ? `rgba(255,195,65,${0.18 + bF * 0.18})` : "rgba(30,46,78,0.38)"
          }
        />
      </g>
    );
  });

  // ── Building label — well above the roof ────────────────────────────────
  const [lblX, lblY] = iso(W / 2, D / 2, roofZ + 50, ox, oy);

  return (
    <svg viewBox="30 30 310 350" style={{ width: "100%", height: "100%" }}>
      <defs>
        <filter id="wGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
        </filter>
        {clipDefs}
      </defs>

      {floorElems}

      {/* HVAC units on roof */}
      <HvacUnit cx={u1x} cy={u1y} label="A" active={hvacA} />
      {n > 4 && <HvacUnit cx={u2x} cy={u2y} label="B" active={hvacB} />}

      {/* HVAC mode badge — right side, clear of building */}
      <rect
        x={badgeX}
        y={badgeY - 9}
        width={84}
        height={17}
        rx={3.5}
        fill="rgba(5,12,26,0.90)"
        stroke={hvacOn ? pal.accent : "rgba(255,255,255,0.07)"}
        strokeWidth={0.75}
      />
      {/* Rotating fan icon */}
      <g transform={`translate(${badgeX + 8},${badgeY - 0.5})`}>
        <circle
          cx={0}
          cy={0}
          r={2.6}
          fill="none"
          stroke={hvacOn ? pal.accent : "rgba(75,95,140,0.30)"}
          strokeWidth={0.7}
        />
        <line
          x1={0}
          y1={-2.6}
          x2={0}
          y2={2.6}
          stroke={hvacOn ? pal.accent : "rgba(75,95,140,0.25)"}
          strokeWidth={0.6}
        />
        <line
          x1={-2.6}
          y1={0}
          x2={2.6}
          y2={0}
          stroke={hvacOn ? pal.accent : "rgba(75,95,140,0.25)"}
          strokeWidth={0.6}
        />
        {hvacOn && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </g>
      <text
        x={badgeX + 18}
        y={badgeY + 3}
        fontSize={7}
        fontWeight="700"
        fill={hvacOn ? pal.accent : "rgba(60,80,125,0.55)"}
        fontFamily="'Space Mono', monospace"
      >
        {hvacMode.toUpperCase()} · {hvacTemp}°F
      </text>

      {/* Zone lighting indicators */}
      {zoneDots}

      {/* Building name */}
      <text
        x={lblX}
        y={lblY}
        fontSize={9}
        fill="rgba(0,212,255,0.28)"
        textAnchor="middle"
        fontFamily="'Space Mono', monospace"
        fontWeight="700"
      >
        {abbrev}
      </text>
    </svg>
  );
}
