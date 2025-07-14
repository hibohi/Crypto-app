
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex-shrink-0 bg-brand-surface border-b border-brand-border px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-2xl font-semibold text-brand-text">{title}</h1>
    </header>
  );
};

export default React.memo(Header);
