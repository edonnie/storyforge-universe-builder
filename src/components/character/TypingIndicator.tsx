
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex max-w-[85%] p-3 rounded-lg bg-muted text-foreground items-center">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-75"></div>
        <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
