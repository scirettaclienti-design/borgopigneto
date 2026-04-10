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

// --- Splash Drop ---
const SplashDrop: React.FC<{
  startX: number;
  startY: number;
  angle: number;
  distance: number;
  delay: number;
  color: string;
}> = ({ startX, startY, angle, distance, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.4 },
  });

  const fade = interpolate(frame, [delay + 15, delay + 35], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rad = (angle * Math.PI) / 180;
  const x = startX + Math.cos(rad) * distance * progress;
  const y = startY + Math.sin(rad) * distance * progress;

  const dropScale = interpolate(frame, [delay, delay + 8, delay + 30], [0, 1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={fade}>
      {/* Teardrop shape */}
      <ellipse
        cx={x}
        cy={y}
        rx={2 * dropScale}
        ry={3 * dropScale}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${x}px ${y}px`,
        }}
      />
      {/* Trail line */}
      <line
        x1={startX + Math.cos(rad) * distance * progress * 0.3}
        y1={startY + Math.sin(rad) * distance * progress * 0.3}
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth={0.5}
        opacity={0.4 * fade}
        strokeLinecap="round"
      />
    </g>
  );
};

// --- Impact Ring ---
const ImpactRing: React.FC<{
  cx: number;
  cy: number;
  delay: number;
  maxRadius: number;
}> = ({ cx, cy, delay, maxRadius }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const expand = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20, stiffness: 60, mass: 0.8 },
  });

  const fade = interpolate(frame, [delay + 10, delay + 35], [0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <circle
      cx={cx}
      cy={cy}
      r={maxRadius * expand}
      fill="none"
      stroke={GOLD}
      strokeWidth={0.7}
      opacity={fade}
    />
  );
};

// --- Main Composition ---
export const BeverageCheers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const masterScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  // === WINE GLASS (Left) ===

  // Bowl
  const wineGlassBowl =
    "M 125,180 Q 110,145 115,115 Q 120,90 150,80 Q 180,90 185,115 Q 190,145 175,180";
  const wineBowlLen = 260;
  const wineBowlStyle = drawStroke(frame, 0, 45, wineBowlLen);

  // Stem
  const wineStem = "M 150,180 L 150,240";
  const wineStemLen = 60;
  const wineStemStyle = drawStroke(frame, 15, 25, wineStemLen);

  // Base
  const wineBase = "M 125,240 Q 138,235 150,238 Q 162,235 175,240";
  const wineBaseLen = 55;
  const wineBaseStyle = drawStroke(frame, 20, 25, wineBaseLen);

  // Wine liquid level
  const wineLevel =
    "M 122,148 Q 135,142 150,145 Q 165,142 178,148";
  const wineLevelLen = 60;
  const wineLevelStyle = drawStroke(frame, 30, 25, wineLevelLen);

  // Wine fill shimmer
  const wineShimmerOp = interpolate(
    frame,
    [35, 50],
    [0, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // === COCKTAIL GLASS (Right) ===

  // V-shape bowl
  const cocktailBowl =
    "M 225,100 L 260,180 L 295,100";
  const cocktailBowlLen = 180;
  const cocktailBowlStyle = drawStroke(frame, 5, 45, cocktailBowlLen);

  // Stem
  const cocktailStem = "M 260,180 L 260,240";
  const cocktailStemLen = 60;
  const cocktailStemStyle = drawStroke(frame, 18, 25, cocktailStemLen);

  // Base
  const cocktailBase = "M 235,240 Q 248,235 260,238 Q 272,235 285,240";
  const cocktailBaseLen = 55;
  const cocktailBaseStyle = drawStroke(frame, 22, 25, cocktailBaseLen);

  // Cocktail liquid
  const cocktailLevel = "M 237,130 L 260,170 L 283,130";
  const cocktailLevelLen = 90;
  const cocktailLevelStyle = drawStroke(frame, 32, 25, cocktailLevelLen);

  // Garnish - olive on pick
  const garnishPick = "M 250,95 L 275,75";
  const garnishPickLen = 30;
  const garnishPickStyle = drawStroke(frame, 35, 18, garnishPickLen);

  const garnishOliveScale = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.5 },
  });

  // === CLINK ANIMATION ===
  // Glasses tilt toward each other
  const wineTilt = interpolate(frame, [50, 70, 85, 100], [0, 8, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const cocktailTilt = interpolate(frame, [50, 70, 85, 100], [0, -8, -2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const wineSlideX = interpolate(frame, [50, 70, 85, 100], [0, 12, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cocktailSlideX = interpolate(frame, [50, 70, 85, 100], [0, -12, -3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wine liquid slosh
  const wineSlosh = Math.sin((frame - 65) * 0.12) * interpolate(frame, [65, 75, 100, 115], [0, 4, 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Impact point
  const impactX = 205;
  const impactY = 100;

  // Splash drops
  const splashDrops = [
    { angle: -60, distance: 30, delay: 70, color: GOLD },
    { angle: -90, distance: 35, delay: 72, color: BURGUNDY },
    { angle: -120, distance: 28, delay: 71, color: GOLD },
    { angle: -45, distance: 22, delay: 73, color: GOLD },
    { angle: -135, distance: 25, delay: 74, color: BURGUNDY },
    { angle: -75, distance: 40, delay: 71, color: GOLD },
    { angle: -105, distance: 38, delay: 73, color: GOLD },
    { angle: -30, distance: 18, delay: 75, color: GOLD },
    { angle: -150, distance: 20, delay: 76, color: BURGUNDY },
  ];

  // Impact rings
  const impactRings = [
    { delay: 70, maxRadius: 15 },
    { delay: 73, maxRadius: 25 },
    { delay: 77, maxRadius: 35 },
  ];

  // Golden sparkle burst at clink
  const sparkBurst = interpolate(frame, [68, 72, 80, 95], [0, 1, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative line under glasses
  const baseLine = "M 100,255 Q 150,248 210,252 Q 270,248 320,255";
  const baseLineLen = 230;
  const baseLineStyle = drawStroke(frame, 25, 35, baseLineLen);

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
        viewBox="80 40 260 240"
        width="440"
        height="320"
        style={{
          transform: `scale(${masterScale})`,
          overflow: "visible",
        }}
      >
        <defs>
          <radialGradient id="wineShimmer" cx="50%" cy="60%" r="40%">
            <stop offset="0%" stopColor={BURGUNDY} stopOpacity={0.15} />
            <stop offset="100%" stopColor={BURGUNDY} stopOpacity={0} />
          </radialGradient>

          <radialGradient id="cocktailShimmer" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.12} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>

          <radialGradient id="clinkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
            <stop offset="60%" stopColor={GOLD} stopOpacity={0.1} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* === WINE GLASS GROUP === */}
        <g
          style={{
            transform: `translateX(${wineSlideX}px) rotate(${wineTilt}deg)`,
            transformOrigin: "150px 240px",
          }}
        >
          {/* Wine bowl shimmer fill */}
          <ellipse
            cx="150"
            cy="140"
            rx="30"
            ry="35"
            fill="url(#wineShimmer)"
            opacity={wineShimmerOp}
          />

          {/* Wine glass bowl */}
          <path
            d={wineGlassBowl}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={wineBowlStyle}
          />

          {/* Wine level line */}
          <path
            d={wineLevel}
            fill="none"
            stroke={BURGUNDY}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.7}
            style={{
              ...wineLevelStyle,
              transform: `rotate(${wineSlosh}deg)`,
              transformOrigin: "150px 145px",
            }}
          />

          {/* Wine stem */}
          <path
            d={wineStem}
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap="round"
            style={wineStemStyle}
          />

          {/* Wine base */}
          <path
            d={wineBase}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            style={wineBaseStyle}
          />

          {/* Wine glass highlight */}
          <path
            d="M 132,120 Q 130,140 133,160"
            fill="none"
            stroke={GOLD}
            strokeWidth={0.5}
            opacity={0.3}
            style={drawStroke(frame, 40, 20, 45)}
          />
        </g>

        {/* === COCKTAIL GLASS GROUP === */}
        <g
          style={{
            transform: `translateX(${cocktailSlideX}px) rotate(${cocktailTilt}deg)`,
            transformOrigin: "260px 240px",
          }}
        >
          {/* Cocktail shimmer */}
          <polygon
            points="245,120 260,165 275,120"
            fill="url(#cocktailShimmer)"
            opacity={wineShimmerOp}
          />

          {/* Cocktail bowl */}
          <path
            d={cocktailBowl}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={cocktailBowlStyle}
          />

          {/* Cocktail liquid */}
          <path
            d={cocktailLevel}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.6}
            style={cocktailLevelStyle}
          />

          {/* Cocktail stem */}
          <path
            d={cocktailStem}
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap="round"
            style={cocktailStemStyle}
          />

          {/* Cocktail base */}
          <path
            d={cocktailBase}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            style={cocktailBaseStyle}
          />

          {/* Garnish pick */}
          <path
            d={garnishPick}
            fill="none"
            stroke={INK}
            strokeWidth={1.2}
            strokeLinecap="round"
            style={garnishPickStyle}
          />

          {/* Olive */}
          <circle
            cx="272"
            cy="78"
            r={5}
            fill="none"
            stroke={BURGUNDY}
            strokeWidth={1.2}
            style={{
              transform: `scale(${garnishOliveScale})`,
              transformOrigin: "272px 78px",
            }}
          />

          {/* Olive pimento */}
          <circle
            cx="272"
            cy="78"
            r={1.5}
            fill="none"
            stroke={GOLD}
            strokeWidth={0.8}
            style={{
              transform: `scale(${garnishOliveScale})`,
              transformOrigin: "272px 78px",
            }}
          />

          {/* Glass highlight */}
          <path
            d="M 240,108 L 255,160"
            fill="none"
            stroke={GOLD}
            strokeWidth={0.5}
            opacity={0.3}
            style={drawStroke(frame, 42, 20, 55)}
          />
        </g>

        {/* === CLINK IMPACT === */}

        {/* Golden glow at impact */}
        <circle
          cx={impactX}
          cy={impactY}
          r={20}
          fill="url(#clinkGlow)"
          opacity={sparkBurst}
        />

        {/* Impact rings */}
        {impactRings.map((ring, i) => (
          <ImpactRing key={i} cx={impactX} cy={impactY} {...ring} />
        ))}

        {/* Splash drops */}
        {splashDrops.map((drop, i) => (
          <SplashDrop key={i} startX={impactX} startY={impactY} {...drop} />
        ))}

        {/* Tiny star sparkles at clink point */}
        {[
          { x: 195, y: 88, d: 72 },
          { x: 215, y: 85, d: 74 },
          { x: 200, y: 110, d: 76 },
          { x: 210, y: 92, d: 75 },
        ].map((s, i) => {
          const sScale = spring({
            frame: Math.max(0, frame - s.d),
            fps,
            config: { damping: 8, stiffness: 200, mass: 0.2 },
          });
          const sFade = interpolate(frame, [s.d + 15, s.d + 30], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={i} opacity={sFade}>
              <line
                x1={s.x - 3 * sScale}
                y1={s.y}
                x2={s.x + 3 * sScale}
                y2={s.y}
                stroke={GOLD}
                strokeWidth={0.7}
                strokeLinecap="round"
              />
              <line
                x1={s.x}
                y1={s.y - 3 * sScale}
                x2={s.x}
                y2={s.y + 3 * sScale}
                stroke={GOLD}
                strokeWidth={0.7}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* === DECORATIVE BASE === */}
        <path
          d={baseLine}
          fill="none"
          stroke={GOLD}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.4}
          style={baseLineStyle}
        />

        {/* Small dots along base */}
        {[120, 155, 190, 225, 260, 295].map((dx, i) => {
          const dScale = spring({
            frame: Math.max(0, frame - (30 + i * 4)),
            fps,
            config: { damping: 10, stiffness: 180, mass: 0.3 },
          });
          return (
            <circle
              key={i}
              cx={dx}
              cy={258}
              r={1.2}
              fill={GOLD}
              opacity={0.4}
              style={{
                transform: `scale(${dScale})`,
                transformOrigin: `${dx}px 258px`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
