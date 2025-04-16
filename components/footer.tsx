'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <footer className='bg-slate-50 border-t border-slate-200 pt-10 pb-8'>
      <div className='container px-4 sm:px-6 lg:px-8 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <Heart className='h-5 w-5 text-rose-500 fill-rose-500' />
              <span className='font-semibold tracking-tight'>LDR Counter</span>
            </div>
            <p className='text-sm text-slate-600 max-w-xs'>
              Supporting couples in long-distance relationships through shared
              stories and community connection.
            </p>
          </div>

          <div>
            <h3 className='font-medium text-sm mb-4'>Explore</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/home'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/surveys'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  Take Survey
                </Link>
              </li>
              <li>
                <Link
                  href='/stories'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  Read Stories
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-medium text-sm mb-4'>Resources</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-sm text-slate-600 hover:text-rose-600 transition-colors'
                >
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm text-slate-500 mb-4 md:mb-0'>
            &copy; {year} LDR Counter. All rights reserved. Created 04/16/2025
          </p>
          <div className='flex space-x-6'>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                currentUrl
              )}&text=Check out LDR Counter!`}
              className='text-slate-400 hover:text-slate-600 transition-colors'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z'></path>
              </svg>
            </a>
            <a
              href={`https://instagram.com/?url=${encodeURIComponent(
                currentUrl
              )}`}
              className='text-slate-400 hover:text-slate-600 transition-colors'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='2' y='2' width='20' height='20' rx='5' ry='5'></rect>
                <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z'></path>
                <line x1='17.5' y1='6.5' x2='17.51' y2='6.5'></line>
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                currentUrl
              )}`}
              className='text-slate-400 hover:text-slate-600 transition-colors'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
