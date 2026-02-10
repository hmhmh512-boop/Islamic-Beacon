import React from 'react';

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  gradient?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ 
  children, 
  className = '', 
  isDark = true, 
  gradient = 'from-emerald-950 to-emerald-900',
  icon,
  title,
  subtitle
}) => {
  return (
    <div className={`
      mx-2 sm:mx-3 md:mx-4
      rounded-2xl sm:rounded-3xl
      p-4 sm:p-6 md:p-8
      shadow-lg sm:shadow-xl
      border border-opacity-30
      transition-all duration-300
      ${isDark 
        ? `bg-gradient-to-br ${gradient} border-white/10` 
        : 'bg-white border-emerald-200'
      }
      ${className}
    `}>
      {/* Header */}
      {(icon || title) && (
        <div className="mb-4 sm:mb-6">
          {icon && <span className="text-3xl sm:text-4xl md:text-5xl block mb-2">{icon}</span>}
          {title && (
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-black quran-text ${
              isDark ? 'text-amber-400' : 'text-emerald-700'
            }`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`text-xs sm:text-sm font-bold mt-1 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`${(icon || title) ? 'mt-4 sm:mt-6' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default ResponsiveCard;
