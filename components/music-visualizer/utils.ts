type CustomCanvasRenderingContext2D = Omit<
  CanvasRenderingContext2D,
  "roundRect"
> & {
  roundRect?: (
    x: number,
    y: number,
    w: number,
    h: number,
    radius?: number | DOMPointInit | (number | DOMPointInit)[],
  ) => void;
};

export const calculateBarData = (
  frequencyData: Uint8Array,
  width: number,
  barWidth: number,
  gap: number,
): number[] => {
  let units = width / (barWidth + gap);
  let step = Math.floor(frequencyData.length / units);

  if (units > frequencyData.length) {
    units = frequencyData.length;
    step = 1;
  }

  const data: number[] = [];

  for (let i = 0; i < units; i++) {
    let sum = 0;

    for (let j = 0; j < step && i * step + j < frequencyData.length; j++) {
      sum += frequencyData[i * step + j];
    }
    data.push(sum / step);
  }
  return data;
};

export const draw = (
  data: number[],
  canvas: HTMLCanvasElement,
  barWidth: number,
  gap: number,
  backgroundColor: string,
  barColor: string,
): void => {
  const ctx = canvas.getContext("2d") as CustomCanvasRenderingContext2D;
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  data.forEach((dp, i) => {
    ctx.fillStyle = barColor;

    const x = i * (barWidth + gap);
    const y = canvas.height - dp / 2;
    const w = barWidth;
    const h = dp || 1;

    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 20);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  });
};

export const drawWaveform = (
  timeDomainData: Uint8Array,
  canvas: HTMLCanvasElement,
  backgroundColor: string,
  lineColor: string,
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();

  const sliceWidth = canvas.width / timeDomainData.length;
  let x = 0;

  for (let i = 0; i < timeDomainData.length; i++) {
    const v = timeDomainData[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
};

export const drawRadial = (
  frequencyData: Uint8Array,
  canvas: HTMLCanvasElement,
  backgroundColor: string,
  barColor: string,
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (backgroundColor !== "transparent") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.4;
  const numBars = 40;
  const step = Math.floor(frequencyData.length / numBars);

  ctx.strokeStyle = barColor;
  ctx.lineWidth = 2;

  for (let i = 0; i < numBars; i++) {
    const value = frequencyData[i * step] || 0;
    const barHeight = (value / 255) * radius * 0.8;
    const angle = (i / numBars) * Math.PI * 2;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barHeight);
    const y2 = centerY + Math.sin(angle) * (radius + barHeight);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};