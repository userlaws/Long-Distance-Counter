'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Pusher from 'pusher-js';
import { Heart, MessageCircle, Calendar } from 'lucide-react';

interface Story {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleStories, setVisibleStories] = useState<Story[]>([]);
  const [rotateInterval, setRotateInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Fetch initial stories
    fetch('/api/submit-survey')
      .then((res) => res.json())
      .then((data) => {
        const fetchedStories = data.stories || [];
        setStories(fetchedStories);
        setLoading(false);

        if (fetchedStories.length > 0) {
          // Initially show at most 6 stories or all if fewer
          updateVisibleStories(fetchedStories);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch stories:', err);
        setLoading(false);
      });

    // Set up Pusher for real-time updates
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY || 'a4b2e46fa5024db4e41a',
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
      }
    );

    const channel = pusher.subscribe('ldr-stories');
    channel.bind('story-added', (data: { stories: Story[] }) => {
      setStories(data.stories);
      updateVisibleStories(data.stories);
    });

    return () => {
      if (rotateInterval) clearInterval(rotateInterval);
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  // Function to update visible stories and set up rotation if needed
  const updateVisibleStories = (allStories: Story[]) => {
    if (allStories.length <= 6) {
      setVisibleStories(allStories);
      if (rotateInterval) {
        clearInterval(rotateInterval);
        setRotateInterval(null);
      }
    } else {
      // Show 6 stories and rotate them
      setVisibleStories(allStories.slice(0, 6));

      // Set up rotation interval if not already set
      if (!rotateInterval) {
        const interval = setInterval(() => {
          setVisibleStories((prev) => {
            // Take the first story and move it to the end for a carousel effect
            const [first, ...rest] = prev;
            // Find a story that's not currently visible
            const notVisible = allStories.find(
              (story) => !prev.some((s) => s.id === story.id)
            );

            if (notVisible) {
              // Add a new story that wasn't visible before
              return [...rest, notVisible];
            } else {
              // Just rotate the existing stories
              return [...rest, first];
            }
          });
        }, 8000); // Rotate every 8 seconds

        setRotateInterval(interval);
      }
    }
  };

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Colors for cards to make them visually distinct
  const cardColors = [
    'from-pink-100 to-rose-50 border-pink-200',
    'from-purple-100 to-indigo-50 border-purple-200',
    'from-indigo-100 to-blue-50 border-indigo-200',
    'from-blue-100 to-sky-50 border-blue-200',
    'from-emerald-100 to-green-50 border-emerald-200',
    'from-amber-100 to-yellow-50 border-amber-200',
  ];

  return (
    <div className='bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen py-12 md:py-24'>
      <div className='container'>
        <div className='mx-auto max-w-5xl space-y-8'>
          <div className='space-y-2 text-center'>
            <motion.h1
              className='text-3xl font-bold md:text-4xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Community Stories
            </motion.h1>
            <motion.p
              className='text-slate-700'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Read inspiring stories from others in long-distance relationships
            </motion.p>
          </div>

          {loading ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className='border-2 border-purple-100 shadow-md overflow-hidden'
                >
                  <CardHeader>
                    <Skeleton className='h-5 w-3/4 bg-purple-100' />
                    <Skeleton className='h-4 w-1/2 mt-2 bg-pink-100' />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className='h-20 w-full bg-indigo-50' />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : visibleStories.length > 0 ? (
            <AnimatePresence>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {visibleStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    className='h-full'
                  >
                    <Card
                      className={`h-full flex flex-col border-2 bg-gradient-to-br ${
                        cardColors[index % cardColors.length]
                      } shadow-md hover:shadow-lg transition-shadow duration-300`}
                    >
                      <CardHeader className='pb-2'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-2'>
                            <MessageCircle className='h-5 w-5 text-purple-500' />
                            <CardTitle className='text-lg line-clamp-2 text-indigo-800'>
                              {story.question}
                            </CardTitle>
                          </div>
                          <Heart className='h-4 w-4 text-pink-500 fill-pink-100' />
                        </div>
                        <CardDescription className='flex items-center gap-1 text-indigo-600 mt-2'>
                          <Calendar className='h-3 w-3' />
                          {formatDate(story.timestamp)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex-1 pt-2'>
                        <p className='text-sm text-indigo-700 bg-white/60 backdrop-blur-sm p-3 rounded-lg'>
                          "{story.answer}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div
              className='text-center py-12 bg-white/60 backdrop-blur-sm rounded-xl shadow-md border-2 border-purple-100'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className='h-12 w-12 text-pink-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2 text-slate-800'>
                No stories yet
              </h3>
              <p className='text-slate-600'>
                Be the first to share your experience by taking our survey!
              </p>
            </motion.div>
          )}

          {stories.length > 0 && (
            <motion.div
              className='text-center pt-4'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className='text-indigo-600 text-sm bg-white/60 backdrop-blur-sm py-2 px-4 rounded-full inline-block shadow-sm'>
                {stories.length > 6
                  ? 'Stories are rotating automatically. Check back for more!'
                  : 'Share your story to see it featured here. We rotate stories when we have more than 6 submissions.'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
