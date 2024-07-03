import React, { useRef, useEffect, useState } from 'react';

const Balls = () => {
  const canvasRef = useRef(null);
  const [cueBallPos, setCueBallPos] = useState({ x: 300, y: 150 });
  const [objectBallPos, setObjectBallPos] = useState({ x: 400, y: 150 });
  const [spin, setSpin] = useState({ x: 0, y: 0 });
  const [projectedPaths, setProjectedPaths] = useState({
    cue: [],
    object: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawBalls = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'green';
      ctx.fillRect(50, 50, 500, 200);

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(cueBallPos.x, cueBallPos.y, 10, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(objectBallPos.x, objectBallPos.y, 10, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.strokeStyle = 'red';
      projectedPaths.cue.forEach((path) => {
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);
        ctx.stroke();
      });

      ctx.strokeStyle = 'blue';
      projectedPaths.object.forEach((path) => {
        ctx.beginPath();
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);
        ctx.stroke();
      });
    };

    drawBalls();
  }, [cueBallPos, objectBallPos, projectedPaths]);

  const handleCanvasInteraction = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX || event.touches[0].clientX) - rect.left;
    const y = (event.clientY || event.touches[0].clientY) - rect.top;
    setCueBallPos({ x, y });
  };

  const calculateReflectionPath = (start, direction, bounds) => {
    const paths = [];
    let currentStart = start;
    let currentDirection = direction;

    while (paths.length < 3) {
      let tMin = Infinity;
      let nearestBoundary;
      const boundsList = Object.keys(bounds);

      boundsList.forEach((boundary) => {
        const [a, b, c, d] = bounds[boundary];
        const t = boundary === 'left' || boundary === 'right' ?
          (a - currentStart.x) / currentDirection.x :
          (b - currentStart.y) / currentDirection.y;

        if (t > 0 && t < tMin) {
          tMin = t;
          nearestBoundary = boundary;
        }
      });

      if (tMin < Infinity) {
        const end = {
          x: currentStart.x + currentDirection.x * tMin,
          y: currentStart.y + currentDirection.y * tMin,
        };
        paths.push({ start: currentStart, end });

        switch (nearestBoundary) {
          case 'left':
          case 'right':
            currentDirection = { ...currentDirection, x: -currentDirection.x };
            break;
          case 'top':
          case 'bottom':
            currentDirection = { ...currentDirection, y: -currentDirection.y };
            break;
          default:
            break;
        }

        currentStart = end;
      } else {
        break;
      }
    }

    return paths;
  };

  const calculateTrajectories = () => {
    const direction = {
      x: objectBallPos.x - cueBallPos.x,
      y: objectBallPos.y - cueBallPos.y,
    };
    const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    const unitDirection = { x: direction.x / distance, y: direction.y / distance };
    const spinEffect = { x: spin.x / distance, y: spin.y / distance };

    const cuePaths = calculateReflectionPath(
      cueBallPos,
      {
        x: unitDirection.x * distance * 2 + spinEffect.x,
        y: unitDirection.y * distance * 2 + spinEffect.y,
      },
      {
        left: [50, 50, 50, 250],
        right: [550, 50, 550, 250],
        top: [50, 50, 550, 50],
        bottom: [50, 250, 550, 250],
      }
    );

    const objectDirection = { x: -unitDirection.x, y: -unitDirection.y };
    const objectPaths = calculateReflectionPath(
      objectBallPos,
      {
        x: objectDirection.x * distance * 2,
        y: objectDirection.y * distance * 2,
      },
      {
        left: [50, 50, 50, 250],
        right: [550, 50, 550, 250],
        top: [50, 50, 550, 50],
        bottom: [50, 250, 550, 250],
      }
    );

    setProjectedPaths({ cue: cuePaths, object: objectPaths });
  };

  useEffect(() => {
    calculateTrajectories();
  }, [cueBallPos, objectBallPos, spin]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width="600"
        height="300"
        onClick={handleCanvasInteraction}
        onTouchStart={handleCanvasInteraction}
        style={{ border: '1px solid black', maxWidth: '100%' }}
      />
      <div>
        <label>Spin X:</label>
        <input
          type="number"
          value={spin.x}
          onChange={(e) => setSpin({ ...spin, x: Number(e.target.value) })}
        />
        <label>Spin Y:</label>
        <input
          type="number"
          value={spin.y}
          onChange={(e) => setSpin({ ...spin, y: Number(e.target.value) })}
        />
      </div>
    </>
  );
};

export default Balls;
