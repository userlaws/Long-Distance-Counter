import type React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function AboutLayout({
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
