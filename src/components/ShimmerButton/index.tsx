'use client';

import { ArrowRight } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import styles from './ShimmerButton.module.css';

interface ShimmerButtonProps {
  text?: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShimmerButton = ({
  text = 'Get Started',
  href,
  onClick,
}: ShimmerButtonProps) => {
  return (
    <div style={{ pointerEvents: 'none' }} className="w-full relative">
      <Link href={href}>
        <button
          onClick={onClick}
          className={`${styles.shimmer_btn} relative px-8 py-3.5 w-full mb-4`}
          style={{ pointerEvents: 'auto' }}
        >
          <span className={styles.text}>
            {text}
            <ArrowRight className="inline-block h-5 w-5 ml-2" />
          </span>
          <span className={styles.shimmer}></span>
        </button>
      </Link>
    </div>
  );
};

export default ShimmerButton;
