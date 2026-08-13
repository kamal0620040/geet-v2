"use client";

import { useMemo } from "react";
import { m } from "framer-motion";

export function AnimatedTitle({ text }: { text: string }) {
  const words = useMemo(() => {
    let charIndex = 0;
    return text.split(" ").map((word) => ({
      wordKey: `${word}-${charIndex}`,
      chars: word.split("").map((c) => ({ char: c, key: `${word}-${charIndex++}` })),
    }));
  }, [text]);
  let index = 0;

  return (
    <h1 className="text-6xl pr-14 font-light leading-[0.95] tracking-[-0.05em] sm:text-7xl md:pr-0 md:text-9xl md:leading-[0.9] md:tracking-[-0.1em]">
      {words.map((word) => (
        <m.span key={word.wordKey} className="inline-block mr-4 break-keep md:mr-8">
          {word.chars.map((c) => (
            <m.span
              key={c.key}
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
              {c.char}
            </m.span>
          ))}
        </m.span>
      ))}
    </h1>
  );
}
