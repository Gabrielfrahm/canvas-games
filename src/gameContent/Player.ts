type IHandlePlayerProps = {
  x: number;
  y: number;
  radius: number;
  color: string;
  canvasContext: CanvasRenderingContext2D | null;
};

const player = ({ x, y, radius, color, canvasContext }: IHandlePlayerProps) => {
  const draw = () => {
    canvasContext!.beginPath();
    canvasContext!.arc(x, y, radius, 0, Math.PI * 2, false);

    canvasContext!.fillStyle = color;
    canvasContext!.fill();
  };

  return {
    draw,
    x,
    y,
    radius,
  };
};

export default player;
