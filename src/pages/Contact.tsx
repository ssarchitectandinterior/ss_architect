import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

const schema = z.object({
  name: z.string().trim().min(2, 'Please share your name').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  service: z.string().max(80).optional().or(z.literal('')),
  budget: z.string().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'A few more words, please').max(2000),
});

import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';

export default function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(iss => { errs[iss.path[0] as string] = iss.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setState('sending');

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('contact_submissions').insert([
          {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            service: parsed.data.service || null,
            message: parsed.data.message,
          },
        ]);
        if (error) {
          console.error('Supabase submission error:', error);
          throw new Error(error.message);
        }
      } else {
        // Fallback simulation when Supabase credentials are not set up yet
        await new Promise(r => setTimeout(r, 900));
      }
      setState('sent');
    } catch (err: any) {
      console.error('Form submission failed:', err);
      setSubmitError(err.message || 'Submission failed. Please try again.');
      setState('idle');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Begin a <span className="italic-serif text-accent">commission.</span></>}
        image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80"
        subtitle="Tell us about your site and your intentions. We reply within two working days."
      />

      <section className="py-24 md:py-32 container-luxe grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-10">
          <Reveal>
            <div>
              <div className="eyebrow text-accent mb-3">Studio</div>
              <p className="font-display text-2xl leading-tight">12 Kala Ghoda Lane<br/>Mumbai 400001<br/>India</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="eyebrow text-accent mb-3">Direct</div>
              <p className="text-lg">
                <a href="mailto:hello@ateliernorr.com" className="link-underline">hello@ateliernorr.com</a><br/>
                <a href="tel:+912248902200" className="link-underline">+91 22 4890 2200</a>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div>
              <div className="eyebrow text-accent mb-3">Hours</div>
              <p className="text-lg text-muted-foreground">Mon–Fri, 10:00–18:30<br/>Studio visits by appointment</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <a href="https://wa.me/912248902200" className="inline-flex items-center gap-3 border border-white/60 hover:border-accent hover:text-accent transition-colors px-5 py-3 uppercase tracking-[0.2em] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Chat on WhatsApp
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={onSubmit} noValidate className="grid md:grid-cols-2 gap-x-8 gap-y-10">
            {[
              { n: 'name', l: 'Your name', t: 'text', full: false, req: true },
              { n: 'email', l: 'Email', t: 'email', full: false, req: true },
              { n: 'phone', l: 'Phone (optional)', t: 'tel', full: false },
              { n: 'service', l: 'Service of interest', t: 'text', full: false },
              { n: 'budget', l: 'Approximate budget', t: 'text', full: true },
            ].map(f => (
              <label key={f.n} className={`block ${f.full ? 'md:col-span-2' : ''}`}>
                <span className="eyebrow text-muted-foreground">{f.l}{f.req && <span className="text-accent"> ◆</span>}</span>
                <input
                  name={f.n}
                  type={f.t}
                  required={f.req}
                  className="mt-2 block w-full bg-transparent border-b border-foreground/25 focus:border-accent outline-none py-3 text-lg font-display transition-colors"
                />
                {errors[f.n] && <span className="text-destructive text-xs mt-1 block">{errors[f.n]}</span>}
              </label>
            ))}

            <label className="block md:col-span-2">
              <span className="eyebrow text-muted-foreground">Tell us about the project <span className="text-accent">◆</span></span>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-2 block w-full bg-transparent border-b border-foreground/25 focus:border-accent outline-none py-3 text-lg resize-none transition-colors"
              />
              {errors.message && <span className="text-destructive text-xs mt-1 block">{errors.message}</span>}
            </label>

            <div className="md:col-span-2 flex items-center gap-6 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={state !== 'idle'}
                className="inline-flex items-center gap-4 bg-foreground text-background border border-white/60 hover:bg-accent hover:text-white px-10 py-5 uppercase tracking-[0.2em] text-xs transition-colors disabled:opacity-70"
              >
                {state === 'idle' && <>Send inquiry →</>}
                {state === 'sending' && <>Sending…</>}
                {state === 'sent' && <>Received — thank you ✓</>}
              </motion.button>
              {submitError && (
                <span className="text-destructive text-sm font-medium block w-full mt-2">
                  {submitError}
                </span>
              )}
              {state === 'sent' && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                  We'll be in touch within two working days.
                </motion.span>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-luxe">
          <div className="aspect-[21/9] bg-muted overflow-hidden grayscale">
            <iframe
              title="Studio location"
              className="w-full h-full border-0"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.8290%2C18.9250%2C72.8360%2C18.9310&layer=mapnik"
            />
          </div>
        </div>
      </section>
    </>
  );
}
