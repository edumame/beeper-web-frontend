import React from "react";

/**
 * 12×16 pixel-art pager. Drawn with discrete <rect> elements so it stays
 * crisp at any scale. Body color is configurable so a "field" of pagers
 * can each have a slightly different LCD-green shade.
 */
export function PixelPager({
  size = 28,
  body = "#07c04e",
  screen = "#aef0c3",
  ink = "#062614",
  buttons = "#0a0a0a",
}: {
  size?: number;
  body?: string;
  screen?: string;
  ink?: string;
  buttons?: string;
}) {
  const w = size;
  const h = Math.round((size / 12) * 16);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 12 16"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    >
      {/* antenna */}
      <rect x="5" y="0" width="2" height="2" fill={body} />
      {/* case top */}
      <rect x="1" y="2" width="10" height="11" fill={body} />
      {/* screen */}
      <rect x="2" y="3" width="8" height="6" fill={screen} />
      {/* pseudo "BEEP" pixels on screen */}
      <rect x="3" y="5" width="1" height="2" fill={ink} />
      <rect x="5" y="5" width="1" height="2" fill={ink} />
      <rect x="7" y="5" width="1" height="2" fill={ink} />
      {/* buttons row */}
      <rect x="2" y="10" width="2" height="2" fill={buttons} />
      <rect x="5" y="10" width="2" height="2" fill={buttons} />
      <rect x="8" y="10" width="2" height="2" fill={buttons} />
      {/* base/legs */}
      <rect x="2" y="13" width="2" height="2" fill={body} />
      <rect x="8" y="13" width="2" height="2" fill={body} />
    </svg>
  );
}

/**
 * A drift of pagers walking across the hero. Pure CSS animation;
 * positions and durations are randomized at SSR time per index so the
 * layout is deterministic but feels organic.
 */
export function PixelPagerField({ count = 4 }: { count?: number }) {
  // deterministic seeded jitter so server + client agree
  const seeds = Array.from({ length: count }, (_, i) => i);
  return (
    <div className="mascot-lane">
      {seeds.map((i) => {
        const duration = 38 + (i * 7) % 18; // 38–56s
        const delay = -(i * 9) % 40; // staggered
        const bottom = 4 + (i * 11) % 32; // px
        const bodyTints = ["#07c04e", "#0fd25b", "#06a543", "#13e065"];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: `${bottom}px`,
              left: 0,
              animation: `pager-walk-rtl ${duration}s linear ${delay}s infinite`,
              willChange: "transform",
            }}
          >
            <div
              style={{
                animation: "pager-bob 0.9s ease-in-out infinite",
                position: "relative",
              }}
            >
              <PixelPager size={26} body={bodyTints[i % bodyTints.length]} />
              {/* sleeping z particles */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -6,
                  left: 24,
                  fontFamily:
                    "var(--font-jetbrains-mono), ui-monospace, monospace",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#ffffff",
                  textShadow: "0 0 6px rgba(7,192,78,0.55)",
                  opacity: 0,
                  animation: `z-float 2.6s ease-out ${(i * 0.6).toFixed(2)}s infinite`,
                }}
              >
                z
              </span>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -6,
                  left: 24,
                  fontFamily:
                    "var(--font-jetbrains-mono), ui-monospace, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ffffff",
                  textShadow: "0 0 6px rgba(7,192,78,0.55)",
                  opacity: 0,
                  animation: `z-float 2.6s ease-out ${(i * 0.6 + 0.9).toFixed(2)}s infinite`,
                }}
              >
                z
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
