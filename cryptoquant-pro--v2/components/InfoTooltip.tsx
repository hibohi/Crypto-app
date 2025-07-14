import React from 'react';
import { InfoIcon } from './icons/InfoIcon';

interface InfoTooltipProps {
  text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <div className="info-tooltip-container">
      <InfoIcon className="h-5 w-5 text-brand-secondary cursor-pointer hover:text-brand-primary" />
      <span className="info-tooltip-text">{text}</span>
    </div>
  );
};

export default InfoTooltip;
