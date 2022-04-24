import type { NextPage } from "next";
import { useRef, useEffect, useState } from "react";
import player from "../gameContent/Player";
import projectile from "../gameContent/Projectile";

interface IProjectilesProps {
  dawn: () => void;
  update: () => void;
  collision: () => { xProjectile: number; yProjectile: number };
  radius: number;
}

interface IEnemiesProps {
  dawn: () => void;
  update: () => void;
  collision: () => { xEnemy: number; yEnemy: number };
  radius: number;
}

type IEnemyProps = {
  x: number;
  y: number;
  radius: number;
  color: string;

  velocity: {
    x: number;
    y: number;
  };
};

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>();

  useEffect(() => {
    setCanvasContext(canvasRef.current.getContext("2d"));
    canvasRef.current.width = innerWidth;
    canvasRef.current.height = innerHeight;
  }, []);

  if (canvasContext !== undefined) {
    const x = canvasRef.current.width / 2;
    const y = canvasRef.current.height / 2;

    const newPlayer = player({
      x,
      y,
      radius: 30,
      color: "blue",
      canvasContext,
    });

    const projectiles: IProjectilesProps[] = [];
    const enemies: IEnemiesProps[] = [];

    const enemy = ({ x, y, radius, color, velocity }: IEnemyProps) => {
      let xEnemy = 0;
      let yEnemy = 0;
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
        xEnemy = x;
        yEnemy = y;
      };
      const collision = () => {
        return {
          xEnemy,
          yEnemy,
        };
      };
      return {
        dawn,
        update,
        collision,
        radius,
      };
    };

    const spawnEnemies = () => {
      setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;
        let x;
        let y;

        if (Math.random() < 0.5) {
          x =
            Math.random() < 0.5 ? 0 - radius : canvasRef.current.width + radius;
          y = Math.random() * canvasRef.current.height;
        } else {
          x = Math.random() * canvasRef.current.width;
          y = Math.random() < 0.5 ? 0 - radius : canvasRef.current.height;
        }

        const color = "green";

        const angle = Math.atan2(
          canvasRef.current.height / 2 - y,
          canvasRef.current.width / 2 - x
        );

        const velocity = {
          x: Math.cos(angle),
          y: Math.sin(angle),
        };

        enemies.push(enemy({ x, y, radius, color, velocity }));
      }, 1000);
    };

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      canvasContext?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      newPlayer.draw();
      projectiles.forEach((projectileItem) => {
        projectileItem.update();
      });

      enemies.forEach((enemy, index) => {
        enemy.update();

        const distPlay = Math.hypot(
          newPlayer.x - enemy.collision().xEnemy,
          newPlayer.y - enemy.collision().yEnemy
        );

        if (distPlay - enemy.radius - newPlayer.radius < 1) {
          cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectileItem2, projectileItem2Index) => {
          const dist = Math.hypot(
            projectileItem2.collision().xProjectile - enemy.collision().xEnemy,
            projectileItem2.collision().yProjectile - enemy.collision().yEnemy
          );
          if (dist - enemy.radius - projectileItem2.radius < 1) {
            setTimeout(() => {
              enemies.splice(index, 1);
              projectiles.splice(projectileItem2Index, 1);
            }, 0);
          }
        });
      });
    };

    window.addEventListener("click", (event) => {
      const angle = Math.atan2(event.clientY - y, event.clientX - x);

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      projectiles.push(
        projectile({
          x,
          y,
          radius: 5,
          color: "red",
          velocity,
          canvasContext,
        })
      );
    });
    animate();
    spawnEnemies();
  }

  return <canvas ref={canvasRef}></canvas>;
};

export default Home;
