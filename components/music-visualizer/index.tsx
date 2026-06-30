import { type ReactElement, useCallback, useEffect, useRef } from "react";
import { calculateBarData, draw } from "./utils";

export interface Props {
  analyser: AnalyserNode;

  width?: number;
  height?: number;

  barWidth?: number;
  gap?: number;

  backgroundColor?: string;
  barColor?: string;
}

export function MusicVisualizer({
  analyser,
  width = 500,
  height = 150,
  barWidth = 2,
  gap = 1,
  backgroundColor = "transparent",
  barColor = "rgb(160, 198, 255)",
}: Props): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  const processFrequencyData = useCallback(
    (data: Uint8Array) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const dataPoints = calculateBarData(
        data,
        canvas.width,
        barWidth,
        gap,
      );

      draw(
        dataPoints,
        canvas,
        barWidth,
        gap,
        backgroundColor,
        barColor,
      );
    },
    [barWidth, gap, backgroundColor, barColor],
  );

  useEffect(() => {
    if (analyser.context.state === "closed") {
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      analyser.getByteFrequencyData(data);

      processFrequencyData(data);

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [analyser, processFrequencyData]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}