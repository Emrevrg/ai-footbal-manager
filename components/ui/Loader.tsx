
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
