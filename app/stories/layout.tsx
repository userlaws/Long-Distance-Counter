import type React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </>
  );
}
