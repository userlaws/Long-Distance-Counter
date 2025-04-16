'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/home' },
    { label: 'Survey', href: '/surveys' },
    { label: 'Stories', href: '/stories' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur'>
      <div className='container px-4 sm:px-6 lg:px-8 mx-auto'>
        <div className='flex h-16 items-center justify-between'>
          <Link
            href='/home'
            className='flex items-center gap-2 transition-opacity hover:opacity-80'
          >
            <Heart className='h-5 w-5 text-rose-500 fill-rose-500' />
            <span className='text-lg font-semibold tracking-tight'>
              LDR Counter
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className='hidden md:flex items-center gap-6'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-rose-600',
                  pathname === item.href ? 'text-rose-600' : 'text-slate-700'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className='md:hidden text-slate-700 hover:text-rose-600 transition-colors'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className='md:hidden border-t border-slate-200 bg-white'>
          <div className='container px-4 py-3'>
            <nav className='flex flex-col space-y-3'>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-2 py-1.5 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-slate-700 hover:text-rose-600 hover:bg-slate-50'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
