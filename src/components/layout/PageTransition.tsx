"use client";

import { MotionConfig, motion } from "framer-motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // reducedMotion="user" makes every framer-motion component in the tree
    // honour prefers-reduced-motion (transform/layout animations are dropped;
    // opacity fades remain).
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
