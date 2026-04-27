'use client';

/**
 * Contact Detail Page — /contact
 *
 * Contact information and a validated message form
 * that posts to the /api/contact endpoint.
 * All buttons use the animated traveling border glow effect.
 */

import { useState, use } from 'react';
import Image from 'next/image';
import {
  Send,
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AnimatedBorderButton from '@/components/ui/animated-border-button';

// ─── Type Definitions ────────────────────────────────────────────────────────

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

const contactInfoItems: ContactInfoItem[] = [
  {
    label: 'Email',
    value: 'alex@portfolio.dev',
    href: 'mailto:alex@portfolio.dev',
    icon: Mail,
  },
  {
    label: 'Location',
    value: 'Dhaka, Bangladesh',
    icon: MapPin,
  },
  {
    label: 'Phone',
    value: '+880 1XXX-XXXXXX',
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

export default function ContactPage({ params, searchParams }: { params: Promise<Record<string, string | string[]>>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  use(params);
  use(searchParams);
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
      <div className="mx-auto max-w-7xl">
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-16 text-center">
          {/* Profile Image */}
          <div className="mb-8 inline-block relative">
            <div className="h-40 w-40 sm:h-48 sm:w-48 rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-[0_0_40px_rgba(0,212,255,0.2)] mx-auto">
              <Image
                src="/profile.jpeg"
                alt="Alex Chen"
                width={192}
                height={192}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-cyan-400/10 scale-110" />
          </div>
          <h1 className="text-h1 text-white">
            Get In Touch
          </h1>
          <div className="mt-6 mx-auto h-1 w-24 rounded-full bg-cyan-500" />
          <p className="mt-6 text-body text-white/50">
            Have a project in mind? Let&apos;s talk.
          </p>
        </div>

        {/* ── Two-Column Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Contact Info */}
          <div className="space-y-10">
            {/* Contact Info */}
            <div>
              <h2 className="text-h2 text-white mb-8">Contact Info</h2>
              <div className="space-y-4">
                {contactInfoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-6 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
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
                            className="text-white text-base mt-0.5 hover:text-cyan-400 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white text-base mt-0.5">{item.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-h2 text-white mb-8">Send a Message</h2>

            {submissionState === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
                <p className="text-green-400 font-semibold text-lg">Message Sent!</p>
                <p className="text-white/50 text-sm text-center">
                  Thank you for reaching out. I will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-white/80 text-sm">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-white/80 text-sm">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-white/80 text-sm">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    className="bg-white/5 border-white/10 text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20 resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                {submissionState === 'error' && errorMessage && (
                  <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                )}

                <AnimatedBorderButton
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={submissionState === 'loading'}
                  borderRadius={6}
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
                </AnimatedBorderButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
