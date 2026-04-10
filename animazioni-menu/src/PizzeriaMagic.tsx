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

// --- Steam Wisp Component ---
const SteamWisp: React.FC<{
  x: number;
  delay: number;
  amplitude: number;
  height: number;
}> = ({ x, delay, amplitude, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [delay, delay + 20], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [delay + 50, delay + 80], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = fadeIn * fadeOut;

  const rise = interpolate(frame, [delay, delay + 80], [0, -height], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const sway = Math.sin((frame - delay) * 0.08) * amplitude;

  const scaleY = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, stiffness: 20, mass: 1.5 },
  });

  return (
    <path
      d={`M ${x},0 Q ${x + sway * 0.5},${rise * 0.33} ${x + sway},${rise * 0.66} T ${x + sway * 0.3},${rise}`}
      fill="none"
      stroke={GOLD}
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={opacity}
      style={{
        transform: `translateY(${rise * 0.1}px) scaleY(${scaleY})`,
        transformOrigin: `${x}px 0px`,
      }}
    />
  );
};

// --- Main Composition ---
export const PizzeriaMagic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Master entrance scale ---
  const masterScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  // --- Oven: Brick arch ---
  const ovenArchPath =
    "M 100,260 L 100,160 Q 100,80 180,60 Q 220,50 260,60 Q 340,80 340,160 L 340,260";
  const ovenArchLen = 520;
  const ovenArchStyle = drawStroke(frame, 0, 45, ovenArchLen);

  // --- Oven: Inner arch (opening) ---
  const ovenInnerPath =
    "M 130,260 L 130,175 Q 130,110 180,95 Q 220,85 260,95 Q 310,110 310,175 L 310,260";
  const ovenInnerLen = 420;
  const ovenInnerStyle = drawStroke(frame, 10, 45, ovenInnerLen);

  // --- Oven: Brick detail lines ---
  const brickLines = [
    { d: "M 100,200 L 130,200", start: 25 },
    { d: "M 100,230 L 130,230", start: 28 },
    { d: "M 340,200 L 310,200", start: 31 },
    { d: "M 340,230 L 310,230", start: 34 },
    { d: "M 105,130 L 128,140", start: 27 },
    { d: "M 335,130 L 312,140", start: 30 },
    // Top bricks
    { d: "M 160,70 L 170,55", start: 33 },
    { d: "M 210,55 L 220,48", start: 35 },
    { d: "M 260,55 L 270,48", start: 37 },
    { d: "M 310,70 L 300,57", start: 39 },
  ];

  // --- Pizza ---
  const pizzaSlideX = interpolate(frame, [30, 65], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const pizzaSlideIntoOven = interpolate(frame, [70, 100], [0, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });

  const pizzaFade = interpolate(frame, [85, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pizzaScale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.6 },
  });

  // Pizza peel (the paddle)
  const peelPath = "M 150,240 L 220,235 L 290,240 L 290,245 L 220,242 L 150,245 Z";
  const peelHandlePath = "M 130,242 L 150,242";

  // Pizza body (circle with toppings)
  const pizzaBodyPath = "M 172,220 A 50,50 0 1,1 268,220 A 50,50 0 1,1 172,220";
  const pizzaBodyLen = 315;
  const pizzaBodyStyle = drawStroke(frame, 35, 35, pizzaBodyLen);

  // Toppings - small circles and shapes
  const toppings = [
    { cx: 200, cy: 205, r: 6, start: 45 },
    { cx: 230, cy: 195, r: 5, start: 48 },
    { cx: 250, cy: 210, r: 7, start: 51 },
    { cx: 215, cy: 220, r: 5, start: 54 },
    { cx: 240, cy: 225, r: 4, start: 57 },
  ];

  // Crust detail
  const crustPath = "M 175,218 Q 185,190 220,182 Q 255,190 265,218";
  const crustLen = 140;
  const crustStyle = drawStroke(frame, 40, 30, crustLen);

  // --- Flame glow inside oven ---
  const flameOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flamePulse =
    0.4 + 0.2 * Math.sin(frame * 0.15) + 0.1 * Math.sin(frame * 0.3 + 1);

  // --- Steam configuration ---
  const steamWisps = [
    { x: 195, delay: 55, amplitude: 8, height: 60 },
    { x: 220, delay: 60, amplitude: 12, height: 75 },
    { x: 245, delay: 65, amplitude: 6, height: 55 },
    { x: 210, delay: 75, amplitude: 10, height: 65 },
    { x: 235, delay: 80, amplitude: 7, height: 70 },
  ];

  // --- Golden glow behind oven ---
  const glowOpacity = interpolate(frame, [50, 80], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        viewBox="40 0 360 320"
        width="440"
        height="320"
        style={{
          transform: `scale(${masterScale})`,
          overflow: "visible",
        }}
      >
        <defs>
          {/* Golden radial glow */}
          <radialGradient id="ovenGlow" cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>

          {/* Flame gradient */}
          <radialGradient id="flameGlow" cx="50%" cy="90%" r="45%">
            <stop offset="0%" stopColor={BURGUNDY} stopOpacity={0.5} />
            <stop offset="40%" stopColor={GOLD} stopOpacity={0.2} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <ellipse
          cx="220"
          cy="180"
          rx="140"
          ry="120"
          fill="url(#ovenGlow)"
          opacity={glowOpacity}
        />

        {/* Oven outer arch */}
        <path
          d={ovenArchPath}
          fill="none"
          stroke={INK}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={ovenArchStyle}
        />

        {/* Oven inner arch */}
        <path
          d={ovenInnerPath}
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={ovenInnerStyle}
        />

        {/* Brick detail lines */}
        {brickLines.map((brick, i) => {
          const s = drawStroke(frame, brick.start, 15, 35);
          return (
            <path
              key={i}
              d={brick.d}
              fill="none"
              stroke={BURGUNDY}
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.6}
              style={s}
            />
          );
        })}

        {/* Flame glow inside oven */}
        <ellipse
          cx="220"
          cy="230"
          rx="80"
          ry="35"
          fill="url(#flameGlow)"
          opacity={flameOpacity * flamePulse}
        />

        {/* Small flame flickers */}
        {[185, 210, 235, 255].map((fx, i) => {
          const flickerH = 10 + 6 * Math.sin(frame * 0.2 + i * 1.5);
          const flickerOp =
            flameOpacity * (0.3 + 0.2 * Math.sin(frame * 0.25 + i));
          return (
            <ellipse
              key={i}
              cx={fx}
              cy={250 - flickerH * 0.5}
              rx={3}
              ry={flickerH}
              fill="none"
              stroke={i % 2 === 0 ? GOLD : BURGUNDY}
              strokeWidth={0.8}
              opacity={flickerOp}
            />
          );
        })}

        {/* Pizza group - slides in then into oven */}
        <g
          style={{
            transform: `translateX(${pizzaSlideX + pizzaSlideIntoOven}px) scale(${pizzaScale})`,
            transformOrigin: "220px 230px",
            opacity: pizzaFade,
          }}
        >
          {/* Peel handle */}
          <path
            d={peelHandlePath}
            fill="none"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            style={drawStroke(frame, 32, 20, 30)}
          />

          {/* Peel paddle */}
          <path
            d={peelPath}
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            strokeLinejoin="round"
            style={drawStroke(frame, 33, 25, 350)}
          />

          {/* Pizza body */}
          <path
            d={pizzaBodyPath}
            fill="none"
            stroke={BURGUNDY}
            strokeWidth={1.8}
            style={pizzaBodyStyle}
          />

          {/* Crust arc */}
          <path
            d={crustPath}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.2}
            strokeLinecap="round"
            style={crustStyle}
          />

          {/* Slice lines */}
          {[
            "M 220,190 L 220,235",
            "M 195,195 L 245,230",
            "M 245,195 L 195,230",
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={GOLD}
              strokeWidth={0.7}
              opacity={0.5}
              style={drawStroke(frame, 50 + i * 3, 20, 60)}
            />
          ))}

          {/* Toppings */}
          {toppings.map((t, i) => {
            const tScale = spring({
              frame: Math.max(0, frame - t.start),
              fps,
              config: { damping: 12, stiffness: 150, mass: 0.4 },
            });
            return (
              <circle
                key={i}
                cx={t.cx}
                cy={t.cy}
                r={t.r}
                fill="none"
                stroke={i % 2 === 0 ? BURGUNDY : GOLD}
                strokeWidth={1}
                opacity={0.7}
                style={{
                  transform: `scale(${tScale})`,
                  transformOrigin: `${t.cx}px ${t.cy}px`,
                }}
              />
            );
          })}
        </g>

        {/* Steam wisps */}
        <g style={{ transform: "translateY(-60px)" }}>
          {steamWisps.map((wisp, i) => (
            <SteamWisp key={i} {...wisp} />
          ))}
        </g>

        {/* Oven floor line */}
        <path
          d="M 90,260 L 350,260"
          fill="none"
          stroke={INK}
          strokeWidth={2}
          strokeLinecap="round"
          style={drawStroke(frame, 5, 30, 260)}
        />

        {/* Decorative dots along base */}
        {[110, 140, 170, 270, 300, 330].map((dotX, i) => {
          const dotScale = spring({
            frame: Math.max(0, frame - (40 + i * 3)),
            fps,
            config: { damping: 10, stiffness: 200, mass: 0.3 },
          });
          return (
            <circle
              key={i}
              cx={dotX}
              cy={268}
              r={1.5}
              fill={GOLD}
              opacity={0.5}
              style={{
                transform: `scale(${dotScale})`,
                transformOrigin: `${dotX}px 268px`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
