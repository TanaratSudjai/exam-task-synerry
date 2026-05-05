import React from 'react';

const LoadingBubble = () => (
  <div className="flex items-start">
    <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm">
      <span className="animate-pulse">กำลังคิด...</span>
    </div>
  </div>
);

export default LoadingBubble;
