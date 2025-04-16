'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function LandingPage() {
  const router = useRouter();
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [hasSurveySubmitted, setHasSurveySubmitted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    const surveySubmitted = document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith('surveySubmitted=true'));

    setHasSurveySubmitted(surveySubmitted);
  }, []);

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
      setError('');
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleYesClick = async () => {
    if (!captchaVerified) {
      setError('Please verify that you are human first');
      return;
    }

    setIsIncrementing(true);
    try {
      const response = await fetch('/api/counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captchaToken: recaptchaRef.current?.getValue() || '',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 429) {
          setError('You have already participated recently');
        } else {
          setError(data.error || 'Failed to increment counter');
        }
        return;
      }

      await response.json();

      if (!hasSurveySubmitted) {
        setShowSurveyPrompt(true);
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Failed to increment counter:', error);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsIncrementing(false);
    }
  };

  const handleTakeSurvey = () => {
    setShowSurveyPrompt(false);
    router.push('/surveys');
  };

  const handleMaybeLater = () => {
    setShowSurveyPrompt(false);
    router.push('/home');
  };

  return (
    <div className='flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-100'>
      <div className='w-full max-w-3xl mx-auto text-center'>
        <h1 className='text-3xl font-bold md:text-4xl mb-6 text-slate-800'>
          Are you in a long distance relationship?
        </h1>

        <div className='rounded-2xl border-2 border-pink-200 bg-white p-8 md:p-10 shadow-xl'>
          <div className='flex justify-center mb-4'>
            <Heart className='h-12 w-12 text-pink-500 fill-pink-200' />
          </div>

          <div className='space-y-6'>
            <p className='text-lg text-slate-800 md:text-xl'>
              Join our community and share your story
            </p>

            <div className='flex flex-col items-center gap-4'>
              <div className='mb-4'>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={
                    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                    '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                  }
                  onChange={handleCaptchaChange}
                  theme='light'
                />
                {error && (
                  <div className='flex items-center justify-center text-rose-500 mt-2'>
                    <AlertCircle className='h-4 w-4 mr-2' />
                    <span className='text-sm'>{error}</span>
                  </div>
                )}
              </div>

              <div className='flex justify-center gap-4'>
                <Button
                  onClick={handleYesClick}
                  disabled={isIncrementing || !captchaVerified}
                  className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  {isIncrementing ? (
                    <span className='flex items-center gap-2'>
                      <Heart className='h-5 w-5 animate-pulse' />
                      Adding your story...
                    </span>
                  ) : (
                    <span className='flex items-center gap-2'>
                      <Heart className='h-5 w-5' />
                      Yes, I am
                    </span>
                  )}
                </Button>

                <Button
                  variant='outline'
                  onClick={() => {
                    setShowSurveyPrompt(false);
                    router.push('/home');
                  }}
                  className='border-pink-200 text-slate-700 hover:bg-pink-50 text-lg py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <span className='flex items-center gap-2'>
                    <ArrowRight className='h-5 w-5' />
                    View Counter
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSurveyPrompt} onOpenChange={setShowSurveyPrompt}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Share Your Story</DialogTitle>
            <DialogDescription>
              Would you like to answer a few questions about your long distance
              relationship? Your responses will help others in similar
              situations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2 sm:gap-0'>
            <Button
              variant='outline'
              onClick={handleMaybeLater}
              className='w-full'
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleTakeSurvey}
              className='w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            >
              Take Survey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
