'use client';

/**
 * Contact Detail Page — /contact
 *
 * Full contact page with education timeline, contact information,
 * and a validated message form that posts to the /api/contact endpoint.
 */

import { useState } from 'react';
import {
  Send,
  Mail,
  MapPin,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// ─── Type Definitions ────────────────────────────────────────────────────────

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  description: string;
  icon: React.ElementType;
}

interface ContactInfoItem {
  label: string;
  value: string;
  href?: string;
  icon: React.ElementType;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmissionState = 'idle' | 'loading' | 'success' | 'error';

// ─── Static Data ─────────────────────────────────────────────────────────────

const educationEntries: EducationEntry[] = [
  {
    degree: 'M.Sc. Human-Computer Interaction',
    institution: 'Stanford University',
    year: '2020 – 2022',
    description: 'Focused on interaction design, usability research, and human-centered AI. Thesis on adaptive UI patterns for accessibility.',
    icon: GraduationCap,
  },
  {
    degree: 'B.Sc. Computer Science',
    institution: 'MIT',
    year: '2016 – 2020',
    description: 'Core coursework in algorithms, systems design, and software engineering. Minor in Visual Arts.',
    icon: GraduationCap,
  },
  {
    degree: 'UX Design Professional Certificate',
    institution: 'Google',
    year: '2021',
    description: 'Comprehensive program covering UX research, wireframing, prototyping, and usability testing methodologies.',
    icon: Calendar,
  },
];

const contactInfoItems: ContactInfoItem[] = [
  {
    label: 'Email',
    value: 'alex@portfolio.dev',
    href: 'mailto:alex@portfolio.dev',
    icon: Mail,
  },
  {
    label: 'Location',
    value: 'San Francisco, CA',
    icon: MapPin,
  },
  {
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    icon: Phone,
  },
];

// ─── Validation ──────────────────────────────────────────────────────────────

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ContactPage() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  function handleFieldChange(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmissionState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message. Please try again.');
      }

      setSubmissionState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});

      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. I will get back to you soon.',
      });

      setTimeout(() => setSubmissionState('idle'), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setSubmissionState('error');
      setErrorMessage(message);

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Education &amp; Contact
          </h1>
          <div className="mt-3 mx-auto h-1 w-24 rounded-full bg-cyan-500" />
          <p className="mt-6 text-lg text-white/50">
            My academic background and how to reach me
          </p>
        </div>

        {/* ── Two-Column Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* LEFT: Education & Contact Info */}
          <div className="space-y-10">
            {/* Education Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Education</h2>
              <div className="relative space-y-5">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />

                {educationEntries.map((entry, index) => {
                  const Icon = entry.icon;
                  return (
                    <div key={index} className="relative flex gap-4">
                      <div className="relative z-10 flex-shrink-0 w-[30px] h-[30px] rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      </div>

                      <div className="flex-1 bg-white/5 border border-white/10 border-l-2 border-l-cyan-500 rounded-xl p-4">
                        <h3 className="text-white font-medium leading-snug">
                          {entry.degree}
                        </h3>
                        <p className="text-white/60 text-sm mt-1">{entry.institution}</p>
                        <p className="text-cyan-400 text-xs mt-1.5 font-medium">{entry.year}</p>
                        <p className="text-white/40 text-xs mt-2 leading-relaxed">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Contact Info</h2>
              <div className="space-y-4">
                {contactInfoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider font-medium">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-white text-sm mt-0.5 hover:text-cyan-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white text-sm mt-0.5">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

            {submissionState === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
                <p className="text-green-400 font-semibold text-lg">Message Sent!</p>
                <p className="text-white/50 text-sm text-center">
                  Thank you for reaching out. I will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80 text-sm">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white/80 text-sm">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80 text-sm">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {submissionState === 'error' && errorMessage && (
                  <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  disabled={submissionState === 'loading'}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 flex items-center justify-center gap-2"
                >
                  {submissionState === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
