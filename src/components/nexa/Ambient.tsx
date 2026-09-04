import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLowPower, useReducedMotion } from "./motion-primitives";

/**
 * Lightweight 2D canvas network of nodes + thin lines, used as the site-wide
 * atmospheric depth layer. One rAF loop, capped at ~30fps, paused off-screen.
 */
export function AmbientNetwork({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const low = useLowPower();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
    let w = 0;
    let h = 0;
    const count = low ? 22 : 54;
    const linkDist = low ? 110 : 150;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.3 + 0.5,
    }));

    let raf = 0;
    let last = 0;
    let running = true;
    const interval = 1000 / 30;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!running || t - last < interval) return;
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]!;
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(120, 200, 220, ${(1 - d / linkDist) * 0.1})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(170, 220, 235, 0.28)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver((e) => {
      running = e.some((x) => x.isIntersecting);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [low, reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-70", className)}
    />
  );
}

/** Soft volumetric glow blobs. Pure CSS, cheap. */
export function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-float absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 14%, transparent), color-mix(in oklab, var(--violet) 10%, transparent) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--secondary) 10%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
