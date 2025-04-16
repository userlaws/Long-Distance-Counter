import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ldr-counter.vercel.app/'),
  title: {
    default: 'Long Distance Relationship Counter | LDRCounter',
    template: '%s | LDRCounter',
  },
  description:
    'Join our community at LDRCounter and see the real-time number of people in long distance relationships. Share your story and connect with others who understand your journey.',
  keywords: [
    'Long Distance Relationships',
    'LDR',
    'Counter',
    'Community',
    'Love',
    'Relationships',
    'Support',
    'Stories',
  ],
  authors: [{ name: 'LDRCounter Team' }],
  creator: 'LDRCounter Team',
  publisher: 'LDRCounter Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ldr-counter.vercel.app/',
    title: 'Long Distance Relationship Counter | LDRCounter',
    description:
      'Join our community at LDRCounter and see the real-time number of people in long distance relationships. Share your story and connect with others who understand your journey.',
    siteName: 'LDRCounter',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'LDRCounter - Connecting Hearts Across Distances',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Long Distance Relationship Counter | LDRCounter',
    description:
      'Join our community at LDRCounter and see the real-time number of people in long distance relationships. Share your story and connect with others who understand your journey.',
    creator: '@ldrcounter',
    images: ['/og-image.jpg'], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem>
          <div className='flex min-h-screen flex-col bg-white'>
            {/* Navbar only shown on non-landing pages */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css';
