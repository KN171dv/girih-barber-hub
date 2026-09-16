import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
} as const;

/** Revela o conteúdo com fade + leve deslocamento vertical quando entra na viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof TAGS;
}) {
  const Component = TAGS[as];

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH, delay: delay / 1000 }}
    >
      {children}
    </Component>
  );
}
