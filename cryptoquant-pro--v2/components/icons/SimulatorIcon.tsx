
import React from 'react';

export const SimulatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 21V3" />
    <path d="M18 15l-6 6-6-6" />
    <path d="M18 9l-6-6-6 6" />
  </svg>
);
