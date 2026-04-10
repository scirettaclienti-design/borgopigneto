import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import {
  GOLD,
  GOLD_LIGHT,
  INK,
  INK_LIGHT,
  drawStrokeHero,
  drawStroke,
  fadeIn,
} from "./lib/animationUtils";

/* ═══════════════════════════════════════════════════════════════════
   HERO: "CUCINA LINEAR" (Formerly Mani In Pasta)
   Clean, classic culinary symbols: A chef's cloche (plate cover), 
   a rolling pin, a fork, and elegant steam. 800×400 viewBox.
   ═══════════════════════════════════════════════════════════════════ */

export const HeroManiInPasta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterScale = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 60, mass: 1 },
  });

  const masterOpacity = fadeIn(frame, 0, 15);

  // ═══════════════════════════════════
  // CLOCHE (Chef's Plate Cover) - Center
  // ═══════════════════════════════════
  const clochePaths = [
    // Base Plate (Bottom ellipse)
    { d: "M 250,280 Q 400,310 550,280", len: 320, start: 10, dur: 45, color: INK, sw: 2.2 },
    { d: "M 230,270 Q 400,325 570,270", len: 360, start: 15, dur: 45, color: INK, sw: 1.5 },
    // Dome (Perfect semicircle)
    { d: "M 300,270 Q 300,160 400,160 Q 500,160 500,270", len: 360, start: 20, dur: 50, color: INK, sw: 2.5 },
    // Dome inner highlight curve
    { d: "M 320,260 Q 320,180 390,175", len: 140, start: 30, dur: 40, color: GOLD_LIGHT, sw: 1.2 },
    // Cloche Handle (Top ring)
    { d: "M 385,160 Q 380,140 400,140 Q 420,140 415,160", len: 60, start: 35, dur: 25, color: GOLD, sw: 2 },
    // Sub-plate rim
    { d: "M 270,285 Q 400,315 530,285", len: 280, start: 25, dur: 40, color: INK_LIGHT, sw: 0.8 },
  ];

  // ═══════════════════════════════════
  // ROLLING PIN (Mattarello) - Bottom Left to Center Right
  // ═══════════════════════════════════
  const rollingPinPaths = [
    // Main cylinder body
    { d: "M 200,360 L 520,300", len: 340, start: 5, dur: 45, color: INK, sw: 2.5 },
    { d: "M 195,350 L 515,290", len: 340, start: 8, dur: 45, color: INK, sw: 2.5 },
    { d: "M 520,300 Q 525,295 515,290", len: 20, start: 50, dur: 15, color: INK, sw: 2.5 },
    { d: "M 200,360 Q 192,358 195,350", len: 20, start: 50, dur: 15, color: INK, sw: 2.5 },
    // Handles
    { d: "M 198,355 L 160,362", len: 45, start: 40, dur: 20, color: GOLD, sw: 2 },
    { d: "M 518,295 L 560,287", len: 45, start: 45, dur: 20, color: GOLD, sw: 2 },
    // Handle knobs
    { d: "M 160,362 Q 155,365 152,358 Q 150,352 155,350", len: 25, start: 50, dur: 15, color: GOLD, sw: 1.5 },
    { d: "M 560,287 Q 565,285 568,292 Q 570,298 565,300", len: 25, start: 55, dur: 15, color: GOLD, sw: 1.5 },
    // Wood texture lines
    { d: "M 220,350 L 480,300", len: 280, start: 20, dur: 40, color: INK_LIGHT, sw: 0.8 },
    { d: "M 250,350 L 450,312", len: 210, start: 25, dur: 40, color: INK_LIGHT, sw: 0.8 },
  ];

  // ═══════════════════════════════════
  // CLASSIC FORK - Right side, elegant
  // ═══════════════════════════════════
  const forkPaths = [
    // Handle
    { d: "M 660,340 C 660,260 630,220 620,180", len: 180, start: 30, dur: 40, color: GOLD, sw: 2.2 },
    // Handle detail / grip
    { d: "M 655,335 C 655,270 635,230 625,185", len: 160, start: 35, dur: 35, color: GOLD_LIGHT, sw: 1 },
    // Fork base (U shape)
    { d: "M 610,165 Q 620,185 630,160", len: 40, start: 60, dur: 20, color: GOLD, sw: 2 },
    // Tines (prongs)
    { d: "M 610,165 L 600,105", len: 65, start: 70, dur: 25, color: GOLD, sw: 1.8 },
    { d: "M 617,175 L 610,100", len: 80, start: 72, dur: 25, color: GOLD, sw: 1.8 },
    { d: "M 623,175 L 620,100", len: 80, start: 74, dur: 25, color: GOLD, sw: 1.8 },
    { d: "M 630,160 L 630,105", len: 60, start: 76, dur: 25, color: GOLD, sw: 1.8 },
  ];

  // ═══════════════════════════════════
  // WHEAT STALK - Left side, simple & clear
  // ═══════════════════════════════════
  const wheatPaths = [
    { d: "M 120,380 C 130,280 100,200 80,120", len: 280, start: 35, dur: 50, color: GOLD, sw: 2 },
    // Grains (V shapes along stalk)
    ...Array.from({ length: 6 }, (_, i) => {
      const y = 280 - i * 30;
      const x = 120 - i * (40 / 6);
      return {
        d: `M ${x - 15},${y - 15} Q ${x},${y} ${x + 10},${y - 20}`,
        len: 40,
        start: 50 + i * 5,
        dur: 20,
        color: GOLD,
        sw: 1.5,
      };
    }),
  ];

  // ═══════════════════════════════════
  // STEAM WISPS - Clean, elegant curves
  // ═══════════════════════════════════
  const steamWisps = [
    { d: "M 320,130 C 310,90 340,60 330,20", x: 320, start: 80 },
    { d: "M 400,120 C 420,80 380,50 400,10", x: 400, start: 85 },
    { d: "M 480,130 C 470,90 490,60 480,20", x: 480, start: 90 },
  ];

  // ═══════════════════════════════════
  // FLOURISHES (Minimal)
  // ═══════════════════════════════════
  const flourishPaths = [
    { d: "M 150,380 L 650,380", len: 500, start: 10, dur: 45, color: INK_LIGHT, sw: 1 },
    { d: "M 200,388 L 600,388", len: 400, start: 15, dur: 40, color: INK_LIGHT, sw: 0.5 },
  ];

  const allGroups = [
    { paths: rollingPinPaths, label: "pin" },
    { paths: forkPaths, label: "fork" },
    { paths: wheatPaths, label: "wheat" },
    { paths: clochePaths, label: "cloche" },
    { paths: flourishPaths, label: "flou" },
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
        viewBox="0 0 800 400"
        width="800"
        height="400"
        style={{
          transform: `scale(${masterScale})`,
          opacity: masterOpacity,
          overflow: "visible",
        }}
      >
        {allGroups.map((group) =>
          group.paths.map((p, i) => {
            const width = typeof p.sw === "number" ? p.sw * 1.5 : p.sw;
            return (
              <path
                key={`${group.label}-${i}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={width}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={drawStrokeHero(frame, p.start, p.dur, p.len)}
              />
            );
          }),
        )}

        {/* Steam wisps */}
        {steamWisps.map((wisp, i) => {
          const steamFadeIn = fadeIn(frame, wisp.start, 20, 0.6);
          const steamFadeOut = interpolate(
            frame,
            [wisp.start + 60, wisp.start + 90],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const sway = Math.sin((frame - wisp.start) * 0.05) * 8;
          const rise = interpolate(
            frame,
            [wisp.start, wisp.start + 90],
            [0, -25],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <path
              key={`steam-${i}`}
              d={wisp.d}
              fill="none"
              stroke={GOLD_LIGHT}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={steamFadeIn * steamFadeOut}
              style={{
                transform: `translate(${sway}px, ${rise}px)`,
                ...drawStroke(frame, wisp.start, 50, 150),
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
