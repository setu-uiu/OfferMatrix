import React from 'react';

interface FoodiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  withTagline?: boolean;
  className?: string;
}

export const FoodiLogo: React.FC<FoodiLogoProps> = ({
  size = 'md',
  variant = 'full',
  withTagline = false,
  className = '',
}) => {
  // Dimensions map
  const dimensions = {
    sm: {
      iconSize: 28,
      textSize: 'text-xl',
      height: 'h-7',
      taglineSize: 'text-[9px]',
    },
    md: {
      iconSize: 36,
      textSize: 'text-2xl sm:text-3xl',
      height: 'h-9 sm:h-10',
      taglineSize: 'text-[10px]',
    },
    lg: {
      iconSize: 48,
      textSize: 'text-4xl',
      height: 'h-12',
      taglineSize: 'text-xs',
    },
    xl: {
      iconSize: 64,
      textSize: 'text-5xl sm:text-6xl',
      height: 'h-16',
      taglineSize: 'text-sm',
    },
  }[size];

  // The official Foodi icon: Red badge with circular plate & dining fork
  const IconMark = (
    <div
      style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
      className="relative rounded-2xl bg-gradient-to-br from-[#ef0909] to-[#d80707] text-white flex items-center justify-center shadow-md shadow-[#ef0909]/25 shrink-0 select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/4 h-3/4"
      >
        {/* Outer Circular Dish Plate Outline */}
        <circle
          cx="24"
          cy="24"
          r="19"
          stroke="white"
          strokeWidth="3.2"
          strokeOpacity="0.95"
        />
        {/* Inner subtle rim */}
        <circle
          cx="24"
          cy="24"
          r="14.5"
          stroke="white"
          strokeWidth="1.2"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />
        {/* Foodi Dining Fork */}
        {/* Fork 3 Tines */}
        <path
          d="M19 12V20C19 22.2 20.8 24 23 24H25C27.2 24 29 22.2 29 20V12"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Fork Center Tine */}
        <line
          x1="24"
          y1="12"
          x2="24"
          y2="23"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Fork Handle */}
        <path
          d="M24 24V36"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );

  // The official Foodi Wordmark featuring the fork inside the second 'o'
  const Wordmark = (
    <div className="flex flex-col justify-center">
      <div className="flex items-center tracking-tight select-none">
        <svg
          height={dimensions.iconSize}
          viewBox="0 0 160 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* 'f' */}
          <path
            d="M14 40V22M14 22V14C14 10.7 16.7 8 20 8H23M8 22H20"
            stroke="#ef0909"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* First 'o' */}
          <circle
            cx="44"
            cy="27"
            r="12"
            stroke="#ef0909"
            strokeWidth="5.5"
          />

          {/* Second 'o' with integrated Foodi Fork */}
          <circle
            cx="76"
            cy="27"
            r="12"
            stroke="#ef0909"
            strokeWidth="5.5"
          />
          {/* Fork inside the second 'o' */}
          <path
            d="M72.5 19.5V24C72.5 25.2 73.5 26.2 74.8 26.2H77.2C78.5 26.2 79.5 25.2 79.5 24V19.5"
            stroke="#ef0909"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="76"
            y1="19.5"
            x2="76"
            y2="25.5"
            stroke="#ef0909"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="76"
            y1="26"
            x2="76"
            y2="34"
            stroke="#ef0909"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 'd' */}
          <path
            d="M118 8V40M118 40C114.5 40 106 37 106 27C106 17 114.5 14 118 14"
            stroke="#ef0909"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 'i' */}
          <line
            x1="138"
            y1="18"
            x2="138"
            y2="40"
            stroke="#ef0909"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle
            cx="138"
            cy="10"
            r="3.5"
            fill="#ef0909"
          />
        </svg>
      </div>

      {withTagline && (
        <span className={`${dimensions.taglineSize} font-bold text-gray-500 uppercase tracking-widest -mt-1`}>
          Food &amp; Grocery Delivery
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{IconMark}</div>;
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-red-100 shadow-xs ${className}`}>
        {IconMark}
        {Wordmark}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {IconMark}
      {Wordmark}
    </div>
  );
};
