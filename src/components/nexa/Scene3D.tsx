import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useLowPower, useReducedMotion } from "./motion-primitives";

const AICore = lazy(() => import("./AICore"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** CSS-only stand-in used while loading, on reduced motion, or without WebGL. */
export function CoreFallback() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-[min(60vw,420px)] w-[min(60vw,420px)]">
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), color-mix(in oklab, var(--violet) 18%, transparent) 45%, transparent 70%)",
          }}
        />
        <div className="animate-float absolute inset-[18%] rounded-full border border-primary/25" />
        <div className="absolute inset-[8%] rounded-full border border-secondary/15" />
        <div className="absolute inset-[28%] rounded-full bg-primary/15 blur-2xl" />
      </div>
    </div>
  );
}

/**
 * Lazily mounts the WebGL hero core. Only renders once visible, degrades on
 * low-power devices, and falls back to CSS art when WebGL is unavailable.
 */
export function Scene3D({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lowPower = useLowPower();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !supportsWebGL()) return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const inView = entries.some((e) => e.isIntersecting);
      setVisible(inView);
      if (inView) setEnabled(true);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      {enabled && visible ? (
        <Suspense fallback={<CoreFallback />}>
          <AICore lowPower={lowPower} />
        </Suspense>
      ) : (
        <CoreFallback />
      )}
    </div>
  );
}

export default Scene3D;
