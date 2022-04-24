type IProjectileProps = {
  x: number;
  y: number;
  radius: number;
  color: string;
  canvasContext: CanvasRenderingContext2D | null;
  velocity: {
    x: number;
    y: number;
  };
};

const projectile = ({
  x,
  y,
  radius,
  color,
  velocity,
  canvasContext,
}: IProjectileProps) => {
  let xProjectile = 0;
  let yProjectile = 0;
  const dawn = () => {
    canvasContext!.beginPath();
    canvasContext!.arc(x, y, radius, 0, Math.PI * 2, false);

    canvasContext!.fillStyle = color;
    canvasContext!.fill();
  };
  const update = () => {
    dawn();
    x = x + velocity.x;
    y = y + velocity.y;
    xProjectile = x;
    yProjectile = y;
  };

  const collision = () => {
    return {
      xProjectile,
      yProjectile,
    };
  };

  return {
    dawn,
    update,
    x,
    y,
    radius,
    velocity,
    collision,
  };
};

export default projectile;
