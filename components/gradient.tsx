"use client";

import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { motion } from "framer-motion";

export interface GradientProps {
  colors?: [string, string, string];
}

const defaultColors: [string, string, string] = [
  "#606080",
  "#8d7dca",
  "#212121",
];

export default function Gradient({ colors = defaultColors }: GradientProps) {
  return (
    <motion.div
      className="absolute inset-0 z-[-1] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "easeInOut",
        duration: 1,
        delay: 0.1,
      }}
    >
      <ShaderGradientCanvas pointerEvents="none">
        <ShaderGradient
          animate="on"
          brightness={1}
          cAzimuthAngle={180}
          cDistance={2.8}
          cPolarAngle={80}
          cameraZoom={9.1}
          color1={colors[0]}
          color2={colors[1]}
          color3={colors[2]}
          envPreset="city"
          grain="on"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.5}
          uFrequency={0}
          uSpeed={0.3}
          uStrength={1.7}
          uTime={8}
          wireframe={false}
          zoomOut={false}
        />
      </ShaderGradientCanvas>
    </motion.div>
  );
}
