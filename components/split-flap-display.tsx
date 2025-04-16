'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplitFlapDigitProps {
  digit: string;
  previousDigit: string;
}

function SplitFlapDigit({ digit, previousDigit }: SplitFlapDigitProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== previousDigit) {
      setIsFlipping(true);
      const timer = setTimeout(() => setIsFlipping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [digit, previousDigit]);

  // Style the digit with fixed width and proper alignment
  const digitStyle = {
    width: '100%',
    textAlign: 'center' as const,
    fontFamily: 'monospace',
    fontVariantNumeric: 'tabular-nums',
    display: 'inline-block',
  };

  return (
    <div className='relative w-12 h-16 md:w-16 md:h-20 lg:w-20 lg:h-24 bg-slate-800 rounded-lg overflow-hidden shadow-lg'>
      {/* Static display when not flipping */}
      {!isFlipping && (
        <div className='absolute inset-0 flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-bold text-pink-500'>
          <span style={digitStyle}>{digit}</span>
        </div>
      )}

      {/* Flipping mechanism */}
      {isFlipping && (
        <>
          {/* Top half (flips down) */}
          <motion.div
            className='absolute top-0 left-0 right-0 h-1/2 bg-slate-800 overflow-hidden'
            style={{ transformOrigin: 'bottom' }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: 90 }}
            transition={{ duration: 0.15, ease: 'easeIn' }}
          >
            <div
              className='absolute inset-0 flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-bold text-pink-500'
              style={{ transform: 'translateY(50%)' }}
            >
              <span style={digitStyle}>{previousDigit}</span>
            </div>
          </motion.div>

          {/* Bottom half (flips up) */}
          <motion.div
            className='absolute bottom-0 left-0 right-0 h-1/2 bg-slate-800 overflow-hidden'
            style={{ transformOrigin: 'top' }}
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.15 }}
          >
            <div
              className='absolute inset-0 flex items-center justify-center text-4xl md:text-5xl lg:text-6xl font-bold text-pink-500'
              style={{ transform: 'translateY(-50%)' }}
            >
              <span style={digitStyle}>{digit}</span>
            </div>
          </motion.div>
        </>
      )}

      {/* Subtle center line */}
      <div className='absolute top-1/2 left-0 right-0 h-[1px] bg-slate-700 opacity-50' />

      {/* Add depth with inner shadows */}
      <div className='absolute inset-0 shadow-inner pointer-events-none rounded-lg' />
    </div>
  );
}

interface SplitFlapDisplayProps {
  number: number;
}

export default function SplitFlapDisplay({ number }: SplitFlapDisplayProps) {
  const [previousNumber, setPreviousNumber] = useState(number);
  const numberString = number.toString().padStart(6, '0');
  const previousNumberString = previousNumber.toString().padStart(6, '0');

  useEffect(() => {
    if (number !== previousNumber) {
      setPreviousNumber(number);
    }
  }, [number, previousNumber]);

  return (
    <div className='flex gap-1 md:gap-2 bg-slate-900 p-6 rounded-xl shadow-inner'>
      {numberString.split('').map((digit, index) => (
        <SplitFlapDigit
          key={index}
          digit={digit}
          previousDigit={previousNumberString[index]}
        />
      ))}
    </div>
  );
}
