import { interpolate, Easing } from "remotion";

// --- Brand Palette ---
export const GOLD = "#b8923a";
export const GOLD_LIGHT = "#d4af5a";
export const BURGUNDY = "#7a1e2e";
export const INK = "#1e1408";
export const INK_LIGHT = "#3a2a14";

/**
 * Animates an SVG stroke as if drawn by a vintage pen.
 * Uses cubic deceleration for that satisfying "ink settling" feel.
 */
export const drawStroke = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  totalLength: number,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
};

/**
 * Multi-phase draw: fast start, slow middle (detail), elegant finish.
 * Perfect for dense, intricate hero illustrations.
 */
export const drawStrokeHero = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  totalLength: number,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    },
  );
  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
};

/**
 * Staggered fade-in opacity for layered elements.
 */
export const fadeIn = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  maxOpacity = 1,
) => {
  return interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, maxOpacity],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );
};
