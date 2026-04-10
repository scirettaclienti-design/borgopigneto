import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import {
  GOLD,
  GOLD_LIGHT,
  BURGUNDY,
  INK,
  INK_LIGHT,
  drawStrokeHero,
  fadeIn,
} from "./lib/animationUtils";

/* ═══════════════════════════════════════════════════════════════════
   HERO: "MIXOLOGY VINTAGE"
   Elegant Boston shaker tilted, pouring into a frosted Martini coupe.
   Lemon zest twist, ice crystals, liquid stream. 800×400 engraving.
   ═══════════════════════════════════════════════════════════════════ */

export const HeroMixologyVintage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterScale = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 60, mass: 1 },
  });
  const masterOpacity = fadeIn(frame, 0, 15);

  // ═══ TIMING ═══
  // Phase 1: Martini coupe (0–50)
  // Phase 2: Boston shaker (20–65)
  // Phase 3: Liquid pour stream (45–100)
  // Phase 4: Lemon zest & garnish (60–110)
  // Phase 5: Frost, drops, sparkle, flourishes (80–150)

  // ═══════════════════════════════════
  // MARTINI COUPE GLASS (Right side)
  // ═══════════════════════════════════
  const coupePaths = [
    // Bowl - elegant wide V-shape with curved lip
    { d: "M 430,200 Q 435,195 440,192 Q 460,178 500,165 Q 540,155 570,150 Q 590,148 605,152 Q 615,158 612,168 Q 608,180 595,195 Q 575,215 555,228 Q 540,236 530,240", len: 350, start: 0, dur: 50, color: INK, sw: 2.2 },
    // Bowl other side
    { d: "M 430,200 Q 428,195 425,192 Q 418,185 430,210 Q 445,230 470,245 Q 490,252 510,255 Q 520,256 530,240", len: 250, start: 3, dur: 48, color: INK, sw: 2.2 },
    // Inner bowl line (liquid surface)
    { d: "M 448,198 Q 480,188 520,180 Q 555,175 580,172", len: 145, start: 20, dur: 30, color: BURGUNDY, sw: 1.2 },
    // Bowl highlight (glass reflection)
    { d: "M 460,192 Q 490,183 520,178", len: 65, start: 25, dur: 22, color: GOLD, sw: 0.6 },
    // Stem
    { d: "M 530,240 L 530,310", len: 70, start: 12, dur: 30, color: INK, sw: 2 },
    // Stem knob (decorative)
    { d: "M 524,275 Q 527,270 530,268 Q 533,270 536,275 Q 533,280 530,282 Q 527,280 524,275", len: 30, start: 18, dur: 20, color: INK, sw: 1.5 },
    // Base
    { d: "M 495,310 Q 505,305 515,308 Q 525,305 530,308 Q 535,305 545,308 Q 555,305 565,310", len: 80, start: 15, dur: 28, color: INK, sw: 2 },
    // Base bottom
    { d: "M 492,315 Q 530,308 568,315", len: 80, start: 17, dur: 26, color: INK, sw: 1.5 },
    // Base foot ring
    { d: "M 498,312 Q 530,306 562,312", len: 70, start: 19, dur: 24, color: INK_LIGHT, sw: 0.8 },
  ];

  // Frost/condensation on glass
  const frostLines: any[] = [];

  // ═══════════════════════════════════
  // BOSTON SHAKER (Left side, tilted)
  // ═══════════════════════════════════
  // Shaker is tilted ~30 degrees, pouring to the right
  const shakerTilt = interpolate(frame, [20, 50, 75, 100], [0, -25, -30, -28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const shakerPaths = [
    // Main body (tall tin)
    { d: "M 220,140 L 200,320 Q 198,335 210,340 L 290,340 Q 302,335 300,320 L 280,140", len: 520, start: 20, dur: 50, color: INK, sw: 2.2 },
    // Top rim
    { d: "M 220,140 Q 225,135 250,132 Q 275,135 280,140", len: 65, start: 25, dur: 25, color: INK, sw: 2 },
    // Pouring lip (small notch)
    { d: "M 278,140 Q 282,136 285,138 Q 286,142 282,145", len: 16, start: 30, dur: 18, color: INK, sw: 1.5 },
    // Body contour lines (metallic reflections)
    { d: "M 225,160 Q 228,230 222,300 Q 220,320 218,330", len: 175, start: 30, dur: 35, color: INK_LIGHT, sw: 0.8 },
    { d: "M 240,155 Q 242,225 238,295 Q 236,315 234,325", len: 175, start: 32, dur: 35, color: INK_LIGHT, sw: 0.6 },
    { d: "M 260,155 Q 258,225 262,295 Q 264,315 266,325", len: 175, start: 34, dur: 35, color: INK_LIGHT, sw: 0.6 },
    { d: "M 275,160 Q 272,230 278,300 Q 280,320 282,330", len: 175, start: 36, dur: 35, color: INK_LIGHT, sw: 0.8 },
    // Bottom rim
    { d: "M 200,320 Q 205,325 210,340", len: 25, start: 28, dur: 18, color: INK, sw: 1.5 },
    { d: "M 300,320 Q 295,325 290,340", len: 25, start: 28, dur: 18, color: INK, sw: 1.5 },
    // Engraved band (decorative middle ring)
    { d: "M 215,220 Q 230,215 250,214 Q 270,215 285,220", len: 75, start: 38, dur: 25, color: GOLD, sw: 1.2 },
    { d: "M 214,228 Q 230,223 250,222 Q 270,223 286,228", len: 76, start: 40, dur: 25, color: GOLD, sw: 1.2 },
    // Diamond pattern inside band
    { d: "M 225,220 L 232,224 L 225,228", len: 16, start: 45, dur: 15, color: GOLD, sw: 0.7 },
    { d: "M 240,220 L 247,224 L 240,228", len: 16, start: 47, dur: 15, color: GOLD, sw: 0.7 },
    { d: "M 255,220 L 262,224 L 255,228", len: 16, start: 49, dur: 15, color: GOLD, sw: 0.7 },
    { d: "M 270,220 L 277,224 L 270,228", len: 16, start: 51, dur: 15, color: GOLD, sw: 0.7 },
    // Metallic highlight streak
    { d: "M 232,150 L 230,200 L 228,260 L 226,310", len: 165, start: 42, dur: 30, color: GOLD_LIGHT, sw: 0.5 },
    // Ice visible at top
    { d: "M 230,145 Q 240,148 248,144 Q 256,148 268,145", len: 42, start: 50, dur: 20, color: INK_LIGHT, sw: 0.8 },
    { d: "M 238,150 Q 245,155 255,150", len: 20, start: 52, dur: 18, color: INK_LIGHT, sw: 0.6 },
  ];

  // ═══════════════════════════════════
  // LIQUID POUR STREAM
  // ═══════════════════════════════════
  const pourOpacity = interpolate(frame, [55, 65, 110, 130], [0, 0.8, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pourWobble = Math.sin(frame * 0.12) * 3;

  const pourPaths = [
    // Main stream - elegant arc from shaker to glass
    { d: `M 285,142 Q 320,130 360,135 Q 400,145 430,165 Q 455,182 470,195`, len: 220, start: 55, dur: 40, color: GOLD, sw: 1.8 },
    // Stream secondary line (thickness)
    { d: `M 283,146 Q 318,135 358,140 Q 398,150 428,170 Q 452,186 468,198`, len: 215, start: 57, dur: 38, color: GOLD, sw: 1 },
    // Drip trail highlights
    { d: "M 350,138 Q 355,140 358,145", len: 12, start: 65, dur: 15, color: GOLD_LIGHT, sw: 0.5 },
    { d: "M 400,155 Q 405,158 408,163", len: 12, start: 70, dur: 15, color: GOLD_LIGHT, sw: 0.5 },
    { d: "M 440,178 Q 445,182 447,188", len: 12, start: 75, dur: 15, color: GOLD_LIGHT, sw: 0.5 },
  ];

  // Splash droplets when liquid hits glass
  const splashDrops: any[] = [];

  // ═══════════════════════════════════
  // LEMON ZEST TWIST (Garnish on rim)
  // ═══════════════════════════════════
  const zestPaths = [
    // Twisted zest spiral
    { d: "M 600,155 Q 610,148 615,140 Q 618,130 612,122 Q 605,118 598,125 Q 595,135 600,142 Q 608,148 618,145 Q 625,140 628,130 Q 630,120 625,112", len: 120, start: 65, dur: 40, color: GOLD, sw: 1.5 },
    // Zest peel texture
    { d: "M 602,148 Q 608,142 610,135", len: 18, start: 72, dur: 18, color: GOLD_LIGHT, sw: 0.7 },
    { d: "M 612,138 Q 610,130 605,125", len: 16, start: 75, dur: 18, color: GOLD_LIGHT, sw: 0.6 },
    // Citrus oil spray dots (tiny)
    ...Array.from({ length: 5 }, (_, i) => ({
      d: `M ${615 + Math.cos(i * 1.2) * 12},${135 + Math.sin(i * 1.8) * 10} l 1,1`,
      len: 2,
      start: 85 + i * 3,
      dur: 10,
      color: GOLD_LIGHT,
      sw: 0.8,
    })),
    // Zest connecting to rim
    { d: "M 600,155 Q 604,158 608,160 Q 610,162 608,165", len: 18, start: 70, dur: 20, color: GOLD, sw: 1.2 },
  ];

  // ═══════════════════════════════════
  // ICE CRYSTALS (in shaker & around)
  // ═══════════════════════════════════
  const iceCrystals = [
    // Geometric ice shapes
    { d: "M 235,155 L 242,152 L 248,158 L 244,165 L 236,163 Z", len: 40, start: 55, dur: 22, color: INK_LIGHT, sw: 0.8 },
    { d: "M 253,148 L 260,145 L 265,150 L 262,156 L 255,155 Z", len: 35, start: 57, dur: 20, color: INK_LIGHT, sw: 0.7 },
    // Tiny crystal facets
    { d: "M 240,158 L 244,155", len: 5, start: 60, dur: 10, color: GOLD_LIGHT, sw: 0.4 },
    { d: "M 258,150 L 261,148", len: 4, start: 62, dur: 10, color: GOLD_LIGHT, sw: 0.4 },
    // Floating ice shard (ejecting during pour)
    { d: "M 310,135 L 315,130 L 320,135 L 316,140 Z", len: 22, start: 75, dur: 18, color: INK_LIGHT, sw: 0.7 },
  ];

  // ═══════════════════════════════════
  // CONDENSATION DROPS ON SHAKER
  // ═══════════════════════════════════
  const condensationDrops: any[] = [];

  // ═══════════════════════════════════
  // GOLDEN SPARKLE BURST (pour impact)
  // ═══════════════════════════════════
  const sparkles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const cx = 460 + Math.cos(angle) * (20 + i * 3);
    const cy = 190 + Math.sin(angle) * (15 + i * 2);
    return { cx, cy, delay: 82 + i * 2, size: 3 + (i % 3) };
  });

  // ═══════════════════════════════════
  // DECORATIVE FLOURISHES
  // ═══════════════════════════════════
  const flourishes = [
    // Art deco line under scene
    { d: "M 120,365 Q 280,355 400,358 Q 520,355 680,365", len: 580, start: 90, dur: 45, color: GOLD, sw: 1 },
    { d: "M 140,373 Q 280,365 400,367 Q 520,365 660,373", len: 540, start: 93, dur: 42, color: GOLD, sw: 0.6 },
    // Left scroll
    { d: "M 150,350 Q 140,340 135,330 Q 133,320 140,315 Q 148,312 152,320 Q 154,330 148,338 Q 142,345 150,348", len: 70, start: 100, dur: 32, color: GOLD, sw: 1 },
    { d: "M 140,315 Q 132,308 128,300", len: 20, start: 108, dur: 18, color: GOLD, sw: 0.7 },
    // Right scroll
    { d: "M 650,350 Q 660,340 665,330 Q 667,320 660,315 Q 652,312 648,320 Q 646,330 652,338 Q 658,345 650,348", len: 70, start: 102, dur: 32, color: GOLD, sw: 1 },
    { d: "M 660,315 Q 668,308 672,300", len: 20, start: 110, dur: 18, color: GOLD, sw: 0.7 },
    // Center diamond ornament
    { d: "M 390,375 L 400,368 L 410,375 L 400,382 Z", len: 40, start: 105, dur: 22, color: GOLD, sw: 0.8 },
    { d: "M 400,370 L 400,380", len: 10, start: 110, dur: 12, color: GOLD, sw: 0.5 },
    { d: "M 395,375 L 405,375", len: 10, start: 112, dur: 12, color: GOLD, sw: 0.5 },
    // Bar counter subtle line
    { d: "M 160,345 L 640,345", len: 480, start: 85, dur: 40, color: INK, sw: 1.8 },
    { d: "M 165,348 L 635,348", len: 470, start: 87, dur: 38, color: INK_LIGHT, sw: 0.8 },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fdf8ef",
      }}
    >
      <svg
        viewBox="80 60 640 340"
        width="800"
        height="400"
        style={{
          transform: `scale(${masterScale})`,
          opacity: masterOpacity,
          overflow: "visible",
        }}
      >
        <defs>
          <radialGradient id="pourGlow" cx="60%" cy="50%" r="35%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.2} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.8} />
            <stop offset="100%" stopColor={BURGUNDY} stopOpacity={0.4} />
          </linearGradient>
        </defs>

        {/* Coupe glass */}
        {coupePaths.map((p, i) => (
          <path
            key={`coupe-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}

        {/* Frost lines on glass */}
        {frostLines.map((p, i) => (
          <path
            key={`frost-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            opacity={0.5}
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}

        {/* Boston shaker (tilts during pour) */}
        <g
          style={{
            transform: `rotate(${shakerTilt}deg)`,
            transformOrigin: "250px 340px",
          }}
        >
          {shakerPaths.map((p, i) => (
            <path
              key={`shaker-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}

          {/* Ice crystals in shaker */}
          {iceCrystals.map((p, i) => (
            <path
              key={`ice-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}

          {/* Condensation */}
          {condensationDrops.map((p, i) => (
            <path
              key={`cond-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}
        </g>

        {/* Pour glow */}
        <ellipse
          cx="420"
          cy="170"
          rx="60"
          ry="40"
          fill="url(#pourGlow)"
          opacity={pourOpacity * 0.6}
        />

        {/* Liquid pour stream */}
        <g
          opacity={pourOpacity}
          style={{ transform: `translateX(${pourWobble}px)` }}
        >
          {pourPaths.map((p, i) => (
            <path
              key={`pour-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}
        </g>

        {/* Splash drops at glass */}
        {splashDrops.map((drop, i) => {
          const dropProg = spring({
            frame: Math.max(0, frame - drop.delay),
            fps,
            config: { damping: 12, stiffness: 140, mass: 0.3 },
          });
          const dropFade = interpolate(
            frame,
            [drop.delay + 12, drop.delay + 28],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const rad = (drop.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * drop.dist * dropProg;
          const dy = Math.sin(rad) * drop.dist * dropProg;
          return (
            <circle
              key={`splash-${i}`}
              cx={drop.x + dx}
              cy={drop.y + dy}
              r={1.5 * dropProg}
              fill="none"
              stroke={GOLD}
              strokeWidth={0.7}
              opacity={dropFade * 0.7}
            />
          );
        })}

        {/* Lemon zest */}
        {zestPaths.map((p, i) => (
          <path
            key={`zest-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}

        {/* Sparkles at pour impact */}
        {sparkles.map((s, i) => {
          const sScale = spring({
            frame: Math.max(0, frame - s.delay),
            fps,
            config: { damping: 8, stiffness: 200, mass: 0.2 },
          });
          const sFade = interpolate(
            frame,
            [s.delay + 15, s.delay + 30],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <g key={`sparkle-${i}`} opacity={sFade}>
              <line
                x1={s.cx - s.size * sScale}
                y1={s.cy}
                x2={s.cx + s.size * sScale}
                y2={s.cy}
                stroke={GOLD}
                strokeWidth={0.6}
                strokeLinecap="round"
              />
              <line
                x1={s.cx}
                y1={s.cy - s.size * sScale}
                x2={s.cx}
                y2={s.cy + s.size * sScale}
                stroke={GOLD}
                strokeWidth={0.6}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Decorative flourishes */}
        {flourishes.map((p, i) => (
          <path
            key={`flourish-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}
      </svg>
    </div>
  );
};
