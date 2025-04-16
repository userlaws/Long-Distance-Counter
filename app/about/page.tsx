import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className='container py-12 md:py-24'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold text-slate-900 md:text-4xl'>
            About LDR Counter
          </h1>
          <p className='text-slate-600'>
            Understanding and supporting long distance relationships
          </p>
        </div>

        <Card>
          <CardContent className='p-6 md:p-8'>
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-bold text-slate-800'>
                  Our Mission
                </h2>
                <p className='mt-2 text-slate-700'>
                  LDR Counter was created to build awareness about the
                  prevalence of long distance relationships in today's
                  interconnected world. We aim to create a community where
                  people in LDRs can feel seen and supported.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold text-slate-800'>
                  What We Do
                </h2>
                <p className='mt-2 text-slate-700'>
                  Our counter tracks the number of people who identify as being
                  in a long distance relationship. This data helps us understand
                  the scale of LDRs globally and provides a sense of community
                  for those who might feel isolated in their relationship
                  situation.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold text-slate-800'>
                  Future Plans
                </h2>
                <p className='mt-2 text-slate-700'>
                  We're working on expanding our platform to include resources,
                  forums, and tools specifically designed to help couples
                  navigate the unique challenges of long distance relationships.
                  Our surveys will help us better understand the needs of the
                  LDR community.
                </p>
              </div>

              {/* <div>
                <h2 className='text-2xl font-bold text-slate-800'>
                  Contact Us
                </h2>
                <p className='mt-2 text-slate-700'>
                  Have questions, suggestions, or want to collaborate? Reach out
                  to us at
                  <a
                    href='mailto:contact@ldrcounter.com'
                    className='ml-1 text-rose-600 hover:underline'
                  >
                    contact@ldrcounter.com
                  </a>
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
