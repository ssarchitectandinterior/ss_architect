import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const services = [
  { title: 'Architecture', desc: 'Ground-up buildings — residential, hospitality, and commercial — designed with a slow, material-first sensibility.', img: img('photo-1600607687939-ce8a6c25118c') },
  { title: 'Interior Design', desc: 'Interiors resolved to the last light switch. Colour, texture, joinery and lighting under one hand.', img: img('photo-1618221195710-dd6b41faaea6') },
  { title: 'Landscape Design', desc: 'Gardens, courtyards and terraces designed as extensions of the building — not as afterthoughts.', img: img('photo-1558618666-fcd25c85f82e') },
  { title: 'Urban Planning', desc: 'Neighbourhood-scale plans for developers who want density with dignity.', img: img('photo-1480714378408-67cf0d13bc1b') },
  { title: 'Master Planning', desc: 'Long-view planning for campuses, resorts and estates. We think in decades.', img: img('photo-1486325212027-8081e485255e') },
  { title: 'Commercial Design', desc: 'Offices, retail and mixed-use — designed to age well and read quietly.', img: img('photo-1497366216548-37526070297c') },
  { title: 'Residential Design', desc: 'Homes for one or two generations. The type of work our studio was founded on.', img: img('photo-1613490493576-7fde63acd811') },
  { title: 'Renovation', desc: 'Careful, additive interventions in heritage and existing buildings.', img: img('photo-1585128792020-803d29415281') },
  { title: 'Turnkey Projects', desc: 'From first sketch to keys in hand — a single-point delivery model for private clients.', img: img('photo-1503387762-592deb58ef4e') },
  { title: 'Furniture Design', desc: 'Bespoke pieces built with our workshop partners across Rajasthan and Kerala.', img: img('photo-1555041469-a586c61ea9bc') },
  { title: 'Lighting Design', desc: 'Layered, dimmable, warm. Light as the last material of a room.', img: img('photo-1565814329452-e1efa11c5b89') },
  { title: '3D Visualization', desc: 'In-house visualisation — used to design with, not to sell with.', img: img('photo-1545324418-cc1a3fa10c00') },
  { title: 'Project Management', desc: 'A dedicated project lead from first meeting to final handover.', img: img('photo-1504307651254-35680f356dfd') },
  { title: 'Construction Supervision', desc: 'Weekly site presence. Every finish mocked up before it is signed off.', img: img('photo-1504307651254-35680f356dfd') },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={<>One studio,<br/><span className="italic-serif text-accent">one drawing.</span></>}
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
        subtitle="We take a project through every stage under one roof — from planning approvals to the last light fitting."
      />

      <section className="py-20 md:py-28 container-luxe">
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 0.05}>
                <details
                  className="group border-b border-foreground/15 py-8"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <summary className="cursor-pointer list-none flex items-baseline gap-6">
                    <span className="text-accent text-xs tracking-[0.2em]">{`0${i + 1}`.slice(-2)}</span>
                    <span className="font-display text-3xl md:text-4xl flex-1 group-hover:text-accent transition-colors">{s.title}</span>
                    <span className="text-accent text-2xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-6 ml-12 text-muted-foreground max-w-xl leading-relaxed">{s.desc}</p>
                </details>
              </Reveal>
            ))}
          </div>

          {/* Anchored image panel on the right */}
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && services[hoveredIndex]?.img && (
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block absolute right-0 top-0 w-[380px] h-[480px] pointer-events-none z-20 overflow-hidden shadow-2xl"
              >
                <img 
                  src={services[hoveredIndex].img}
                  className="w-full h-full object-cover"
                  alt={services[hoveredIndex].title}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card border-t border-border text-foreground">
        <div className="container-luxe grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow text-accent mb-6">Why choose us</div>
            <h2 className="heading-xl">Careful, on time,<br/><span className="italic-serif">on brief.</span></h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[
              'Experienced architects — no juniors in the lead.',
              'One project manager, from sketch to handover.',
              'Premium materials, vetted with the workshop.',
              'A transparent monthly cost and time report.',
              'On-time delivery, or an honest conversation early.',
              'A decade of post-project maintenance care.',
            ].map((w, i) => (
              <Reveal key={w} delay={i * 0.05}>
                <div className="flex items-start gap-5 border-t border-white/15 pt-4">
                  <span className="text-accent font-display text-2xl leading-none pt-1">◆</span>
                  <span className="text-lg text-white/85">{w}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
