import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full', className = '' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const LogoIcon = () => (
    <div className={`${iconSizes[size]} bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg`}>
      <svg
        viewBox="0 0 32 32"
        className="w-3/5 h-3/5 text-white"
        fill="currentColor"
      >
        {/* Fork */}
        <path d="M8 4v6c0 1.1.9 2 2 2s2-.9 2-2V4h2v6c0 2.2-1.8 4-4 4s-4-1.8-4-4V4h2z" />
        <rect x="9" y="2" width="2" height="2" rx="1" />
        <rect x="7" y="2" width="2" height="2" rx="1" />
        <rect x="11" y="2" width="2" height="2" rx="1" />
        
        {/* Spoon */}
        <path d="M20 4c-2.2 0-4 1.8-4 4v2c0 1.1.9 2 2 2v12c0 1.1.9 2 2 2s2-.9 2-2V12c1.1 0 2-.9 2-2V8c0-2.2-1.8-4-4-4z" />
        
        {/* Plate/Bowl */}
        <ellipse cx="16" cy="26" rx="12" ry="4" fill="currentColor" opacity="0.3" />
        <path d="M4 22c0-2.2 5.4-4 12-4s12 1.8 12 4v2c0 2.2-5.4 4-12 4s-12-1.8-12-4v-2z" />
      </svg>
    </div>
  );

  const LogoText = () => (
    <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent`}>
      MealMate
    </span>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  );
};

export default Logo;
