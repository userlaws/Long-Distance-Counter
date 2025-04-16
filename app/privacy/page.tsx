import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function PrivacyPolicy() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='container py-12 md:py-24 flex-grow'>
        <div className='mx-auto max-w-3xl space-y-8 text-center'>
          <h1 className='text-3xl font-bold text-slate-900 md:text-4xl'>
            Privacy Policy
          </h1>
          <p className='text-slate-600'>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card>
            <CardContent className='p-6 md:p-8'>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    Our Commitment to Privacy
                  </h2>
                  <p className='text-slate-700'>
                    At LDR Counter, we are committed to protecting your privacy.
                    We believe in transparency and want you to understand
                    exactly how we handle your data.
                  </p>
                </div>

                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    What We Don't Store
                  </h2>
                  <ul className='list-disc list-inside space-y-2 text-slate-700'>
                    <li>We do not store any personal information</li>
                    <li>We do not store your IP address</li>
                    <li>We do not store your survey responses</li>
                    <li>We do not use cookies or tracking technologies</li>
                    <li>
                      We do not collect or store any demographic information
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    What We Do Store
                  </h2>
                  <p className='text-slate-700'>
                    The only data we maintain is an anonymous counter that
                    tracks the total number of people who have participated in
                    our community. This counter is completely anonymous and
                    cannot be traced back to any individual.
                  </p>
                </div>

                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    Third-Party Services
                  </h2>
                  <p className='text-slate-700'>
                    We use reCAPTCHA to prevent spam and abuse. This service is
                    provided by Google and is subject to their privacy policy.
                    We do not have access to any data collected by reCAPTCHA.
                  </p>
                </div>

                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    Your Rights
                  </h2>
                  <p className='text-slate-700'>
                    Since we do not store any personal data, there is no data to
                    access, modify, or delete. You can participate in our
                    counter anonymously at any time.
                  </p>
                </div>

                <div>
                  <h2 className='text-2xl font-bold text-slate-800 mb-4'>
                    Changes to This Policy
                  </h2>
                  <p className='text-slate-700'>
                    We may update this privacy policy from time to time. Any
                    changes will be posted on this page with an updated revision
                    date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
