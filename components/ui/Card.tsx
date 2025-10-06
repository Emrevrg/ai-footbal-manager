
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-glass-light dark:bg-glass-dark backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
};
