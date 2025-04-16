'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Quote, ChevronRight, ChevronLeft } from 'lucide-react';
import Pusher from 'pusher-js';
import { motion } from 'framer-motion';
import { Story } from '@/lib/db';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stories when component mounts
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/submit-survey');
        if (response.ok) {
          const data = await response.json();
          setStories(data.stories || []);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();

    // Set up Pusher for real-time updates
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('ldr-stories');
    channel.bind('story-added', (data: { stories: Story[] }) => {
      setStories(data.stories || []);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const nextStory = () => {
    if (stories.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevStory = () => {
    if (stories.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + stories.length) % stories.length
    );
  };

  if (isLoading) {
    return (
      <div className='container py-24 flex items-center justify-center'>
        <div className='text-center'>
          <Heart className='h-12 w-12 text-pink-500 animate-pulse mx-auto' />
          <p className='mt-4 text-slate-700'>Loading stories...</p>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className='container py-24 flex items-center justify-center'>
        <div className='max-w-lg text-center'>
          <Heart className='h-12 w-12 text-pink-500 mx-auto mb-6' />
          <h1 className='text-3xl font-bold text-slate-800 mb-4'>
            No Stories Yet
          </h1>
          <p className='text-slate-700 mb-6'>
            Be the first to share your long-distance relationship experience by
            taking our survey!
          </p>
          <Button
            className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            onClick={() => (window.location.href = '/surveys')}
          >
            Take Survey
          </Button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className='container py-12 md:py-24'>
      <div className='max-w-4xl mx-auto space-y-12'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold md:text-4xl text-slate-800'>
            Community Stories
          </h1>
          <p className='text-slate-600'>
            Real experiences from people in long-distance relationships
          </p>
        </div>

        <div className='relative'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='relative'
          >
            <Card className='border-2 border-pink-100 bg-gradient-to-br from-white to-pink-50 shadow-xl overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-purple-50 to-pink-50 border-b border-pink-100'>
                <div className='flex items-center gap-2'>
                  <Quote className='h-6 w-6 text-pink-500' />
                  <CardTitle className='text-rose-600'>
                    {currentStory.question}
                  </CardTitle>
                </div>
                <CardDescription className='text-purple-700'>
                  Shared by an LDR community member
                </CardDescription>
              </CardHeader>
              <CardContent className='p-6 pt-8 text-lg text-slate-700 leading-relaxed'>
                "{currentStory.answer}"
              </CardContent>
              <CardFooter className='flex justify-between border-t border-pink-100 pt-4'>
                <p className='text-sm text-slate-500'>
                  {new Date(currentStory.timestamp).toLocaleDateString()}
                </p>
                <div className='flex items-center gap-2 text-sm text-slate-500'>
                  <span>
                    {currentIndex + 1} of {stories.length}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {stories.length > 1 && (
            <>
              <Button
                variant='outline'
                size='icon'
                className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-pink-200 text-pink-500 hover:bg-pink-50 hover:text-pink-600 h-12 w-12 shadow-md'
                onClick={prevStory}
              >
                <ChevronLeft className='h-6 w-6' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border-pink-200 text-pink-500 hover:bg-pink-50 hover:text-pink-600 h-12 w-12 shadow-md'
                onClick={nextStory}
              >
                <ChevronRight className='h-6 w-6' />
              </Button>
            </>
          )}
        </div>

        <div className='text-center'>
          <p className='text-slate-700 mb-6'>
            Have your own story to share? We'd love to hear about your
            experience!
          </p>
          <Button
            className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            onClick={() => (window.location.href = '/surveys')}
          >
            Take Survey
          </Button>
        </div>
      </div>
    </div>
  );
}
