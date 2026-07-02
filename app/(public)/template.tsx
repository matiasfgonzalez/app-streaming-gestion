"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transición de página del sitio público: fade breve al navegar (template.tsx
 * se re-monta por navegación). Sin desplazamiento para no competir con los
 * FadeUp/Reveal internos. Respeta reduced-motion.
 */
export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
