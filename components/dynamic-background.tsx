"use client";

import { motion } from "framer-motion";
import Gradient from "@/components/gradient";

interface DynamicBackgroundProps {
  gradientColors: [string, string, string];
}

export function DynamicBackground({ gradientColors }: DynamicBackgroundProps) {
  return (
    <motion.div
      className="absolute inset-0 z-[-1] pointer-events-none"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 1 }}
    >
      <Gradient colors={gradientColors} />
    </motion.div>
  );
}
