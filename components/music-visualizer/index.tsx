import { type ReactElement, useCallback, useEffect, useRef } from "react";
import { calculateBarData, draw, drawWaveform, drawRadial } from "./utils";

export type VisualizerMode = "spectrum" | "waveform" | "radial";

export interface Props {
  analyser: AnalyserNode;
  mode?: VisualizerMode;

  width?: number;
  height?: number;

  barWidth?: number;
  gap?: number;

  backgroundColor?: string;
  barColor?: string;

  className?: string;
}

export function MusicVisualizer({
  analyser,
  mode = "spectrum",
  width = 500,
  height = 150,
  barWidth = 2,
  gap = 1,
  backgroundColor = "transparent",
  barColor = "rgb(160, 198, 255)",
  className,
}: Props): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  const processAudioData = useCallback(
    (data: Uint8Array) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (mode === "waveform") {
        drawWaveform(data, canvas, backgroundColor, barColor);
      } else if (mode === "radial") {
        drawRadial(data, canvas, backgroundColor, barColor);
      } else {
        const dataPoints = calculateBarData(
          data,
          canvas.width,
          barWidth,
          gap,
        );
        draw(dataPoints, canvas, barWidth, gap, backgroundColor, barColor);
      }
    },
    [mode, barWidth, gap, backgroundColor, barColor],
  );

  useEffect(() => {
    if (analyser.context.state === "closed") {
      return;
    }

    const data = new Uint8Array(analyser.frequencyBinCount);

    const render = () => {
      if (mode === "waveform") {
        analyser.getByteTimeDomainData(data);
      } else {
        analyser.getByteFrequencyData(data);
      }

      processAudioData(data);
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [analyser, mode, processAudioData]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}