import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/motion";

/** Número que conta de 0 até o valor final quando entra na viewport. */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controls = animate(0, value, {
      duration: reduced ? 0 : duration,
      ease: EASE_SMOOTH,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  const formatted =
    decimals > 0
      ? display.toLocaleString("pt-BR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(display).toLocaleString("pt-BR");

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
