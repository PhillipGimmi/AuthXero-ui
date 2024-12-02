import React from 'react';
import { createPortal } from 'react-dom';

interface TooltipSectionProps {
  tooltipText: string;
  mousePosition: { x: number; y: number };
  isVisible: boolean;
}

const TooltipSection: React.FC<TooltipSectionProps> = ({ tooltipText, mousePosition, isVisible }) => {
  if (!isVisible) return null;

  // Constants for positioning calculations
  const CURSOR_OFFSET = 8;  // Distance from cursor
  const VIEWPORT_MARGIN = 16;  // Minimum distance from viewport edges
  const DEFAULT_WIDTH = 200;
  const DEFAULT_HEIGHT = 40;  // Approximate height for single line tooltip

  const simplifyText = (text: string) => {
    if (text.toLowerCase().includes('percentage change')) {
      return 'Change vs Previous';
    }
    if (text.toLowerCase().includes('total')) {
      return text.split(':')[0].trim();
    }
    return text;
  };

  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const simplifiedText = simplifyText(tooltipText);
    
    // Create temporary element to measure actual tooltip dimensions
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    temp.style.padding = '10px 12px';
    temp.innerText = simplifiedText;
    document.body.appendChild(temp);
    
    const tooltipWidth = Math.min(temp.offsetWidth, DEFAULT_WIDTH);
    const tooltipHeight = temp.offsetHeight || DEFAULT_HEIGHT;
    document.body.removeChild(temp);

    // Initial preferred position (below and to the right of cursor)
    let left = mousePosition.x + CURSOR_OFFSET;
    let top = mousePosition.y + CURSOR_OFFSET;

    // Check right edge
    if (left + tooltipWidth > viewportWidth - VIEWPORT_MARGIN) {
      left = mousePosition.x - tooltipWidth - CURSOR_OFFSET;
    }

    // Check bottom edge
    if (top + tooltipHeight > viewportHeight - VIEWPORT_MARGIN) {
      top = mousePosition.y - tooltipHeight - CURSOR_OFFSET;
    }

    // Check left edge
    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN;
    }

    // Check top edge
    if (top < VIEWPORT_MARGIN) {
      top = VIEWPORT_MARGIN;
    }

    return { left, top };
  };

  const position = calculatePosition();

  const tooltipStyles = {
    position: 'fixed' as const,
    ...position,
    backgroundColor: '#1A1A1A',
    color: '#9CA3AF',
    padding: '10px 12px',
    borderRadius: '6px',
    zIndex: 1000,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    fontSize: '13px',
    lineHeight: '1.2',
    whiteSpace: 'nowrap' as const,
    pointerEvents: 'none' as const,
    transform: 'translateZ(0)', // Force GPU acceleration
    maxWidth: `${DEFAULT_WIDTH}px`,
    transition: 'all 0.1s ease-out',
  };

  return createPortal(
    <div style={tooltipStyles}>
      {simplifyText(tooltipText)}
    </div>,
    document.body
  );
};

export default TooltipSection;