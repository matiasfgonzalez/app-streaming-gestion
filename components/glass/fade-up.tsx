"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrada orquestada de página (fade + rise al montar, no on-scroll — para eso
 * está `Reveal`). Escalonar con `delay` (0, 0.08, 0.16…). Respeta reduced-motion.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.55, 0.28, 1] }}
    >
      {children}
    </motion.div>
  );
}
