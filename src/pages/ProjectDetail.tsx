import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '@/components/site/Reveal';
import { projects as staticProjects } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [dbProject, setDbProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !slug) {
      setLoading(false);
      return;
    }

    // Fetch project from Supabase database by ID
    supabase
      .from('projects')
      .select('*')
      .eq('id', slug)
      .single()
      .then(async ({ data, error }) => {
        if (!error && data) {
          // Fetch gallery photos from project_media table
          const { data: mediaData } = await supabase
            .from('project_media')
            .select('*')
            .eq('project_id', data.id)
            .eq('file_type', 'image')
            .order('sort_order', { ascending: true });

          const galleryPhotos = mediaData && mediaData.length > 0
            ? mediaData.map((m) => m.file_url)
            : [data.image_url];

          setDbProject({
            slug: data.id,
            title: data.title,
            category: data.category,
            location: data.location,
            year: data.year,
            client: data.client || 'Private Client',
            area: data.area || 'Custom Commission',
            duration: data.duration || 'N/A',
            services: data.services ? data.services.split(/[·,]/).map((s: string) => s.trim()) : [data.category, 'Architectural Design'],
            materials: data.materials ? data.materials.split(/[·,]/).map((m: string) => m.trim()) : ['Natural Stone', 'Timber', 'Glass'],
            cover: data.image_url,
            video: data.video_url,
            description: data.description || 'Architectural commission crafted with precision and environmental sensitivity.',
            challenges: data.challenges,
            solution: data.solution,
            gallery: galleryPhotos,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const p = dbProject || staticProjects.find(x => x.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading project details…
      </div>
    );
  }

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="heading-xl">Not found.</h1>
          <Link to="/projects" className="link-underline uppercase tracking-[0.2em] text-xs">← Back to projects</Link>
        </div>
      </div>
    );
  }

  const related = staticProjects.filter(x => x.slug !== p.slug).slice(0, 3);

  const specFields = [
    { label: 'AREA', value: p.area },
    { label: 'DURATION', value: p.duration },
    { label: 'SERVICES', value: Array.isArray(p.services) ? p.services.join(' · ') : p.services },
    { label: 'MATERIALS', value: Array.isArray(p.materials) ? p.materials.join(' · ') : p.materials },
  ].filter(item => item.value);

  return (
    <>
      <section className="pt-[76px] bg-[#111] text-white">
        <div className="relative h-[85vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            src={p.cover} alt={p.title} className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/70" />
          <div className="relative h-full container-luxe flex flex-col justify-end pb-16">
            <div className="eyebrow text-accent mb-6">{p.category} · {p.location}</div>
            <h1 className="heading-hero">{p.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 container-luxe">
        <div className="grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
            <dl className="space-y-6 text-sm">
              {p.client && (
                <div className="border-t border-foreground/15 pt-4">
                  <dt className="eyebrow text-muted-foreground mb-2">CLIENT</dt>
                  <dd className="text-foreground">{p.client}</dd>
                </div>
              )}
              {p.location && (
                <div className="border-t border-foreground/15 pt-4">
                  <dt className="eyebrow text-muted-foreground mb-2">LOCATION</dt>
                  <dd className="text-foreground">{p.location}</dd>
                </div>
              )}
              {p.year && (
                <div className="border-t border-foreground/15 pt-4">
                  <dt className="eyebrow text-muted-foreground mb-2">YEAR</dt>
                  <dd className="text-foreground">{p.year}</dd>
                </div>
              )}
              {specFields.map(({ label, value }) => (
                <div key={label} className="border-t border-foreground/15 pt-4">
                  <dt className="eyebrow text-muted-foreground mb-2">{label}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="lg:col-span-8 space-y-12">
            <Reveal>
              <p className="heading-lg">{p.description}</p>
            </Reveal>
            {p.challenges && (
              <Reveal>
                <div>
                  <div className="eyebrow text-accent mb-3 uppercase tracking-widest">Challenge</div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{p.challenges}</p>
                </div>
              </Reveal>
            )}
            {p.solution && (
              <Reveal>
                <div>
                  <div className="eyebrow text-accent mb-3 uppercase tracking-widest">Approach</div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{p.solution}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-luxe space-y-6 md:space-y-10">
          {p.video && (
            <Reveal delay={0}>
              <div className="relative overflow-hidden bg-black aspect-[16/9] mb-12 shadow-2xl rounded-sm group">
                <video
                  src={p.video}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs uppercase tracking-widest px-3 py-1 rounded border border-white/20">
                  Architectural Walkthrough Video
                </div>
              </div>
            </Reveal>
          )}

          {p.gallery && p.gallery.map((g: string, i: number) => (
            <Reveal key={g + i} delay={i * 0.05}>
              <div className={`overflow-hidden bg-muted ${i % 3 === 0 ? 'aspect-[21/9]' : i % 3 === 1 ? 'aspect-[16/10]' : 'aspect-[4/5] max-w-3xl mx-auto'}`}>
                <img src={g} alt={`${p.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-card/40 border-t border-border">
        <div className="container-luxe">
          <div className="flex items-end justify-between mb-14">
            <h2 className="heading-xl">Related <span className="italic-serif">work.</span></h2>
            <Link to="/projects" className="uppercase tracking-[0.2em] text-xs link-underline">All projects →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.slug} to={`/projects/${r.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img src={r.cover} alt={r.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                </div>
                <div className="mt-4 eyebrow text-muted-foreground">{r.category} · {r.year}</div>
                <div className="font-display text-2xl group-hover:text-accent transition-colors">{r.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
