import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import React from "react";

// --- Brand Palette ---
const GOLD = "#b8923a";
const BURGUNDY = "#7a1e2e";
const INK = "#1e1408";

// --- Helpers ---
const drawStroke = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  totalLength: number,
) => {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
};

// --- Golden Sparkle ---
const Sparkle: React.FC<{
  x: number;
  y: number;
  delay: number;
  size: number;
}> = ({ x, y, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sparkleScale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.3 },
  });

  const fadeOut = interpolate(frame, [delay + 25, delay + 45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(frame, [delay, delay + 60], [0, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const s = size * sparkleScale;

  return (
    <g
      opacity={fadeOut}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${sparkleScale})`,
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      {/* 4-point star sparkle */}
      <path
        d={`M 0,${-s} Q ${s * 0.15},${-s * 0.15} ${s},0 Q ${s * 0.15},${s * 0.15} 0,${s} Q ${-s * 0.15},${s * 0.15} ${-s},0 Q ${-s * 0.15},${-s * 0.15} 0,${-s} Z`}
        fill="none"
        stroke={GOLD}
        strokeWidth={0.8}
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      />
    </g>
  );
};

// --- Aura Ring ---
const AuraRing: React.FC<{ delay: number; radius: number }> = ({
  delay,
  radius,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringScale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 25, stiffness: 40, mass: 1.2 },
  });

  const opacity = interpolate(frame, [delay, delay + 15, delay + 50, delay + 70], [0, 0.2, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <circle
      cx="200"
      cy="160"
      r={radius * ringScale}
      fill="none"
      stroke={GOLD}
      strokeWidth={0.6}
      opacity={opacity}
    />
  );
};

// --- Main Composition ---
export const CucinaTradition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  // --- Fork ---
  // Handle
  const forkHandlePath = "M 200,280 L 200,175";
  const forkHandleLen = 105;
  const forkHandleStyle = drawStroke(frame, 0, 40, forkHandleLen);

  // Neck decoration
  const forkNeckPath = "M 195,178 Q 200,170 205,178";
  const forkNeckLen = 16;
  const forkNeckStyle = drawStroke(frame, 15, 20, forkNeckLen);

  // Tines
  const tines = [
    { d: "M 188,175 L 188,130 Q 188,125 190,122", start: 20, len: 58 },
    { d: "M 196,175 L 196,125 Q 196,120 197,117", start: 23, len: 63 },
    { d: "M 204,175 L 204,125 Q 204,120 203,117", start: 26, len: 63 },
    { d: "M 212,175 L 212,130 Q 212,125 210,122", start: 29, len: 58 },
  ];

  // --- Pasta twirl ---
  // The pasta wraps around the fork tines with organic curves
  const pastaAppear = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rotation of the pasta twirl
  const twistAngle = interpolate(frame, [35, 90], [0, 720], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Pasta strands wrapping around fork
  const pastaStrands = [
    {
      d: "M 180,155 Q 165,140 185,128 Q 210,118 220,135 Q 225,148 205,155 Q 185,160 180,148",
      start: 38,
      len: 160,
      color: GOLD,
    },
    {
      d: "M 175,148 Q 160,135 180,122 Q 205,110 218,130 Q 228,145 210,152 Q 188,158 178,145",
      start: 42,
      len: 170,
      color: INK,
    },
    {
      d: "M 182,160 Q 170,148 188,135 Q 212,125 222,140 Q 230,152 208,160 Q 190,165 183,155",
      start: 46,
      len: 155,
      color: BURGUNDY,
    },
    // Dangling strands
    {
      d: "M 185,155 Q 178,165 175,180 Q 173,190 178,195",
      start: 50,
      len: 55,
      color: GOLD,
    },
    {
      d: "M 210,152 Q 218,165 222,178 Q 224,188 220,192",
      start: 53,
      len: 50,
      color: GOLD,
    },
    {
      d: "M 195,158 Q 192,172 188,185",
      start: 55,
      len: 35,
      color: INK,
    },
    {
      d: "M 205,157 Q 208,170 212,182",
      start: 57,
      len: 35,
      color: INK,
    },
  ];

  // Subtle fork tilt as pasta twirls
  const forkTilt = interpolate(frame, [35, 65, 85, 100], [0, -3, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparkles configuration
  const sparkles = [
    { x: 150, y: 120, delay: 55, size: 6 },
    { x: 245, y: 130, delay: 62, size: 5 },
    { x: 160, y: 170, delay: 70, size: 4 },
    { x: 240, y: 165, delay: 75, size: 5.5 },
    { x: 170, y: 105, delay: 80, size: 3.5 },
    { x: 235, y: 108, delay: 85, size: 4 },
    { x: 145, y: 145, delay: 90, size: 3 },
    { x: 252, y: 150, delay: 95, size: 4.5 },
    { x: 195, y: 95, delay: 88, size: 3 },
    { x: 210, y: 98, delay: 92, size: 2.5 },
  ];

  // Golden aura pulse
  const auraRings = [
    { delay: 50, radius: 55 },
    { delay: 60, radius: 70 },
    { delay: 72, radius: 85 },
    { delay: 85, radius: 100 },
  ];

  // Handle end cap
  const handleCapScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.4 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <svg
        viewBox="120 70 160 240"
        width="400"
        height="320"
        style={{
          transform: `scale(${masterScale})`,
          overflow: "visible",
        }}
      >
        <defs>
          <radialGradient id="goldenAura" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.12} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Soft golden aura background */}
        <ellipse
          cx="200"
          cy="155"
          rx="80"
          ry="70"
          fill="url(#goldenAura)"
          opacity={interpolate(frame, [40, 65], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />

        {/* Aura rings */}
        {auraRings.map((ring, i) => (
          <AuraRing key={i} {...ring} />
        ))}

        {/* Fork group with tilt */}
        <g
          style={{
            transform: `rotate(${forkTilt}deg)`,
            transformOrigin: "200px 200px",
          }}
        >
          {/* Fork handle */}
          <path
            d={forkHandlePath}
            fill="none"
            stroke={INK}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={forkHandleStyle}
          />

          {/* Handle decoration - small oval */}
          <ellipse
            cx="200"
            cy="278"
            rx="4"
            ry="6"
            fill="none"
            stroke={GOLD}
            strokeWidth={1}
            opacity={0.7}
            style={{
              transform: `scale(${handleCapScale})`,
              transformOrigin: "200px 278px",
            }}
          />

          {/* Fork neck */}
          <path
            d={forkNeckPath}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            strokeLinecap="round"
            style={forkNeckStyle}
          />

          {/* Fork tines */}
          {tines.map((tine, i) => (
            <path
              key={i}
              d={tine.d}
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeLinecap="round"
              style={drawStroke(frame, tine.start, 25, tine.len)}
            />
          ))}

          {/* Pasta strands */}
          <g
            opacity={pastaAppear}
            style={{
              transform: `rotate(${twistAngle * 0.003}deg)`,
              transformOrigin: "200px 145px",
            }}
          >
            {pastaStrands.map((strand, i) => (
              <path
                key={i}
                d={strand.d}
                fill="none"
                stroke={strand.color}
                strokeWidth={i < 3 ? 1.4 : 1}
                strokeLinecap="round"
                opacity={i < 3 ? 0.8 : 0.6}
                style={drawStroke(frame, strand.start, 30, strand.len)}
              />
            ))}
          </g>
        </g>

        {/* Sparkles */}
        {sparkles.map((sparkle, i) => (
          <Sparkle key={i} {...sparkle} />
        ))}

        {/* Fine decorative flourish under fork */}
        <path
          d="M 175,290 Q 188,285 200,288 Q 212,285 225,290"
          fill="none"
          stroke={GOLD}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.4}
          style={drawStroke(frame, 45, 25, 60)}
        />
      </svg>
    </div>
  );
};
