import React from 'react';
import { Rectangle } from 'recharts';

export const CustomCandle = (props: any) => {
  const { x, y, width, height, ohlc } = props;
  const [open, high, low, close] = ohlc;
  
  const isRising = close > open;
  const color = isRising ? 'var(--brand-success)' : 'var(--brand-danger)';
  
  const y_max = y + height;
  const y_min = y;

  const close_y = y_min + ((high - close) / (high - low)) * height;
  const open_y = y_min + ((high - open) / (high - low)) * height;
  
  const candle_y = Math.min(open_y, close_y);
  const candle_height = Math.abs(open_y - close_y);

  return (
    <g stroke={color} fill={color} strokeWidth="1">
      <path
        d={`M ${x + width / 2}, ${y_min} 
            L ${x + width / 2}, ${y_max}`}
      />
      <Rectangle
        x={x}
        y={candle_y}
        width={width}
        height={candle_height}
        fill={color}
      />
    </g>
  );
};
