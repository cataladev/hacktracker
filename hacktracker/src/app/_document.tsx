import React from 'react';

const AnimatedComponent = () => {
  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="animate-fadeIn">
        <img src="/path/to/icon.png" alt="Icon" className="w-16 h-16" />
      </div>
      <div className="animate-fadeIn mt-4">
        <p className="text-lg font-bold">Animated Text</p>
      </div>
    </div>
  );
};

export default AnimatedComponent;