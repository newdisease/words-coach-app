import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 34 }, (_, index) => ({
  x: (index * 47) % 100,
  y: (index * 71) % 100,
  size: 1 + (index % 3),
  speed: 0.12 + (index % 5) * 0.025,
  phase: index * 1.7,
}));

function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let pointer = { x: 0.5, y: 0.5 };
    let easedPointer = { x: 0.5, y: 0.5 };

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const updatePointer = (event) => {
      pointer = {
        x: event.clientX / Math.max(window.innerWidth, 1),
        y: event.clientY / Math.max(window.innerHeight, 1),
      };
    };

    const draw = (timestamp) => {
      const time = reducedMotion.matches ? 0 : timestamp * 0.000035;
      easedPointer.x += (pointer.x - easedPointer.x) * 0.035;
      easedPointer.y += (pointer.y - easedPointer.y) * 0.035;

      const driftX = (easedPointer.x - 0.5) * 34;
      const driftY = (easedPointer.y - 0.5) * 20;
      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#00123f");
      gradient.addColorStop(0.55, "#073b91");
      gradient.addColorStop(1, "#0d6efd");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      const glow = (x, y, radius, color) => {
        const radial = context.createRadialGradient(x, y, 0, x, y, radius);
        radial.addColorStop(0, color);
        radial.addColorStop(1, "rgba(0, 18, 63, 0)");
        context.fillStyle = radial;
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      };

      glow(width * 0.14 + driftX, height * 0.18 + driftY, width * 0.42, "rgba(69, 144, 255, 0.28)");
      glow(width * 0.86 - driftX, height * 0.76 - driftY, width * 0.52, "rgba(0, 199, 255, 0.2)");

      for (let layer = 0; layer < 4; layer += 1) {
        const baseline = height * (0.27 + layer * 0.19) + driftY * (layer + 1) * 0.2;
        const amplitude = height * (0.035 + layer * 0.012);
        const offset = time * (0.8 + layer * 0.16) + layer * 1.8;
        context.beginPath();
        context.moveTo(-80, height);
        for (let x = -80; x <= width + 80; x += 42) {
          const wave = Math.sin(x * 0.0022 + offset) * amplitude;
          const secondary = Math.sin(x * 0.0048 - offset * 0.7) * amplitude * 0.35;
          context.lineTo(x, baseline + wave + secondary);
        }
        context.lineTo(width + 80, height);
        context.closePath();
        context.fillStyle = `rgba(69, 144, 255, ${0.045 + layer * 0.012})`;
        context.fill();
      }

      PARTICLES.forEach((particle) => {
        const x = (particle.x / 100) * width + driftX * particle.speed;
        const y = ((particle.y / 100) * height + Math.sin(time * particle.speed * 20 + particle.phase) * 18 + driftY * particle.speed) % height;
        context.beginPath();
        context.arc(x, y < 0 ? y + height : y, particle.size, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 255, 255, 0.16)";
        context.fill();
      });

      if (!reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    draw(0);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  return <canvas className="interactive-background" ref={canvasRef} aria-hidden="true" />;
}

export default InteractiveBackground;
