"use client";
import {
  useRef,
  useEffect,
  type ReactNode,
  type MouseEvent,
  type HTMLAttributes,
} from "react";

let sharedObserver: IntersectionObserver | null = null;
const observed = new WeakMap<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const trigger = observed.get(entry.target);
        if (trigger) {
          trigger();
          sharedObserver?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
  );
  return sharedObserver;
}

export function TiltCard({
  children,
  className = "",
  intensity = 8,
  ...props
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
} & HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const write = (rotateX: number, rotateY: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clamp = (n: number) => Math.max(-1, Math.min(1, n));
    const nx = clamp((x - centerX) / centerX);
    const ny = clamp((y - centerY) / centerY);
    const rotateY = nx * intensity;
    const rotateX = -ny * intensity;
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      write(rotateX, rotateY);
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (reducedMotion.current) return;
    write(0, 0);
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
}

export function AnimateIn({
  children,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale" | "rotate";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const cls =
      direction === "left" ? "animate-in-left" :
      direction === "right" ? "animate-in-right" :
      direction === "scale" ? "animate-scale" :
      direction === "rotate" ? "animate-rotate" :
      "animate-in";

    const trigger = () => {
      el.style.animationDelay = `${delay}s`;
      el.classList.add(cls);
    };

    const observer = getSharedObserver();
    observed.set(el, trigger);
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      observed.delete(el);
    };
  }, [delay, direction]);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
