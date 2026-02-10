import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  isDark?: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxLength = 200, 
  className = '', 
  isDark = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = text.length > maxLength;
  const displayText = isExpanded ? text : text.substring(0, maxLength);

  return (
    <div className={`${className} transition-all duration-300`}>
      <p className={`${isDark ? 'text-slate-200' : 'text-slate-800'} leading-relaxed text-sm whitespace-pre-wrap break-words`}>
        {displayText}
        {isLongText && !isExpanded && '...'}
      </p>
      
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`mt-3 px-4 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 ${
            isDark
              ? 'bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 border border-emerald-600/50'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
          }`}
        >
          {isExpanded ? '▲ إخفاء' : '▼ عرض المزيد'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
