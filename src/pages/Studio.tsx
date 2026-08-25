import Reveal from '@/components/site/Reveal';
import PageHeader from '@/components/site/PageHeader';

const team = [
  { n: 'Ishaan Verma', r: 'Founder & Principal Architect', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80' },
  { n: 'Meera Kulkarni', r: 'Design Director, Interior', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
  { n: 'Tanvi Rao', r: 'Senior Architect', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { n: 'Kabir Nair', r: 'Project Manager', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
  { n: 'Saira Kapoor', r: 'Landscape Architect', img: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80' },
  { n: 'Aditya Menon', r: 'Structural Engineer', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80' },
];

const timeline = [
  ['2011', 'Studio founded above a bookshop in Kala Ghoda, Mumbai.'],
  ['2014', 'First hospitality commission completed in Udaipur.'],
  ['2017', 'Recognised by Architectural Digest India Under-40.'],
  ['2020', 'Landscape practice added; team crosses twelve.'],
  ['2023', 'Terra Boutique Hotel wins Kyoorius Design Grand Prix.'],
  ['2026', '92 completed projects across seven states.'],
];

export default function Studio() {
  return (
    <>
      <PageHeader
        eyebrow="Studio"
        title={<>A quiet <span className="italic-serif text-accent">practice,</span><br/>fifteen years in.</>}
        image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="py-24 md:py-40 container-luxe">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="eyebrow text-accent">Founder's note</div>
          </div>
          <div className="lg:col-span-8">
            <Reveal>
              <p className="heading-lg">
                I opened SS Architects &amp; Interiors because I wanted to draw slowly — with a room to think, a client to trust, and a builder we knew by name. Fifteen years and ninety-two projects later, that is still the only ambition.
              </p>
              <p className="mt-8 text-muted-foreground text-lg leading-relaxed max-w-2xl">
                We are not a big firm. We are twenty-two people who care very deeply about the fall of light onto a limewashed wall. Our clients tend to stay clients — many of the homes we have built are second or third houses for the same family.
              </p>
              <div className="mt-10 font-display italic text-xl text-accent">— Ishaan Verma, Founder</div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card/40 border-y border-border">
        <div className="container-luxe grid md:grid-cols-3 gap-12">
          {[
            ['Mission', 'To design buildings and interiors that are made to last — quietly, materially, and in service of the people inside them.'],
            ['Vision', 'A practice known less for a signature look than for the depth of its listening.'],
            ['Philosophy', 'Restraint over expression. Craft over image. Slow over urgent. The room, before the render.'],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1}>
              <div className="border-t border-foreground/20 pt-6">
                <div className="eyebrow text-accent mb-4">{t}</div>
                <p className="font-display text-2xl leading-[1.25]">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 container-luxe">
        <div className="eyebrow text-accent mb-6">Timeline</div>
        <h2 className="heading-xl mb-16">A brief <span className="italic-serif">history.</span></h2>
        <div className="space-y-0">
          {timeline.map(([y, t], i) => (
            <Reveal key={y} delay={i * 0.04}>
              <div className="grid md:grid-cols-12 gap-6 py-8 border-t border-foreground/15">
                <div className="md:col-span-3 font-display text-4xl md:text-5xl text-accent">{y}</div>
                <div className="md:col-span-9 text-lg text-foreground/85 flex items-center">{t}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card border-t border-border text-foreground">
        <div className="container-luxe">
          <div className="eyebrow text-accent mb-6">Team</div>
          <h2 className="heading-xl mb-16">Twenty-two hands,<br/><span className="italic-serif">one drawing.</span></h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {team.map((m, i) => (
              <Reveal key={m.n} delay={i * 0.05}>
                <figure className="group">
                  <div className="aspect-[3/4] overflow-hidden bg-white/5 mb-5">
                    <img src={m.img} alt={m.n} loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[900ms] group-hover:scale-[1.03]" />
                  </div>
                  <figcaption>
                    <div className="font-display text-2xl">{m.n}</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">{m.r}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
