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
  CheckCircle2,
  Loader2,
  MapPin,
} from 'lucide-react';

// ─── Brand SVG Icons ────────────────────────────────────────────────────────

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 5.5V18.5C22 19.33 21.33 20 20.5 20H3.5C2.67 20 2 19.33 2 18.5V5.5C2 4.67 2.67 4 3.5 4H20.5C21.33 4 22 4.67 22 5.5ZM20.5 5.5H3.5V7.23L12 12.33L20.5 7.23V5.5ZM3.5 18.5H20.5V9.12L12 14.27L3.5 9.12V18.5Z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
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
    label: 'Gmail',
    value: 'alex@portfolio.dev',
    href: 'mailto:alex@portfolio.dev',
    icon: GmailIcon,
  },
  {
    label: 'WhatsApp',
    value: '+880 1XXX-XXXXXX',
    href: 'https://wa.me/8801XXXXXXXXX',
    icon: WhatsAppIcon,
  },
  {
    label: 'Twitter',
    value: '@yourhandle',
    href: 'https://x.com/yourhandle',
    icon: TwitterIcon,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT: Contact Info */}
          <div className="space-y-6">
            {/* Google Map */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.03] backdrop-blur-xl">
              <div className="relative w-full h-64 sm:h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.38703812057!2d90.2792399!3d23.7805733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563b5e21c8bda!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location — Dhaka, Bangladesh"
                  className="absolute inset-0"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-3 border-t border-white/[0.03]">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-white/50 text-sm">Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-h2 text-white mb-5">Contact Info</h2>
              <div className="space-y-3">
                {contactInfoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 border border-white/[0.03] rounded-xl p-4 backdrop-blur-xl"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
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
          <div className="backdrop-blur-xl border border-white/[0.03] rounded-2xl p-5 sm:p-6">
            <h2 className="text-h2 text-white mb-6">Send a Message</h2>

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
                    className="bg-white/[0.02] border-white/[0.05] text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
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
                    className="bg-white/[0.02] border-white/[0.05] text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
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
                    className="bg-white/[0.02] border-white/[0.05] text-white text-base placeholder:text-white/30 focus:border-cyan-500/50 focus:ring-cyan-500/20"
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
