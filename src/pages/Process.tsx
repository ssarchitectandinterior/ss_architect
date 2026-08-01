import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

const stages = [
  ['Discovery', 'A first meeting, always in person if possible. We listen more than we sketch.'],
  ['Site Visit', 'A slow walk of the land. Sun path, wind, sound, neighbours, existing trees.'],
  ['Research', 'A written brief and a mood folder, agreed and signed off before we design.'],
  ['Concept', 'One direction — presented in sketches, a physical model, and a materials tray.'],
  ['Planning', 'Approvals, zoning, statutory work — handled by our in-house liaison.'],
  ['Material Selection', 'Samples on site, in the actual light. Nothing chosen from a screen.'],
  ['3D Visualization', 'In-house renders to design with. Refined until the room feels right.'],
  ['Working Drawings', 'A tender-ready set our contractors love to build from.'],
  ['Execution', 'Weekly site presence. Snag lists closed within seven days.'],
  ['Quality Inspection', 'A three-round finish inspection before any sign-off.'],
  ['Handover', 'Keys, warranties, and a printed care manual for the building.'],
];

export default function Process() {
  return (
    <>
      <PageHeader
        eyebrow="Process"
        title={<>A slow,<br/><span className="italic-serif text-accent">certain</span> path.</>}
        image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="py-24 md:py-32 container-luxe">
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-foreground/15" aria-hidden />
          <ol className="space-y-16 md:space-y-24">
            {stages.map(([t, d], i) => (
              <li key={t} className="relative grid md:grid-cols-2 gap-6 md:gap-16 items-start">
                <span className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                <Reveal>
                  <div className={`pl-16 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:col-start-2 md:pl-16'}`}>
                    <div className="eyebrow text-accent mb-3">Stage {`0${i + 1}`.slice(-2)}</div>
                    <h3 className="font-display text-4xl md:text-5xl mb-4">{t}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md md:inline-block">{d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
