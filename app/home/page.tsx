'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Pusher from 'pusher-js';

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of the counter value
    const fetchCounter = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/counter');
        const data = await res.json();
        if (res.ok) {
          setCount(data.count);
        }
      } catch (err) {
        console.error('Failed to fetch counter:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounter();

    // Set up Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('ldr-counter');
    channel.bind('counter-updated', (data: { count: number }) => {
      setCount(data.count);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // Function to render individual digits with animation
  const renderDigits = () => {
    if (isLoading) {
      return <span className='animate-pulse'>Loading...</span>;
    }

    const digits = count.toString().split('');
    return digits.map((digit, index) => (
      <span
        key={`${index}-${digit}`}
        className='inline-block animate-slide-up font-mono'
      >
        {digit}
      </span>
    ));
  };

  return (
    <div className='flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-100'>
      <div className='w-full max-w-3xl mx-auto text-center'>
        <h1 className='text-3xl font-bold md:text-4xl mb-6 text-slate-800'>
          Long Distance Relationships
        </h1>
        <p className='text-xl mb-8 text-slate-700'>
          Celebrating connections that transcend distance
        </p>

        <div className='rounded-2xl border-2 border-pink-200 bg-white p-8 md:p-10 shadow-xl'>
          <div className='flex justify-center mb-4'>
            <Heart className='h-12 w-12 text-pink-500 fill-pink-200' />
          </div>
          <p className='text-lg text-slate-800 md:text-xl mb-4'>
            Current number of people in long distance relationships:
          </p>
          <div className='my-6 overflow-hidden'>
            <div
              className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider'
              style={{
                color: '#FF1B6B', // Solid color for visibility
              }}
            >
              {renderDigits()}
            </div>
          </div>
          <p className='text-slate-700 mt-6'>
            This counter updates in real-time as people join our community.
          </p>
        </div>
      </div>
    </div>
  );
}
