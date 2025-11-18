import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-indigo-400 rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-light text-indigo-100 animate-pulse text-center serif italic">
        {message}
      </h3>
    </div>
  );
};

export default LoadingOverlay;