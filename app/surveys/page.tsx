'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertCircle, Heart, Stars } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [shareStory, setShareStory] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [answers, setAnswers] = useState({
    meaning: '',
    memorable: '',
    challenges: '',
    connection: '',
    advice: '',
  });

  const questions = [
    {
      id: 'meaning',
      question: 'What does being in a long-distance relationship mean to you?',
      icon: '💖',
    },
    {
      id: 'memorable',
      question: 'Can you share a memorable moment from your relationship?',
      icon: '✨',
    },
    {
      id: 'challenges',
      question: 'What challenges do you face in maintaining your relationship?',
      icon: '🌈',
    },
    {
      id: 'connection',
      question: 'How do you stay connected despite the distance?',
      icon: '📱',
    },
    {
      id: 'advice',
      question:
        'What advice would you give to others in long-distance relationships?',
      icon: '💌',
    },
  ];

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
      setError('');
    } else {
      setCaptchaVerified(false);
    }
  };

  const handleSubmit = async () => {
    if (!captchaVerified) {
      setError('Please verify that you are human first');
      return;
    }

    setIsSubmitting(true);

    try {
      // First, submit the survey data
      const surveyData = {
        answers,
        shareStory,
        selectedQuestion: shareStory ? selectedQuestion : null,
        captchaToken: recaptchaRef.current?.getValue() || '',
      };

      const surveyResponse = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (!surveyResponse.ok) {
        throw new Error('Failed to submit survey');
      }

      // Then, increment the counter
      const counterResponse = await fetch('/api/counter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captchaToken: recaptchaRef.current?.getValue() || '',
        }),
      });

      if (!counterResponse.ok) {
        const data = await counterResponse.json();
        setError(data.error || 'Failed to increment counter');
        return;
      }

      setFormSubmitted(true);
      router.push('/home');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (formSubmitted) {
    return (
      <div className='container py-12 md:py-24'>
        <motion.div
          className='mx-auto max-w-2xl text-center space-y-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='p-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 inline-block mx-auto shadow-lg'>
            <CheckCircle className='h-16 w-16 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-slate-800'>Thank You!</h1>
          <p className='text-lg text-slate-700'>
            Your responses have been recorded successfully. Thank you for
            sharing your experience.
          </p>
          {shareStory && (
            <p className='text-slate-600'>
              Your story will be added to our community stories after review.
            </p>
          )}
          <Button
            onClick={() => router.push('/stories')}
            className='mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-lg py-2 px-6'
          >
            View Community Stories
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const isFinalStep = currentStep === questions.length;

  return (
    <div className='bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen'>
      <div className='container py-12 md:py-24'>
        <div className='mx-auto max-w-2xl space-y-8'>
          <div className='space-y-2 text-center'>
            <h1 className='text-3xl font-bold md:text-4xl bg-gradient-to-r from-pink-600 to-indigo-600 text-transparent bg-clip-text'>
              LDR Experience Survey
            </h1>
            <p className='text-slate-700'>
              Share your experiences to help others in long-distance
              relationships
            </p>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className='w-full border-2 border-indigo-100 shadow-lg'>
              {!isFinalStep ? (
                <>
                  <CardHeader className='bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100'>
                    <div className='flex items-center gap-2'>
                      <span className='text-2xl'>{currentQuestion.icon}</span>
                      <CardTitle className='text-slate-800'>
                        Question {currentStep + 1} of {questions.length}
                      </CardTitle>
                    </div>
                    <CardDescription className='text-slate-600'>
                      {currentQuestion.question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <Textarea
                      name={currentQuestion.id}
                      value={
                        answers[currentQuestion.id as keyof typeof answers]
                      }
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [currentQuestion.id]: e.target.value,
                        })
                      }
                      placeholder='Type your answer here...'
                      className='min-h-[150px] border-indigo-200 focus:border-purple-400 focus:ring-purple-400'
                    />
                  </CardContent>
                  <CardFooter className='flex justify-between border-t border-indigo-100 pt-4'>
                    <Button
                      variant='outline'
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className='border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                    >
                      Next
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader className='bg-gradient-to-r from-purple-50 to-pink-50 border-b border-pink-100'>
                    <div className='flex items-center gap-2'>
                      <Heart className='h-5 w-5 text-pink-500' />
                      <CardTitle className='text-indigo-800'>
                        Final Step
                      </CardTitle>
                    </div>
                    <CardDescription className='text-purple-700 text-base mt-2'>
                      Complete verification and choose sharing options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6 pt-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-indigo-50'>
                        <Checkbox
                          id='share-story'
                          checked={shareStory}
                          onCheckedChange={(checked) =>
                            setShareStory(checked === true)
                          }
                          className='text-pink-500 border-pink-300 focus:ring-pink-500'
                        />
                        <Label
                          htmlFor='share-story'
                          className='text-indigo-800 cursor-pointer'
                        >
                          I would like to share one of my responses anonymously
                          with the community
                        </Label>
                      </div>

                      {shareStory && (
                        <div className='space-y-2 pl-6 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50'>
                          <Label className='text-indigo-800'>
                            Which response would you like to share?
                          </Label>
                          <div className='space-y-3 mt-2'>
                            {questions.map((q) => (
                              <div
                                key={q.id}
                                className='flex items-center space-x-2'
                              >
                                <input
                                  type='radio'
                                  id={`share-${q.id}`}
                                  name='share-question'
                                  value={q.id}
                                  checked={selectedQuestion === q.id}
                                  onChange={() => setSelectedQuestion(q.id)}
                                  className='text-purple-600 focus:ring-purple-500'
                                />
                                <Label
                                  htmlFor={`share-${q.id}`}
                                  className='text-purple-700 cursor-pointer'
                                >
                                  <span className='mr-2'>{q.icon}</span>{' '}
                                  {q.question}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className='pt-4'>
                        <div className='mb-2'>
                          <Label className='text-indigo-800'>
                            Please verify you are human
                          </Label>
                        </div>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={
                            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
                          }
                          onChange={handleCaptchaChange}
                        />
                        {error && (
                          <div className='text-red-500 mt-2'>
                            <AlertCircle className='inline-block mr-2' />
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between border-t border-indigo-100 pt-4'>
                    <Button
                      variant='outline'
                      onClick={handleBack}
                      className='border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !captchaVerified ||
                        (shareStory && !selectedQuestion) ||
                        isSubmitting
                      }
                      className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 ${
                        isSubmitting ? 'opacity-70' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
