import React from 'react';

const LoadingCard = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 bg-white p-4 rounded-lg mb-4">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-5/12"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default LoadingCard;

