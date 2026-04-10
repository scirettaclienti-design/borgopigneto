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
  BURGUNDY,
  INK,
  INK_LIGHT,
  drawStrokeHero,
  drawStroke,
  fadeIn,
} from "./lib/animationUtils";

/* ═══════════════════════════════════════════════════════════════════
   HERO: "LA PALA NEL FORNO"
   Monumental brick dome oven, frontal view. Live flames inside,
   wooden peel sliding a pizza in. Dense engraving style, 800×400.
   ═══════════════════════════════════════════════════════════════════ */

export const HeroPalaNelForno: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterScale = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 60, mass: 1 },
  });
  const masterOpacity = fadeIn(frame, 0, 15);

  // ═══ TIMING ═══
  // Phase 1: Oven dome structure (0–50)
  // Phase 2: Brick details & arch (20–70)
  // Phase 3: Fire & embers (40–90)
  // Phase 4: Peel & pizza slide-in (50–110)
  // Phase 5: Smoke, sparks, decorative (80–150)

  // ═══════════════════════════════════
  // OVEN DOME — OUTER STRUCTURE
  // ═══════════════════════════════════
  const ovenStructure = [
    // Grand dome arch
    { d: "M 200,350 L 200,220 Q 200,120 300,80 Q 370,58 400,55 Q 430,58 500,80 Q 600,120 600,220 L 600,350", len: 750, start: 0, dur: 55, color: INK, sw: 2.5 },
    // Inner dome arch (opening)
    { d: "M 260,350 L 260,240 Q 260,170 320,140 Q 370,125 400,122 Q 430,125 480,140 Q 540,170 540,240 L 540,350", len: 560, start: 8, dur: 50, color: INK, sw: 2 },
    // Keystone at apex
    { d: "M 385,58 L 390,48 L 400,45 L 410,48 L 415,58", len: 40, start: 15, dur: 22, color: INK, sw: 2 },
    // Keystone cross detail
    { d: "M 395,50 L 405,50", len: 10, start: 20, dur: 12, color: GOLD, sw: 1 },
    { d: "M 400,46 L 400,56", len: 10, start: 22, dur: 12, color: GOLD, sw: 1 },
    // Floor line
    { d: "M 150,350 L 650,350", len: 500, start: 5, dur: 40, color: INK, sw: 2.5 },
    // Oven floor interior
    { d: "M 265,350 L 535,350", len: 270, start: 10, dur: 30, color: INK_LIGHT, sw: 1 },
    // Chimney
    { d: "M 380,55 L 375,25 L 370,15 Q 385,8 400,5 Q 415,8 430,15 L 425,25 L 420,55", len: 120, start: 18, dur: 35, color: INK, sw: 1.8 },
    // Chimney cap
    { d: "M 365,18 Q 385,10 400,8 Q 415,10 435,18", len: 75, start: 25, dur: 22, color: INK, sw: 1.5 },
  ];

  // ═══════════════════════════════════
  // BRICKS — Dense engraving pattern
  // ═══════════════════════════════════
  const brickRows: Array<{
    d: string;
    len: number;
    start: number;
    dur: number;
    color: string;
    sw: number;
  }> = [];

  // Horizontal mortar lines on the dome
  const brickAngles = [
    { y: 100, x1: 310, x2: 490, start: 25 },
    { y: 130, x1: 280, x2: 520, start: 27 },
    { y: 160, x1: 255, x2: 545, start: 29 },
    { y: 190, x1: 238, x2: 562, start: 31 },
    { y: 220, x1: 225, x2: 575, start: 33 },
    { y: 250, x1: 215, x2: 585, start: 35 },
    { y: 280, x1: 208, x2: 592, start: 37 },
    { y: 310, x1: 203, x2: 597, start: 39 },
    { y: 340, x1: 200, x2: 600, start: 41 },
  ];

  brickAngles.forEach((row) => {
    // Between outer and inner arch (left side)
    const leftEnd = Math.min(row.x1 + 55, 260);
    const rightStart = Math.max(row.x2 - 55, 540);
    if (row.y < 240 || row.y > 130) {
      brickRows.push({
        d: `M ${row.x1},${row.y} L ${leftEnd},${row.y}`,
        len: leftEnd - row.x1,
        start: row.start,
        dur: 22,
        color: INK_LIGHT,
        sw: 0.7,
      });
      brickRows.push({
        d: `M ${rightStart},${row.y} L ${row.x2},${row.y}`,
        len: row.x2 - rightStart,
        start: row.start + 2,
        dur: 22,
        color: INK_LIGHT,
        sw: 0.7,
      });
    }
  });

  // Vertical brick joints (staggered)
  for (let row = 0; row < 8; row++) {
    const y = 100 + row * 30;
    const offset = row % 2 === 0 ? 0 : 15;
    const xStart = 205 + Math.max(0, (4 - row) * 12);
    const xEnd = 595 - Math.max(0, (4 - row) * 12);

    for (let x = xStart + offset; x < xEnd; x += 30) {
      if (x > 255 && x < 545 && y > 130 && y < 350) continue; // skip interior
      brickRows.push({
        d: `M ${x},${y} L ${x},${y + 28}`,
        len: 28,
        start: 30 + row * 2 + Math.random() * 5,
        dur: 18,
        color: INK_LIGHT,
        sw: 0.5,
      });
    }
  }

  // Inner arch brick detail (voussoirs)
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI + (i / 11) * Math.PI;
    const cx = 400;
    const cy = 240;
    const r1 = 145;
    const r2 = 165;
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2;
    brickRows.push({
      d: `M ${x1.toFixed(1)},${y1.toFixed(1)} L ${x2.toFixed(1)},${y2.toFixed(1)}`,
      len: 20,
      start: 35 + i * 2,
      dur: 16,
      color: BURGUNDY,
      sw: 0.8,
    });
  }

  // ═══════════════════════════════════
  // FIRE INSIDE THE OVEN
  // ═══════════════════════════════════
  const fireFlicker = (offset: number) =>
    0.5 + 0.3 * Math.sin(frame * 0.18 + offset) + 0.2 * Math.sin(frame * 0.35 + offset * 2);

  const firePaths = [
    // Large central flame
    { d: "M 380,350 Q 370,320 375,290 Q 380,265 390,250 Q 400,240 410,250 Q 420,265 425,290 Q 430,320 420,350", len: 200, start: 40, dur: 40, color: BURGUNDY, sw: 1.5 },
    // Left flame
    { d: "M 310,350 Q 305,330 310,310 Q 318,290 325,280 Q 335,275 340,285 Q 345,300 340,320 Q 335,340 330,350", len: 150, start: 43, dur: 38, color: BURGUNDY, sw: 1.3 },
    // Right flame
    { d: "M 470,350 Q 475,330 470,310 Q 462,290 455,280 Q 445,275 440,285 Q 435,300 440,320 Q 445,340 450,350", len: 150, start: 46, dur: 38, color: BURGUNDY, sw: 1.3 },
    // Flame tips (thin, dancing)
    { d: "M 395,250 Q 398,235 395,220 Q 392,210 400,205", len: 50, start: 50, dur: 25, color: GOLD, sw: 1 },
    { d: "M 325,280 Q 322,268 325,255 Q 330,248 335,252", len: 38, start: 52, dur: 25, color: GOLD, sw: 0.8 },
    { d: "M 455,280 Q 458,268 455,255 Q 450,248 445,252", len: 38, start: 54, dur: 25, color: GOLD, sw: 0.8 },
    // Inner flame wisps
    { d: "M 360,340 Q 365,318 370,300 Q 378,285 385,290", len: 60, start: 55, dur: 28, color: GOLD, sw: 0.7 },
    { d: "M 420,340 Q 415,318 410,300 Q 402,285 395,290", len: 60, start: 57, dur: 28, color: GOLD, sw: 0.7 },
    // Ember base glow lines
    { d: "M 290,348 Q 340,342 400,345 Q 460,342 510,348", len: 230, start: 48, dur: 30, color: BURGUNDY, sw: 0.6 },
    { d: "M 300,344 Q 350,338 400,340 Q 450,338 500,344", len: 210, start: 50, dur: 28, color: GOLD, sw: 0.5 },
  ];

  // ═══════════════════════════════════
  // WOODEN PEEL + PIZZA
  // ═══════════════════════════════════
  // Peel slides in from left
  const peelSlideX = interpolate(frame, [50, 90], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const peelIntoOven = interpolate(frame, [95, 130], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  const peelFade = interpolate(frame, [110, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const peelPaths = [
    // Peel paddle (flat wooden blade)
    { d: "M 280,325 L 350,315 L 430,310 L 510,315 L 520,325 L 510,335 L 430,340 L 350,335 Z", len: 550, start: 55, dur: 40, color: INK, sw: 1.8 },
    // Wood grain on paddle
    { d: "M 310,320 Q 380,316 430,318 Q 480,316 510,320", len: 210, start: 62, dur: 30, color: INK_LIGHT, sw: 0.6 },
    { d: "M 305,328 Q 380,324 430,326 Q 480,324 512,328", len: 220, start: 64, dur: 30, color: INK_LIGHT, sw: 0.5 },
    { d: "M 315,333 Q 380,330 430,332 Q 480,330 508,333", len: 200, start: 66, dur: 28, color: INK_LIGHT, sw: 0.4 },
    // Handle
    { d: "M 280,325 L 180,328 Q 170,328 165,325 Q 160,320 165,318 Q 170,315 180,315 L 280,320", len: 250, start: 58, dur: 35, color: INK, sw: 2 },
    // Handle grip rings
    { d: "M 195,315 Q 192,320 195,328", len: 15, start: 68, dur: 15, color: INK_LIGHT, sw: 1 },
    { d: "M 210,316 Q 207,321 210,327", len: 13, start: 70, dur: 15, color: INK_LIGHT, sw: 1 },
    { d: "M 225,317 Q 222,322 225,326", len: 12, start: 72, dur: 15, color: INK_LIGHT, sw: 1 },
  ];

  const pizzaPaths = [
    // Pizza body circle on the peel
    { d: "M 360,305 Q 380,285 420,282 Q 460,285 478,305 Q 485,320 475,335 Q 458,348 420,350 Q 382,348 365,335 Q 355,320 360,305 Z", len: 310, start: 60, dur: 40, color: BURGUNDY, sw: 1.8 },
    // Crust edge (thicker outer ring)
    { d: "M 365,308 Q 383,290 420,288 Q 457,290 472,308", len: 120, start: 65, dur: 32, color: INK, sw: 1.2 },
    // Sauce/cheese texture
    { d: "M 380,300 Q 400,295 420,297 Q 440,295 455,302", len: 80, start: 70, dur: 25, color: GOLD, sw: 0.8 },
    { d: "M 375,315 Q 400,310 420,312 Q 445,310 460,318", len: 90, start: 72, dur: 25, color: GOLD, sw: 0.7 },
    { d: "M 378,328 Q 400,323 420,325 Q 445,323 458,330", len: 85, start: 74, dur: 25, color: GOLD, sw: 0.6 },
    // Slice lines
    { d: "M 420,288 L 420,348", len: 60, start: 75, dur: 20, color: INK_LIGHT, sw: 0.6 },
    { d: "M 368,310 L 470,325", len: 110, start: 77, dur: 20, color: INK_LIGHT, sw: 0.5 },
    { d: "M 368,335 L 470,310", len: 110, start: 79, dur: 20, color: INK_LIGHT, sw: 0.5 },
    // Topping spots
    ...Array.from({ length: 7 }, (_, i) => ({
      d: (() => {
        const angle = (i / 7) * Math.PI * 2;
        const r = 20 + (i % 3) * 8;
        const cx = 420 + Math.cos(angle) * r;
        const cy = 318 + Math.sin(angle) * r * 0.7;
        const tr = 3 + (i % 2) * 2;
        return `M ${cx - tr},${cy} A ${tr},${tr} 0 1,1 ${cx + tr},${cy} A ${tr},${tr} 0 1,1 ${cx - tr},${cy}`;
      })(),
      len: 25,
      start: 78 + i * 2,
      dur: 18,
      color: i % 2 === 0 ? BURGUNDY : GOLD,
      sw: 0.8,
    })),
    // Basil leaf
    { d: "M 410,305 Q 405,298 400,295 Q 395,295 393,300 Q 395,306 402,308 Q 408,308 410,305", len: 40, start: 85, dur: 20, color: INK, sw: 0.9 },
    { d: "M 402,300 L 400,308", len: 8, start: 88, dur: 12, color: INK, sw: 0.5 },
  ];

  // ═══════════════════════════════════
  // SPARKS & EMBERS (floating particles)
  // ═══════════════════════════════════
  const sparks = Array.from({ length: 12 }, (_, i) => {
    const baseX = 340 + Math.sin(i * 2.3) * 80;
    const baseY = 280 - i * 8;
    const delay = 70 + i * 4;
    return { x: baseX, y: baseY, delay, i };
  });

  // ═══════════════════════════════════
  // SMOKE FROM CHIMNEY
  // ═══════════════════════════════════
  // FLOURISHES (Cleaned up)


  const smokeWisps = [
    { d: "M 395,15 Q 390,0 392,-18 Q 398,-30 395,-45", delay: 90 },
    { d: "M 400,10 Q 405,-5 402,-22 Q 396,-35 400,-50", delay: 95 },
    { d: "M 408,12 Q 415,-2 410,-20 Q 405,-32 412,-48", delay: 100 },
  ];

  // ═══════════════════════════════════
  // DECORATIVE FRAME
  // ═══════════════════════════════════
  const framePaths = [
    // Base decorative line
    { d: "M 120,370 Q 250,362 400,365 Q 550,362 680,370", len: 580, start: 80, dur: 45, color: GOLD, sw: 1 },
    { d: "M 140,378 Q 270,372 400,374 Q 530,372 660,378", len: 540, start: 83, dur: 42, color: GOLD, sw: 0.6 },
    // Corner rosette left
    { d: "M 145,355 Q 135,348 128,340 Q 125,332 132,328 Q 140,326 145,332 Q 148,340 145,348", len: 55, start: 95, dur: 30, color: GOLD, sw: 1 },
    { d: "M 128,340 Q 118,338 110,342", len: 20, start: 100, dur: 18, color: GOLD, sw: 0.7 },
    { d: "M 145,332 Q 150,322 148,312", len: 22, start: 102, dur: 18, color: GOLD, sw: 0.7 },
    // Corner rosette right
    { d: "M 655,355 Q 665,348 672,340 Q 675,332 668,328 Q 660,326 655,332 Q 652,340 655,348", len: 55, start: 97, dur: 30, color: GOLD, sw: 1 },
    { d: "M 672,340 Q 682,338 690,342", len: 20, start: 102, dur: 18, color: GOLD, sw: 0.7 },
    { d: "M 655,332 Q 650,322 652,312", len: 22, start: 104, dur: 18, color: GOLD, sw: 0.7 },
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
        viewBox="0 -60 800 460"
        width="800"
        height="460"
        style={{
          transform: `scale(${masterScale})`,
          opacity: masterOpacity,
          overflow: "visible",
        }}
      >
        <defs>
          <radialGradient id="fireGlow" cx="50%" cy="85%" r="40%">
            <stop offset="0%" stopColor={BURGUNDY} stopOpacity={0.25} />
            <stop offset="50%" stopColor={GOLD} stopOpacity={0.1} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Fire glow inside oven */}
        <ellipse
          cx="400"
          cy="310"
          rx="130"
          ry="60"
          fill="url(#fireGlow)"
          opacity={fadeIn(frame, 40, 30, 0.6) * fireFlicker(0)}
        />

        {/* Oven structure */}
        {ovenStructure.map((p, i) => (
          <path
            key={`oven-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}

        {/* Brick details */}
        {brickRows.map((p, i) => (
          <path
            key={`brick-${i}`}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
            strokeLinecap="round"
            style={drawStrokeHero(frame, p.start, p.dur, p.len)}
          />
        ))}

        {/* Fire */}
        {firePaths.map((p, i) => {
          const flicker = fireFlicker(i * 0.7);
          return (
            <path
              key={`fire-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              opacity={flicker}
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          );
        })}

        {/* Peel + Pizza group (slides in) */}
        <g
          style={{
            transform: `translateX(${peelSlideX + peelIntoOven}px)`,
            opacity: peelFade,
          }}
        >
          {peelPaths.map((p, i) => (
            <path
              key={`peel-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}
          {pizzaPaths.map((p, i) => (
            <path
              key={`pizza-${i}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={typeof p.sw === "number" ? p.sw * 1.8 : p.sw}
              strokeLinecap="round"
              style={drawStrokeHero(frame, p.start, p.dur, p.len)}
            />
          ))}
        </g>

        {/* Sparks / embers */}
        {sparks.map((s) => {
          const sparkScale = spring({
            frame: Math.max(0, frame - s.delay),
            fps,
            config: { damping: 8, stiffness: 200, mass: 0.2 },
          });
          const sparkFade = interpolate(
            frame,
            [s.delay + 12, s.delay + 28],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const drift = Math.sin(frame * 0.15 + s.i) * 3;
          const rise = interpolate(
            frame,
            [s.delay, s.delay + 30],
            [0, -20 - s.i * 2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <circle
              key={`spark-${s.i}`}
              cx={s.x + drift}
              cy={s.y + rise}
              r={1.5 * sparkScale}
              fill="none"
              stroke={s.i % 3 === 0 ? BURGUNDY : GOLD}
              strokeWidth={0.6}
              opacity={sparkFade * 0.7}
            />
          );
        })}

        {/* Smoke from chimney */}
        {smokeWisps.map((wisp, i) => {
          const smokeFade = fadeIn(frame, wisp.delay, 20, 0.3);
          const smokeOut = interpolate(
            frame,
            [wisp.delay + 35, wisp.delay + 55],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const sway = Math.sin((frame - wisp.delay) * 0.05) * 6;
          return (
            <path
              key={`smoke-${i}`}
              d={wisp.d}
              fill="none"
              stroke={INK_LIGHT}
              strokeWidth={0.8}
              strokeLinecap="round"
              opacity={smokeFade * smokeOut}
              style={{
                transform: `translateX(${sway}px)`,
                ...drawStroke(frame, wisp.delay, 40, 70),
              }}
            />
          );
        })}

        {/* Decorative frame */}
        {framePaths.map((p, i) => (
          <path
            key={`frame-${i}`}
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
