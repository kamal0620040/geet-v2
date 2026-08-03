"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export function AnimatedTitle({ text }: { text: string }) {
  const words = useMemo(() => text.split(" "), [text]);
  let index = 0;

  return (
    <h1 className="text-8xl font-light leading-[0.9] tracking-[-0.1em] md:text-9xl md:leading-[0.9] md:tracking-[-0.1em]">
      {words.map((word, i) => (
        <motion.span key={i} className="inline-block mr-8 break-keep">
          {word.split("").map((c, j) => (
            <motion.span
              key={`${c}-${j}`}
              className="inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  ease: "easeInOut",
                  delay: index++ * 0.04,
                  duration: 0.2,
                },
              }}
            >
              {c}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </h1>
  );
}
