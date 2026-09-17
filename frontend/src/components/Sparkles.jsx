import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const COLORS = ["#E50914", "#ff4d57", "#ffd166", "#ffffff", "#ff8fab"];
const MAX_PARTICLES = 1400;

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function drawSparkle(ctx, x, y, r, rot, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = color;
  // soft glow
  ctx.globalAlpha *= 0.35;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha /= 0.35;
  // 4-point star
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const rad = i % 2 === 0 ? r : r * 0.28;
    const a = (i * Math.PI) / 4;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Full-screen canvas overlay. Parent calls ref.current.burst(x, y, opts) or .trail(x, y).
const Sparkles = forwardRef(function Sparkles(_, ref) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  useImperativeHandle(ref, () => {
    function tick() {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      const list = particles.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        if (--p.life <= 0) {
          list.splice(i, 1);
          continue;
        }
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        const t = p.life / p.maxLife;
        const twinkle = 0.65 + 0.35 * Math.sin(p.life * 0.45 + p.seed);
        ctx.globalAlpha = Math.min(1, t * 1.6) * twinkle;
        drawSparkle(ctx, p.x, p.y, p.size * (0.4 + 0.6 * t), p.rot, p.color);
      }
      ctx.globalAlpha = 1;
      frame.current = list.length ? requestAnimationFrame(tick) : 0;
    }

    function add(p) {
      if (particles.current.length < MAX_PARTICLES) particles.current.push(p);
    }

    function start() {
      if (!frame.current) frame.current = requestAnimationFrame(tick);
    }

    return {
      burst(x, y, { count = 90, power = 1, angle = null, spread = Math.PI * 2, colors = COLORS } = {}) {
        if (prefersReducedMotion()) count = Math.min(count, 10);
        for (let i = 0; i < count; i++) {
          const a = angle === null ? Math.random() * Math.PI * 2 : angle + (Math.random() - 0.5) * spread;
          const speed = (1.5 + Math.random() * 7.5) * power;
          const life = 50 + Math.random() * 60;
          add({
            x, y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed,
            drag: 0.955 + Math.random() * 0.02,
            gravity: 0.06,
            life, maxLife: life,
            size: 2.5 + Math.random() * 7,
            rot: Math.random() * Math.PI,
            spin: (Math.random() - 0.5) * 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            seed: Math.random() * 10,
          });
        }
        start();
      },
      trail(x, y) {
        if (prefersReducedMotion()) return;
        for (let i = 0; i < 2; i++) {
          const life = 30 + Math.random() * 25;
          add({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -0.4 - Math.random() * 0.8,
            drag: 0.98,
            gravity: -0.01,
            life, maxLife: life,
            size: 1.5 + Math.random() * 3.5,
            rot: 0,
            spin: 0.05,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            seed: Math.random() * 10,
          });
        }
        start();
      },
    };
  }, []);

  return <canvas ref={canvasRef} className="sparkles" aria-hidden="true" />;
});

export default Sparkles;
