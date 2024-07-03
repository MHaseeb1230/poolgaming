import React from 'react';
import { subtract, add, multiply } from 'mathjs';

const Calculator = ({ cueBallPos, objectBallPos }) => {
  const calculateTrajectory = () => {
    if (!cueBallPos || !objectBallPos) return [0, 0];

    const direction = subtract([objectBallPos.x, objectBallPos.y], [cueBallPos.x, cueBallPos.y]);
    const distance = Math.sqrt(direction[0] ** 2 + direction[1] ** 2);
    const unitDirection = [direction[0] / distance, direction[1] / distance];
    const projectedPath = add([cueBallPos.x, cueBallPos.y], multiply(unitDirection, distance));

    return projectedPath;
  };

  const path = calculateTrajectory();

  return (
    <div>
      <p>Projected Path: ({path[0]}, {path[1]})</p>
    </div>
  );
};

export default Calculator;
