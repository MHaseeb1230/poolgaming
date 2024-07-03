import React, { useRef, useEffect } from 'react';

const PoolTable = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw the pool table rectangle
    ctx.fillStyle = 'green';
    ctx.fillRect(50, 50, 500, 200);

    // Draw the pockets (corners)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(50, 50, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(550, 50, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(50, 250, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(550, 250, 10, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width="600"
      height="300"
      style={{ border: '1px solid black' }}
    />
  );
};

export default PoolTable;
