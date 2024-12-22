import React, { useEffect, useRef } from 'react';

type StarProps = Readonly<{
  number?: number;
}>;

const NIGHT_SKY_COLORS = [
  '#280F36', // Deep purple
  '#632B6C', // Medium purple
  '#BE6590', // Pink purple
  '#FFC1A0', // Light peach
  '#FE9C7F', // Coral
] as const;

const STAR_SIZES = [0.5, 1, 1.5, 2, 2.5] as const;

export function Stars({ number = 500 }: StarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.classList.add('star');

      // Random animation parameters
      const flickerDuration = 2 + Math.random() * 4; // Random duration between 2-6s
      const flickerDelay = Math.random() * -10; // Random delay between 0-10s
      const initialOpacity = 0.5 + Math.random() * 0.3; // Random base opacity

      const size = STAR_SIZES[Math.floor(Math.random() * STAR_SIZES.length)];
      const color =
        NIGHT_SKY_COLORS[Math.floor(Math.random() * NIGHT_SKY_COLORS.length)];

      // Apply styles with unique animation
      Object.assign(star.style, {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        backgroundColor: color,
        opacity: initialOpacity.toString(),
        animation: `flicker ${flickerDuration}s ease-in-out infinite`,
        animationDelay: `${flickerDelay}s`,
        ...(size > 2 && {
          boxShadow: `0 0 6px 1px ${color}`,
        }),
      });

      container.appendChild(star);
    };

    // Create all stars
    Array.from({ length: number }, createStar);

    return () => {
      container.innerHTML = '';
    };
  }, [number]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
}
